"use client";

import React, { useState, useEffect, useCallback } from "react";
import Profile from "@components/Profile";
import { Post } from "@types";
import { useParams } from "next/navigation";
import Spinner from "@components/Spinner";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { User } from "next-auth";
import { UserProfileParams } from "@types";
import useFetchData from "@app/hooks/useFetchData";

const UserProfile = () => {
	const { data: session } = useSession() as { data: Session | null };
	const { id } = useParams<UserProfileParams>();
	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);

	const { data, loading, error } = useFetchData<{
		user: User;
		prompts: Post[];
	}>(`/api/users/${id}?id=${id}`, [id]);

	const handleDelete = useCallback((postId: string) => {
		setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
	}, []);

	useEffect(() => {
		if (data) {
			setUser(data.user);
			setPosts(data.prompts);
		}
	}, [data]);

	const isCurrentUserProfile = session?.user?.id === id;

	if (loading) {
		return <Spinner />;
	}
	if (error) {
		return <p>Error: {error}</p>;
	}

    if(!id){
        return <p>User id is missing</p>
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
			isProfilePage={true}
			onDelete={handleDelete}
		/>
	);
};

export default UserProfile;