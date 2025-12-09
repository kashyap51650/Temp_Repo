import React, { useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip/Tooltip";

export function TruncateWithTooltip({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [children]);

  const span = (
    <span ref={ref} className={`truncate ${className}`} {...props}>
      {children}
    </span>
  );

  return isTruncated ? (
    <Tooltip>
      <TooltipTrigger asChild>{span}</TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  ) : (
    span
  );
}
