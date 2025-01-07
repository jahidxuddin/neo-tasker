"use server";

import { Socket } from "net";
import Appointment from "../model/appointment";

export async function getAppointments(date: Date): Promise<any[]> {
	const client = new Socket();
	client.connect(8080, "localhost");

	return new Promise((resolve, reject) => {
		client.on("data", (data) => {
			const response = data.toString();
			if (!response.startsWith("OK")) {
				reject(
					new Error("Unexpected response from server: " + response)
				);
				return;
			}

			const appointmentsString = response.substring(3).trim();
			if (appointmentsString.length === 0) {
				resolve([]);
			}
			try {
				const appointments = appointmentsString
					.split("; ")
					.map(Appointment.fromString);
				resolve(
					appointments.map((appointment) => appointment.toJSON())
				);
			} catch (error) {
				reject(
					new Error(
						"Error parsing appointments: " +
							(error as Error).message
					)
				);
			} finally {
				client.write("END\n");
				client.end();
			}
		});

		client.on("error", (err) => {
			reject(new Error("TCP error: " + err.message));
			client.write("END\n");
			client.end();
		});

		const formattedDate = date.toISOString().split("T")[0];
		const command = `GET ${formattedDate}\n`;
		client.write(command);
	});
}

export async function bookAppointment(date: Date, time: String): Promise<void> {
	const client = new Socket();
	client.connect(8080, "localhost");

	return new Promise((resolve, reject) => {
		client.on("data", (data) => {
			const response = data.toString();
			if (!response.startsWith("OK")) {
				reject(
					new Error("Unexpected response from server: " + response)
				);
				client.write("END\n");
				client.end();
			}
			resolve();
			client.write("END\n");
			client.end();
		});

		client.on("error", (err) => {
			reject(new Error("TCP error: " + err.message));
			client.write("END\n");
			client.end();
		});

		const formattedDate = date.toISOString().split("T")[0];
		const command = `PUT ${formattedDate} ${time}\n`;
		client.write(command);
	});
}
