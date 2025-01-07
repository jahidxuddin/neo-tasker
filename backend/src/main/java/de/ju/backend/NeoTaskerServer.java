package de.ju.backend;

import de.ju.backend.appointment.AppointmentRepository;
import de.ju.backend.lib.ServerSocket;
import de.ju.backend.lib.Socket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;


public class NeoTaskerServer {
    public static final Logger logger = LoggerFactory.getLogger(NeoTaskerServer.class);

    private boolean isRunning;
    private final ServerSocket serverSocket;
    private final Queue<Socket> clients;
    private final AppointmentRepository appointmentRepository;

    public NeoTaskerServer(int port) throws IOException {
        this.isRunning = false;
        this.serverSocket = new ServerSocket(port);
        this.clients = new ConcurrentLinkedQueue<>();
        this.appointmentRepository = new AppointmentRepository();
        this.isRunning = true;
        new Thread(this::listenForClients).start();
        new Thread(this::runClients).start();
    }

    private void listenForClients() {
        while (isRunning) {
            try {
                Socket client = serverSocket.accept();
                clients.add(client);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void runClients() {
        while (isRunning) {
            Socket client = clients.poll();
            if (client != null) {
                new Thread(new ClientHandler(client, isRunning, appointmentRepository)).start();
            }
        }
    }

    public static void main(String[] args) throws IOException {
        new NeoTaskerServer(8080);
    }
}
