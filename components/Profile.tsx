import React, { useMemo, useCallback } from "react";
import PromptCard from "./PromptCard";
import { ProfileProps } from "@types";

const Profile: React.FC<ProfileProps> = ({
	name,
	desc,
	data,
	isCurrentUserProfile,
	isProfilePage,
	onDelete,
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
					handleTagClick={handleTagClick}
					isCurrentUserProfile={isCurrentUserProfile}
					isProfilePage={isProfilePage}
					onDelete={onDelete}
				/>
			)),
		[data, handleTagClick, isCurrentUserProfile, isProfilePage, onDelete],
	);

	return (
		<section className="w-full">
			<h1 className="head_text text-left">
				<span className="blue_gradient">{name}&#39;s</span> Profile
			</h1>
			<p className="desc text-left">{desc}</p>
			<div className="prompt_layout mt-10">{memoizedPromptCards}</div>
		</section>
	);
};

export default Profile;
