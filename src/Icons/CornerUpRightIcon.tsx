"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CornerUpRightIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CornerUpRightIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const CornerUpRightIcon = forwardRef<
	CornerUpRightIconHandle,
	CornerUpRightIconProps
>(
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

		const iconVariants: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.12, 0.95, 1],
				rotate: [0, 6, -4, 0],
				transition: { duration: 0.9 * speed, ease: "easeInOut" },
			},
		};

		const arrowVariants: Variants = {
			normal: { opacity: 1, x: 0, y: 0, rotate: 0 },
			animate: {
				opacity: [0, 1],
				x: [-6, 3, 0],
				y: [4, -2, 0],
				rotate: [20, -10, 0],
				transition: { duration: 0.8 * speed, ease: "easeOut", delay: 0.1 },
			},
		};

		const pathVariants: Variants = {
			normal: { pathLength: 1 },
			animate: {
				pathLength: [0, 1],
				transition: { duration: 0.7 * speed, ease: "easeInOut" },
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
					variants={iconVariants}
				>
					<motion.path
						d="M4 20v-7a4 4 0 0 1 4-4h12"
						variants={pathVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="m15 14 5-5-5-5"
						variants={arrowVariants}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

CornerUpRightIcon.displayName = "CornerUpRightIcon";
export { CornerUpRightIcon };
