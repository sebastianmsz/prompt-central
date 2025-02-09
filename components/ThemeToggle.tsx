"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<button
			className="black_btn transition-colors duration-200"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
		>
			{resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
		</button>
	);
}
