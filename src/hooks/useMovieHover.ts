import { useRef, useCallback, useState } from "react";

export type UsePreviewHoverOptions<Details> = {
  delay?: number;
  fetchData: (id: number) => Promise<Details>;
};

type PreviewState<Item> = {
  item: Item | null;
  position: { top: number; left: number; width: number } | null;
};

export function usePreviewHover<Item extends { id: number }, Details>({
  delay = 500,
  fetchData,
}: UsePreviewHoverOptions<Details>) {
  const [preview, setPreview] = useState<PreviewState<Item>>({
    item: null,
    position: null,
  });

  const [previewContent, setPreviewContent] = useState<Details | null>(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isPreviewExiting, setIsPreviewExiting] = useState(false);

  const transitionDuration = 300;

  const currentHoverIdRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentCacheRef = useRef<Map<number, Details>>(new Map());

  const handleHover = useCallback(
    async (item: Item, element: HTMLElement) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      if (!item) return;
      const rect = element.getBoundingClientRect();

      currentHoverIdRef.current = item.id;

      // Handle exit transition before showing new preview
      if (isPreviewOpen || isPreviewExiting) {
        setPreviewOpen(false);
        setIsPreviewExiting(true);

        await new Promise((resolve) => setTimeout(resolve, transitionDuration));
        if (currentHoverIdRef.current !== item.id) return;

        setIsPreviewExiting(false);
      }

      setPreview({
        item,
        position: {
          top: rect.top + window.scrollY - 50,
          left: rect.left + window.scrollX,
          width: rect.width,
        },
      });

      setPreviewContent(null);
      setPreviewOpen(false);

      fetchTimeoutRef.current = setTimeout(async () => {
        const cancelGuard = () => currentHoverIdRef.current !== item.id;

        try {
          const cached = contentCacheRef.current.get(item.id);
          if (cached && !cancelGuard()) {
            setPreviewContent(cached);
            setPreviewOpen(true);
            return;
          }

          const details = await fetchData(item.id);
          if (cancelGuard()) return;

          contentCacheRef.current.set(item.id, details);
          setPreviewContent(details);
          setPreviewOpen(true);
        } catch (e) {
          if (!cancelGuard()) {
            console.error("Failed to fetch content preview:", e);
          }
        }
      }, delay);
    },
    [isPreviewOpen, isPreviewExiting]
  );

  const startExit = () => {
    setPreviewOpen(false);
    setIsPreviewExiting(true);

    setTimeout(() => {
      setIsPreviewExiting(false);
      setPreviewContent(null);
      setPreview({ item: null, position: null });
    }, transitionDuration);
  };

  const handleUnhover = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      startExit();
    }, 200); // delay before exiting
  }, []);

  const cancelUnhover = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    hoveredItem: preview.item,
    previewPosition: preview.position,
    content: previewContent,
    isPreviewExiting,
    isPreviewOpen,
    handleHover,
    handleUnhover,
    cancelUnhover,
  };
}