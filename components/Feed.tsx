"use client";

import { useState, useEffect, useMemo, useCallback, ChangeEvent } from "react";
import PromptCard from "./PromptCard";
import { Post } from "@types";
import React from "react";
import Spinner from "./Spinner";
import NoResults from "./NoResults";
import usePromptList from "@app/hooks/usePromptList";
import { useSearchParams } from "next/navigation";

const Feed = () => {
	const searchParams = useSearchParams();
	const tag = searchParams.get("tag");

	const [searchText, setSearchText] = useState("");

	const {
		data: allPrompts,
		loading,
		error,
		page,
		totalPages,
		handleLoadMore,
		refreshData,
	} = usePromptList<Post>({ apiEndpoint: "/api/prompt" });

	const handleTagClick = useCallback((tag: string) => {
		console.log(`Tag clicked: ${tag}`);
		setSearchText(tag);
	}, []);

	const handleDelete = useCallback(
		(postId: string, optimistic?: boolean) => {
			if (optimistic) {
				setFilteredPrompts((prevPrompts) =>
					prevPrompts.filter((post) => post._id !== postId),
				);
			} else {
				refreshData();
			}
		},
		[refreshData],
	);

	const [filteredPrompts, setFilteredPrompts] = useState<Post[]>(allPrompts);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			const lowerSearchText = searchText.toLowerCase();
			const newFilteredPrompts = allPrompts.filter(
				(prompt) =>
					prompt.prompt.toLowerCase().includes(lowerSearchText) ||
					prompt.tag.some((tag) =>
						tag.toLowerCase().includes(lowerSearchText),
					) ||
					prompt.creator?.name?.toLowerCase().includes(lowerSearchText),
			);
			setFilteredPrompts(newFilteredPrompts);
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchText, allPrompts]);

	useEffect(() => {
		setFilteredPrompts(allPrompts);
	}, [allPrompts]);

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

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	const clearSearch = useCallback(() => {
		setSearchText("");
	}, []);

	useEffect(() => {
		if (tag) {
			setSearchText(tag);
		}
	}, [tag]);

	const showNoResults =
		searchText && !loading && !error && filteredPrompts.length === 0;

	return (
		<div className="flex w-full flex-col items-center">
			<form className="relative flex w-full justify-center">
				<input
					type="text"
					placeholder="Search prompts by text, tag, or creator"
					value={searchText}
					onChange={handleSearchChange}
					required
					className="mt-5 w-full max-w-md rounded-md border px-5 py-2 text-sm shadow focus:border-black focus:outline-none focus:ring-0"
				/>
			</form>
			{showNoResults ? (
				<NoResults searchTerm={searchText} onClear={clearSearch} />
			) : (
				<>
					<div className="prompt_grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{memoizedFilteredPromptCards}
					</div>
					{loading && <Spinner />}
					{error && <div className="mt-4 text-red-500">{error}</div>}
					{filteredPrompts.length >= 12 &&
						page < totalPages &&
						!loading &&
						!error && (
							<button onClick={handleLoadMore} className="black_btn mb-4">
								Load More
							</button>
						)}
				</>
			)}
		</div>
	);
};

export default Feed;
