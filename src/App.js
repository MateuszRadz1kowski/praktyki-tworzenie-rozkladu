import React from "react";
import ScheduleTable from "./components/ScheduleTable";

export default function App() {
	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-[18px] font-normal text-[#2a6aad] mb-4">
					Rozkłady » modyfikacja wybranego rozkładu
				</h1>

				<div className="bg-[#deeaf7] border border-[#a0c0dc] rounded p-3">
					<ScheduleTable />
				</div>
			</div>
		</div>
	);
}
