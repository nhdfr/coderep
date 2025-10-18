"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface MessageCircleIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface MessageCircleIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const MessageCircleIcon = forwardRef<
	MessageCircleIconHandle,
	MessageCircleIconProps
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

		const svgVariants: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.05, 0.95, 1],
				rotate: [0, -2, 2, 0],
				transition: { duration: 1.1 * speed, ease: "easeInOut", repeat: 0 },
			},
		};

		const pathVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.6, 1],
				transition: { duration: 1.2 * speed, ease: "easeInOut", repeat: 0 },
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
				>
					<motion.path
						d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 
               3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 
               0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"
						variants={pathVariants}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

MessageCircleIcon.displayName = "MessageCircleIcon";
export { MessageCircleIcon };
