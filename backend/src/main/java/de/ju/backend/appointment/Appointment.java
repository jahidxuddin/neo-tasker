package de.ju.backend.appointment;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Appointment {
    private Date date;
    private boolean isBooked;

    public Appointment(Date date, boolean isBooked) {
        this.date = date;
        this.isBooked = isBooked;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void setBooked(boolean booked) {
        isBooked = booked;
    }

    @Override
    public String toString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        return "Appointment{" + "date=" + sdf.format(date) + ", isBooked=" + isBooked + '}';
    }
}
