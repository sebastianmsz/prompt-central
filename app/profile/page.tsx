"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Profile from "@components/Profile";
import { Post } from "@types";
import Spinner from "@components/Spinner";
import useFetchData from "@app/hooks/useFetchData";
import { Session } from "next-auth";

const MyProfile = () => {
	const { data: session } = useSession() as {
		data: Session | null;
		status: string;
	};
	const [myPosts, setMyPosts] = useState<Post[]>([]);

    const userId = session?.user?.id

	const { data, loading, error } = useFetchData<Post[]>(
		userId ? `/api/users/${userId}/posts?id=${userId}` : "",
		[userId],
	);

	const handleDelete = useCallback((postId: string) => {
		setMyPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
	}, []);

	useEffect(() => {
		if (data) {
			setMyPosts(data);
		}
	}, [data]);

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
			name={session.user.name || "Unknown"}
			desc={`Welcome back, ${session.user.name}`}
			data={myPosts}
			isCurrentUserProfile={true}
			isProfilePage={true}
			onDelete={handleDelete}
		/>
	);
};

export default MyProfile;