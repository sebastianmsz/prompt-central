"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";

class ErrorBoundary extends Component<
	{ children: ReactNode },
	{ hasError: boolean }
> {
	constructor(props: { children: ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <div>Something went wrong. Please try again.</div>;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
