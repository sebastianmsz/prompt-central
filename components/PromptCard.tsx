"use client";

import Image from "next/image";
import { useState } from "react";
import { PromptCardListProps } from "@types";

const PromptCard: React.FC<PromptCardListProps> = ({
	post,
	handleTagClick,
}) => {
	const [copied, setCopied] = useState<string>("");

	const handleCopy = () => {
		setCopied(post.prompt);
		navigator.clipboard.writeText(post.prompt);
		setTimeout(() => setCopied(""), 3000);
	};

	return (
		<div className="prompt_card">
			<div className="flex justify-between items-start gap-5">
				<div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
					<Image
						src={post.creator?.image || "/assets/icons/default-user.png"}
						alt="User image"
						width={40}
						height={40}
						className="rounded-full object-contain"
					/>

					<div className="flex flex-col">
						<h3 className="font-satoshi font-semibold text-gray-900">
							{post.creator?.username || "Unknown User"}{" "}
						</h3>
						<p className="font-inter text-sm text-gray-500">
							{post.creator?.email || "No email"}{" "}
						</p>
					</div>
				</div>
				<div className="copy_btn" onClick={handleCopy}>
					<Image
						src={
							copied === post.prompt
								? "/assets/icons/tick.svg"
								: "/assets/icons/copy.svg"
						}
						width={12}
						height={12}
						alt="Copy"
					/>
				</div>
			</div>
			<p className="my-4 font-satoshi text-sm text-gray-700 break-words">
				{post.prompt}
			</p>
			<p
				className="font-inter text-sm blue_gradient cursor-pointer"
				onClick={() => handleTagClick && handleTagClick(post.tag)}
			>
				{post.tag}
			</p>
		</div>
	);
};

export default PromptCard;
