import { type RefObject, useEffect } from "react";

interface UseIntersectionObserverProps {
  target: RefObject<Element | null>;
  onIntersect: () => void;
  enabled?: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
}

export const useIntersectionObserver = ({
  target,
  onIntersect,
  enabled = false,
  root = null,
  rootMargin = "0px",
  threshold = 0,
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    if (!enabled || !target.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(target.current);

    return () => observer.disconnect();
  }, [target, onIntersect, enabled, root, rootMargin, threshold]);
};
