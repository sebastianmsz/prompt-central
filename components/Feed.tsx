"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import PromptCard from "./PromptCard";
import { Post } from "@types";

const Feed: React.FC = () => {
	const [searchText, setSearchText] = useState<string>("");
	const [posts, setPosts] = useState<Post[]>([]);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch("/api/prompt");
			const data: Post[] = await response.json();
			setPosts(data);
		};

		fetchPosts();
	}, []);

	return (
		<section className="feed">
			<form className="relative w-full flex-center">
				<input
					type="text"
					value={searchText}
					onChange={handleSearchChange}
					placeholder="Search for prompts"
					className="search_input"
				/>
			</form>
			<div className="mt-16 prompt_layout">
				{posts.map((post) => (
					<PromptCard key={post._id} post={post} />
				))}
			</div>
		</section>
	);
};

export default Feed;
