"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
	signIn,
	signOut,
	getProviders,
	ClientSafeProvider,
} from "next-auth/react";

const Nav = () => {
	const isUserLoggedIn = true;
	const [providers, setProviders] = useState<Record<
		string,
		ClientSafeProvider
	> | null>(null);
	const [toggleDropdown, setToggleDropdown] = useState(false);

	useEffect(() => {
		const fetchProviders = async () => {
			const response = await getProviders();
			setProviders(response);
		};
		fetchProviders();
	}, []);

	return (
		<nav className="flex-between w-full mb-16 pt-3">
			<Link href="/" className="flex gap-2 flex-center">
				<Image
					src="/assets/images/logo.svg"
					alt="Promt Central Logo"
					width={30}
					height={30}
					className="object-contain"
				/>
				<p className="logo_text">Prompt Central</p>
			</Link>
			<div className="sm:flex hidden">
				{isUserLoggedIn ? (
					<div className="flex gap-3 md:gap-5">
						<Link href="/create-promt" className="black_btn">
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
								src="/assets/images/logo.svg"
								width={37}
								height={37}
								alt="Profile Picture"
								className="shadow-lg rounded-full"
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
									className="black_btn"
								>
									Sign In
								</button>
							))}
					</>
				)}
			</div>
			<div className="sm:hidden flex relative">
				{isUserLoggedIn ? (
					<div className="flex">
						<Image
							src="/assets/images/logo.svg"
							width={37}
							height={37}
							alt="Profile Picture"
							className="rounded-full"
							onClick={() => setToggleDropdown((prev) => !prev)}
						/>
						{toggleDropdown && (
							<div className="dropdown">
								<Link
									href="/profile"
									className="dropdown_link"
									onClick={() => setToggleDropdown(false)}
								>
									My Profile
								</Link>
								<Link
									href="/create-prompt"
									className="dropdown_link"
									onClick={() => setToggleDropdown(false)}
								>
									Create Prompt
								</Link>
								<button
									type="button"
									onClick={() => {
										setToggleDropdown(false);
										signOut();
									}}
									className="dropdown_link"
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
									Sign In
								</button>
							))}
					</>
				)}
			</div>
		</nav>
	);
};

export default Nav;
