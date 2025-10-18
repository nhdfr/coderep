"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface HeadsetIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface HeadsetIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const HeadsetIcon = forwardRef<HeadsetIconHandle, HeadsetIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const frameControls = useAnimation();
		const tailControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						frameControls.start("normal");
						tailControls.start("normal");
					} else {
						frameControls.start("animate");
						tailControls.start("animate");
					}
				},
				stopAnimation: () => {
					frameControls.start("normal");
					tailControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					frameControls.start("animate");
					tailControls.start("animate");
				} else onMouseEnter?.(e as any);
			},
			[frameControls, tailControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					frameControls.start("normal");
					tailControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[frameControls, tailControls, onMouseLeave],
		);

		const frameVariants: Variants = {
			normal: { strokeDashoffset: 0, scale: 1, rotate: 0 },
			animate: {
				strokeDashoffset: [240, 40, 0],
				scale: [1, 0.96, 1.06, 1],
				rotate: [0, -2, 1, 0],
				transition: {
					duration: 0.95 * speed,
					ease: [0.2, 0.85, 0.25, 1],
					times: [0, 0.35, 0.75, 1],
				},
			},
		};

		const tailVariants: Variants = {
			normal: { strokeDashoffset: 0, x: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [100, 20, 0],
				x: [10, -4, 0],
				opacity: [0, 1, 1],
				transition: {
					duration: 0.7 * speed,
					ease: [0.22, 0.9, 0.28, 1],
					delay: 0.18,
					times: [0, 0.5, 1],
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<motion.path
						d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"
						initial="normal"
						animate={frameControls}
						variants={frameVariants}
						style={{ strokeDasharray: 240, transformOrigin: "12px 12px" }}
					/>
					<motion.path
						d="M21 16v2a4 4 0 0 1-4 4h-5"
						initial="normal"
						animate={tailControls}
						variants={tailVariants}
						style={{ strokeDasharray: 100, strokeLinecap: "round" }}
					/>
				</svg>
			</motion.div>
		);
	},
);

HeadsetIcon.displayName = "HeadsetIcon";
export { HeadsetIcon };
