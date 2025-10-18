"use client";

import { Icon_List } from "@/Icons";
import { SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import CmdSection from "./CmdSection";

const HeroSection: React.FC = () => {
	return (
		<div className="relative">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.7 }}
				className="from-primary/10 absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] via-transparent to-transparent"
			/>
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 1,
					delay: 0.2,
					repeat: Infinity,
					repeatType: "reverse",
				}}
				className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"
			/>
			<motion.div
				initial={{ opacity: 0, scale: 0.7 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 1.2,
					delay: 1,
					repeat: Infinity,
					repeatType: "reverse",
				}}
				className="bg-indigoDeep/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl"
			/>

			<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mt-10 flex flex-col md:mt-15 lg:flex-row lg:items-center lg:justify-between">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="space-y-8"
					>
						<div className="space-y-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1, duration: 0.7 }}
								className="bg-primary/10 border-primary/20 inline-flex items-center space-x-2 rounded-full border px-4 py-2"
							>
								<SparklesIcon size={14} className="text-primary" />
								<span className="text-primary text-xs font-medium">
									{`Now with ${Icon_List.length}+ animated icons`}
								</span>
							</motion.div>

							<motion.h1
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.7 }}
								className="text-4xl leading-tight font-bold"
							>
								<span className="from-primary via-indigoDeep to-accent bg-gradient-to-r bg-clip-text text-transparent">
									Make Every <br className="hidden max-sm:block" /> Icon Move
								</span>
								<br />
								<span className="text-white">with AnimateIcons</span>
							</motion.h1>

							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3, duration: 0.8 }}
								className="max-w-2xl space-y-2 text-sm leading-relaxed text-zinc-300"
							>
								<p>
									A sleek React library for animated SVG icons that move with
									purpose. Transform static designs into engaging user
									experiences with smooth, performant animations.
								</p>
								<p>
									built with{" "}
									<Link
										href={"https://motion.dev/"}
										target="_blank"
										className="underline"
									>
										motion
									</Link>{" "}
									and{" "}
									<Link
										href={"https://lucide.dev/"}
										target="_blank"
										className="underline"
									>
										lucide
									</Link>
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.8 }}
							>
								<CmdSection />
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
