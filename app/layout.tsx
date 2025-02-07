import "@styles/global.css";
import React from "react";
import Provider from "@components/Provider";
import { ThemeProvider } from "@components/ThemeProvider";
import Nav from "@components/Nav";
import ErrorBoundary from "@components/ErrorBoundary";

export const metadata = {
	title: "Prompt Central",
	description: "Discover and share AI prompts.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Provider>
						<div className="main">
							<div className="gradient" />
						</div>
						<main className="app">
							<Nav />
							<ErrorBoundary>{children}</ErrorBoundary>
						</main>
					</Provider>
				</ThemeProvider>
			</body>
		</html>
	);
}
