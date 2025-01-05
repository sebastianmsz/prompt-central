"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Profile from "@components/Profile";
import Spinner from "@components/Spinner";
import { Post } from "@types";
import { useParams } from "next/navigation";
import usePromptList from "@app/hooks/usePromptList";

const UserProfile = () => {
	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<{ name: string } | null>(null);
	const [userError, setUserError] = useState<string | null>(null);

	const {
		data: initialPosts,
		loading,
		error,
		page,
		totalPages,
		handleLoadMore,
		refreshData,
	} = usePromptList<Post>({ apiEndpoint: `/api/users/${id}/posts` });

	const [posts, setPosts] = useState<Post[]>(initialPosts);

	useEffect(() => {
		setPosts(initialPosts);
	}, [initialPosts]);

	const fetchUserData = useCallback(async () => {
		try {
			const response = await fetch(`/api/users/${id}`);
			if (!response.ok) throw new Error("Failed to fetch user data");
			const { user } = (await response.json()) as { user: { name: string } };
			setUser(user);
		} catch (err: unknown) {
			let errorMessage = "Failed to load user data.";
			if (err instanceof Error) {
				errorMessage = err.message;
			}
			setUserError(errorMessage);
		}
	}, [id]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const handleDelete = useCallback(
		(postId: string, optimistic?: boolean) => {
			if (optimistic) {
				setPosts((prevPosts) =>
					prevPosts.filter((post) => post._id !== postId),
				);
			} else {
				refreshData();
			}
		},
		[refreshData],
	);

	const profileDescription = useMemo(
		() => `Posts by ${user?.name || "User"}`,
		[user?.name],
	);

	if (userError) return <p>Error: {userError}</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div className="flex w-full flex-col items-center">
			{user && (
				<Profile
					name={user.name}
					desc={profileDescription}
					data={posts}
					isCurrentUserProfile={false}
					isProfilePage={true}
					onDelete={handleDelete}
				/>
			)}
			{loading && <Spinner />}
			{page < totalPages && !loading && (
				<button onClick={handleLoadMore} className="black_btn mb-4">
					Load More
				</button>
			)}
		</div>
	);
};

export default UserProfile;
