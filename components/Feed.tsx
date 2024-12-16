"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import PromptCard from "./PromptCard";
import { useInView } from "react-intersection-observer";
import { Post } from "@types";
import React, { ChangeEvent } from "react";
import Spinner from "./Spinner";

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
			setLoading(true);
			setError(null);
			const response = await fetch(
				`/api/prompt?page=${pageNum}&limit=${ITEMS_PER_PAGE}`,
			);
			if (!response.ok) throw new Error("Failed to fetch prompts");

			const data: Post[] = await response.json();
			setPrompts((prev) => (pageNum === 1 ? data : [...prev, ...data]));
			setHasMore(data.length === ITEMS_PER_PAGE);
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

	useEffect(() => {
		if (inView && hasMore && !loading) {
			setPage((prev) => prev + 1);
		}
	}, [inView, hasMore, loading]);

	const handleTagClick = useCallback((tag: string) => {
		console.log(`Tag clicked: ${tag}`);
	}, []);

	const handleEdit = useCallback((id: string) => {
		console.log(`Edit clicked: ${id}`);
	}, []);

	const handleDelete = useCallback((id: string) => {
		console.log(`Delete clicked: ${id}`);
	}, []);

	const memoizedPromptCards = useMemo(
		() =>
			prompts.map((prompt) => (
				<PromptCard
					key={prompt._id}
					post={prompt}
					handleTagClick={handleTagClick}
					handleEdit={() => handleEdit(prompt._id || "")}
					handleDelete={() => handleDelete(prompt._id || "")}
					userId={prompt.creator?.id}
				/>
			)),
		[prompts, handleTagClick, handleEdit, handleDelete],
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
			{loading && <Spinner />}
			<div ref={ref} className="h-8" />
			{error && <div className="mt-4 text-red-500">{error}</div>}
		</div>
	);
};

export default Feed;
