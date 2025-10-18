"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ShieldUserHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface ShieldUserProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const ShieldUserIcon = forwardRef<ShieldUserHandle, ShieldUserProps>(
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
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) controls.start("animate");
				else onMouseEnter?.(e as any);
			},
			[controls, onMouseEnter, reduced],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) controls.start("normal");
				else onMouseLeave?.(e as any);
			},
			[controls, onMouseLeave],
		);

		const shieldVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [120, 0],
				opacity: [0.3, 1],
				transition: { duration: 0.8 * speed, ease: "easeInOut" },
			},
		};

		const bodyVariants: Variants = {
			normal: { opacity: 1, y: 0 },
			animate: {
				opacity: [0, 1],
				y: [6, 0],
				transition: {
					duration: 0.5 * speed,
					delay: 0.5,
					ease: "easeOut",
				},
			},
		};

		const headVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.5, 1.2, 1],
				opacity: [0, 1],
				transition: {
					duration: 0.6 * speed,
					delay: 0.3,
					ease: "easeOut",
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
					className="lucide lucide-shield-user-icon lucide-shield-user"
				>
					<motion.path
						d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
						strokeDasharray="120"
						strokeDashoffset="0"
						variants={shieldVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M6.376 18.91a6 6 0 0 1 11.249.003"
						variants={bodyVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.circle
						cx="12"
						cy="11"
						r="4"
						variants={headVariants}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

ShieldUserIcon.displayName = "ShieldUserIcon";
export { ShieldUserIcon };
