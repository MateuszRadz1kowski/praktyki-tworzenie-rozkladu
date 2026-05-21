import React from "react";

export const ROUTE_TOOLTIPS = {
	nonStop: "Przejeżdża bez zatrzymania",
	alternative: "Jedzie inną linią, kursuje inną trasą",
	skipped: "Nie przejeżdża",
	replacementBus: "Komunikacja zastępcza",
};

export default function TableHeader() {
	return (
		<thead>
			<tr className="bg-[#c5ddf5] text-gray-800">
				<th className="border border-[#a0c0dc] px-2 py-1.5 text-left font-semibold w-8">
					Lp
				</th>
				<th className="border border-[#a0c0dc] px-2 py-1.5 text-left font-semibold">
					Miejscowość
				</th>
				<th className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-20">
					Przyjazd
				</th>
				<th className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-20">
					Odjazd
				</th>
				<th
					title={ROUTE_TOOLTIPS.nonStop}
					className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-10 cursor-help"
				>
					|
				</th>
				<th
					title={ROUTE_TOOLTIPS.alternative}
					className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-10 cursor-help"
				>
					&lt;
				</th>
				<th
					title={ROUTE_TOOLTIPS.skipped}
					className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-10 cursor-help"
				>
					x
				</th>
				<th className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-16">
					Peron
				</th>
				<th
					title={ROUTE_TOOLTIPS.replacementBus}
					className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-8 cursor-help"
				>
					Kz
				</th>
			</tr>
		</thead>
	);
}
