import React, { Suspense } from "react";
import Feed from "@components/Feed";
import Spinner from "@components/Spinner";

const Home: React.FC = () => {
	return (
		<section className="flex-center w-full flex-col">
			<h1 className="head_text text center">
				Discover and Share
				<br className="max-md:hidden" />
				<span className="orange_gradient text-center">AI-Powered Prompts</span>
			</h1>
			<p className="desc text-center">
				Prompt Central is an open-source AI prompting tool for modern world to
				discover, create and share creative prompts
			</p>
			<Suspense fallback={<Spinner />}>
				<Feed />
			</Suspense>
		</section>
	);
};

export default Home;
