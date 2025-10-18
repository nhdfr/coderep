"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BoltIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BoltIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const BoltIcon = forwardRef<BoltIconHandle, BoltIconProps>(
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
				scale: [1, 1.08, 0.95, 1],
				rotate: [0, -2, 2, 0],
				transition: { duration: 1.2 * speed, ease: "easeInOut", repeat: 0 },
			},
		};

		const pathVariants: Variants = {
			normal: { pathLength: 1 },
			animate: {
				pathLength: [0, 1],
				transition: { duration: 1.3 * speed, ease: "easeInOut", repeat: 0 },
			},
		};

		const circleVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [1, 1.3, 0.9, 1],
				opacity: [1, 0.6, 1],
				transition: { duration: 1.1 * speed, ease: "easeInOut", repeat: 0 },
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
						d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
						variants={pathVariants}
					/>
					<motion.circle cx="12" cy="12" r="4" variants={circleVariants} />
				</motion.svg>
			</motion.div>
		);
	},
);

BoltIcon.displayName = "BoltIcon";
export { BoltIcon };
