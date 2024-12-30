import { useState, useEffect, useCallback } from "react";

const useFetchData = <T>(url: string, dependencies: React.DependencyList = []) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
            if(!url){
                return;
            }
			const response = await fetch(url);
			if (!response.ok) {
				const message = `An error has occurred: ${response.status}`;
				throw new Error(message);
			}
			const result: T = await response.json();
			setData(result);
		} catch (err: unknown) {
			let errorMessage = "An unknown error occurred";
			if (err instanceof Error) {
				errorMessage = err.message;
			}
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, [url, ...dependencies]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error };
};

export default useFetchData;