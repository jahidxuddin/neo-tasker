package de.ju.backend.appointment;

import de.ju.backend.database.DatabaseConnector;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class AppointmentRepository {
    public List<Appointment> findAppointmentsByDate(Date date) {
        String query = "SELECT date, is_booked FROM appointments WHERE DATE(date) = ?";
        List<Appointment> appointments = new ArrayList<>();
        try (Connection connection = DatabaseConnector.getInstance().getConnection(); PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setDate(1, new java.sql.Date(date.getTime()));
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    Date appointmentDate = resultSet.getTimestamp("date");
                    boolean isBooked = resultSet.getBoolean("is_booked");
                    appointments.add(new Appointment(appointmentDate, isBooked));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding appointments by date: " + date, e);
        }
        return appointments;
    }

    public Appointment findAppointmentByDate(Date date) {
        String query = "SELECT date, is_booked FROM appointments WHERE DATE(date) = ?";
        try (Connection connection = DatabaseConnector.getInstance().getConnection(); PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setDate(1, new java.sql.Date(date.getTime()));
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                Date appointmentDate = resultSet.getTimestamp("date");
                boolean isBooked = resultSet.getBoolean("is_booked");
                return new Appointment(appointmentDate, isBooked);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding appointment by date: " + date, e);
        }
        return null;
    }

    public void updateAppointment(Appointment appointment, String time) {
        Calendar calendar = getCalendar(appointment, time);

        java.sql.Timestamp appointmentTimestamp = new java.sql.Timestamp(calendar.getTimeInMillis());

        String query = "UPDATE appointments SET is_booked = ? WHERE date = ?";
        try (Connection connection = DatabaseConnector.getInstance().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {

            preparedStatement.setBoolean(1, appointment.isBooked());
            preparedStatement.setTimestamp(2, appointmentTimestamp);

            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected == 0) {
                throw new RuntimeException("No appointment found to update for date and time: " + appointmentTimestamp);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error updating appointment for date and time: " + appointment.getDate() + " " + time, e);
        }
    }

    private static Calendar getCalendar(Appointment appointment, String time) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(appointment.getDate());

        String[] timeParts = time.split(":");
        if (timeParts.length != 3) {
            throw new IllegalArgumentException("Invalid time format. Expected format: HH:mm:ss");
        }

        int hours = Integer.parseInt(timeParts[0]) + 1;
        int minutes = Integer.parseInt(timeParts[1]);
        int seconds = Integer.parseInt(timeParts[2]);

        calendar.set(Calendar.HOUR_OF_DAY, hours);
        calendar.set(Calendar.MINUTE, minutes);
        calendar.set(Calendar.SECOND, seconds);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar;
    }
}
