import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, addMonths, subMonths, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SelectedDateModal from "./components/SelectedDateModal";

export default function CalendarManagerPage() {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [selectedDay, setSelectedDay] = useState<Date | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		document.getElementsByClassName("rdp-caption_label")[0]?.remove();
	}, []);

	const handlePreviousMonth = () => {
		setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
	};

	const handleNextMonth = () => {
		setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
	};

	const handleDayClick = (day: Date) => {
		setSelectedDay(day);
		setIsModalOpen(true);
	};

	return (
		<main className="w-full h-screen flex flex-col items-center bg-gray-900 text-white p-4 sm:p-8">
			<div className="flex justify-between items-center mb-4 sm:mb-6 gap-4 sm:gap-6">
				<Button variant="ghost" onClick={handlePreviousMonth}>
					<ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
				</Button>
				<h2 className="text-lg sm:text-2xl font-semibold text-center">
					{format(currentMonth, "MMMM yyyy")}
				</h2>
				<Button variant="ghost" onClick={handleNextMonth}>
					<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
				</Button>
			</div>
			<DayPicker
				weekStartsOn={1}
				hideNavigation
				mode="single"
				month={currentMonth}
				className="border border-gray-600 rounded-md p-4 sm:p-12 w-full sm:w-3/4 h-[70%] sm:h-[90%] bg-gray-800 grid place-items-center"
				classNames={{
					head_cell:
						"font-normal text-sm sm:text-lg text-center text-gray-400",
					cell: "text-center text-sm sm:text-lg p-0 relative [&:has([aria-selected])]:bg-primary-600 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
					day: "h-12 w-12 sm:h-28 sm:w-28 p-0 font-normal aria-selected:opacity-100",
					day_selected:
						"bg-primary-500 text-primary-foreground hover:bg-primary-600 hover:text-primary-foreground focus:bg-primary-600 focus:text-primary-foreground",
					day_today: "bg-primary-700 text-white",
					day_outside: "text-gray-500 opacity-50",
					day_disabled: "text-gray-500 opacity-50",
					day_hidden: "invisible",
				}}
				disabled={[
					{
						before: startOfToday(),
					},
				]}
				onDayClick={handleDayClick}
			/>

			<SelectedDateModal
				isModalOpen={isModalOpen}
				selectedDay={selectedDay}
				setIsModalOpen={setIsModalOpen}
				setSelectedDay={setSelectedDay}
			/>
		</main>
	);
}
