"use client";
import React, { memo } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProviderProps {
	children: React.ReactNode;
	session?: Session | null;
}

const Provider = memo(({ children }: ProviderProps) => {
	return <SessionProvider>{children}</SessionProvider>;
});

Provider.displayName = "Provider";
export default Provider;
