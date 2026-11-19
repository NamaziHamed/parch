"use client";
import React, {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface MasonryProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Target column width; the column count is derived from the container. */
  minColumnWidth?: number;
  maxColumns?: number;
  className?: string;
}

const FALLBACK_HEIGHT = 160;

function columnCount(width: number, minColumnWidth: number, gap: number, max: number) {
  if (width < 340) return 1;
  // Phones get two compact columns, like a native notes app.
  const fit = Math.floor((width + gap) / (minColumnWidth + gap));
  return Math.min(max, Math.max(2, fit));
}

/**
 * Shortest-column masonry: every card goes into whichever column is currently
 * the shortest, so short notes pack in beside long ones instead of being dealt
 * out round-robin. Cards are absolutely positioned from measured heights and
 * glide to their new spot when the list changes (search, delete).
 */
export default function Masonry<T>({
  items,
  getKey,
  renderItem,
  minColumnWidth = 210,
  maxColumns = 4,
  className,
}: MasonryProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const observer = useRef<ResizeObserver | null>(null);
  const refCallbacks = useRef(new Map<string, (node: HTMLElement | null) => void>());

  const [width, setWidth] = useState(0);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [animate, setAnimate] = useState(false);

  const gap = width < 640 ? 12 : 16;
  const columns = columnCount(width, minColumnWidth, gap, maxColumns);
  const columnWidth = width ? (width - gap * (columns - 1)) / columns : 0;

  const measureAll = useCallback(() => {
    setHeights((prev) => {
      let next = prev;
      nodes.current.forEach((node, key) => {
        const h = node.offsetHeight;
        if (prev[key] !== h) {
          if (next === prev) next = { ...prev };
          next[key] = h;
        }
      });
      return next;
    });
  }, []);

  // Track the container width (sidebar, window resizes, rotation).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  // Track card heights (fonts loading, content changes).
  useLayoutEffect(() => {
    const ro = new ResizeObserver(measureAll);
    observer.current = ro;
    nodes.current.forEach((node) => ro.observe(node));
    return () => ro.disconnect();
  }, [measureAll]);

  // Re-measure synchronously before paint whenever the column width or the
  // item set changes, so cards never flash at a stale position.
  useLayoutEffect(() => {
    if (columnWidth) measureAll();
  }, [columnWidth, items, measureAll]);

  // Enable the glide animation only after the first real layout.
  useLayoutEffect(() => {
    if (!width || animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [width, animate]);

  const refFor = (key: string) => {
    let cb = refCallbacks.current.get(key);
    if (!cb) {
      cb = (node: HTMLElement | null) => {
        const prev = nodes.current.get(key);
        if (prev && prev !== node) observer.current?.unobserve(prev);
        if (node) {
          nodes.current.set(key, node);
          observer.current?.observe(node);
        } else {
          nodes.current.delete(key);
          refCallbacks.current.delete(key);
        }
      };
      refCallbacks.current.set(key, cb);
    }
    return cb;
  };

  const { positions, height } = useMemo(() => {
    const cols = new Array(columns).fill(0);
    const positions = new Map<string, { x: number; y: number }>();
    for (const item of items) {
      const key = getKey(item);
      let target = 0;
      for (let c = 1; c < columns; c++) if (cols[c] < cols[target]) target = c;
      positions.set(key, { x: target * (columnWidth + gap), y: cols[target] });
      cols[target] += (heights[key] ?? FALLBACK_HEIGHT) + gap;
    }
    return { positions, height: Math.max(0, Math.max(...cols) - gap) };
  }, [items, getKey, columns, columnWidth, gap, heights]);

  const measured = width > 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        // Before hydration we can't measure, so fall back to a plain grid.
        !measured && "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 items-start",
        measured && "relative",
        className
      )}
      style={measured ? { height } : undefined}
    >
      {items.map((item) => {
        const key = getKey(item);
        const pos = positions.get(key)!;
        return (
          <div
            key={key}
            ref={refFor(key)}
            className={cn(
              measured && "absolute top-0 left-0",
              animate && "transition-transform duration-300 ease-out motion-reduce:transition-none"
            )}
            style={
              measured
                ? {
                    width: columnWidth,
                    transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                  }
                : undefined
            }
          >
            {renderItem(item)}
          </div>
        );
      })}
    </div>
  );
}
