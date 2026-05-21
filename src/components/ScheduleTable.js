import React, { useState } from "react";
import { stops as initialStops } from "../data/stops";
import TableHeader from "./TableHeader";
import ScheduleRow from "./ScheduleRow";

const MINUTES_IN_DAY = 1440;

const convertTimeToMinutes = (timeString) => {
	if (!timeString) return null;
	const [hours, minutes] = timeString.split(":").map(Number);
	return (hours * 60 + minutes) % MINUTES_IN_DAY;
};

const formatMinutesToHHMM = (totalMinutes) => {
	if (totalMinutes == null || totalMinutes == undefined) return null;
	const normalizedMinutes =
		((totalMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
	const hours = Math.floor(normalizedMinutes / 60);
	const minutes = normalizedMinutes % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const getStepDelta = (e) => {
	if (e.ctrlKey) return 60;
	if (e.shiftKey) return 6;
	return 1;
};

export default function ScheduleTable() {
	const [routeSegments, setRouteSegments] = useState(() =>
		initialStops.map((stop) => ({
			...stop,
			isSkipped: stop.doesntPassBy ?? false,
			arrival: convertTimeToMinutes(stop.arrival),
			departure: convertTimeToMinutes(stop.departure),
		})),
	);

	const isFirstStation = (idx) => idx == 0;
	const isLastStation = (idx) => idx == routeSegments.length - 1;

	const firstSkippedInSeriesIdx = (() => {
		let firstIdx = -1;
		for (let i = routeSegments.length - 1; i >= 0; i--) {
			const hasX = i == routeSegments.length - 1 || routeSegments[i].isSkipped;
			if (hasX) {
				firstIdx = i;
			} else {
				break;
			}
		}
		return firstIdx;
	})();

	const adjustArrivalTime = (idx, e, direction) => {
		const delta = getStepDelta(e) * direction;
		setRouteSegments((prevSegments) => {
			const nextSegments = [...prevSegments];
			const current = nextSegments[idx];
			const isX = idx == nextSegments.length - 1 || current.isSkipped;

			let newArrival = (current.arrival ?? current.departure ?? 0) + delta;
			newArrival =
				((newArrival % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;

			if (
				current.departure !== null &&
				!isX &&
				newArrival > current.departure
			) {
				newArrival = current.departure;
			}

			let previousDeparture = null;
			for (let i = idx - 1; i >= 0; i--) {
				if (!nextSegments[i].isSkipped && nextSegments[i].departure !== null) {
					previousDeparture = nextSegments[i].departure;
					break;
				}
			}
			if (previousDeparture !== null && newArrival <= previousDeparture) {
				newArrival = previousDeparture + 1;
			}

			nextSegments[idx] = { ...current, arrival: newArrival };
			return nextSegments;
		});
	};

	const adjustDepartureTime = (idx, e, direction) => {
		const delta = getStepDelta(e) * direction;
		setRouteSegments((prevSegments) => {
			const nextSegments = [...prevSegments];
			const current = nextSegments[idx];
			const oldDeparture = current.departure ?? 0;

			let newDeparture = oldDeparture + delta;
			newDeparture =
				((newDeparture % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;

			if (direction == -1) {
				const minAllowed = current.arrival !== null ? current.arrival : 0;
				if (newDeparture < minAllowed) newDeparture = minAllowed;
				nextSegments[idx] = { ...current, departure: newDeparture };
			} else {
				const actualDelta = newDeparture - oldDeparture;
				nextSegments[idx] = { ...current, departure: newDeparture };

				for (let i = idx + 1; i < nextSegments.length; i++) {
					const nextStop = nextSegments[i];
					nextSegments[i] = {
						...nextStop,
						arrival:
							nextStop.arrival !== null
								? (nextStop.arrival + actualDelta) % MINUTES_IN_DAY
								: null,
						departure:
							nextStop.departure !== null
								? (nextStop.departure + actualDelta) % MINUTES_IN_DAY
								: null,
					};
				}
			}

			return nextSegments;
		});
	};

	const updateSegmentProperties = (idx, changes) =>
		setRouteSegments((prev) =>
			prev.map((segment, i) =>
				i == idx ? { ...segment, ...changes } : segment,
			),
		);

	const togglePassingWithoutStopping = (idx, isChecked) =>
		updateSegmentProperties(idx, {
			passingWithoutStop: isChecked,
			anotherLineRoute: isChecked ? false : routeSegments[idx].anotherLineRoute,
		});

	const toggleAlternativeRoute = (idx, isChecked) =>
		updateSegmentProperties(idx, {
			anotherLineRoute: isChecked,
			passingWithoutStop: isChecked
				? false
				: routeSegments[idx].passingWithoutStop,
		});

	const toggleSkippedSegment = (idx, isChecked) =>
		updateSegmentProperties(idx, {
			isSkipped: isChecked,
			passingWithoutStop: isChecked
				? false
				: routeSegments[idx].passingWithoutStop,
			anotherLineRoute: isChecked ? false : routeSegments[idx].anotherLineRoute,
		});

	return (
		<div className="overflow-x-auto">
			<table
				className="w-full border-collapse text-[13px]"
				style={{ minWidth: 540 }}
			>
				<TableHeader />
				<tbody>
					{routeSegments.map((segment, idx) => (
						<ScheduleRow
							key={segment.id}
							segment={segment}
							index={idx}
							isFirstStation={isFirstStation(idx)}
							isLastStation={isLastStation(idx)}
							showArrivalForSkipped={idx == firstSkippedInSeriesIdx}
							formattedArrival={formatMinutesToHHMM(segment.arrival)}
							formattedDeparture={formatMinutesToHHMM(segment.departure)}
							onAdjustArrival={adjustArrivalTime}
							onAdjustDeparture={adjustDepartureTime}
							onTogglePassingWithoutStopping={togglePassingWithoutStopping}
							onToggleAlternativeRoute={toggleAlternativeRoute}
							onToggleSkippedSegment={toggleSkippedSegment}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
