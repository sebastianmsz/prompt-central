"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Profile from "@components/Profile";
import Spinner from "@components/Spinner";
import { Post } from "@types";
import { useParams } from "next/navigation";

const UserProfile = () => {
	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<{ name: string } | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUserData = useCallback(async () => {
		try {
			const response = await fetch(`/api/users/${id}`);
			if (!response.ok) throw new Error("Failed to fetch user data");
			const { user } = (await response.json()) as { user: { name: string } };
			setUser(user);
		} catch {
			setError("Failed to load user data.");
		}
	}, [id]);

	const fetchPosts = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/users/${id}/posts?page=${page}&limit=12`,
			);
			if (!response.ok) throw new Error("Failed to fetch posts");
			const data = await response.json();
			setPosts((prev) =>
				page === 1 ? data.prompts : [...prev, ...data.prompts],
			);
			setTotalPages(data.pagination.totalPages);
		} catch {
			setError("Failed to load posts.");
		} finally {
			setLoading(false);
		}
	}, [id, page]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	const handleLoadMore = useCallback(() => {
		if (page < totalPages && !loading) {
			setPage((prev) => prev + 1);
		}
	}, [page, totalPages, loading]);

	const profileDescription = useMemo(
		() => `Posts by ${user?.name || "User"}`,
		[user?.name],
	);

	if (error) return <p>Error: {error}</p>;

	return (
		<div className="flex flex-col items-center">
			{user && (
				<Profile
					name={user.name}
					desc={profileDescription}
					data={posts}
					isCurrentUserProfile={false}
					isProfilePage={true}
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
