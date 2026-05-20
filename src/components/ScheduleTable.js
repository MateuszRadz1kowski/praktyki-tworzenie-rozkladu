import React, { useState } from "react";
import { stops as initialStops } from "../data/stops";

const TOOLTIPS = {
	passingWithoutStop: "Przejeżdża bez zatrzymania",
	anotherLineRoute: "Jedzie inną linią, kursuje inną trasą",
	doesntPassBy: "Nie przejeżdża",
	kz: "Komunikacja zastępcza",
};

function TimeControl({ value }) {
	return (
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
	);
}

export default function ScheduleTable() {
	const [stops, setStops] = useState(initialStops);

	const hardLastIndex = stops.length - 1;

	const firstActiveIndex = stops.findIndex((s) => !s.doesntPassBy);

	const lastActiveIndex = (() => {
		let i = hardLastIndex;
		while (i >= 0 && (stops[i].doesntPassBy || i == hardLastIndex)) {
			i--;
		}
		return i < hardLastIndex ? i + 1 : hardLastIndex;
	})();

	const update = (index, changes) => {
		setStops((prev) =>
			prev.map((stop, i) => (i == index ? { ...stop, ...changes } : stop)),
		);
	};

	const handlePassingWithoutStop = (index, checked) => {
		update(index, {
			passingWithoutStop: checked,
			anotherLineRoute: checked ? false : stops[index].anotherLineRoute,
		});
	};

	const handleAnotherLineRoute = (index, checked) => {
		update(index, {
			anotherLineRoute: checked,
			passingWithoutStop: checked ? false : stops[index].passingWithoutStop,
		});
	};

	const handleDoesntPassBy = (index, checked) => {
		const newLastActiveIndex = (() => {
			let i = hardLastIndex;
			while (i >= 0) {
				const isX =
					(i === index ? checked : stops[i].doesntPassBy) ||
					i === hardLastIndex;
				if (!isX) break;
				i--;
			}
			return i < hardLastIndex ? i + 1 : hardLastIndex;
		})();

		update(index, {
			doesntPassBy: checked,
			passingWithoutStop:
				checked && index !== newLastActiveIndex
					? false
					: stops[index].passingWithoutStop,
			anotherLineRoute:
				checked && index !== newLastActiveIndex
					? false
					: stops[index].anotherLineRoute,
		});
	};

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
					{stops.map((stop, index) => {
						const rowBg = index % 2 === 0 ? "bg-white" : "bg-[#eef5fc]";

						const isFirstActive = index == firstActiveIndex;
						const isLastActive = index == lastActiveIndex;
						const isHardLast = index == hardLastIndex;

						const { passingWithoutStop, anotherLineRoute, doesntPassBy } = stop;

						const showArrivalControl =
							!isFirstActive &&
							(isHardLast ? lastActiveIndex === hardLastIndex : true);

						let arrivalContent = null;
						if (showArrivalControl) {
							if (passingWithoutStop) {
								arrivalContent = (
									<span className="text-gray-600 font-semibold">|</span>
								);
							} else if (anotherLineRoute) {
								arrivalContent = (
									<span className="text-gray-600 font-semibold">&lt;</span>
								);
							} else if (!doesntPassBy && stop.arrival) {
								arrivalContent = <TimeControl value={stop.arrival} />;
							} else if (isLastActive && stop.arrival) {
								arrivalContent = <TimeControl value={stop.arrival} />;
							}
						}

						const showDepartureControl =
							!isLastActive && !doesntPassBy && !isHardLast;

						let departureContent = null;
						if (showDepartureControl) {
							if (passingWithoutStop) {
								departureContent = (
									<span className="text-gray-600 font-semibold">|</span>
								);
							} else if (anotherLineRoute) {
								departureContent = (
									<span className="text-gray-600 font-semibold">&lt;</span>
								);
							} else if (stop.departure) {
								departureContent = <TimeControl value={stop.departure} />;
							}
						}

						const passingWithoutStopLocked = doesntPassBy && !isLastActive;
						const doesntPassByLocked = isHardLast;
						const passingWithoutStopLockedFinal = isHardLast
							? lastActiveIndex === hardLastIndex
								? false
								: true
							: passingWithoutStopLocked;

						return (
							<tr key={stop.id} className={rowBg}>
								<td className="border border-[#b8d0e8] px-2 py-1 text-gray-600 text-right whitespace-nowrap">
									{index + 1}.
								</td>

								<td className="border border-[#b8d0e8] px-2 py-1 text-gray-800">
									{stop.name}
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center w-20">
									{arrivalContent}
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center w-20">
									{departureContent}
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="checkbox"
										checked={
											passingWithoutStop && !passingWithoutStopLockedFinal
										}
										disabled={passingWithoutStopLockedFinal}
										onChange={(e) =>
											handlePassingWithoutStop(index, e.target.checked)
										}
										className={`w-[15px] h-[15px] ${passingWithoutStopLockedFinal ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
										title={TOOLTIPS.passingWithoutStop}
									/>
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="checkbox"
										checked={anotherLineRoute && !passingWithoutStopLockedFinal}
										disabled={passingWithoutStopLockedFinal}
										onChange={(e) =>
											handleAnotherLineRoute(index, e.target.checked)
										}
										className={`w-[15px] h-[15px] ${passingWithoutStopLockedFinal ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
										title={TOOLTIPS.anotherLineRoute}
									/>
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="checkbox"
										checked={doesntPassBy || doesntPassByLocked}
										disabled={doesntPassByLocked}
										onChange={(e) =>
											handleDoesntPassBy(index, e.target.checked)
										}
										className={`w-[15px] h-[15px] ${doesntPassByLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
										title={TOOLTIPS.doesntPassBy}
									/>
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="text"
										defaultValue={stop.platform}
										maxLength={5}
										className="w-12 text-center text-[12px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
									/>
								</td>

								<td className="border border-[#b8d0e8] px-1 py-1 text-center">
									<input
										type="checkbox"
										defaultChecked={stop.kz}
										className="w-[15px] h-[15px] cursor-pointer"
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
