import { AlertCircle } from "lucide-react";
import { useId, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import type { BiodistributionDataPoint } from "@/types/biodistribution";

interface BiodistributionChartProps {
  data: BiodistributionDataPoint[];
  title?: string;
  className?: string;
  animationDuration?: number;
  referenceLineValue?: number;
}

interface ColorConfig {
  color: string;
  pattern: "solid" | "striped";
}

// 30-slot color config: 15 unique colors × 2 (solid + striped).
// Sequence interleaves the two halves so the same color never appears
// in consecutive slots — solid from color 1-8 alternates with striped
// from color 9-15, then solid 9-15 alternates with striped 1-8.
// "#D4C200" yellow → "#C4A000" (darker amber-gold, better white-bg contrast).
// 3 added: "#332288" Indigo, "#117733" Forest Green, "#AA4499" Mauve.
const CHART_COLOR_CONFIG: ColorConfig[] = [
  // slot  1  – Blue         solid   | slot 16 – Amber-Gold    striped
  { color: "#0072B2", pattern: "solid" }, //  1
  { color: "#C4A000", pattern: "striped" }, //  2
  // slot  3  – Vermillion   solid   | slot 17 – Mauve         striped
  { color: "#D55E00", pattern: "solid" }, //  3
  { color: "#AA4499", pattern: "striped" }, //  4
  // slot  5  – Teal/Green   solid   | slot 18 – Gray          striped
  { color: "#009E73", pattern: "solid" }, //  5
  { color: "#999999", pattern: "striped" }, //  6
  // slot  7  – Wine         solid   | slot 19 – Black         striped
  { color: "#882255", pattern: "solid" }, //  7
  { color: "#000000", pattern: "striped" }, //  8
  // slot  9  – Sky Blue     solid   | slot 20 – Blue          striped
  { color: "#56B4E9", pattern: "solid" }, //  9
  { color: "#0072B2", pattern: "striped" }, // 10
  // slot 11  – Orange       solid   | slot 21 – Vermillion    striped
  { color: "#E69F00", pattern: "solid" }, // 11
  { color: "#D55E00", pattern: "striped" }, // 12
  // slot 13  – Muted Teal   solid   | slot 22 – Teal/Green    striped
  { color: "#44AA99", pattern: "solid" }, // 13
  { color: "#009E73", pattern: "striped" }, // 14
  // slot 15  – Dark Blue    solid   | slot 23 – Wine          striped
  { color: "#004488", pattern: "solid" }, // 15
  { color: "#882255", pattern: "striped" }, // 16
  // slot 17  – Purple/Pink  solid   | slot 24 – Sky Blue      striped
  { color: "#CC79A7", pattern: "solid" }, // 17
  { color: "#56B4E9", pattern: "striped" }, // 18
  // slot 19  – Forest Green solid   | slot 25 – Orange        striped
  { color: "#117733", pattern: "solid" }, // 19
  { color: "#E69F00", pattern: "striped" }, // 20
  // slot 21  – Indigo       solid   | slot 26 – Muted Teal    striped
  { color: "#332288", pattern: "solid" }, // 21
  { color: "#44AA99", pattern: "striped" }, // 22
  // slot 23  – Amber-Gold   solid   | slot 27 – Dark Blue     striped
  { color: "#C4A000", pattern: "solid" }, // 23
  { color: "#004488", pattern: "striped" }, // 24
  // slot 25  – Mauve        solid   | slot 28 – Purple/Pink   striped
  { color: "#AA4499", pattern: "solid" }, // 25
  { color: "#CC79A7", pattern: "striped" }, // 26
  // slot 27  – Gray         solid   | slot 29 – Forest Green  striped
  { color: "#999999", pattern: "solid" }, // 27
  { color: "#117733", pattern: "striped" }, // 28
  // slot 29  – Black        solid   | slot 30 – Indigo        striped
  { color: "#000000", pattern: "solid" }, // 29
  { color: "#332288", pattern: "striped" }, // 30
];

const MAX_ERROR_BAR_RATIO = 1.5;

function getColorConfigByIndex(index: number): ColorConfig {
  return CHART_COLOR_CONFIG[index % CHART_COLOR_CONFIG.length];
}

function getColorByIndex(index: number): string {
  return getColorConfigByIndex(index).color;
}

function getPatternTypeByIndex(index: number): "solid" | "striped" {
  return getColorConfigByIndex(index).pattern;
}

function getPatternId(prefix: string, index: number): string {
  return `${prefix}-pattern-${index}`;
}

function parseNumericValue(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

function CustomLegend(props: any) {
  const { payload, idPrefix } = props;

  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 px-4 py-3">
      {payload.map((entry: any, index: number) => {
        const patternType = getPatternTypeByIndex(index);

        return (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <svg width="16" height="16">
              {patternType === "striped" ? (
                <>
                  <defs>
                    <pattern
                      id={`${idPrefix}-legend-stripe-${index}`}
                      patternUnits="userSpaceOnUse"
                      width="6"
                      height="6"
                      patternTransform="rotate(45)"
                    >
                      <rect width="6" height="6" fill={entry.color} />
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="6"
                        stroke="white"
                        strokeWidth="2.5"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="16"
                    height="16"
                    fill={`url(#${idPrefix}-legend-stripe-${index})`}
                    rx="2"
                  />
                </>
              ) : (
                <rect width="16" height="16" fill={entry.color} rx="2" />
              )}
            </svg>
            <span className="text-sm text-foreground font-medium">
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  idPrefix: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  idPrefix,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm min-w-[200px]">
      <p className="font-semibold text-card-foreground mb-2 border-b border-border pb-2">
        {label}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => {
          const stdDev = entry.payload?.[`${entry.name}_std_dev`];
          const isCapped = entry.payload?.[`${entry.name}_capped`];
          const seriesIndex = entry.payload?.seriesIndex ?? index;
          const patternType = getPatternTypeByIndex(seriesIndex);

          return (
            <div key={index} className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <svg width="14" height="14" className="flex-shrink-0">
                  {patternType === "striped" ? (
                    <>
                      <defs>
                        <pattern
                          id={`${idPrefix}-tooltip-stripe-${seriesIndex}`}
                          patternUnits="userSpaceOnUse"
                          width="6"
                          height="6"
                          patternTransform="rotate(45)"
                        >
                          <rect width="6" height="6" fill={entry.color} />
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="6"
                            stroke="white"
                            strokeWidth="2.5"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width="14"
                        height="14"
                        fill={`url(#${idPrefix}-tooltip-stripe-${seriesIndex})`}
                        rx="2"
                      />
                    </>
                  ) : (
                    <rect width="14" height="14" fill={entry.color} rx="2" />
                  )}
                </svg>
                <span className="text-muted-foreground text-xs">
                  {entry.name}:
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-card-foreground">
                  {typeof entry.value === "number"
                    ? entry.value.toFixed(2)
                    : entry.value}
                  %
                </span>
                {stdDev && (
                  <span className="text-xs text-muted-foreground">
                    ±{Number(stdDev).toFixed(2)}
                    {isCapped && (
                      <span
                        className="ml-1 text-orange-500"
                        title="Error bar capped for visibility"
                      >
                        *
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CHANGE 1: error bar color now uses `color` prop (bar's own color) ────────
function CustomBarWithErrorBar(props: any) {
  const { fill, x, y, width, height, payload, dataKey, seriesIndex } = props;

  const value = parseNumericValue(payload[dataKey]);
  const stdDev = parseNumericValue(payload[`${dataKey}_std_dev`]);

  if (value === 0 || height === 0) return null;

  const rawErrorBarHeight = (stdDev / value) * height;
  const maxAllowedHeight = height * MAX_ERROR_BAR_RATIO;
  const isCapped = rawErrorBarHeight > maxAllowedHeight;
  const errorBarHeight = Math.min(rawErrorBarHeight, maxAllowedHeight);

  const capWidth = 20;
  const errorBarY = y - errorBarHeight;

  // Use the bar's own color for error bars instead of hardcoded black
  const errorBarColor = getColorByIndex(seriesIndex);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={4}
        ry={4}
      />

      {stdDev > 0 && (
        <>
          {/* Vertical stem */}
          <line
            x1={x + width / 2}
            y1={y}
            x2={x + width / 2}
            y2={errorBarY}
            stroke={errorBarColor}
            strokeWidth={2}
            opacity={0.9}
          />
          {/* Top cap */}
          <line
            x1={x + width / 2 - capWidth / 2}
            y1={errorBarY}
            x2={x + width / 2 + capWidth / 2}
            y2={errorBarY}
            stroke={errorBarColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.9}
          />
          {/* Double cap if capped */}
          {isCapped && (
            <line
              x1={x + width / 2 - capWidth / 2}
              y1={errorBarY - 4}
              x2={x + width / 2 + capWidth / 2}
              y2={errorBarY - 4}
              stroke={errorBarColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.9}
            />
          )}
        </>
      )}
    </g>
  );
}

export function BiodistributionChart({
  data,
  title,
  className,
  animationDuration = 800,
  referenceLineValue = 0,
}: BiodistributionChartProps) {
  // Generate a unique ID prefix per chart instance to avoid SVG pattern ID collisions
  // when multiple charts are rendered simultaneously (e.g., AGC modal + full-screen modal)
  const instanceId = useId();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const organOrder: string[] = [];
    const organGroups: Record<
      string,
      Record<string, number | string | boolean>
    > = {};

    data.forEach((item) => {
      const meanValue = parseNumericValue(item.mean_uptake_percent_per_g);
      const stdDevValue = parseNumericValue(item.std_dev);

      if (meanValue === 0) return;

      if (!organGroups[item.organ_name]) {
        organGroups[item.organ_name] = { organ: item.organ_name };
        organOrder.push(item.organ_name);
      }

      const displayKey = item.datapoint_display_name || item.time_point_display;
      organGroups[item.organ_name][displayKey] = meanValue;
      organGroups[item.organ_name][`${displayKey}_std_dev`] = stdDevValue;

      const errorBarRatio = stdDevValue / meanValue;
      organGroups[item.organ_name][`${displayKey}_capped`] =
        errorBarRatio > MAX_ERROR_BAR_RATIO;
    });

    return organOrder.map((organName) => organGroups[organName]);
  }, [data]);

  const dataPointDisplayNames = useMemo(() => {
    const displayNameMap = new Map<string, number>();

    data.forEach((item) => {
      const displayName =
        item.datapoint_display_name || item.time_point_display;
      const hours = parseFloat(item.time_point_hours);
      if (!displayNameMap.has(displayName) && !isNaN(hours)) {
        displayNameMap.set(displayName, hours);
      }
    });

    return Array.from(displayNameMap.entries())
      .sort(([, aHours], [, bHours]) => aHours - bHours)
      .map(([displayName]) => displayName);
  }, [data]);

  const maxYValue = useMemo(() => {
    let max = 0;
    data.forEach((item) => {
      const meanValue = parseNumericValue(item.mean_uptake_percent_per_g);
      const stdDevValue = parseNumericValue(item.std_dev);
      const cappedStdDev = Math.min(
        stdDevValue,
        meanValue * MAX_ERROR_BAR_RATIO
      );
      const value = meanValue + cappedStdDev;
      if (value > max) max = value;
    });
    return Math.ceil(max * 1.1);
  }, [data]);

  const hasCappedErrorBars = useMemo(() => {
    return data.some((item) => {
      const meanValue = parseNumericValue(item.mean_uptake_percent_per_g);
      if (meanValue <= 0) return false;
      const stdDevValue = parseNumericValue(item.std_dev);
      return stdDevValue / meanValue > MAX_ERROR_BAR_RATIO;
    });
  }, [data]);

  const showReferenceLine = referenceLineValue > 0;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 border border-border rounded-lg bg-card">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {title && (
        <h2 className="text-xl font-semibold text-card-foreground mb-4 text-center">
          {title}
        </h2>
      )}

      {hasCappedErrorBars && (
        <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <AlertCircle className="size-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-orange-800 dark:text-orange-200">
            <strong>Note:</strong> Some error bars have been capped for better
            visibility. Data points with very large standard deviations are
            marked with <span className="text-orange-500">*</span> in the
            tooltip.
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            {dataPointDisplayNames.map((_, index) => {
              const config = getColorConfigByIndex(index);
              if (config.pattern !== "striped") return null;
              return (
                <pattern
                  key={getPatternId(instanceId, index)}
                  id={getPatternId(instanceId, index)}
                  patternUnits="userSpaceOnUse"
                  width="6"
                  height="6"
                  patternTransform="rotate(45)"
                >
                  <rect width="6" height="6" fill={config.color} />
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="6"
                    stroke="white"
                    strokeWidth="2.5"
                  />
                </pattern>
              );
            })}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />

          <XAxis
            dataKey="organ"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: "#000000", fontSize: 12, fontWeight: 600 }}
            stroke="#000000"
            strokeWidth={2}
          />

          <YAxis
            label={{
              value: "%ID/g",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#000000", fontWeight: 700, fontSize: 14 },
            }}
            tick={{ fill: "#000000", fontSize: 12, fontWeight: 600 }}
            stroke="#000000"
            strokeWidth={2}
            domain={[0, maxYValue]}
          />

          <Tooltip
            content={<CustomTooltip idPrefix={instanceId} />}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />

          {/* ─── CHANGE 2: Legend moved to top with verticalAlign="top" ──── */}
          <Legend
            content={<CustomLegend idPrefix={instanceId} />}
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "12px" }}
          />

          {showReferenceLine && (
            <ReferenceLine
              y={referenceLineValue}
              stroke="#0096DB"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `${referenceLineValue.toFixed(2)}%`,
                position: "left",
                fill: "#0096DB",
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          )}

          {dataPointDisplayNames.map((displayName, index) => {
            const config = getColorConfigByIndex(index);
            const barFill =
              config.pattern === "striped"
                ? `url(#${getPatternId(instanceId, index)})`
                : config.color;

            return (
              <Bar
                key={displayName}
                dataKey={displayName}
                name={displayName}
                fill={barFill}
                maxBarSize={60}
                animationBegin={index * 100}
                animationDuration={animationDuration}
                animationEasing="ease-out"
                isAnimationActive={true}
                shape={(props: any) => (
                  <CustomBarWithErrorBar
                    {...props}
                    seriesIndex={index}
                    color={config.color}
                  />
                )}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
