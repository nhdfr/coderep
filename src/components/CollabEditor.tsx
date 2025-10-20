"use client";
type CollabEditorProps = {
	docId: string;
	language?: string;
	enableVim?: boolean;
	onVimReady?: () => void;
	onVimFailed?: (err?: any) => void;
	initialContent?: string;
	onChange?: (content: string) => void;
};

export type CollabEditorHandle = {
	toggleVim: (on?: boolean) => void;
	loadVim: () => Promise<boolean>;
	getValue: () => string;
	setValue: (value: string) => void;
};

const CollabEditor = React.forwardRef(function CollabEditor(
	{
		docId,
		language = "javascript",
		enableVim = false,
		onVimReady,
		onVimFailed,
		initialContent = "",
		onChange,
	}: CollabEditorProps,
	ref: React.Ref<CollabEditorHandle | null>,
) {
	const ydocRef = useRef<Y.Doc | null>(null);
	const providerRef = useRef<any>(null);
	const editorRef = useRef<any>(null);
	const vimStatusRef = useRef<HTMLDivElement | null>(null);
	const vimModeRef = useRef<any>(null);
	const contentRef = useRef<string>(initialContent);
	const [connectionStatus, setConnectionStatus] = React.useState<
		"connecting" | "connected" | "disconnected"
	>("connecting");

	const createVimFromModule = (
		mod: any,
		editor: any,
		statusNode: HTMLElement | null,
	) => {
		try {
			if (!mod) throw new Error("empty module");
			if (typeof mod === "function") return mod(editor, statusNode);
			if (mod.initVimMode && typeof mod.initVimMode === "function")
				return mod.initVimMode(editor, statusNode);
			const d = mod.default || mod;
			if (typeof d === "function") return d(editor, statusNode);
			if (d && typeof d.initVimMode === "function")
				return d.initVimMode(editor, statusNode);
		} catch (e) {}
		throw new Error("could not find init function in monaco-vim module");
	};

	useEffect(() => {
		const ydoc = new Y.Doc();
		ydocRef.current = ydoc;

		const protocol =
			typeof window !== "undefined" && window.location.protocol === "https:"
				? "wss:"
				: "ws:";
		const wsUrl = `${protocol}//${window.location.host}/ws`;

		// console.log("Connecting to WebSocket:", wsUrl);

		const provider = new WebsocketProvider(wsUrl, docId, ydoc);
		providerRef.current = provider;

		provider.on("status", (event: any) => {
			console.log("WebSocket status:", event);
			setConnectionStatus(
				event.status === "connected"
					? "connected"
					: event.status === "connecting"
						? "connecting"
						: "disconnected",
			);
		});

		const saved = localStorage.getItem(`editor-content-${docId}`);
		if (saved && !ydoc.getText("monaco").toString()) {
			ydoc.getText("monaco").insert(0, saved);
		}

		return () => {
			provider.disconnect();
			ydoc.destroy();
		};
	}, [docId]);

	const handleEditorMount = (editor: any, monaco: any) => {
		editorRef.current = editor;

		const ydoc = ydocRef.current;
		if (!ydoc) return;

		const ytext = ydoc.getText("monaco");

		const currentContent =
			ytext.toString() ||
			localStorage.getItem(`editor-content-${docId}`) ||
			initialContent;
		editor.setValue(currentContent);
		contentRef.current = currentContent;

		ytext.observe(() => {
			const remote = ytext.toString();
			if (remote !== editor.getValue()) {
				const pos = editor.getPosition();
				editor.setValue(remote);
				if (pos) editor.setPosition(pos);
				contentRef.current = remote;
				localStorage.setItem(`editor-content-${docId}`, remote);
			}
		});

		editor.onDidChangeModelContent(() => {
			const current = editor.getValue();
			if (current !== ytext.toString()) {
				ydoc.transact(() => {
					ytext.delete(0, ytext.length);
					ytext.insert(0, current);
				});
			}
			contentRef.current = current;
			localStorage.setItem(`editor-content-${docId}`, current);
			if (onChange) {
				onChange(current);
			}
		});

		const ensureVim = async () => {
			if (vimModeRef.current) return true;
			if (!editor) return false;
			try {
				const mod = await import("monaco-vim");
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
				} catch (e) {}
			} else {
				try {
					if (
						vimModeRef.current &&
						typeof vimModeRef.current.dispose === "function"
					) {
						vimModeRef.current.dispose();
					}
				} catch (e) {}
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
		getValue: () => {
			return editorRef.current?.getValue() || contentRef.current || "";
		},
		setValue: (value: string) => {
			contentRef.current = value;
			if (editorRef.current) {
				editorRef.current.setValue(value);
			}
			localStorage.setItem(`editor-content-${docId}`, value);
		},
	}));

	useEffect(() => {
		return () => {
			try {
				if (
					vimModeRef.current &&
					typeof vimModeRef.current.dispose === "function"
				) {
					vimModeRef.current.dispose();
				}
			} catch (e) {}
			vimModeRef.current = null;
		};
	}, []);

	const getConnectionStatusColor = () => {
		switch (connectionStatus) {
			case "connected":
				return "text-green-400";
			case "connecting":
				return "text-yellow-400";
			case "disconnected":
				return "text-red-400";
			default:
				return "text-zinc-400";
		}
	};

	const getConnectionStatusText = () => {
		switch (connectionStatus) {
			case "connected":
				return "Live collaboration active";
			case "connecting":
				return "Connecting...";
			case "disconnected":
				return "Offline mode (localStorage)";
			default:
				return "";
		}
	};

	return (
		<div className="h-[80vh] w-full">
			<div className="mb-1 flex items-center justify-between">
				<div ref={vimStatusRef} className="text-xs text-zinc-400" />
				<div className={`text-xs ${getConnectionStatusColor()}`}>
					{getConnectionStatusText()}
				</div>
			</div>
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
