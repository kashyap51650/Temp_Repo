import { useEffect, useMemo, useRef, useState } from "react";

interface UseTruncationDetectionOptions {
  enabled?: boolean;
  selector?: string | string[];
  dependencies?: unknown[];
  delay?: number;
}

/**
 * Hook to detect if text content is truncated and needs a tooltip
 * @param options - Configuration options
 * @returns Object with ref to attach to element and isTruncated state
 */
export function useTruncationDetection<T extends HTMLElement = HTMLElement>({
  enabled = true,
  selector,
  dependencies = [],
  delay = 50,
}: UseTruncationDetectionOptions = {}) {
  const ref = useRef<T>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const serializedSelector = useMemo(
    () => (Array.isArray(selector) ? JSON.stringify(selector) : selector),
    [selector]
  );

  useEffect(() => {
    if (!enabled) {
      setIsTruncated(false);
      return;
    }

    const checkTruncation = () => {
      const element = ref.current;
      if (!element) {
        return;
      }

      let targetElement: Element | null = null;

      // If selector(s) provided, check specific child element(s)
      if (selector) {
        const selectors = Array.isArray(selector) ? selector : [selector];

        // Try each selector until we find a matching element
        for (const sel of selectors) {
          targetElement = element.querySelector(sel);

          if (targetElement) break;
        }
      }

      // Fallback to the element itself if no selector or no match found
      if (!targetElement) {
        targetElement = element;
      }

      if (targetElement) {
        const truncated = targetElement.scrollWidth > targetElement.clientWidth;

        setIsTruncated(truncated);
      }
    };

    // Configurable delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(checkTruncation, delay);

    // ResizeObserver for better performance when used in lists/tables
    // Only observes the specific element, not global window resize
    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined" && ref.current) {
      resizeObserver = new ResizeObserver(() => {
        checkTruncation();
      });
      resizeObserver.observe(ref.current);
    } else {
      // Fallback to window resize listener for older environments or when element not ready
      window.addEventListener("resize", checkTruncation);
    }

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", checkTruncation);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, serializedSelector, delay, ...dependencies]);

  return { ref, isTruncated };
}
