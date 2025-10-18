"use client";

    import React from "react";

const error: React.FC = () => {
	return (
		<div className="from-bgDark to-bgDark flex min-h-screen flex-col items-center justify-center bg-gradient-to-br via-zinc-900 text-white">
			<h1 className="text-base">Error Page</h1>
			<p>Something went wrong. Please try again later.</p>
			<p>If the problem persists, contact support.</p>
			<p>Thank you for your patience.</p>
		</div>
	);
};

export default error;
