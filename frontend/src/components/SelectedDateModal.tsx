"use client";

import Appointment from "@/model/appointment";
import { format } from "date-fns";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
	bookAppointment,
	getAppointments,
} from "@/service/appointment-service";
import AppointmentButton from "./AppointmentButton";

type Props = {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	selectedDay: Date | null;
	setSelectedDay: React.Dispatch<React.SetStateAction<Date | null>>;
};

export default function SelectedDateModal({
	isModalOpen,
	setIsModalOpen,
	selectedDay,
	setSelectedDay,
}: Props) {
	const [isLoading, setIsLoading] = useState(true);
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		setAppointments([]);
		setIsLoading(true);
		if (selectedDay != null) {
			(async () => {
				const nextDay = new Date(selectedDay);
				nextDay.setDate(nextDay.getDate() + 1);
				const appointments = await getAppointments(nextDay);

				setAppointments(
					appointments.map(
						(appointment) =>
							new Appointment(
								appointment.date,
								appointment.isBooked
							)
					)
				);
				setIsLoading(false);
			})();
		}
	}, [selectedDay]);

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedDay(null);
	};

	if (!isModalOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-gray-800 rounded-lg p-6 w-[90%] max-w-lg text-white space-y-3">
				<div className="flex justify-between items-start">
					<h3 className="text-lg sm:text-xl font-semibold mb-4">
						{selectedDay && format(selectedDay, "MMMM d, yyyy")}
					</h3>
					<XIcon
						className="cursor-pointer"
						size={24}
						onClick={closeModal}
					/>
				</div>
				<ul className="space-y-3">
					{isLoading ? (
						<>Loading...</>
					) : appointments.length === 0 ? (
						<>No appointments available</>
					) : (
						appointments.map((appointment, index) => (
							<li
								key={index}
								className="flex justify-between items-center mb-2"
							>
								<span>
									{appointment
										.getDate()
										.toISOString()
										.split("T")[1]
										.slice(0, 8)}
								</span>
								<AppointmentButton
									appointment={appointment}
									selectedDay={selectedDay}
								/>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
}
