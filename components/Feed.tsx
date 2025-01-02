"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import PromptCard from "./PromptCard";
import { Post } from "@types";
import React, { ChangeEvent } from "react";
import Spinner from "./Spinner";

const ITEMS_PER_PAGE = 10;

const Feed = () => {
	const [prompts, setPrompts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchPrompts = useCallback(async (pageNum: number) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`/api/prompt?page=${pageNum}&limit=${ITEMS_PER_PAGE}`,
			);
			if (!response.ok) throw new Error("Failed to fetch prompts");

			const data = await response.json();
			setPrompts((prev) =>
				pageNum === 1 ? data.prompts : [...prev, ...data.prompts],
			);
			setTotalPages(data.pagination.totalPages);
		} catch (err: unknown) {
			let errorMessage = "An unknown error occurred";
			if (err instanceof Error) {
				errorMessage = err.message;
			}
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPrompts(page);
	}, [fetchPrompts, page]);

	const handleLoadMore = () => {
		if (page < totalPages && !loading) {
			setPage((prev) => prev + 1);
		}
	};

	const handleTagClick = useCallback((tag: string) => {
		console.log(`Tag clicked: ${tag}`);
	}, []);

	const handleDelete = useCallback((postId: string) => {
		setPrompts((prevPrompts) =>
			prevPrompts.filter((post) => post._id !== postId),
		);
	}, []);

	const memoizedPromptCards = useMemo(
		() =>
			prompts.map((prompt) => (
				<PromptCard
					key={prompt._id}
					post={prompt}
					handleTagClick={handleTagClick}
					userId={prompt.creator?.id}
					isProfilePage={false}
					isCurrentUserProfile={false}
					onDelete={handleDelete}
				/>
			)),
		[prompts, handleTagClick, handleDelete],
	);

	const [searchText, setSearchText] = useState("");
	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			console.log(searchText);
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchText]);

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
			<div className="mb-4 mt-10 grid w-full max-w-6xl auto-rows-min grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{memoizedPromptCards}
			</div>
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
