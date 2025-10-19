import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "shit buffer",
	description: "share your shit code whereever you want",
	keywords: ["collaboration","yjs","monaco","live edit","real-time","vim","code share"],
	openGraph: {
		title: "shitogether",
		description: "--",
		url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
		siteName: "Collaborative Buffer",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Collaborative Buffer — Live, shareable text editor",
		description: "Paste code, get a live shareable URL and edit collaboratively in real-time with optional Vim keybindings.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta
					name="google-site-verification"
					content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ""}
				/>
			</head>
			<body
				className={`${geistMono.variable} ${geistSans.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
