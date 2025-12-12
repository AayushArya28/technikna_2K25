import { useEffect, useState } from "react";

const BrowserWarningModal = () => {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleDismiss = () => {
        setIsOpen(false);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 px-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-[#0b0b0f]/95 p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="absolute -top-24 -left-16 h-52 w-52 rounded-full bg-[#ff1744]/25 blur-[120px]" aria-hidden="true" />
                <div className="flex flex-col gap-4">
                    <span className="text-xs uppercase tracking-[0.4em] text-white/60">Browser Notice</span>
                    <h2 className="text-2xl font-semibold tracking-wide">Safari is not supported</h2>
                    <p className="text-sm text-white/70">
                        For the smoothest Technika experience, please switch to Google Chrome. Safari currently misses a few security and performance features that the event pages rely on.
                    </p>
                    <div className="flex flex-col gap-2 text-xs text-white/60">
                        <span className="uppercase tracking-[0.3em]">Recommended setup</span>
                        <span className="text-white/80">Google Chrome version 120 or later</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-white/90"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrowserWarningModal;
