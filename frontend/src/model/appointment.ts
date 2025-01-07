export default class Appointment {
	private date: Date;
	private isBooked: boolean;

	constructor(date: Date, isBooked: boolean) {
		this.date = date;
		this.isBooked = isBooked;
	}

	public toJSON() {
		return {
			date: this.date,
			isBooked: this.isBooked,
		};
	}

	public getDate(): Date {
		return this.date;
	}

	public setDate(date: Date): void {
		this.date = date;
	}

	public getIsBooked(): boolean {
		return this.isBooked;
	}

	public setBooked(booked: boolean): void {
		this.isBooked = booked;
	}

	public static fromString(str: string): Appointment {
		if (!str || !str.startsWith("Appointment{") || !str.endsWith("}")) {
			throw new Error("Invalid string format for Appointment: " + str);
		}

		try {
			const content = str.substring(12, str.length - 1);
			const parts = content.split(", ");

			const datePart = parts[0].split("=")[1];
			const isBookedPart = parts[1].split("=")[1];

			const isBooked = isBookedPart === "true";
			const date = new Date(datePart);

			if (isNaN(date.getTime())) {
				throw new Error("Invalid date format in string: " + datePart);
			}

			return new Appointment(date, isBooked);
		} catch (e) {
			throw new Error("Error parsing string: " + e);
		}
	}

	public toString(): string {
		return `Appointment{date=${this.date.toISOString()}, isBooked=${
			this.isBooked
		}}`;
	}
}
