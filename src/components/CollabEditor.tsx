"use client";

import React, { useEffect, useRef, useImperativeHandle } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

type CollabEditorProps = {
	docId: string;
	language?: string;
	enableVim?: boolean;
	onVimReady?: () => void;
	onVimFailed?: (err?: any) => void;
};

export type CollabEditorHandle = {
	toggleVim: (on?: boolean) => void;
	loadVim: () => Promise<boolean>;
};

const CollabEditor = React.forwardRef(function CollabEditor(
	{
		docId,
		language = "javascript",
		enableVim = false,
		onVimReady,
		onVimFailed,
	}: CollabEditorProps,
	ref: React.Ref<CollabEditorHandle | null>,
) {
	const ydocRef = useRef<Y.Doc | null>(null);
	const providerRef = useRef<any>(null);
	const editorRef = useRef<any>(null);
	const vimStatusRef = useRef<HTMLDivElement | null>(null);
	const vimModeRef = useRef<any>(null);

	// helper: create a vim mode instance from a dynamically imported module
	const createVimFromModule = (
		mod: any,
		editor: any,
		statusNode: HTMLElement | null,
	) => {
		// common shapes:
		// - module exports { initVimMode }
		// - module.default is a function or object with initVimMode
		// - module itself is a function
		try {
			if (!mod) throw new Error("empty module");
			if (typeof mod === "function") return mod(editor, statusNode);
			if (mod.initVimMode && typeof mod.initVimMode === "function")
				return mod.initVimMode(editor, statusNode);
			const d = mod.default || mod;
			if (typeof d === "function") return d(editor, statusNode);
			if (d && typeof d.initVimMode === "function")
				return d.initVimMode(editor, statusNode);
		} catch (e) {
			// fall through and throw below
		}
		throw new Error("could not find init function in monaco-vim module");
	};

	useEffect(() => {
		const ydoc = new Y.Doc();
		ydocRef.current = ydoc;

		const protocol =
			typeof window !== "undefined" && window.location.protocol === "https:"
				? "wss:"
				: "ws:";
		// connect to local collab server
		const wsUrl = `${protocol}//${window.location.hostname}:1234`;
		const provider = new WebsocketProvider(wsUrl, docId, ydoc);
		providerRef.current = provider;

		provider.on("status", (ev: any) => {
			console.log("y-websocket status:", ev);
		});

		return () => {
			provider.disconnect();
			ydoc.destroy();
		};
	}, [docId]);

	const handleEditorMount = (editor: any, monaco: any) => {
		editorRef.current = editor;

		const ydoc = ydocRef.current;
		if (!ydoc) return;

		// create a shared text type
		const ytext = ydoc.getText("monaco");

		// initialize editor content from ytext
		editor.setValue(ytext.toString());

		// apply remote updates
		ytext.observe(() => {
			const remote = ytext.toString();
			if (remote !== editor.getValue()) {
				const pos = editor.getPosition();
				editor.setValue(remote);
				if (pos) editor.setPosition(pos);
			}
		});

		// apply local updates to ytext
		editor.onDidChangeModelContent(() => {
			const current = editor.getValue();
			if (current !== ytext.toString()) {
				// perform a full replace (simple approach)
				ydoc.transact(() => {
					ytext.delete(0, ytext.length);
					ytext.insert(0, current);
				});
			}
		});

		// init vim — defer dynamic import until requested
		const ensureVim = async () => {
			if (vimModeRef.current) return true;
			if (!editor) return false;
			try {
				const mod = await import("monaco-vim");
				// create instance from whatever shape the module has
				vimModeRef.current = createVimFromModule(
					mod,
					editor,
					vimStatusRef.current,
				);
				if (typeof onVimReady === "function") onVimReady();
				return true;
			} catch (e) {
				if (typeof onVimFailed === "function") onVimFailed(e);
				return false;
			}
		};

		if (enableVim) {
			ensureVim();
		}
	};

	// expose a toggle to parent
	useImperativeHandle(ref, () => ({
		toggleVim: async (on?: boolean) => {
			const shouldOn =
				typeof on === "boolean" ? on : !Boolean(vimModeRef.current);
			if (shouldOn) {
				if (!editorRef.current) return;
				try {
					const mod = await import("monaco-vim");
					vimModeRef.current = createVimFromModule(
						mod,
						editorRef.current,
						vimStatusRef.current,
					);
				} catch (e) {
					// no-op
				}
			} else {
				// disabling vim: monaco-vim returns an object with dispose or similar; try to call a detach method if present
				try {
					if (
						vimModeRef.current &&
						typeof vimModeRef.current.dispose === "function"
					) {
						vimModeRef.current.dispose();
					}
				} catch (e) {
					// ignore
				}
				vimModeRef.current = null;
			}
		},
		loadVim: async () => {
			if (!editorRef.current) return false;
			try {
				const mod = await import("monaco-vim");
				vimModeRef.current = createVimFromModule(
					mod,
					editorRef.current,
					vimStatusRef.current,
				);
				return true;
			} catch (e) {
				return false;
			}
		},
	}));

	// Cleanup vim mode if component unmounts
	useEffect(() => {
		return () => {
			try {
				if (
					vimModeRef.current &&
					typeof vimModeRef.current.dispose === "function"
				) {
					vimModeRef.current.dispose();
				}
			} catch (e) {
				// ignore
			}
			vimModeRef.current = null;
		};
	}, []);

	return (
		<div className="h-[80vh] w-full">
			<div ref={vimStatusRef} className="mb-1 text-xs text-zinc-400" />
			<Editor
				height="100%"
				defaultLanguage={language}
				theme="vs-dark"
				onMount={handleEditorMount}
			/>
		</div>
	);
});

export default CollabEditor;
