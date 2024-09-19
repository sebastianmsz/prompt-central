"use client";
import { SessionProvider } from "next-auth/react";
import { ProviderProps } from "@/types";

const Provider: React.FC<ProviderProps> = ({ session, children }) => {
	return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;
