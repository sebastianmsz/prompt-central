import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface UseTagFilterOptions<T> {
	items: T[];
	tagField: keyof T;
	initialTag?: string;
	debounceMs?: number;
}

export interface UseTagFilterReturn<T> {
	filteredItems: T[];
	activeTag: string | null;
	setActiveTag: (tag: string | null) => void;
	clearTag: () => void;
	isFiltering: boolean;
}

const DEFAULT_DEBOUNCE_MS = 100;

export function useTagFilter<T>({
	items,
	tagField,
	initialTag,
	debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseTagFilterOptions<T>): UseTagFilterReturn<T> {
	const router = useRouter();
	const searchParams = useSearchParams();
	const urlTag = searchParams.get("tag");

	const [activeTag, setActiveTagState] = useState<string | null>(
		initialTag || urlTag || null,
	);
	const [debouncedTag, setDebouncedTag] = useState<string | null>(
		initialTag || urlTag || null,
	);
	const [isFiltering, setIsFiltering] = useState(false);

	useEffect(() => {
		if (urlTag !== activeTag) {
			setActiveTagState(urlTag);
			setDebouncedTag(urlTag);
		}
	}, [urlTag, activeTag]);

	useEffect(() => {
		setIsFiltering(true);
		const timeoutId = setTimeout(() => {
			setDebouncedTag(activeTag);
			setIsFiltering(false);
		}, debounceMs);

		return () => clearTimeout(timeoutId);
	}, [activeTag, debounceMs]);

	const setActiveTag = useCallback(
		(tag: string | null) => {
			setActiveTagState(tag);

			const params = new URLSearchParams(searchParams.toString());
			if (tag) {
				params.set("tag", tag);
			} else {
				params.delete("tag");
			}

			router.replace(`?${params.toString()}`, { scroll: false });
		},
		[router, searchParams],
	);

	const clearTag = useCallback(() => {
		setActiveTag(null);
	}, [setActiveTag]);

	const filteredItems = useMemo(() => {
		if (!debouncedTag) return items;

		const tagLower = debouncedTag.toLowerCase();
		return items.filter((item) => {
			const tags = item[tagField];
			if (Array.isArray(tags)) {
				return tags.some((tag) => tag.toLowerCase() === tagLower);
			}
			return String(tags).toLowerCase() === tagLower;
		});
	}, [items, debouncedTag, tagField]);

	return {
		filteredItems,
		activeTag,
		setActiveTag,
		clearTag,
		isFiltering,
	};
}
