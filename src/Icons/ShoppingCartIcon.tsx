"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ShoppingCartIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface ShoppingCartIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const ShoppingCartIcon = forwardRef<
	ShoppingCartIconHandle,
	ShoppingCartIconProps
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
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e as any);
				}
			},
			[controls, onMouseLeave],
		);

		const cartVariants: Variants = {
			normal: { y: 0, rotate: 0, scale: 1 },
			animate: {
				y: [0, -3, 0, -1, 0],
				rotate: [0, -4, 3, -2, 0],
				transition: {
					duration: 1.8 * speed,
					repeat: 0,
					ease: "easeInOut",
				},
			},
		};

		const wheelVariants: Variants = {
			normal: { rotate: 0 },
			animate: {
				rotate: [0, 360],
				transition: { duration: 1 * speed, ease: "linear", repeat: 0 },
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
				>
					<motion.circle cx="8" cy="21" r="1" variants={wheelVariants} />
					<motion.circle cx="19" cy="21" r="1" variants={wheelVariants} />

					<motion.path
						d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
						variants={cartVariants}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

ShoppingCartIcon.displayName = "ShoppingCartIcon";
export { ShoppingCartIcon };
