import React, { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function RulebookModal({
  open,
  title,
  content,
  pdfUrl,
  pdfPage,
  onClose,
}) {
  const normalizedText = useMemo(() => {
    const text = String(content || "")
      .replace(/\r\n?/g, "\n")
      .replace(/\u00a0/g, " ")
      .replace(/OBJECTIV\s*\n\s*E/gi, "OBJECTIVE")
      .replace(/JUDG(?:ING)?\s*\n\s*CRITERIA/gi, "JUDGING CRITERIA")
      .replace(/-\s*\n\s*/g, "-")
      .trim();

    return text;
  }, [content]);

  const textLines = useMemo(() => {
    if (!normalizedText) return [];

    const raw = normalizedText
      // Normalize common extracted bullet symbols
      .replace(/[ò]/g, "•")
      .replace(/[➢]/g, "•")
      .split("\n")
      .map((l) => l.replace(/\s+$/g, ""));

    const isHeadingLine = (line) => {
      const trimmed = String(line || "").trim();
      if (!trimmed) return false;
      if (/^(rulebook|objective|rules?|judging criteria|note|duration)\b/i.test(trimmed)) {
        return true;
      }

      // Lines that are mostly uppercase (titles/section names)
      const letters = trimmed.replace(/[^A-Za-z]/g, "");
      if (letters.length >= 6) {
        const upper = letters.replace(/[^A-Z]/g, "").length;
        if (upper / letters.length >= 0.85) return true;
      }

      return false;
    };

    const isListLine = (line) =>
      /^\s*(?:\d+\s*[\.)]|•|-)\s+/.test(String(line || "").trim());

    const merged = [];
    for (const originalLine of raw) {
      const line = String(originalLine || "").trim();

      if (!line) {
        if (merged.length === 0 || merged[merged.length - 1] !== "") merged.push("");
        continue;
      }

      if (merged.length === 0) {
        merged.push(line);
        continue;
      }

      const prev = merged[merged.length - 1];
      if (!prev) {
        merged.push(line);
        continue;
      }

      if (isHeadingLine(line) || isListLine(line) || isHeadingLine(prev) || isListLine(prev)) {
        merged.push(line);
        continue;
      }

      // Merge wrapped sentence lines from PDF extraction.
      const joiner = /[-–]$/.test(prev) ? "" : " ";
      merged[merged.length - 1] = `${prev}${joiner}${line}`;
    }

    // Avoid leading/trailing blank lines
    while (merged[0] === "") merged.shift();
    while (merged[merged.length - 1] === "") merged.pop();
    return merged;
  }, [normalizedText]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY || 0;

    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    // Strong scroll lock (works even with smooth-scroll libraries)
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      document.documentElement.style.overflow = prevHtmlOverflow;

      // Restore scroll position after unlocking
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const pageNumber = useMemo(() => {
    const parsed = Number(pdfPage);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
  }, [pdfPage]);

  const pdfContainerRef = useRef(null);
  const [pdfWidth, setPdfWidth] = useState(0);

  useEffect(() => {
    if (!open) return;
    if (!pdfContainerRef.current) return;

    const element = pdfContainerRef.current;
    const update = () => setPdfWidth(element.clientWidth || 0);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(element);
    return () => ro.disconnect();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10060] flex items-center justify-center bg-black/70 px-3 py-4 overflow-hidden sm:px-4 sm:py-6">
      <div className="flex max-h-[92dvh] w-full max-w-3xl flex-col rounded-3xl border border-white/12 bg-black/70 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:max-h-[90vh] sm:p-5 lg:p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-white/50">Rulebook</div>
            <div className="text-lg font-semibold text-white sm:text-xl">{String(title || "Event")}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 transition sm:px-4"
          >
            Close
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {typeof pdfUrl === "string" && pdfUrl.trim() ? (
            <div className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-center justify-end">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
                >
                  Open in new tab
                </a>
              </div>

              <div
                ref={pdfContainerRef}
                className="min-h-0 w-full flex-1 overflow-auto [-webkit-overflow-scrolling:touch] overscroll-contain rounded-2xl border border-white/10 bg-black/50 p-2"
                onWheelCapture={(e) => e.stopPropagation()}
                onTouchMoveCapture={(e) => e.stopPropagation()}
              >
                <Document
                  file={pdfUrl}
                  loading={<div className="text-sm text-white/70">Loading rulebook…</div>}
                  error={
                    <div className="text-sm text-white/70">
                      Couldn’t load the rulebook PDF.
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pdfWidth ? Math.min(pdfWidth - 16, 920) : undefined}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={<div className="text-sm text-white/70">Rendering…</div>}
                  />
                </Document>
              </div>
            </div>
          ) : (
            <div
              className="h-full overflow-y-auto [-webkit-overflow-scrolling:touch] overscroll-contain p-4"
              onWheelCapture={(e) => e.stopPropagation()}
              onTouchMoveCapture={(e) => e.stopPropagation()}
            >
              <div className="text-sm text-white/85 leading-relaxed">
                {textLines.map((line, idx) => {
                  if (!line) {
                    return <div key={`sp-${idx}`} className="h-3" />;
                  }

                  const trimmed = line.trim();

                  const headingMatch = trimmed.match(
                    /^(rulebook|objective|rules?|judging criteria|note|duration)\b\s*:?(.*)$/i,
                  );
                  if (headingMatch) {
                    const label = headingMatch[1].toUpperCase();
                    const rest = String(headingMatch[2] || "").trim();
                    return (
                      <div key={`h-${idx}`} className="mt-3 text-base font-semibold text-white">
                        {rest ? `${label}: ${rest}` : label}
                      </div>
                    );
                  }

                  const numbered = trimmed.match(/^(\d+)\s*[\.)]\s*(.*)$/);
                  if (numbered) {
                    return (
                      <div key={`n-${idx}`} className="flex gap-2 py-0.5">
                        <span className="shrink-0 text-white/80">{numbered[1]}.</span>
                        <span className="min-w-0">{numbered[2] || ""}</span>
                      </div>
                    );
                  }

                  const bulleted = trimmed.match(/^(?:•|-)\s*(.*)$/);
                  if (bulleted) {
                    const bulletText = String(bulleted[1] || "").trim();
                    const letters = bulletText.replace(/[^A-Za-z]/g, "");
                    const upperRatio =
                      letters.length > 0
                        ? letters.replace(/[^A-Z]/g, "").length / letters.length
                        : 0;

                    if (bulletText && letters.length >= 6 && upperRatio >= 0.85 && bulletText.length <= 60) {
                      return (
                        <div key={`bh-${idx}`} className="mt-3 text-base font-semibold text-white">
                          {bulletText}
                        </div>
                      );
                    }

                    return (
                      <div key={`b-${idx}`} className="flex gap-2 py-0.5">
                        <span className="shrink-0 text-white/80">•</span>
                        <span className="min-w-0">{bulletText}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={`p-${idx}`} className="py-0.5 text-sm text-white/85">
                      {trimmed}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
