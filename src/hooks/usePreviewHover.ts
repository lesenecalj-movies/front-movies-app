import { useRef, useCallback, useState } from "react";

export type UsePreviewHoverOptions<Details> = {
  delay?: number;
  fetchData: (id: number) => Promise<Details>;
};

export type PreviewPosition = {
  top: number;
  left: number;
  width: number;
  origin: 'right' | 'left' | 'center';
}

type PreviewState<Item> = {
  item: Item | null;
  position: PreviewPosition | null;
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

  function getPreviewPosition(element: HTMLElement): PreviewPosition {
    const rect = element.getBoundingClientRect();

    const cardLeft = rect.left + window.scrollX;
    const cardRight = rect.right + window.scrollX;
    const cardWidth = rect.width;
    const previewWidth = cardWidth * 1.5;

    const screenLeft = window.scrollX;
    const screenRight = window.scrollX + window.innerWidth;

    let left: number;
    let origin: 'left' | 'right' | 'center';

    if (cardLeft <= screenLeft + previewWidth / 3) {
      left = cardLeft;
      origin = 'left';
    }
    else if (cardRight >= screenRight - previewWidth / 3) {
      left = cardRight - previewWidth;
      origin = 'right';
    }
    else {
      left = cardLeft + cardWidth / 2 - previewWidth / 2;
      origin = 'center';
    }
    return {
      top: rect.top + window.scrollY - 50,
      left,
      width: rect.width,
      origin,
    };
  }

  const handleHover = useCallback(
    async (item: Item, element: HTMLElement) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      if (!item) return;

      currentHoverIdRef.current = item.id;

      // Handle exit transition before showing new preview
      if (isPreviewOpen || isPreviewExiting) {
        setPreviewOpen(false);
        setIsPreviewExiting(true);

        await new Promise((resolve) => setTimeout(resolve, transitionDuration));
        if (currentHoverIdRef.current !== item.id) return;

        setIsPreviewExiting(false);
      }

      const previewHoverPosition = getPreviewPosition(element);

      setPreview({
        item,
        position: previewHoverPosition,
      });

      setPreviewContent(null);
      setPreviewOpen(false);

      const cancelGuard = () => currentHoverIdRef.current !== item.id;

      let details: Details | undefined;

      try {
        const cached = contentCacheRef.current.get(item.id);
        if (cached) {
          details = cached;
        } else {
          details = await fetchData(item.id);
          if (!cancelGuard()) {
            contentCacheRef.current.set(item.id, details);
          }
        }
      } catch (e) {
        if (!cancelGuard()) {
          console.error("Failed to fetch content preview:", e);
        }
        return;
      }

      fetchTimeoutRef.current = setTimeout(async () => {
        if (cancelGuard()) return;
        setPreviewContent(details);
        setPreviewOpen(true);
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

    timeoutRef.current = setTimeout(startExit, 200); // delay before exiting
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