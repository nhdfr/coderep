"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface YenYuanIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface YenYuanIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const YenYuanIcon = forwardRef<YenYuanIconHandle, YenYuanIconProps>(
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

		const svgVariants: Variants = {
			normal: { scale: 1, rotate: 0, y: 0 },
			animate: {
				scale: [1, 1.06, 1],
				rotate: [0, -2, 2, 0],
				y: [0, -1, 0],
				transition: { duration: 1.2 * speed, ease: "easeInOut" },
			},
		};

		const vStroke: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.7, 1],
				transition: { duration: 0.9 * speed, ease: "easeInOut", delay: 0.06 },
			},
		};

		const midStroke: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.8, 1],
				transition: { duration: 0.6 * speed, ease: "easeInOut", delay: 0.22 },
			},
		};

		const baseStroke: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.8, 1],
				transition: { duration: 0.6 * speed, ease: "easeInOut", delay: 0.34 },
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
					variants={svgVariants}
					className="lucide lucide-japanese-yen-icon lucide-japanese-yen"
				>
					<g opacity={0.35}>
						<path d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3" />
						<path d="M6 15h12" />
						<path d="M6 11h12" />
					</g>

					<motion.path
						d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3"
						pathLength={1}
						variants={vStroke}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M6 11h12"
						pathLength={1}
						variants={midStroke}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M6 15h12"
						pathLength={1}
						variants={baseStroke}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

YenYuanIcon.displayName = "YenYuanIcon";
export { YenYuanIcon };
