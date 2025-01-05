import { format } from "date-fns";
import { Button } from "../../components/ui/button";
import { XIcon } from "lucide-react";

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
					<li className="flex justify-between items-center mb-2">
						<span>10:00 AM</span>
						<Button variant="secondary">Book</Button>
					</li>
					<li className="flex justify-between items-center mb-2">
						<span>11:00 AM</span>
						<Button variant="secondary">Book</Button>
					</li>
					<li className="flex justify-between items-center mb-2">
						<span>12:00 PM</span>
						<Button variant="secondary">Book</Button>
					</li>
				</ul>
			</div>
		</div>
	);
}
