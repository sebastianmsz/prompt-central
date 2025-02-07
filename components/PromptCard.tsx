"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { PromptCardProps as Props } from "@types";
import { useSession, signIn } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PromptCard: React.FC<Props> = ({
	post,
	handleTagClick,
	isProfilePage,
	onDelete,
}) => {
	const { data: session } = useSession() as { data: Session | null };
	const [isMaximized, setIsMaximized] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [copied, setCopied] = useState("");
	const [deleting, setDeleting] = useState(false);
	const router = useRouter();
	const modalRef = useRef<HTMLDivElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);

	const isCurrentUserPost = session?.user?.id === post.creator?._id;

	const maxTagsToDisplay = 3;
	const tagsToDisplay = post.tag.slice(0, maxTagsToDisplay);
	const hasMoreTags = post.tag.length > maxTagsToDisplay;

	const handleCopy = () => {
		setCopied(post.prompt);
		navigator.clipboard.writeText(post.prompt);
		setTimeout(() => {
			setCopied("");
		}, 2000);
	};

	const handleDeleteClick = (event: React.MouseEvent) => {
		event.stopPropagation(); // Prevent triggering the modal when delete is clicked
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		setIsDeleteModalOpen(false);
		setDeleting(true);
		try {
			if (post._id && onDelete) {
				onDelete(post._id, true);
				const response = await fetch(`/api/prompt/${post._id}`, {
					method: "DELETE",
				});
				if (!response.ok) {
					throw new Error(`An error has occurred: ${response.status}`);
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

	const handleEdit = useCallback(() => {
		if (session?.user && post._id) {
			router.push(`/edit-prompt?id=${post._id}`);
		} else {
			signIn("google");
		}
		setIsMaximized(false);
	}, [router, session, post]);

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
	};

	const handleMaximize = (event: React.MouseEvent) => {
		event.stopPropagation();
		setIsMaximized(true);
	};

	const handleCloseMaximize = () => {
		setIsMaximized(false);
	};

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (backdropRef.current && backdropRef.current === event.target) {
			handleCloseMaximize();
		}
	}, []);

	useEffect(() => {
		if (isMaximized) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMaximized, handleClickOutside]);

	const handleTagClickWrapper = (tag: string, isModal: boolean) => {
		handleTagClick?.(tag);
		if (isModal) {
			handleCloseMaximize();
		}
	};

	const renderUserInfo = () => (
		<Link
			href={`/profile/${post.creator?._id}`}
			className="flex w-full items-center gap-2 sm:max-w-[70%] sm:gap-3"
			onClick={(event) => event.stopPropagation()}
		>
			<Image
				src={post.creator?.image || "/assets/img/default-user.svg"}
				alt="user_image"
				width={32}
				height={32}
				className="rounded-full object-contain ring-2 ring-gray-200 sm:h-10 sm:w-10 dark:ring-gray-700"
			/>
			<div className="min-w-0 flex-1">
				<h3 className="truncate font-satoshi text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
					{post.creator?.name}
				</h3>
				<p className="truncate text-xs text-gray-500 sm:text-sm dark:text-gray-400">
					{post.creator?.email}
				</p>
			</div>
		</Link>
	);

	const renderButtons = () =>
		isProfilePage &&
		isCurrentUserPost && (
			<div className="mt-3 flex justify-end gap-2 sm:mt-4">
				<button
					onClick={(event) => {
						event.stopPropagation();
						handleEdit();
					}}
					className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white sm:px-3 sm:text-sm"
				>
					Edit
				</button>
				<button
					onClick={handleDeleteClick}
					disabled={deleting}
					className="rounded-md bg-red-500 px-2 py-1 text-xs text-white sm:px-3 sm:text-sm"
				>
					{deleting ? "Deleting..." : "Delete"}
				</button>
			</div>
		);

	const renderTags = (isModal: boolean) =>
		(isModal ? post.tag : tagsToDisplay).map((tag, index) => (
			<p
				key={index}
				className="blue_gradient cursor-pointer truncate font-inter text-sm decoration-blue-500 hover:underline"
				onClick={(event) => {
					event.stopPropagation();
					handleTagClickWrapper(tag, isModal);
				}}
			>
				#{tag}
			</p>
		));

	const renderContent = (isModal = false) => (
		<div className="flex h-full flex-col">
			<div className="flex items-start justify-between gap-4">
				{renderUserInfo()}
				<div className="flex items-center gap-2">
					<button
						onClick={(event) => {
							event.stopPropagation();
							handleCopy();
						}}
						className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
					>
						<Image
							src={copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
							alt="Copy icon"
							width={18}
							height={18}
						/>
						<span className="absolute -bottom-8 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block dark:bg-gray-700">
							{copied ? "Copied!" : "Copy prompt"}
						</span>
					</button>
					{isModal && (
						<button
							onClick={handleCloseMaximize}
							className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="h-5 w-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>

			<div className="mt-4 flex-grow">
				<p
					className={`font-satoshi text-sm text-gray-700 dark:text-gray-300 ${
						isModal
							? "max-h-[40vh] overflow-auto"
							: "line-clamp-2 cursor-pointer"
					}`}
				>
					{post.prompt}
				</p>
			</div>

			<div className="mt-4 space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					{renderTags(isModal)}
					{hasMoreTags && !isModal && (
						<span className="text-xs text-gray-500">
							+{post.tag.length - maxTagsToDisplay}
						</span>
					)}
				</div>
				{renderButtons()}
			</div>
		</div>
	);

	return (
		<>
			{isDeleteModalOpen && (
				<div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-4">
					<div className="dark:bg-dark-surface w-full max-w-[95%] rounded-md bg-white p-4 shadow-lg sm:w-96 sm:max-w-none sm:p-6">
						<h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl dark:text-white">
							Confirm Delete
						</h2>
						<p className="mb-4 text-sm sm:mb-6 sm:text-base dark:text-gray-300">
							Are you sure you want to delete this post?
						</p>
						<div className="flex justify-end gap-2 sm:gap-4">
							<button
								onClick={handleCloseDeleteModal}
								className="rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300 sm:px-4 sm:py-2 sm:text-base dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmDelete}
								className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 sm:px-4 sm:py-2 sm:text-base"
							>
								Confirm Delete
							</button>
						</div>
					</div>
				</div>
			)}

			<div
				className="dark:bg-dark-surface group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-5 dark:shadow-gray-800/10"
				onClick={handleMaximize}
				ref={modalRef}
			>
				{renderContent()}
			</div>

			{isMaximized && (
				<div
					className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm sm:p-4"
					ref={backdropRef}
				>
					<div
						className="dark:bg-dark-surface relative max-h-[95vh] w-full max-w-[95%] overflow-auto rounded-xl bg-white p-4 shadow-xl sm:max-h-[90vh] sm:max-w-2xl sm:p-6"
						ref={modalRef}
					>
						{renderContent(true)}
					</div>
				</div>
			)}
		</>
	);
};

export default PromptCard;
