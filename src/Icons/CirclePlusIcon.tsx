"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CirclePlusIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CirclePlusIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const CirclePlusIcon = forwardRef<CirclePlusIconHandle, CirclePlusIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () =>
					reduced ? controls.start("normal") : controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) controls.start("animate");
				else onMouseEnter?.(e as any);
			},
			[controls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) controls.start("normal");
				else onMouseLeave?.(e as any);
			},
			[controls, onMouseLeave],
		);

		const circleAnim: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.1, 1],
				rotate: 360,
				transition: { duration: 2 * speed, repeat: 0, ease: "linear" },
			},
		};

		const plusLine: Variants = {
			normal: { opacity: 1 },
			animate: {
				opacity: [1, 0.4, 1],
				transition: { duration: 1 * speed, repeat: 0, ease: "easeInOut" },
			},
		};

		return (
			<motion.div
				className={cn("inline-flex items-center justify-center", className)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				{...props}
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					animate={controls}
					initial="normal"
				>
					<motion.circle
						cx="12"
						cy="12"
						r="10"
						variants={circleAnim}
						stroke="currentColor"
					/>
					<motion.path d="M8 12h8" variants={plusLine} stroke="currentColor" />
					<motion.path d="M12 8v8" variants={plusLine} stroke="currentColor" />
				</motion.svg>
			</motion.div>
		);
	},
);

CirclePlusIcon.displayName = "CirclePlusIcon";
export { CirclePlusIcon };
