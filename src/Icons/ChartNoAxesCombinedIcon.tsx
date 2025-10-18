"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ChartNoAxesCombinedIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface ChartNoAxesCombinedIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const ChartNoAxesCombinedIcon = forwardRef<
	ChartNoAxesCombinedIconHandle,
	ChartNoAxesCombinedIconProps
>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const groupControls = useAnimation();
		const barsControls = useAnimation();
		const lineControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						groupControls.start("normal");
						barsControls.start("normal");
						lineControls.start("normal");
					} else {
						groupControls.start("animate");
						barsControls.start("animate");
						lineControls.start("animate");
					}
				},
				stopAnimation: () => {
					groupControls.start("normal");
					barsControls.start("normal");
					lineControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					groupControls.start("animate");
					barsControls.start("animate");
					lineControls.start("animate");
				} else onMouseEnter?.(e as any);
			},
			[groupControls, barsControls, lineControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					groupControls.start("normal");
					barsControls.start("normal");
					lineControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[groupControls, barsControls, lineControls, onMouseLeave],
		);

		const ease = [0.25, 0.1, 0.25, 1] as const;

		const groupVariants: Variants = {
			normal: { scale: 1, rotate: 0, y: 0 },
			animate: {
				scale: [1, 1.04, 0.99, 1],
				rotate: [0, -1.5, 1, 0],
				transition: { duration: 0.8 * speed, ease },
			},
		};

		const barVariant = (delay = 0): Variants => ({
			normal: { scaleY: 1, opacity: 1, transformOrigin: "center bottom" },
			animate: {
				scaleY: [1, 1.4, 0.95, 1],
				opacity: [1, 1, 0.95, 1],
				transition: { duration: 0.7 * speed, ease, delay },
			},
		});

		const lineVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.6, 1],
				transition: { duration: 1.0 * speed, ease: "easeInOut", delay: 0.12 },
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
					initial="normal"
					animate={groupControls}
					variants={groupVariants}
				>
					<motion.path
						d="M12 16v5"
						initial="normal"
						animate={barsControls}
						variants={barVariant(0)}
					/>
					<motion.path
						d="M16 14v7"
						initial="normal"
						animate={barsControls}
						variants={barVariant(0.06)}
					/>
					<motion.path
						d="M20 10v11"
						initial="normal"
						animate={barsControls}
						variants={barVariant(0.12)}
					/>
					<motion.path
						d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"
						initial="normal"
						animate={lineControls}
						variants={lineVariants}
					/>
					<motion.path
						d="M4 18v3"
						initial="normal"
						animate={barsControls}
						variants={barVariant(0.18)}
					/>
					<motion.path
						d="M8 14v7"
						initial="normal"
						animate={barsControls}
						variants={barVariant(0.24)}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

ChartNoAxesCombinedIcon.displayName = "ChartNoAxesCombinedIcon";
export { ChartNoAxesCombinedIcon };
