"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ThemeToggle } from "./ThemeToggle";
import {
	signIn,
	signOut,
	useSession,
	getProviders,
	ClientSafeProvider,
} from "next-auth/react";

const Nav = () => {
	const { data: session } = useSession();
	const [providers, setProviders] = useState<Record<
		string,
		ClientSafeProvider
	> | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = useCallback(() => {
		setIsMenuOpen((prev) => !prev);
	}, []);

	useEffect(() => {
		(async () => {
			const res = await getProviders();
			setProviders(res);
		})();
	}, []);

	return (
		<nav className="mb-8 flex w-full items-center justify-between pt-3 md:mb-16">
			<Link href="/" className="flex-center flex gap-2">
				<Image
					src="/assets/img/logo.svg"
					alt="Prompt Central Logo"
					width={30}
					height={30}
				/>
				<p className="logo_text">Prompt Central</p>
			</Link>

			<div className="hidden gap-3 sm:flex">
				<ThemeToggle />
				{session?.user ? (
					<div className="flex gap-3 md:gap-5">
						<Link href="/create-prompt" className="black_btn">
							Create Post
						</Link>
						<button
							type="button"
							onClick={() => signOut({ callbackUrl: "/" })}
							className="outline_btn"
						>
							Sign Out
						</button>
						<Link href={`/profile/${session.user.id}`}>
							<Image
								src={session.user.image || "/assets/img/default-user.svg"}
								width={37}
								height={37}
								className="rounded-full"
								alt="Profile"
							/>
						</Link>
					</div>
				) : (
					<>
						{providers &&
							Object.values(providers).map((provider) => (
								<button
									type="button"
									key={provider.name}
									onClick={() => signIn(provider.id)}
									className="black_btn flex items-center gap-2"
								>
									<Image
										src={`/assets/img/${provider.name}.svg`}
										alt="Provider Icon"
										width={20}
										height={20}
									/>
									Sign in with {provider.name}
								</button>
							))}
					</>
				)}
			</div>

			<div className="relative flex sm:hidden">
				{session?.user ? (
					<div className="flex">
						<Image
							src={session.user.image || "/assets/img/default-user.svg"}
							width={37}
							height={37}
							className="rounded-full"
							alt="Profile"
							onClick={toggleMenu}
						/>

						{isMenuOpen && (
							<div className="dropdown absolute right-0 top-full mt-3">
								<Link
									href={`/profile/${session.user.id}`}
									className="dropdown_link"
									onClick={() => setIsMenuOpen(false)}
								>
									My Profile
								</Link>
								<Link
									href="/create-prompt"
									className="dropdown_link"
									onClick={() => setIsMenuOpen(false)}
								>
									Create Prompt
								</Link>
								<ThemeToggle />
								<button
									type="button"
									onClick={() => {
										setIsMenuOpen(false);
										signOut({ callbackUrl: "/" });
									}}
									className="black_btn mt-2 w-full"
								>
									Sign Out
								</button>
							</div>
						)}
					</div>
				) : (
					<div className="flex items-center gap-3">
						<ThemeToggle />
						{providers &&
							Object.values(providers).map((provider) => (
								<button
									type="button"
									key={provider.name}
									onClick={() => signIn(provider.id)}
									className="black_btn"
								>
									Sign in with {provider.name}
								</button>
							))}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Nav;
