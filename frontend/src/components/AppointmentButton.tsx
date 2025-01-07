"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { bookAppointment } from "@/service/appointment-service";
import Appointment from "@/model/appointment";

type AppointmentButtonProps = {
	appointment: Appointment;
	selectedDay: Date | null;
};

const AppointmentButton: React.FC<AppointmentButtonProps> = ({
	appointment,
	selectedDay,
}) => {
	const [isBooked, setIsBooked] = useState<boolean>(
		appointment.getIsBooked()
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleBookAppointment = async () => {
		if (selectedDay !== null) {
			const nextDay = new Date(selectedDay);
			nextDay.setDate(nextDay.getDate() + 1);

			setIsLoading(true);

			try {
				await bookAppointment(
					nextDay,
					appointment
						.getDate()
						.toISOString()
						.split("T")[1]
						.slice(0, 8)
				);
				setIsBooked(true);
			} catch (error) {
				console.error("Error booking appointment:", error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<Button
			variant="secondary"
			disabled={isBooked || isLoading}
			className="btn btn-secondary"
			onClick={handleBookAppointment}
		>
			{isLoading ? "Booking..." : isBooked ? "Booked" : "Book"}
		</Button>
	);
};

export default AppointmentButton;
