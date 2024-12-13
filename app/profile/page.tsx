"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Profile from "@components/Profile";
import { Post } from "@types";
import { useRouter } from "next/navigation";

const MyProfile = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [myPosts, setMyPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleEdit = (post: string) => {
		router.push(`/update-prompt?id=${post}`);
	};

	const handleDelete = async (post: string) => {
		const hasConfirmed = confirm("Are you sure you want to delete this post?");
		if (hasConfirmed) {
			try {
				await fetch(`/api/prompt/${post}`, {
					method: "DELETE",
				});
				const filteredPosts = myPosts.filter((item) => item.id !== post);
				setMyPosts(filteredPosts);
			} catch (err: any) {
				console.error(err);
				setError(err.message);
			}
		}
	};

	const fetchUserPrompts = useCallback(async () => {
		if (session?.user?.id) {
			try {
				const response = await fetch(`/api/users/${session.user.id}/posts`);
				if (!response.ok) {
					const message = `An error has occurred: ${response.status}`;
					throw new Error(message);
				}
				const data = await response.json();
				setMyPosts(data);
			} catch (err: any) {
				console.error("Error fetching prompts:", err);
				setError(err.message);
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
		return <p>Loading</p>;
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
