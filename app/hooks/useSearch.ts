import { useState, useCallback, useMemo, useRef, useEffect } from "react";

type FieldPath<T> = keyof T | string;

export interface UseSearchOptions<T> {
	items: T[];
	searchFields: FieldPath<T>[];
	debounceMs?: number;
}

export interface UseSearchReturn<T> {
	filteredItems: T[];
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	isSearching: boolean;
	clearSearch: () => void;
}

const DEFAULT_DEBOUNCE_MS = 300;

function getValue(obj: unknown, path: string): unknown {
	if (!obj || typeof obj !== "object") {
		return undefined;
	}

	try {
		return path.split(".").reduce<unknown>(
			(acc: unknown, part: string) => {
				if (acc && typeof acc === "object" && acc !== null) {
					return (acc as { [key: string]: unknown })[part];
				}
				return undefined;
			},
			obj as { [key: string]: unknown },
		);
	} catch {
		return undefined;
	}
}

export function useSearch<T>({
	items,
	searchFields,
	debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseSearchOptions<T>): UseSearchReturn<T> {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isSearching, setIsSearching] = useState(false);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const previousItemsRef = useRef(items);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (searchTerm !== debouncedSearchTerm) {
			setIsSearching(true);
		}

		timeoutRef.current = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
			setIsSearching(false);
		}, debounceMs);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [searchTerm, debounceMs, debouncedSearchTerm]);

	useEffect(() => {
		if (items !== previousItemsRef.current && searchTerm) {
			setIsSearching(true);
			timeoutRef.current = setTimeout(() => {
				setIsSearching(false);
			}, debounceMs);
		}
		previousItemsRef.current = items;
	}, [items, searchTerm, debounceMs]);

	const filteredItems = useMemo(() => {
		if (!debouncedSearchTerm) return items;

		const searchTermLower = debouncedSearchTerm.toLowerCase();
		return items.filter((item) =>
			searchFields.some((field) => {
				const value = getValue(item, field.toString());

				if (value === undefined || value === null) {
					return false;
				}

				if (Array.isArray(value)) {
					return value.some((v) =>
						String(v).toLowerCase().includes(searchTermLower),
					);
				}
				return String(value).toLowerCase().includes(searchTermLower);
			}),
		);
	}, [items, debouncedSearchTerm, searchFields]);

	const clearSearch = useCallback(() => {
		setSearchTerm("");
		setDebouncedSearchTerm("");
		setIsSearching(false);
	}, []);

	return {
		filteredItems,
		searchTerm,
		setSearchTerm,
		isSearching,
		clearSearch,
	};
}
