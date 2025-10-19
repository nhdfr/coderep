// Minimal className helper to avoid bringing in `clsx` and `tailwind-merge`.
export function cn(...inputs: Array<string | false | null | undefined>) {
	return inputs.filter(Boolean).join(" ");
}
