"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface WalletMinimalIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface WalletMinimalIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const WalletMinimalIcon = forwardRef<
	WalletMinimalIconHandle,
	WalletMinimalIconProps
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

		const wrapperVariants: Variants = {
			normal: { rotate: 0, scale: 1 },
			animate: {
				rotate: [-2, 0, -1, 0],
				scale: [1, 1.02, 1],
				transition: { duration: 0.9 * speed, ease: "easeInOut" as const },
			},
		};

		const outlineVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [120, 0],
				opacity: [0.4, 1],
				transition: { duration: 0.8 * speed, ease: "easeInOut" as const },
			},
		};

		const dotPopVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.7, 1.25, 1],
				opacity: [0, 1],
				transition: {
					duration: 0.45 * speed,
					delay: 0.4,
					ease: "easeOut" as const,
				},
			},
		};

		const latchSnapVariants: Variants = {
			normal: { x: 0, opacity: 0 },
			animate: {
				x: [0, 3, 0],
				opacity: [0, 1, 0],
				transition: {
					duration: 0.5 * speed,
					delay: 0.5,
					ease: "easeInOut" as const,
				},
			},
		};

		const shimmerVariants: Variants = {
			normal: { x: -18, opacity: 0 },
			animate: {
				x: [-18, 22],
				opacity: [0, 0.35, 0],
				transition: {
					duration: 0.8 * speed,
					delay: 0.25,
					ease: "easeInOut" as const,
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
					className="lucide lucide-wallet-minimal-icon lucide-wallet-minimal"
				>
					<motion.g
						variants={wrapperVariants}
						initial="normal"
						animate={controls}
					>
						<defs>
							<linearGradient id="wm-shimmer" x1="0" x2="1" y1="0" y2="0">
								<stop offset="0%" stopColor="currentColor" stopOpacity="0" />
								<stop
									offset="50%"
									stopColor="currentColor"
									stopOpacity="0.35"
								/>
								<stop offset="100%" stopColor="currentColor" stopOpacity="0" />
							</linearGradient>
						</defs>

						<motion.path
							d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"
							strokeDasharray="120"
							strokeDashoffset="120"
							variants={outlineVariants}
							initial="normal"
							animate={controls}
						/>

						<motion.path
							d="M17 14h.01"
							variants={dotPopVariants}
							initial="normal"
							animate={controls}
						/>

						<motion.path
							d="M17 14h.01"
							variants={latchSnapVariants}
							initial="normal"
							animate={controls}
						/>

						<motion.rect
							x="2"
							y="4"
							width="20"
							height="16"
							rx="3"
							fill="url(#wm-shimmer)"
							variants={shimmerVariants}
							initial="normal"
							animate={controls}
							style={{ pointerEvents: "none" }}
						/>
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

WalletMinimalIcon.displayName = "WalletMinimalIcon";
export { WalletMinimalIcon };
