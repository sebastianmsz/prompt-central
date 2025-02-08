"use client";

import { useCallback, useMemo } from "react";
import PromptCard from "./PromptCard";
import { Post } from "@types";
import Spinner from "./Spinner";
import NoResults from "./NoResults";
import usePromptList from "@app/hooks/usePromptList";
import { useSearch } from "@app/hooks/useSearch";
import { useTagFilter } from "@app/hooks/useTagFilter";

const Feed = () => {
	const {
		data: allPrompts,
		loading: isInitialLoading,
		error,
		page,
		totalPages,
		handleLoadMore,
		refreshData,
	} = usePromptList<Post>({ apiEndpoint: "/api/prompt" });

	const {
		filteredItems: searchResults,
		searchTerm,
		setSearchTerm,
		isSearching,
		clearSearch,
	} = useSearch<Post>({
		items: allPrompts,
		searchFields: ["prompt", "creator._id", "creator.name", "creator.email"],
		debounceMs: 300,
	});

	const {
		filteredItems: tagFilteredItems,
		activeTag,
		setActiveTag,
		isFiltering,
	} = useTagFilter<Post>({
		items: searchResults,
		tagField: "tag",
		debounceMs: 100,
	});

	const handleTagClick = useCallback(
		(tag: string) => {
			if (activeTag === tag) {
				setActiveTag(null);
			} else {
				clearSearch();
				setActiveTag(tag);
			}
		},
		[activeTag, setActiveTag, clearSearch],
	);

	const handleDelete = useCallback(
		(postId: string, optimistic?: boolean) => {
			if (optimistic) {
				refreshData();
			} else {
				refreshData();
			}
		},
		[refreshData],
	);

	const memoizedPromptCards = useMemo(
		() =>
			tagFilteredItems.map((prompt) => (
				<PromptCard
					key={prompt._id}
					post={prompt}
					handleTagClick={handleTagClick}
					userId={prompt.creator?._id}
					isProfilePage={false}
					onDelete={handleDelete}
				/>
			)),
		[tagFilteredItems, handleTagClick, handleDelete],
	);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
			if (activeTag) {
				setActiveTag(null);
			}
		},
		[setSearchTerm, activeTag, setActiveTag],
	);

	const showNoResults =
		!isInitialLoading &&
		!error &&
		tagFilteredItems.length === 0 &&
		(searchTerm || activeTag);

	const getFilterStatus = () => {
		if (isSearching || isFiltering) {
			return "Filtering...";
		}
		if (activeTag) {
			return `Showing results for tag: #${activeTag}`;
		}
		if (searchTerm) {
			return `Showing results for: "${searchTerm}"`;
		}
		return null;
	};

	const filterStatus = getFilterStatus();

	return (
		<div className="flex w-full flex-col items-center">
			<form className="relative flex w-full justify-center">
				<input
					type="text"
					placeholder="Search prompts by text or creator"
					value={searchTerm}
					onChange={handleSearchChange}
					className="mt-5 w-full max-w-md rounded-md border px-5 py-2 text-sm shadow focus:border-black focus:outline-none focus:ring-0"
				/>
			</form>

			{filterStatus && (
				<div className="mt-4 flex items-center gap-2">
					<span className="text-sm text-gray-600">{filterStatus}</span>
					{(activeTag || searchTerm) && !isSearching && !isFiltering && (
						<button
							onClick={() => {
								clearSearch();
								setActiveTag(null);
							}}
							className="text-sm text-blue-600 hover:underline"
						>
							Clear filters
						</button>
					)}
				</div>
			)}

			{showNoResults ? (
				<NoResults
					searchTerm={searchTerm || activeTag || ""}
					onClear={() => {
						clearSearch();
						setActiveTag(null);
					}}
				/>
			) : (
				<>
					<div className="prompt_grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{memoizedPromptCards}
					</div>
					{isInitialLoading && <Spinner />}
					{error && <div className="mt-4 text-red-500">{error}</div>}
					{tagFilteredItems.length >= 12 &&
						page < totalPages &&
						!isInitialLoading &&
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
