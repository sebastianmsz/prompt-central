import { useState, useEffect, useCallback } from "react";

interface UsePromptListProps {
	apiEndpoint: string;
	initialPage?: number;
	initialLimit?: number;
}

const usePromptList = <T>(props: UsePromptListProps) => {
	const { apiEndpoint, initialPage = 1, initialLimit = 12 } = props;
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = useCallback(
		async (currentPage: number) => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(
					`${apiEndpoint}?page=${currentPage}&limit=${initialLimit}`,
				);
				if (!response.ok) {
					const message = `An error has occurred: ${response.status}`;
					throw new Error(message);
				}
				const result = await response.json();
				setData((prevData) =>
					currentPage === initialPage
						? result.prompts
						: [...prevData, ...result.prompts],
				);
				setTotalPages(result.pagination.totalPages);
			} catch (err: unknown) {
				let errorMessage = "An unknown error occurred";
				if (err instanceof Error) {
					errorMessage = err.message;
				}
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[apiEndpoint, initialLimit, initialPage],
	);

	useEffect(() => {
		fetchData(page);
	}, [fetchData, page]);

	const handleLoadMore = useCallback(() => {
		if (page < totalPages && !loading) {
			setPage((prev) => prev + 1);
		}
	}, [page, totalPages, loading]);

	const refreshData = useCallback(() => {
		setPage(initialPage);
		setData([]);
		fetchData(initialPage);
	}, [fetchData, initialPage]);

	return {
		data,
		loading,
		error,
		page,
		totalPages,
		handleLoadMore,
		refreshData,
	};
};

export default usePromptList;
