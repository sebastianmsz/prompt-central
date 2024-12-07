"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import PromptCard from "./PromptCard";
import { useInView } from "react-intersection-observer";
import { Post } from "@types";
import React from "react";

const ITEMS_PER_PAGE = 10;

const Feed = () => {
	const [prompts, setPrompts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const { ref, inView } = useInView();

	const fetchPrompts = useCallback(async (pageNum: number) => {
		try {
			const response = await fetch(
				`/api/prompt?page=${pageNum}&limit=${ITEMS_PER_PAGE}`,
			);
			if (!response.ok) throw new Error("Failed to fetch prompts");

			const data: Post[] = await response.json();
			setPrompts((prev) => (pageNum === 1 ? data : [...prev, ...data]));
			setHasMore(data.length === ITEMS_PER_PAGE);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPrompts(page);
	}, [fetchPrompts, page]);

	useEffect(() => {
		if (inView && hasMore && !loading) {
			setPage((prev) => prev + 1);
		}
	}, [inView, hasMore, loading]);

	const handleTagClick = useCallback((tag: string) => {
		console.log(`Tag clicked: ${tag}`);
	}, []);

	const memoizedPromptCards = useMemo(
		() =>
			prompts.map((prompt) => (
				<PromptCard
					key={prompt._id}
					post={prompt}
					handleTagClick={handleTagClick}
				/>
			)),
		[prompts, handleTagClick],
	);

	const [searchText, setSearchText] = useState("");
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			console.log(searchText);
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchText]);

	return (
		<div className="flex flex-col items-center w-full">
			<form className="relative flex justify-center w-full">
				<input
					type="text"
					placeholder="Search for a tag or a username"
					value={searchText}
					onChange={handleSearchChange}
					required
					className="w-full max-w-md px-5 py-2 mt-5 text-sm border rounded-md shadow focus:outline-none focus:ring-0 focus:border-black"
				/>
			</form>
			<div className="grid w-full max-w-6xl gap-6 mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min">
				{memoizedPromptCards}
			</div>
			{loading && (
				<div className="w-16 h-16 my-8 border-4 border-t-amber-500 border-gray-200 rounded-full animate-spin" />
			)}
			<div ref={ref} className="h-8" />
			{error && <div className="mt-4 text-red-500">{error}</div>}
		</div>
	);
};

export default Feed;
