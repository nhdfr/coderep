import Link from "next/link";
import React from "react";

const NotFound: React.FC = () => {
	return (
		<div className="from-bgDark to-bgDark flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br via-zinc-900 px-6 text-white">
			<h1 className="text-center text-6xl font-extrabold tracking-wide drop-shadow-lg">
				404
			</h1>
			<h2 className="text-center text-2xl font-semibold">
				Oops! Page Not Found
			</h2>
			<p className="max-w-md text-center text-gray-400">
				Sorry, the page you are looking for might have been removed, had its
				name changed, or is temporarily unavailable.
			</p>
			<Link
				href="/"
				className="text-indigoDeep hover:text-indigoDeep/90 transition-colors duration-300"
			>
				Go Back Home
			</Link>
		</div>
	);
};

export default NotFound;
