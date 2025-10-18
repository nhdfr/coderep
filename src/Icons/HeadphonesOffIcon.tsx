"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface HeadphonesOffIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface HeadphonesOffIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const HeadphonesOffIcon = forwardRef<
	HeadphonesOffIconHandle,
	HeadphonesOffIconProps
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

		const headphonesVariants: Variants = {
			normal: { rotate: 0, scale: 1 },
			animate: {
				scale: [1, 1.1, 0.95, 1],
				rotate: [0, -3, 3, -2, 0],
				transition: { duration: 1.2 * speed, ease: "easeInOut", repeat: 0 },
			},
		};

		const earcupVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [1, 1.2, 0.9, 1],
				opacity: [1, 0.7, 1],
				transition: { duration: 0.9 * speed, ease: "easeInOut", repeat: 0 },
			},
		};

		const slashVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [1, 0, 1],
				opacity: 1,
				transition: { duration: 1.2 * speed, ease: "easeInOut" },
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
					variants={headphonesVariants}
				>
					<motion.path
						d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 
            2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 
            0v7a2 2 0 0 1-2 2h-1a2 
            2 0 0 1-2-2v-3a2 2 0 0 1 
            2-2h3"
						variants={earcupVariants}
					/>

					<motion.path
						d="M22 2L2 22"
						variants={slashVariants}
						strokeWidth={2.5}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

HeadphonesOffIcon.displayName = "HeadphonesOffIcon";
export { HeadphonesOffIcon };
