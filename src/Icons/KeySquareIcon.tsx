"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface KeySquareHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface KeySquareProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const KeySquareIcon = forwardRef<KeySquareHandle, KeySquareProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const controls = useAnimation();
		const sparkControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						controls.start("normal");
						sparkControls.start("normal");
					} else {
						controls.start("animate");
						sparkControls.start("animate");
					}
				},
				stopAnimation: () => {
					controls.start("normal");
					sparkControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					controls.start("animate");
					sparkControls.start("animate");
				} else onMouseLeave?.(e as any);
			},
			[controls, sparkControls],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
					sparkControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[controls, sparkControls],
		);

		const settle: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.03, 0.995, 1],
				rotate: [0, -3, 1, 0],
				transition: { duration: 0.6 * speed, ease: "easeInOut" },
			},
		};

		const linkPulse: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.6, 1],
				transition: {
					duration: 0.5 * speed,
					ease: "easeInOut",
					delay: 0.05,
				},
			},
		};

		const toothSnap: Variants = {
			normal: { x: 0, y: 0, opacity: 1 },
			animate: {
				x: [0.4, 0],
				y: [0, -0.4, 0],
				opacity: [0.5, 1],
				transition: {
					duration: 0.45 * speed,
					ease: "easeOut",
					delay: 0.12,
				},
			},
		};

		const miniLink: Variants = {
			normal: { scale: 1, rotate: 0, originX: 12, originY: 12 },
			animate: {
				scale: [1, 1.06, 1],
				rotate: [0, -10, 0],
				transition: {
					duration: 0.5 * speed,
					ease: "easeInOut",
					delay: 0.18,
				},
			},
		};

		const sparkTrail: Variants = {
			normal: { pathLength: 0, opacity: 0 },
			animate: {
				pathLength: [0, 1],
				opacity: [0, 1, 0],
				transition: {
					duration: 0.4 * speed,
					ease: "easeOut",
					delay: 0.36,
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
					className="lucide lucide-key-square-icon lucide-key-square"
				>
					<motion.g variants={settle} initial="normal" animate={controls}>
						<motion.path
							d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"
							variants={linkPulse}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="m14 7 3 3"
							variants={miniLink}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"
							variants={toothSnap}
							initial="normal"
							animate={controls}
						/>

						<motion.path
							d="M10.1 13.9 L12.2 12.2"
							stroke="currentColor"
							strokeWidth="1.4"
							variants={sparkTrail}
							initial="normal"
							animate={sparkControls}
						/>
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

KeySquareIcon.displayName = "KeySquareIcon";
export { KeySquareIcon };
