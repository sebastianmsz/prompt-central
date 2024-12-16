import React, { useMemo, useCallback } from "react";
import PromptCard from "./PromptCard";
import { Post, ProfileProps } from "@types";

const Profile: React.FC<ProfileProps> = ({
	name,
	desc,
	data,
	isCurrentUserProfile,
	handleEdit,
	handleDelete,
	isProfilePage,
}) => {
	const handleTagClick = useCallback((tag: string) => {
		console.log(`Tag clicked: ${tag}`);
	}, []);

	const memoizedPromptCards = useMemo(
		() =>
			data.map((prompt) => (
				<PromptCard
					key={prompt._id}
					post={prompt}
					handleEdit={() => handleEdit(prompt._id || "")}
					handleDelete={() => handleDelete(prompt._id || "")}
					handleTagClick={handleTagClick}
					isCurrentUserProfile={isCurrentUserProfile}
					isProfilePage={isProfilePage}
				/>
			)),
		[
			data,
			handleEdit,
			handleDelete,
			handleTagClick,
			isCurrentUserProfile,
			isProfilePage,
		],
	);

	return (
		<section className="w-full">
			<h1 className="head_text text-left">
				<span className="blue_gradient">{name}</span>'s Profile
			</h1>
			<p className="desc text-left">{desc}</p>
			<div className="mt-10 prompt_layout">{memoizedPromptCards}</div>
		</section>
	);
};

export default Profile;
