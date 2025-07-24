import { useRef } from "react";

export function useInfiniteScroll(
  loading: boolean,
  hasMore: boolean,
  onLoadMore: () => void,
  rootMargin: string = "300px"
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = (node: HTMLDivElement | null) => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { rootMargin }
    );

    if (node) observerRef.current.observe(node);
  };

  return lastElementRef;
}