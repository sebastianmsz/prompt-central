"use client";

interface NoResultsProps {
	searchTerm: string;
	onClear: () => void;
}

const NoResults = ({ searchTerm, onClear }: NoResultsProps) => {
	return (
		<div
			className="flex flex-col items-center justify-center p-8 text-center"
			role="status"
			aria-live="polite"
		>
			<div className="mb-6">
				<svg
					className="mx-auto h-16 w-16 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>

			<h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
				No matches found
			</h2>

			{searchTerm && (
				<p className="mb-4 max-w-[300px] text-gray-600 dark:text-gray-300">
					We couldn&apos;t find any results for &quot;
					<span className="inline-block max-w-[200px] truncate align-bottom">
						{searchTerm}
					</span>
					&quot;
				</p>
			)}

			<div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
				<p className="mb-2">Try:</p>
				<ul className="list-disc pl-4 text-left">
					<li>Checking for typos or misspellings</li>
					<li>Using more general keywords</li>
					<li>Searching by a single tag instead of multiple terms</li>
				</ul>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row">
				<button
					onClick={onClear}
					className="black_btn"
					aria-label="Clear search and show all prompts"
				>
					View all prompts
				</button>
			</div>
		</div>
	);
};

export default NoResults;
