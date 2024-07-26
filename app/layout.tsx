import "../styles/global.css";

export const metadata = {
	title: "Prompt Central",
	description: "Discover and share AI promts.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<div className="main">
					<div className="gradient" />
				</div>
				<main className="app">{children}</main>
			</body>
		</html>
	);
}
