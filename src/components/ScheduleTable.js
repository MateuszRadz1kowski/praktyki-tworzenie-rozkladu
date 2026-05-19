import React from "react";
import { stops } from "../data/stops";

const TOOLTIPS = {
	passingWithoutStop: "Przejeżdża bez zatrzymania",
	anotherLineRoute: "Jedzie inną linią, kursuje inną trasą",
	doesntPassBy: "Nie przejeżdża",
	kz: "Komunikacja zastępcza",
};

function TimeCell({ value }) {
	if (!value)
		return (
			<td className="border border-[#b8d0e8] px-2 py-1 text-center w-20" />
		);

	return (
		<td className="border border-[#b8d0e8] px-1 py-1 text-center w-20">
			<div className="flex flex-col items-center leading-none">
				<span className="text-[13px] font-medium text-gray-800 tabular-nums">
					{value}
				</span>
				<div className="flex gap-[2px] mt-[2px]">
					<button className="w-[18px] h-[14px] flex items-center justify-center bg-gray-100 border border-gray-300 text-gray-400 text-[9px] leading-none rounded-[2px] cursor-default select-none">
						−
					</button>
					<button className="w-[18px] h-[14px] flex items-center justify-center bg-gray-100 border border-gray-300 text-gray-400 text-[9px] leading-none rounded-[2px] cursor-default select-none">
						+
					</button>
				</div>
			</div>
		</td>
	);
}

export default function ScheduleTable() {
	return (
		<div className="overflow-x-auto">
			<table
				className="w-full border-collapse text-[13px]"
				style={{ minWidth: 540 }}
			>
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
							title={TOOLTIPS.passingWithoutStop}
							className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-10 cursor-help"
						>
							|
						</th>
						<th
							title={TOOLTIPS.anotherLineRoute}
							className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-10 cursor-help"
						>
							&lt;
						</th>
						<th
							title={TOOLTIPS.doesntPassBy}
							className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-10 cursor-help"
						>
							x
						</th>
						<th className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-16">
							Peron
						</th>
						<th
							title={TOOLTIPS.kz}
							className="border border-[#a0c0dc] px-2 py-1.5 text-center font-semibold w-8 cursor-help"
						>
							Kz
						</th>
					</tr>
				</thead>

				<tbody>
					{stops.map((stop, idx) => {
						const isLast = idx == stops.length - 1;
						const rowBg = idx % 2 == 0 ? "bg-white" : "bg-[#eef5fc]";

						return (
							<tr key={stop.id} className={rowBg}>
								<td className="border border-[#b8d0e8] px-2 py-1 text-gray-600 text-right">
									{idx + 1}.
								</td>

								<td className="border border-[#b8d0e8] px-2 py-1 text-gray-800">
									{stop.name}
								</td>

								<TimeCell value={idx === 0 ? null : stop.arrival} />

								<TimeCell value={isLast ? null : stop.departure} />

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="checkbox"
										defaultChecked={stop.passingWithoutStop}
										readOnly
										className="w-[15px] h-[15px]"
										title={TOOLTIPS.passingWithoutStop}
									/>
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="checkbox"
										defaultChecked={stop.anotherLineRoute}
										readOnly
										className="w-[15px] h-[15px]"
										title={TOOLTIPS.anotherLineRoute}
									/>
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="checkbox"
										defaultChecked={stop.doesntPassBy}
										readOnly
										disabled={isLast}
										className={`w-[15px] h-[15px] ${isLast ? "opacity-50" : ""}`}
										title={TOOLTIPS.doesntPassBy}
									/>
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="text"
										defaultValue={stop.peron}
										maxLength={3}
										className="w-12 text-center text-[12px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
									/>
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="checkbox"
										defaultChecked={stop.kz}
										readOnly
										className="w-[15px] h-[15px]"
										title={TOOLTIPS.kz}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
