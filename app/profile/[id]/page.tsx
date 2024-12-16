"use client";

import React, { useState, useEffect, useCallback } from "react";
import Profile from "@components/Profile";
import { Post } from "@types";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@components/Spinner";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { User } from "next-auth";
import { UserProfileParams } from "@types";

const UserProfile = () => {
	const { data: session } = useSession() as { data: Session | null };
	const { id } = useParams<UserProfileParams>();
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const isCurrentUserProfile = session?.user?.id === id;

	const handleEdit = (post: string) => {
		router.push(`/update-prompt?id=${post}`);
	};

	const handleDelete = async (postId: string) => {
		try {
			const response = await fetch(`/api/prompt/${postId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setPosts((prevPosts) =>
					prevPosts.filter((post) => post._id !== postId),
				);
			} else {
				const message = `An error has occurred: ${response.status}`;
				throw new Error(message);
			}
		} catch (err: unknown) {
			let errorMessage = "An unknown error occurred";
			if (err instanceof Error) {
				errorMessage = err.message;
			}
			console.error(err);
			setError(errorMessage);
		}
	};

	const fetchUserData = useCallback(async () => {
		const controller = new AbortController();
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(`/api/users/${id}`, {
				signal: controller.signal,
			});
			if (!response.ok) {
				const message = `An error has occurred: ${response.status}`;
				throw new Error(message);
			}
			const { user, prompts } = await response.json();
			setUser(user);
			setPosts(prompts);
		} catch (err: unknown) {
			if (err instanceof Error && err.name !== "AbortError") {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
			console.error("Error fetching user data:", err);
		} finally {
			setLoading(false);
		}
		return () => controller.abort();
	}, [id]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	if (loading) {
		return <Spinner />;
	}
	if (error) {
		return <p>Error: {error}</p>;
	}

	if (!user) {
		return <p>User not found</p>;
	}
	return (
		<Profile
			name={user.name || "Unknown"}
			desc={`Posts by ${user.name}`}
			data={posts}
			isCurrentUserProfile={isCurrentUserProfile}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
			key={user.id}
			isProfilePage={true}
		/>
	);
};

export default UserProfile;
