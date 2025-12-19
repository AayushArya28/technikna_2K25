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
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
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
            <div className="h-full overflow-y-auto [-webkit-overflow-scrolling:touch] overscroll-contain p-4">
              <pre className="whitespace-pre-wrap text-sm text-white/85 leading-relaxed">
                {String(content || "")}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
