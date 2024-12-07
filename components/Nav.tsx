"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
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
		<nav className="flex justify-between items-center w-full mb-16 pt-3">
			<Link href="/" className="flex gap-2 flex-center">
				<Image
					src="/assets/img/logo.svg"
					alt="Prompt Central Logo"
					width={30}
					height={30}
				/>
				<p className="logo_text">Prompt Central</p>
			</Link>

			<div className="sm:flex hidden">
				{session?.user ? (
					<div className="flex gap-3 md:gap-5">
						<Link href="/create-prompt" className="black_btn">
							Create Post
						</Link>
						<button
							type="button"
							onClick={() => signOut()}
							className="outline_btn"
						>
							Sign Out
						</button>
						<Link href="/profile">
							<Image
								src={session.user.image || "/assets/img/default-user.png"}
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

			<div className="sm:hidden flex relative">
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
							<div className="dropdown">
								<Link
									href="/profile"
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
								<button
									type="button"
									onClick={() => {
										setIsMenuOpen(false);
										signOut();
									}}
									className="mt-5 w-full black_btn"
								>
									Sign Out
								</button>
							</div>
						)}
					</div>
				) : (
					<>
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
					</>
				)}
			</div>
		</nav>
	);
};

export default Nav;
