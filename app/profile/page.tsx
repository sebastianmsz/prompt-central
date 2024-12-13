"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Profile from "@components/Profile";
import { Post } from "@types";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import Spinner from "@components/Spinner";

const MyProfile = () => {
	const { data: session, status } = useSession() as {
		data: Session | null;
		status: string;
	};
	const router = useRouter();
	const [myPosts, setMyPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleEdit = (post: string) => {
		router.push(`/update-prompt?id=${post}`);
	};

	const handleDelete = async (postId: string) => {
		try {
			const response = await fetch(`/api/prompt/${postId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setMyPosts((prevPosts) =>
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

	const fetchUserPrompts = useCallback(async () => {
		setLoading(true);
		setError(null);
		if (session?.user?.id) {
			try {
				const response = await fetch(`/api/users/${session.user.id}/posts`);
				if (!response.ok) {
					const message = `An error has occurred: ${response.status}`;
					throw new Error(message);
				}
				const data: Post[] = await response.json();
				setMyPosts(data);
			} catch (err: unknown) {
				let errorMessage = "An unknown error occurred";
				if (err instanceof Error) {
					errorMessage = err.message;
				}
				console.error("Error fetching prompts:", err);
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
	}, [session?.user?.id]);

	useEffect(() => {
		fetchUserPrompts();
	}, [fetchUserPrompts]);

	if (loading) {
		return <Spinner />;
	}
	if (error) {
		return <p>Error: {error}</p>;
	}
	if (!session?.user?.id) {
		return <p>Not signed in</p>;
	}

	return (
		<Profile
			name={session.user.username}
			desc="Welcome to your personalized profile page"
			data={myPosts}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
			key={session.user.id}
		/>
	);
};

export default MyProfile;
