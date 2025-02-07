import React, { Suspense } from "react";
import Feed from "@components/Feed";
import Spinner from "@components/Spinner";

const HeroSection = () => (
	<div className="mx-auto max-w-7xl space-y-6 py-12 text-center">
		<h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
			Master AI Prompting with{" "}
			<span className="red_gradient mt-2 block">Prompt Central</span>
		</h1>
		<p className="mx-auto max-w-2xl text-xl text-gray-600">
			Your collaborative hub for sharing powerful AI prompts that deliver
			results
		</p>
	</div>
);

const Home = () => {
	return (
		<main className="flex min-h-screen flex-col items-center px-4 sm:px-8">
			<HeroSection />
			<Suspense fallback={<Spinner />}>
				<Feed />
			</Suspense>
		</main>
	);
};

export default Home;
