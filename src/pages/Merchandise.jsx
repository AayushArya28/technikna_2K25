import React, { useState, useEffect, useRef } from "react";
import { useEntitlements } from "../context/useEntitlements.jsx";
import gsap from "gsap";
import BrowserWarningModal from "../components/BrowserWarningModal.jsx";

const PRODUCTS = [
  {
    id: "jacket",
    title: "Technika Jacket",
    price: 1199,
    thumb: "https://i.ibb.co/nMN19szx/jacket-1.png",
    images: [
      "https://i.ibb.co/nMN19szx/jacket-1.png",
      "https://i.ibb.co/Dgm4kXYt/jacket-2.png"
    ],
  },
  {
    id: "tshirt",
    title: "Technika T-Shirt",
    price: 799,
    thumb: "https://i.ibb.co/fVkkBTg2/tshirt-thumbnal.png",
    images: [
      "https://i.ibb.co/qMVvN1Nv/tshirt-1.png",
      "https://i.ibb.co/TM3c6FFW/tshirt-2.png",
      "https://i.ibb.co/39yxmgvj/tshirt-4.png",
      "https://i.ibb.co/mCsCjgx7/tshirt-3.png"
    ],
  }
];

export default function Merchandise() {
  const [modalProduct, setModalProduct] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [couponApplied, setCouponApplied] = useState(false);
  const [cartOpen, setCartOpen] = useState(true);

  const addToCart = (product) => {
    setCart((c) => {
      const found = c.find((i) => i.id === product.id);
      if (found) {
        showNotice("You can only add one of each item");
        return c;
      }
      const thumb = product.thumb || product.images[0];
      return [...c, { ...product, qty: 1, thumb }];
    });
  };

  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const discounted = couponApplied ? 1499 : total;

  useEffect(() => {
    const hasJacket = cart.some((i) => i.id === "jacket");
    const hasTshirt = cart.some((i) => i.id === "tshirt");
    setCouponApplied(hasJacket && hasTshirt);
  }, [cart]);

  useEffect(() => {
    if (modalProduct) setModalIndex(0);
  }, [modalProduct]);

  const modalRef = useRef(null);
  const [notice, setNotice] = useState(null);
  const { isBitStudent } = useEntitlements();

  const showNotice = (text, ms = 2200) => {
    setNotice(text);
    window.setTimeout(() => setNotice(null), ms);
  };

  const closeModal = () => {
    if (!modalRef.current) {
      setModalProduct(null);
      return;
    }
    gsap.to(modalRef.current, {
      y: 20,
      opacity: 0,
      scale: 0.98,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setModalProduct(null),
    });
  };

  useEffect(() => {
    if (modalProduct && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 20, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
      );
    }
  }, [modalProduct]);

  // Prevent background scrolling while modal is open; allow scrolling inside modal.
  // Use fixed positioning to preserve scroll position and restore on close.
  useEffect(() => {
    if (!modalProduct) return;
    const body = document.body;
    const docEl = document.documentElement;
    const scrollY = window.scrollY || window.pageYOffset;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      scrollTop: scrollY,
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    // Also lock html element as a fallback
    const prevHtmlOverflow = docEl.style.overflow;
    docEl.style.overflow = "hidden";

    return () => {
      docEl.style.overflow = prevHtmlOverflow || "";
      body.style.overflow = prev.overflow || "";
      body.style.position = prev.position || "";
      body.style.top = prev.top || "";
      body.style.width = prev.width || "";
      window.scrollTo(0, prev.scrollTop || 0);
    };
  }, [modalProduct]);

  // Allow touch scrolling only inside modal on mobile: prevent touchmove outside modal
  useEffect(() => {
    if (!modalProduct) return;
    const onTouchMove = (e) => {
      if (!modalRef.current) return;
      if (!modalRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [modalProduct]);

  return (
    <>
      <BrowserWarningModal />

      <div className="relative flex min-h-screen w-full items-start justify-center overflow-hidden bg-gradient-to-b from-black via-[#140109] to-black px-6 pb-12 pt-28 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-16 h-[420px] w-[420px] rounded-full bg-[#ff0030]/12 blur-[150px]" />
          <div className="absolute bottom-0 left-8 h-80 w-80 rounded-full bg-[#4100ff]/12 blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-6xl w-full">
          <h1 className="text-4xl font-bold mb-6">Merchandise</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="relative overflow-hidden rounded-[28px] border border-white/12 bg-black/55 p-4 flex flex-col md:flex-row gap-4 backdrop-blur-xl shadow-[0_40px_110px_rgba(255,0,48,0.12)]">
                <div className="flex-shrink-0 w-full md:w-48">
                  <img src={p.images[0]} alt={p.title} className="rounded-md w-full h-40 object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{p.title}</h2>
                    <p className="text-white/70 mt-2">High quality official event merch.</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold">₹{p.price}</div>
                      <div className="text-sm text-white/60">{p.images.length} photos</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setModalProduct(p)}
                        className="px-4 py-2 bg-transparent border border-white/10 rounded-full hover:bg-white/5"
                      >
                        View
                      </button>
                      <button
                        onClick={() => addToCart(p)}
                        className="px-4 py-2 bg-gradient-to-r from-[#ff1744] via-[#ff4f81] to-[#5b2cff] text-white rounded-full shadow-md"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart summary (collapsible) */}
          {cartOpen ? (
            <div className="fixed right-4 bottom-4 bg-neutral-900 rounded-lg p-3 w-full max-w-[320px] md:w-80">
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setCartOpen(false)} className="flex items-center gap-2 text-left text-neutral-400 hover:text-white">
                  <span className="text-neutral-400">▴</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-neutral-300">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7m13-7l2 7M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  <div className="font-semibold">Cart</div>
                </button>
                <div className="text-sm text-neutral-400">{cart.reduce((s, it) => s + it.qty, 0)} items</div>
              </div>

              <div className="flex flex-col gap-2 max-h-40 overflow-auto">
                {cart.length === 0 && <div className="text-neutral-400">Cart is empty</div>}
                {cart.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {it.thumb && (
                        <img src={it.thumb} alt={it.title} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <div className="font-medium">{it.title}</div>
                        <div className="text-sm text-neutral-400">Qty: {it.qty}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div>₹{it.price * it.qty}</div>
                      <button onClick={() => removeFromCart(it.id)} className="text-xs text-red-400">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-neutral-400">Total</div>
                  <div className="font-bold">₹{couponApplied ? discounted : total}</div>
                </div>

                {couponApplied && (
                  <div className="text-xs text-emerald-400">Coupon applied — price reduced to ₹1499</div>
                )}
                {cart.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        if (!isBitStudent) {
                          showNotice("You are not eligible to buy the merch from the site.");
                          return;
                        }
                        showNotice("Checkout coming soon — will be available soon");
                      }}
                      className="flex-1 px-3 py-2 rounded-full bg-gradient-to-r from-[#ff1744] via-[#ff4f81] to-[#5b2cff] text-white font-semibold"
                    >
                      Buy now
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="fixed right-4 bottom-4 bg-neutral-900 rounded-lg p-2 w-full max-w-[260px] md:w-56">
              <button onClick={() => setCartOpen(true)} className="w-full flex items-center justify-between gap-3 text-sm font-semibold text-neutral-400 hover:text-white px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400">▾</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-neutral-300">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7m13-7l2 7M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  <div>Cart</div>
                </div>
                <div className="text-sm text-neutral-400">{cart.reduce((s, it) => s + it.qty, 0)}</div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div ref={modalRef} className="w-[92%] max-w-4xl relative bg-black/55 border border-white/12 backdrop-blur-xl rounded-[32px] p-4 shadow-[0_60px_140px_rgba(255,0,48,0.18)] overflow-auto max-h-[90vh]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.16),_transparent_55%)]" />
            <div className="flex items-start justify-between mb-3 z-10 relative">
              <div>
                <h3 className="text-2xl font-semibold">{modalProduct.title}</h3>
                <div className="text-sm text-white/70">Price: ₹{modalProduct.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={closeModal} className="text-white/60 hover:text-white text-sm">Close</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 z-10 relative">
              <div className="md:col-span-7 flex items-start justify-center relative">
                <button aria-label="Previous image" title="Previous" onClick={() => setModalIndex((i) => Math.max(0, i - 1))} className="hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-2 text-white/70 hover:bg-black/60">‹</button>
                <img
                  src={modalProduct.images[modalIndex]}
                  alt="main"
                  className="w-full md:max-w-[520px] max-h-[55vh] md:max-h-[70vh] object-contain rounded-2xl"
                />
                <button aria-label="Next image" title="Next" onClick={() => setModalIndex((i) => Math.min(modalProduct.images.length - 1, i + 1))} className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-2 text-white/70 hover:bg-black/60">›</button>
              </div>

              <div className="md:col-span-5">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {modalProduct.images.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setModalIndex(i)}
                        className={`flex-shrink-0 rounded-md overflow-hidden border ${i === modalIndex ? "border-[#ff1744]" : "border-white/10"}`}>
                        <img src={src} alt={`thumb-${i}`} className="w-24 h-24 object-cover block" />
                      </button>
                    ))}
                  </div>

                  <div className="text-sm text-white/70">Official event merchandise — images. Use corner actions to add or buy.</div>

                  <div className="mt-auto">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { addToCart(modalProduct); closeModal(); }}
                        className="flex-1 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={() => {
                          closeModal();
                          if (!isBitStudent) {
                            showNotice("You are not eligible to buy the merch from the site.");
                            return;
                          }
                          showNotice("Coming soon — checkout coming shortly");
                        }}
                        className="flex-1 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff1744] via-[#ff4f81] to-[#5b2cff] text-white font-semibold"
                      >
                        Buy now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {notice && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-28 z-50 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-md">
          {notice}
        </div>
      )}
    </>
  );
}
