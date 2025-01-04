import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";

export default function CalendarManagerPage() {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

	useEffect(() => {
		document.getElementsByClassName("rdp-caption_label")[0]?.remove();
	}, []);

	const handlePreviousMonth = () => {
		setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
	};

	const handleNextMonth = () => {
		setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
	};

	return (
		<main className="w-full h-screen flex flex-col items-center bg-gray-100 p-4 sm:p-8">
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
				className="border rounded-md p-4 sm:p-6 w-full sm:w-1/2 h-[70%] sm:h-3/4"
				classNames={{
					head_cell:
						"text-muted-foreground font-normal text-sm sm:text-lg text-center",
					cell: "text-center text-sm sm:text-lg p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
					day: "h-12 w-12 sm:h-24 sm:w-24 p-0 font-normal aria-selected:opacity-100",
					day_selected:
						"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
					day_today: "bg-accent text-accent-foreground",
					day_outside: "text-muted-foreground opacity-50",
					day_disabled: "text-muted-foreground opacity-50",
					day_hidden: "invisible",
				}}
			/>
		</main>
	);
}
