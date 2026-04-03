import { useCallback, useRef, useState } from "react";

/**
 * useExportChartAsImage
 *
 * Reusable hook that exports a chart container (SVG-based, e.g. Recharts)
 * as a PNG image file without any external dependencies.
 *
 * Usage:
 *   const { chartRef, exportAsImage, isExporting } = useExportChartAsImage("chart-filename");
 *   <div ref={chartRef}>
 *     <BiodistributionChart ... />
 *   </div>
 *   <Button onClick={exportAsImage} disabled={isExporting}>Export as Image</Button>
 */
export function useExportChartAsImage(filename = "chart") {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportAsImage = useCallback(async () => {
    const container = chartRef.current;
    if (!container) return;

    const svg = container.querySelector("svg");
    if (!svg) return;

    setIsExporting(true);
    let objectUrl: string | undefined;

    try {
      const svgClone = svg.cloneNode(true) as SVGElement;

      // Ensure background is white (SVGs are usually transparent)
      svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgClone.style.background = "#ffffff";

      const svgRect = svg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const viewBox = svg.viewBox?.baseVal;

      let exportWidth = Math.max(
        svgRect.width,
        containerRect.width,
        viewBox?.width ?? 0,
        Number(svg.getAttribute("width")) || 0
      );
      let exportHeight = Math.max(
        svgRect.height,
        containerRect.height,
        viewBox?.height ?? 0,
        Number(svg.getAttribute("height")) || 0
      );

      const contentBounds = svg.getBBox();
      if (contentBounds.width > 0 && contentBounds.height > 0) {
        const padding = 16;
        const minX = contentBounds.x - padding;
        const minY = contentBounds.y - padding;
        const boundsWidth = contentBounds.width + padding * 2;
        const boundsHeight = contentBounds.height + padding * 2;

        exportWidth = Math.max(exportWidth, boundsWidth);
        exportHeight = Math.max(exportHeight, boundsHeight);
        svgClone.setAttribute(
          "viewBox",
          `${minX} ${minY} ${exportWidth} ${exportHeight}`
        );
      }

      const width = Math.max(1, Math.ceil(exportWidth));
      const height = Math.max(1, Math.ceil(exportHeight));

      svgClone.setAttribute("width", String(width));
      svgClone.setAttribute("height", String(height));

      const svgString = new XMLSerializer().serializeToString(svgClone);
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      objectUrl = url;

      const img = new Image();
      img.width = width;
      img.height = height;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(scale, scale);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${filename}-${new Date().toISOString().split("T")[0]}.png`;
      link.click();
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setIsExporting(false);
    }
  }, [filename]);

  return { chartRef, exportAsImage, isExporting };
}
