"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserRoundCogHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserRoundCogProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

const UserRoundCogIcon = forwardRef<UserRoundCogHandle, UserRoundCogProps>(
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

		const bodyVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [40, 0],
				opacity: [0.3, 1],
				transition: { duration: 0.6 * speed, ease: "easeInOut" },
			},
		};

		const headVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.5, 1.2, 1],
				opacity: [0, 1],
				transition: { duration: 0.6 * speed, ease: "easeOut" },
			},
		};

		const cogVariants: Variants = {
			normal: { rotate: 0, scale: 1, opacity: 1 },
			animate: {
				rotate: 360,
				scale: [0.9, 1.2, 1],
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
					className="lucide lucide-user-round-cog-icon lucide-user-round-cog"
				>
					<motion.path
						d="M2 21a8 8 0 0 1 10.434-7.62"
						strokeDasharray="40"
						strokeDashoffset="40"
						variants={bodyVariants}
						initial="normal"
						animate={controls}
					/>

					<motion.circle
						cx="10"
						cy="8"
						r="5"
						variants={headVariants}
						initial="normal"
						animate={controls}
					/>

					<motion.g variants={cogVariants} initial="normal" animate={controls}>
						<motion.circle cx="18" cy="18" r="3" />
						<motion.path d="m14.305 19.53.923-.382" />
						<motion.path d="m15.228 16.852-.923-.383" />
						<motion.path d="m16.852 15.228-.383-.923" />
						<motion.path d="m16.852 20.772-.383.924" />
						<motion.path d="m19.148 15.228.383-.923" />
						<motion.path d="m19.53 21.696-.382-.924" />
						<motion.path d="m20.772 16.852.924-.383" />
						<motion.path d="m20.772 19.148.924.383" />
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

UserRoundCogIcon.displayName = "UserRoundCogIcon";
export { UserRoundCogIcon };
