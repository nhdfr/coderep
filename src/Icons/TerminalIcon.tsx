"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface TerminalIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface TerminalIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const TerminalIcon = forwardRef<TerminalIconHandle, TerminalIconProps>(
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
			normal: { transition: { duration: 0.3 * speed } },
			animate: { transition: { staggerChildren: 0.1 } },
		};

		const commandLineVariants: Variants = {
			normal: { scaleX: 1, originX: 0, transition: { duration: 0.3 * speed } },
			animate: {
				scaleX: [1, 0.3, 1],
				originX: 0,
				transition: { duration: 0.6 * speed, times: [0, 0.5, 1], repeat: 0 },
			},
		};

		const chevronVariants: Variants = {
			normal: { x: 0, opacity: 1 },
			animate: {
				x: [0, -2, 0],
				opacity: [1, 0.6, 1],
				transition: { duration: 0.5 * speed, repeat: 0 },
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
					variants={svgVariants}
					animate={controls}
					initial="normal"
				>
					<motion.path d="M12 19h8" variants={commandLineVariants} />
					<motion.path d="m4 17 6-6-6-6" variants={chevronVariants} />
				</motion.svg>
			</motion.div>
		);
	},
);

TerminalIcon.displayName = "TerminalIcon";
export { TerminalIcon };
