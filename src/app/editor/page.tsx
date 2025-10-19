"use client";

import React from "react";
import CollabEditor, { CollabEditorHandle } from "@/components/CollabEditor";
import { useRouter } from "next/navigation";

export default function EditorPage() {
	const router = useRouter();
	const editorRef = React.useRef<CollabEditorHandle | null>(null);
	const [id, setId] = React.useState<string | null>(null);
	const [vimEnabled, setVimEnabled] = React.useState(false);
	const [vimStatus, setVimStatus] = React.useState<
		"not-loaded" | "loading" | "ready" | "failed"
	>("not-loaded");

	React.useEffect(() => {
		const newId = Math.random().toString(36).slice(2, 9);
		setId(newId);
		router.replace(`/p/${newId}`);
	}, [router]);

	return (
		<div className="min-h-screen bg-zinc-900 text-white">
			<div className="container mx-auto p-6">
				<h1 className="mb-4 text-2xl font-semibold">Collaborative Buffer</h1>
				<div className="mb-4 flex items-center gap-4">
					<button
						className="rounded bg-zinc-800 px-3 py-1"
						onClick={async () => {
							if (vimStatus === "not-loaded" || vimStatus === "failed") {
								setVimStatus("loading");
								const ok = await editorRef.current?.loadVim();
								setVimStatus(ok ? "ready" : "failed");
								if (!ok) return;
								setVimEnabled(true);
								return;
							}

							setVimEnabled((s) => {
								const next = !s;
								editorRef.current?.toggleVim(next);
								return next;
							});
						}}
					>
						{vimEnabled ? "Disable Vim" : "Enable Vim"}
					</button>
					<div className="text-sm text-zinc-400">
						Vim: {vimStatus}
						{vimStatus === "failed" && (
							<div>
								<span className="mr-2">(monaco-vim not installed)</span>
								<button
									className="underline"
									onClick={() => {
										alert(
											"To enable Vim: run `npm install monaco-vim` and reload the page.",
										);
									}}
								>
									Install instructions
								</button>
							</div>
						)}
					</div>
					{id && (
						<input
							readOnly
							value={`${typeof window !== "undefined" ? window.location.origin : ""}/p/${id}`}
							className="w-80 rounded bg-zinc-800 px-2 py-1"
							onFocus={(e) => e.currentTarget.select()}
						/>
					)}
				</div>
				<p className="mb-4 text-sm text-zinc-400">
					Share the link above to let others join and edit in real-time.
				</p>
				{id ? (
					<CollabEditor
						ref={editorRef}
						docId={id}
						language="javascript"
						enableVim={vimEnabled}
					/>
				) : (
					<div>Creating session...</div>
				)}
			</div>
		</div>
	);
}
