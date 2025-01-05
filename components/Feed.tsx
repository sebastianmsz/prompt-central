"use client";
import { useState, useEffect, useMemo, useCallback, ChangeEvent } from "react";
import PromptCard from "./PromptCard";
import { Post } from "@types";
import React from "react";
import Spinner from "./Spinner";
import usePromptList from "@app/hooks/usePromptList";

const Feed = () => {
	const [searchText, setSearchText] = useState("");
	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	const handleTagClick = useCallback((tag: string) => {
		console.log(`Tag clicked: ${tag}`);
		setSearchText(tag);
	}, []);

	const {
		data: allPrompts,
		loading,
		error,
		page,
		totalPages,
		handleLoadMore,
		refreshData,
	} = usePromptList<Post>({ apiEndpoint: "/api/prompt" });

	const [prompts, setPrompts] = useState<Post[]>(allPrompts);

	useEffect(() => {
		setPrompts(allPrompts);
	}, [allPrompts]);

	const handleDelete = useCallback(
		(postId: string, optimistic?: boolean) => {
			if (optimistic) {
				setPrompts((prevPrompts) =>
					prevPrompts.filter((post) => post._id !== postId),
				);
			} else {
				refreshData();
			}
		},
		[refreshData],
	);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			console.log(searchText);
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchText]);

	const filteredPrompts = useMemo(() => {
		if (!searchText) return prompts;
		const lowerSearchText = searchText.toLowerCase();
		return prompts.filter(
			(prompt) =>
				prompt.prompt.toLowerCase().includes(lowerSearchText) ||
				prompt.tag.toLowerCase().includes(lowerSearchText) ||
				prompt.creator?.name?.toLowerCase().includes(lowerSearchText),
		);
	}, [prompts, searchText]);

	const memoizedFilteredPromptCards = useMemo(
		() =>
			filteredPrompts.map((prompt) => (
				<PromptCard
					key={prompt._id}
					post={prompt}
					handleTagClick={handleTagClick}
					userId={prompt.creator?.id}
					isProfilePage={false}
					onDelete={handleDelete}
				/>
			)),
		[filteredPrompts, handleTagClick, handleDelete],
	);

	return (
		<div className="flex w-full flex-col items-center">
			<form className="relative flex w-full justify-center">
				<input
					type="text"
					placeholder="Search for a tag or a username"
					value={searchText}
					onChange={handleSearchChange}
					required
					className="mt-5 w-full max-w-md rounded-md border px-5 py-2 text-sm shadow focus:border-black focus:outline-none focus:ring-0"
				/>
			</form>
			<div className="prompt_grid">{memoizedFilteredPromptCards}</div>
			{loading && <Spinner />}
			{page < totalPages && !loading && (
				<button onClick={handleLoadMore} className="black_btn mb-4">
					Load More
				</button>
			)}
			{error && <div className="mt-4 text-red-500">{error}</div>}
		</div>
	);
};

export default Feed;
