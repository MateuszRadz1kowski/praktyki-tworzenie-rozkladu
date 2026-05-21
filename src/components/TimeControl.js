import React, { useRef, useCallback, useEffect } from "react";

export default function TimeControl({ value, onMinus, onPlus }) {
	const minusRef = useRef(null);
	const plusRef = useRef(null);
	const intervalRef = useRef(null);
	const timeoutRef = useRef(null);

	const startRepeat = useCallback((handler) => {
		timeoutRef.current = setTimeout(() => {
			intervalRef.current = setInterval(handler, 100);
		}, 400);
	}, []);

	const stopRepeat = useCallback(() => {
		clearTimeout(timeoutRef.current);
		clearInterval(intervalRef.current);
	}, []);

	useEffect(() => {
		return () => stopRepeat();
	}, [stopRepeat]);

	return (
		<div className="flex flex-col items-center leading-none">
			<span className="text-[13px] font-medium text-gray-800 tabular-nums select-none">
				{value}
			</span>
			<div className="flex gap-[2px] mt-[2px]">
				<button
					ref={minusRef}
					onMouseDown={(e) => {
						e.preventDefault();
						onMinus(e);
						startRepeat(() => onMinus(e));
					}}
					onMouseUp={stopRepeat}
					onMouseLeave={stopRepeat}
					onTouchStart={(e) => {
						onMinus(e);
						startRepeat(() => onMinus(e));
					}}
					onTouchEnd={stopRepeat}
					className="w-[18px] h-[14px] flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border border-gray-300 text-gray-500 text-[9px] leading-none rounded-[2px] select-none cursor-pointer"
				>
					−
				</button>
				<button
					ref={plusRef}
					onMouseDown={(e) => {
						e.preventDefault();
						onPlus(e);
						startRepeat(() => onPlus(e));
					}}
					onMouseUp={stopRepeat}
					onMouseLeave={stopRepeat}
					onTouchStart={(e) => {
						onPlus(e);
						startRepeat(() => onPlus(e));
					}}
					onTouchEnd={stopRepeat}
					className="w-[18px] h-[14px] flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border border-gray-300 text-gray-500 text-[9px] leading-none rounded-[2px] select-none cursor-pointer"
				>
					+
				</button>
			</div>
		</div>
	);
}
