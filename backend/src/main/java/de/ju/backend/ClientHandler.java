package de.ju.backend;

import de.ju.backend.appointment.Appointment;
import de.ju.backend.appointment.AppointmentRepository;
import de.ju.backend.lib.Socket;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static de.ju.backend.NeoTaskerServer.logger;

public class ClientHandler implements Runnable {
    private final Socket client;
    private volatile boolean isRunning;
    private final AppointmentRepository appointmentRepository;
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    public ClientHandler(Socket client, boolean isRunning, AppointmentRepository appointmentRepository) {
        this.client = client;
        this.isRunning = isRunning;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public void run() {
        try {
            handleClient();
        } finally {
            cleanupClient();
        }
    }

    private void handleClient() {
        while (isRunning) {
            Thread.onSpinWait();
            try {
                String cmdLine = "";
                while (!cmdLine.equals("END")) {
                    while (client.dataAvailable() <= 0);
                    cmdLine = client.readLine();
                    logger.info(cmdLine);
                    String[] args = cmdLine.split(" ");
                    if (cmdLine.startsWith("GET")) {
                        handleGetAppointments(args);
                    } else if (cmdLine.startsWith("PUT")) {
                        handlePutAppointments(args);
                    }
                }
            } catch (IOException | ParseException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void handleGetAppointments(String[] args) throws IOException, ParseException {
        Date date = formatter.parse(args[1]);
        List<Appointment> appointments = appointmentRepository.findAppointmentsByDate(date);
        String appointmentsString = appointments.stream()
                .map(Appointment::toString)
                .collect(Collectors.joining("; "));
        client.write("OK " + appointmentsString  + "\n");
    }

    private void handlePutAppointments(String[] args) throws ParseException, IOException {
        Date date = formatter.parse(args[1]);
        String time = args[2];
        Appointment appointment = appointmentRepository.findAppointmentByDate(date);
        if (appointment == null) {
            client.write("ERROR can't find appointment\n");
        } else {
            appointment.setBooked(true);
            appointmentRepository.updateAppointment(appointment, time);
            client.write("OK " + appointment + "\n");
        }
    }

    private void cleanupClient() {
        try {
            client.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
