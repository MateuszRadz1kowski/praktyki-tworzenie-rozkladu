import React from "react";
import TimeControl from "./TimeControl";
import { ROUTE_TOOLTIPS } from "./TableHeader";

export default function ScheduleRow({
	segment,
	index,
	isFirstStation,
	isLastStation,
	showArrivalForSkipped,
	formattedArrival,
	formattedDeparture,
	onAdjustArrival,
	onAdjustDeparture,
	onTogglePassingWithoutStopping,
	onToggleAlternativeRoute,
	onToggleSkippedSegment,
}) {
	const { passingWithoutStop, anotherLineRoute, isSkipped, name, peron, kz } =
		segment;

	const rowBg = index % 2 === 0 ? "bg-white" : "bg-[#eef5fc]";
	const isCheckedX = isLastStation ? true : isSkipped;
	const isXCheckboxDisabled = isLastStation;
	const isSubOptionsDisabled = isCheckedX;

	const shouldRenderArrival =
		!isFirstStation &&
		((!isCheckedX && !passingWithoutStop && !anotherLineRoute) ||
			(isCheckedX && showArrivalForSkipped));

	const shouldRenderDeparture =
		!isCheckedX && !passingWithoutStop && !anotherLineRoute;

	const isArrivalDisabled = isCheckedX && !showArrivalForSkipped;

	return (
		<tr className={rowBg}>
			<td className="border border-[#b8d0e8] px-2 py-1 text-gray-600 text-right whitespace-nowrap">
				{index + 1}.
			</td>

			<td className="border border-[#b8d0e8] px-2 py-1 text-gray-800">
				{name}
			</td>

			<td className="border border-[#b8d0e8] px-1 py-1 text-center w-20 h-9">
				{shouldRenderArrival ? (
					segment.arrival !== null ? (
						<TimeControl
							value={formattedArrival}
							onMinus={(e) =>
								!isArrivalDisabled && onAdjustArrival(index, e, -1)
							}
							onPlus={(e) =>
								!isArrivalDisabled && onAdjustArrival(index, e, +1)
							}
							disabled={isArrivalDisabled}
						/>
					) : (
						<span className="text-gray-400">--:--</span>
					)
				) : !isFirstStation && passingWithoutStop ? (
					<span className="text-gray-600 font-semibold">|</span>
				) : !isFirstStation && anotherLineRoute ? (
					<span className="text-gray-600 font-semibold">&lt;</span>
				) : null}
			</td>

			<td className="border border-[#b8d0e8] px-1 py-1 text-center w-20 h-9">
				{shouldRenderDeparture ? (
					segment.departure !== null ? (
						<TimeControl
							value={formattedDeparture}
							onMinus={(e) => onAdjustDeparture(index, e, -1)}
							onPlus={(e) => onAdjustDeparture(index, e, +1)}
						/>
					) : (
						<span className="text-gray-400">--:--</span>
					)
				) : !isCheckedX && passingWithoutStop ? (
					<span className="text-gray-600 font-semibold">|</span>
				) : !isCheckedX && anotherLineRoute ? (
					<span className="text-gray-600 font-semibold">&lt;</span>
				) : null}
			</td>

			<td className="border border-[#b8d0e8] px-1 py-1 text-center">
				<input
					type="checkbox"
					checked={passingWithoutStop && !isCheckedX}
					disabled={isSubOptionsDisabled}
					onChange={(e) =>
						onTogglePassingWithoutStopping(index, e.target.checked)
					}
					className={`w-[15px] h-[15px] ${isSubOptionsDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
					title={ROUTE_TOOLTIPS.nonStop}
				/>
			</td>

			<td className="border border-[#b8d0e8] px-1 py-1 text-center">
				<input
					type="checkbox"
					checked={anotherLineRoute && !isCheckedX}
					disabled={isSubOptionsDisabled}
					onChange={(e) => onToggleAlternativeRoute(index, e.target.checked)}
					className={`w-[15px] h-[15px] ${isSubOptionsDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
					title={ROUTE_TOOLTIPS.alternative}
				/>
			</td>

			<td className="border border-[#b8d0e8] px-1 py-1 text-center">
				<input
					type="checkbox"
					checked={isCheckedX}
					disabled={isXCheckboxDisabled}
					onChange={(e) => onToggleSkippedSegment(index, e.target.checked)}
					className={`w-[15px] h-[15px] ${isXCheckboxDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
					title={ROUTE_TOOLTIPS.skipped}
				/>
			</td>

			<td className="border border-[#b8d0e8] px-1 py-1 text-center">
				<input
					type="text"
					defaultValue={peron}
					maxLength={5}
					disabled={isCheckedX}
					className={`w-12 text-center text-[12px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400 ${isCheckedX ? "bg-gray-100 text-gray-400" : ""}`}
				/>
			</td>

			<td className="border border-[#b8d0e8] px-1 py-1 text-center">
				<input
					type="checkbox"
					defaultChecked={kz}
					disabled={isCheckedX}
					className={`w-[15px] h-[15px] ${isCheckedX ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
					title={ROUTE_TOOLTIPS.replacementBus}
				/>
			</td>
		</tr>
	);
}
