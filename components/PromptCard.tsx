"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { PromptCardProps as Props } from "@types";
import Modal from "./Modal";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

const PromptCard: React.FC<Props> = ({
	post,
	handleTagClick,
	isProfilePage,
	onDelete,
}) => {
	const { data: session } = useSession() as { data: Session | null };
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [copied, setCopied] = useState("");
	const [deleting, setDeleting] = useState(false);
	const router = useRouter();

	const isCurrentUserPost = session?.user?.id === post.creator?._id;

	const handleCopy = () => {
		setCopied(post.prompt);
		navigator.clipboard.writeText(post.prompt);
		setTimeout(() => {
			setCopied("");
		}, 2000);
	};

	const handleDeleteClick = async () => {
		setIsModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		setIsModalOpen(false);
		setDeleting(true);
		try {
			if (post._id && onDelete) {
				onDelete(post._id, true);
				const response = await fetch(`/api/prompt/${post._id}?id=${post._id}`, {
					method: "DELETE",
				});
				if (!response.ok) {
					const message = `An error has occurred: ${response.status}`;
					throw new Error(message);
				}
			} else {
				throw new Error("Post id is missing or onDelete not provided");
			}
		} catch (error) {
			console.error("An error occurred:", error);
			if (post._id) {
				onDelete?.(post._id, false);
			}
		} finally {
			setDeleting(false);
		}
	};

	const handleEdit = useCallback(
		(postId: string) => {
			router.push(`/edit-prompt?id=${postId}`);
		},
		[router],
	);

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="flex flex-col gap-4 overflow-hidden rounded-lg bg-white p-4 shadow-md">
			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onConfirm={handleConfirmDelete}
				title="Confirm Delete"
				message="Are you sure you want to delete this post?"
			/>
			<div className="flex flex-wrap items-start justify-between gap-5">
				{post.creator && post.creator._id ? (
					<Link
						href={`/profile/${post.creator._id}`}
						className="flex flex-1 cursor-pointer items-center justify-start gap-3"
					>
						<Image
							src={post.creator?.image || "/assets/img/default-user.svg"}
							alt="User image"
							width={40}
							height={40}
							className="rounded-full object-contain"
						/>
						<div className="flex flex-col">
							<h3 className="truncate font-satoshi font-semibold text-gray-900">
								{post.creator?.name || "Unknown User"}
							</h3>
							<p className="max-w-full break-words font-inter text-sm text-gray-500">
								{post.creator?.email || "No email"}
							</p>
						</div>
					</Link>
				) : (
					<div className="flex flex-1 items-center justify-start gap-3">
						<Image
							src={"/assets/img/default-user.svg"}
							alt="User image"
							width={40}
							height={40}
							className="rounded-full object-contain"
						/>
						<div className="flex flex-col">
							<h3 className="truncate font-satoshi font-semibold text-gray-900">
								{"Unknown User"}
							</h3>
							<p className="max-w-full break-words font-inter text-sm text-gray-500">
								{"No email"}
							</p>
						</div>
					</div>
				)}
				<div
					onClick={handleCopy}
					className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur"
				>
					<Image
						src={copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
						alt="Copy icon"
						width={20}
						height={20}
					/>
				</div>
			</div>
			<p className="my-4 max-w-full text-ellipsis break-words font-satoshi text-sm text-gray-700">
				{post.prompt}
			</p>
			<p
				className="blue_gradient cursor-pointer truncate font-inter text-sm"
				onClick={() => handleTagClick?.(post.tag)}
			>
				{post.tag}
			</p>
			{isProfilePage && isCurrentUserPost && (
				<div className="flex justify-end gap-2">
					<button
						onClick={() => handleEdit(post._id || "")}
						className="rounded-md bg-blue-500 px-3 py-1 text-white"
					>
						Edit
					</button>
					<button
						onClick={handleDeleteClick}
						disabled={deleting}
						className="rounded-md bg-red-500 px-3 py-1 text-white"
					>
						{deleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			)}
		</div>
	);
};

export default PromptCard;
