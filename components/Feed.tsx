"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import PromptCard from "./PromptCard";
import { useInView } from "react-intersection-observer";
import { Post, FeedProps } from "@types";

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

	const handleTagClick = (tag: string) => {
		console.log(`Tag clicked: ${tag}`);
	};

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

	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="feed">
			{memoizedPromptCards}
			{loading && <div className="loading-spinner" />}
			<div ref={ref} style={{ height: "20px" }} />
		</div>
	);
};

export default Feed;
