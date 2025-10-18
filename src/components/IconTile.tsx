"use client";
import { getIconCode } from "@/actions/getIconCode";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyIcon, CopyIconHandle } from "@/Icons/CopyIcon";
import { TerminalIcon, TerminalIconHandle } from "@/Icons/TerminalIcon";
import { differenceInDays } from "date-fns";
import React, { useState } from "react";
import { CheckIcon } from "./icons/CheckIcon";

type Props = {
	item: IconListItem;
};

const IconTile: React.FC<Props> = ({ item }) => {
	const [copied, setCopied] = useState(false);
	const [copiedCli, setCopiedCli] = useState(false);
	const cliRef = React.useRef<TerminalIconHandle>(null);
	const codeRef = React.useRef<CopyIconHandle>(null);

	const IconComponent = item.icon;

	const copyToClipboard = async () => {
		const code = await getIconCode(item.name);
		if (code) {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		}
	};

	const copyCliCommand = async () => {
		let cliTool = "npx";
		if (typeof window !== "undefined") {
			const savedTab = localStorage.getItem("tab");
			if (savedTab === "bun") {
				cliTool = "bunx";
			}
			if (savedTab === "pnpm") {
				cliTool = "pnpm dlx";
			}
		}

		const command = `${cliTool} shadcn@latest add "https://animateicons.vercel.app/icons/${item.name}.json"`;
		await navigator.clipboard.writeText(command);
		setCopiedCli(true);
		setTimeout(() => setCopiedCli(false), 1500);
	};

	function isNew(addedAt: string) {
		return differenceInDays(new Date(), new Date(addedAt)) <= 7;
	}

	return (
		<div className="bg-primary/10 border-primary/20 relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-md border p-4 text-sm text-white shadow-lg">
			{item.addedAt && isNew(item.addedAt) && (
				<span className="bg-primary/25 absolute top-0 right-0 rounded-bl-md px-2 py-1 text-xs font-medium text-gray-200">
					New
				</span>
			)}

			<IconComponent
				className="hover:bg-primary/15 inline-block cursor-pointer rounded-xl p-3"
				size={23}
			/>
			<p className="line-clamp-1 text-gray-300">{item.name}</p>

			<div className="mt-2 flex items-center justify-center gap-6">
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							className="hover:text-primary flex size-6 items-center justify-center"
							onClick={copyCliCommand}
							aria-label={copiedCli ? "CLI Copied" : "Copy CLI Command"}
							onMouseEnter={() => cliRef.current?.startAnimation()}
							onMouseLeave={() => cliRef.current?.stopAnimation()}
						>
							{copiedCli ? (
								<CheckIcon />
							) : (
								<TerminalIcon size={18} ref={cliRef} />
							)}
						</button>
					</TooltipTrigger>
					<TooltipContent
						side="bottom"
						className="px-3! py-1.5! font-medium! text-blue-600!"
					>
						copy shadcn/cli command
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<button
							className="hover:text-primary flex size-6 items-center justify-center"
							onClick={copyToClipboard}
							aria-label={copied ? "Code Copied" : "Copy JSX Code"}
							onMouseEnter={() => codeRef.current?.startAnimation()}
							onMouseLeave={() => codeRef.current?.stopAnimation()}
						>
							{copied ? <CheckIcon /> : <CopyIcon size={17} ref={codeRef} />}
						</button>
					</TooltipTrigger>
					<TooltipContent
						side="bottom"
						className="px-3! py-1.5! font-medium! text-blue-600!"
					>
						copy code
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};

export default IconTile;
