"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface DiffIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface DiffIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const DiffIcon = forwardRef<DiffIconHandle, DiffIconProps>(
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

		const diffVariants: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.15, 0.9, 1],
				rotate: [0, -2, 2, 0],
				transition: {
					duration: 1.2 * speed,
					ease: "easeInOut",
					repeat: Infinity,
				},
			},
		};

		const plusVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: 1,
				transition: {
					duration: 0.6 * speed,
					ease: "easeInOut",
					repeat: Infinity,
					repeatDelay: 0.4,
				},
			},
		};

		const minusVariants: Variants = {
			normal: { x: 0, opacity: 1 },
			animate: {
				x: [-10, 0, 10, 0],
				opacity: [0.8, 1, 0.8, 1],
				transition: {
					duration: 1.2 * speed,
					ease: "easeInOut",
					repeat: Infinity,
				},
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
					variants={diffVariants}
				>
					<motion.path d="M12 3v14" variants={plusVariants} />{" "}
					<motion.path d="M5 10h14" variants={plusVariants} />{" "}
					<motion.path d="M5 21h14" variants={minusVariants} />{" "}
				</motion.svg>
			</motion.div>
		);
	},
);

DiffIcon.displayName = "DiffIcon";
export { DiffIcon };
