import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { useEntitlements } from "../context/useEntitlements.jsx"; // Removed entitlement check
import { useAuth } from "../context/useAuth.jsx";
import { BASE_API_URL, getAuthHeaders, fetchJson } from "../lib/api.js";
import gsap from "gsap";
import BrowserWarningModal from "../components/BrowserWarningModal.jsx";

const PRODUCTS = [
  {
    id: "2474", // jacket
    title: "Official Bit Mesra Jacket",
    price: 1199,
    originalPrice: 1399,
    thumb: "https://i.ibb.co/nMN19szx/jacket-1.png",
    images: ["https://i.ibb.co/nMN19szx/jacket-1.png", "https://i.ibb.co/Dgm4kXYt/jacket-2.png"],
  },
  {
    id: "2475", // tshirt
    title: "Technika T-Shirt",
    price: 799,
    originalPrice: 999,
    thumb: "https://i.ibb.co/fVkkBTg2/tshirt-thumbnal.png",
    images: [
      "https://i.ibb.co/qMVvN1Nv/tshirt-1.png",
      "https://i.ibb.co/TM3c6FFW/tshirt-2.png",
      "https://i.ibb.co/39yxmgvj/tshirt-4.png",
      "https://i.ibb.co/mCsCjgx7/tshirt-3.png",
    ],
  },
  {
    id: "2476", // combo
    isCombo: true,
    title: "Technika Combo (Jacket + T-Shirt)",
    price: 1499,
    originalPrice: 1998,
    thumb: "https://i.ibb.co/nMN19szx/jacket-1.png",
    images: ["https://i.ibb.co/nMN19szx/jacket-1.png", "https://i.ibb.co/fVkkBTg2/tshirt-thumbnal.png"],
  },
];

export default function Merchandise() {
  const [modalProduct, setModalProduct] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState({}); // { jacket: 'M', tshirt: 'S', combo_jacket: 'M', combo_tshirt: 'M' }
  const [quantities, setQuantities] = useState({});

  const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    setOrders([]);
    try {
      const headers = await getAuthHeaders();
      const { data } = await fetchJson(`${BASE_API_URL}/merch/orders`, { headers });

      if (data && Array.isArray(data.orders)) {
        const mappedOrders = data.orders.map(o => {
          let title = "Technika Merch";
          if (o.item?.type === 'jacket') title = "Official Bit Mesra Jacket";
          else if (o.item?.type === 'tee') title = "Technika T-Shirt";
          else if (o.item?.type === 'combo') title = "Technika Combo";

          return {
            id: o.id,
            title: title,
            status: o.paymentStatus,
            payment_url: o.paymentUrl,
            size: o.item?.size,
            amount: 0 // Backend doesn't send amount in list, handled by UI defaults or logic
          };
        });
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (ordersModalOpen) {
      fetchOrders();
    }
  }, [ordersModalOpen, user]);

  // itemsToBuy is now just one item { productId, size } for this flow
  const handleCheckout = async (itemsToBuy) => {
    if (!user) {
      showNotice("Please login to purchase");
      return;
    }

    // We expect itemsToBuy to have at least one valid item
    const item = itemsToBuy[0];
    if (!item) return;

    // Pre-open payment tab to avoid popup blockers; we'll close it if payment isn't needed.
    const paymentTab = window.open("about:blank", "_blank");
    const closePaymentTab = () => {
      if (paymentTab && !paymentTab.closed) paymentTab.close();
    };
    try {
      if (paymentTab) paymentTab.opener = null;
    } catch {
      // ignore
    }
    const willUseNewTab = Boolean(paymentTab);
    if (!willUseNewTab) {
      showNotice("Popup blocked. Redirecting in same tab...");
    }

    showNotice(`Booking ${item.productId}...`);

    try {
      const headers = await getAuthHeaders();
      // If combo, the 'size' passed in might be "Jacket: M, T-Shirt: L" or similar constructed string.
      // We pass the structure { items: [ { productId: ..., size: ..., quantity: ... } ] }
      // but 'itemsToBuy' has 'productId' which we map to 'id' if needed, or keep as is.
      // Map ID to type
      let type = "";
      if (item.productId === "2474") type = "jacket"; // jacket
      else if (item.productId === "2475") type = "tee"; // tshirt
      else if (item.productId === "2476") type = "combo"; // combo

      // Fetch user profile for required fields
      const db = getFirestore();
      let profile = {};
      try {
        if (user.uid) {
          const snap = await getDoc(doc(db, "auth", user.uid));
          if (snap.exists()) profile = snap.data();
        }
      } catch (e) {
        console.warn("Failed to fetch profile for checkout", e);
      }

      const payload = {
        name: profile.name || user.displayName || "Technika User",
        phone: profile.phone || "0000000000",
        college: profile.college || "BIT Mesra",
        item: {
          type: type,
          quantity: Number(item.quantity) || 1,
          size: item.size
        }
      };

      console.log("Sending checkout payload:", payload);

      const { resp, data } = await fetchJson(`${BASE_API_URL}/merch/order`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        closePaymentTab();
        showNotice(data?.message || "Booking creation failed");
        return;
      }

      if (data.paymentUrl || data.payment_url) {
        const url = data.paymentUrl || data.payment_url;
        console.log("Redirecting to payment:", url);
        if (willUseNewTab) {
          try {
            if (paymentTab && !paymentTab.closed) {
              paymentTab.location.href = url;
              // Ideally we would set some 'pending' state here like Alumni does
              showNotice("Payment initiated. Check new tab.");
              return;
            }
          } catch (e) {
            console.error("Tab redirection failed", e);
            closePaymentTab();
          }
        }

        // Fallback
        closePaymentTab();
        window.location.href = url;
      } else {
        console.log("No payment URL returned", data);
        closePaymentTab();
        showNotice(data.message || "Booking initiated successfully!");
        setOrdersModalOpen(true);
      }
    } catch (err) {
      closePaymentTab();
      console.error("Booking error:", err);
      showNotice("Something went wrong. Try again.");
    }
  };

  const checkOrderStatus = async (orderId) => {
    try {
      const headers = await getAuthHeaders();
      // Backend uses GET /merch/order/:id for specific order details
      const { data } = await fetchJson(`${BASE_API_URL}/merch/order/${orderId}`, { headers });

      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: data.status, // Backend returns 'status'
            payment_url: data.paymentUrl // Backend returns 'paymentUrl'
          };
        }
        return o;
      }));

      if (data.status) showNotice(`Status: ${data.status}`);
    } catch (e) {
      showNotice("Failed to update status");
    }
  };

  // Removed standard cart functions and useEffects

  useEffect(() => {
    if (modalProduct) setModalIndex(0);
  }, [modalProduct]);

  const modalRef = useRef(null);
  const [notice, setNotice] = useState(null);
  // const { isBitStudent } = useEntitlements();

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

  // Removed redundant useEffect related to modalSize synchronization, simple state is enough

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">Merchandise</h1>
            {user && (
              <div className="flex flex-col items-end">
                <button
                  onClick={() => setOrdersModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm hover:bg-white/20 transition-colors"
                >
                  My Orders
                </button>
                {/* Order Summary / Hint */}
                {orders.length > 0 && (
                  <div className="mt-2 text-xs text-white/60">
                    {orders.length} active order{orders.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6 rounded-lg border border-white/10 bg-black/50 p-3 text-sm text-white/80">
            <strong className="text-white">Combo offer:</strong> Purchase both the Technika Jacket and Technika T-Shirt together and the combined price will be reduced to ₹1499. The discount is applied automatically in the cart when both items are added.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="relative overflow-hidden rounded-[28px] border border-white/12 bg-black/55 p-4 flex flex-col md:flex-row gap-4 backdrop-blur-xl shadow-[0_40px_110px_rgba(255,0,48,0.12)]">
                <div className="flex-shrink-0 w-full md:w-44">
                  <img src={p.images[0]} alt={p.title} className="rounded-md w-full h-36 object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold leading-tight">{p.title}</h2>
                    <p className="text-white/70 mt-2 text-sm">{p.id === 'combo' ? 'Best value pack.' : 'High quality merch.'}</p>
                  </div>

                  <div className="mt-4 flex flex-col gap-4">
                    <div>
                      {p.originalPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/40 line-through">₹{p.originalPrice}</span>
                          <span className="text-lg font-semibold text-[#ff4f81]">₹{p.price}</span>
                        </div>
                      ) : (
                        <div className="text-lg font-semibold">₹{p.price}</div>
                      )}

                      <div className="mt-3 space-y-2">
                        {p.isCombo ? (
                          <>
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-white/50 mr-2">Jacket</label>
                              <select
                                value={selectedSizes[`${p.id}_jacket`] || "M"}
                                onChange={(e) => setSelectedSizes((s) => ({ ...s, [`${p.id}_jacket`]: e.target.value }))}
                                className="bg-black/25 border border-white/8 rounded px-2 py-1 text-white text-xs"
                              >
                                {SIZES.map((sz) => (<option key={sz} value={sz}>{sz}</option>))}
                              </select>
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-white/50 mr-2">T-Shirt</label>
                              <select
                                value={selectedSizes[`${p.id}_tshirt`] || "M"}
                                onChange={(e) => setSelectedSizes((s) => ({ ...s, [`${p.id}_tshirt`]: e.target.value }))}
                                className="bg-black/25 border border-white/8 rounded px-2 py-1 text-white text-xs"
                              >
                                {SIZES.map((sz) => (<option key={sz} value={sz}>{sz}</option>))}
                              </select>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <label className="text-xs text-white/50 mb-1">Size</label>
                              <select
                                value={selectedSizes[p.id] || "M"}
                                onChange={(e) => setSelectedSizes((s) => ({ ...s, [p.id]: e.target.value }))}
                                className="bg-black/25 border border-white/8 rounded px-2 py-1 text-white text-sm"
                              >
                                {SIZES.map((sz) => (<option key={sz} value={sz}>{sz}</option>))}
                              </select>
                            </div>
                            <div className="flex flex-col w-16">
                              <label className="text-xs text-white/50 mb-1">Qty</label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={quantities[p.id] || 1}
                                onChange={(e) => setQuantities(q => ({ ...q, [p.id]: Math.max(1, parseInt(e.target.value) || 1) }))}
                                className="bg-black/25 border border-white/8 rounded px-2 py-1 text-white text-sm w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      {!p.isCombo && (
                        <button
                          onClick={() => setModalProduct(p)}
                          aria-label={`View ${p.title}`}
                          className="w-10 h-10 flex items-center justify-center rounded-full border border-white/8 bg-transparent text-white/70 hover:bg-white/5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7z" />
                            <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (p.isCombo) {
                            const jacketSize = selectedSizes[`${p.id}_jacket`] || "M";
                            const tshirtSize = selectedSizes[`${p.id}_tshirt`] || "M";
                            handleCheckout([
                              { productId: p.id, size: `Jacket: ${jacketSize}, T-Shirt: ${tshirtSize}`, quantity: 1 }
                            ]);
                          } else {
                            const qty = quantities[p.id] || 1;
                            handleCheckout([
                              { productId: p.id, size: selectedSizes[p.id] || "M", quantity: qty }
                            ]);
                          }
                        }}
                        className="flex-1 px-3 py-2 text-sm rounded-full bg-gradient-to-r from-[#ff6b7a] via-[#ff4f81] to-[#7a4bff] text-white shadow-sm font-semibold"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart removed as requested */}
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

                  <div className="mt-4 mb-4">
                    {!modalProduct.isCombo && (
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs text-white/50 mb-1">Size</label>
                          <select
                            value={selectedSizes[modalProduct.id] || "M"}
                            onChange={(e) => setSelectedSizes((s) => ({ ...s, [modalProduct.id]: e.target.value }))}
                            className="bg-black/25 border border-white/8 rounded px-3 py-2 text-white text-sm"
                          >
                            {SIZES.map((sz) => (<option key={sz} value={sz}>{sz}</option>))}
                          </select>
                        </div>
                        <div className="flex flex-col w-20">
                          <label className="text-xs text-white/50 mb-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={quantities[modalProduct.id] || 1}
                            onChange={(e) => setQuantities(q => ({ ...q, [modalProduct.id]: Math.max(1, parseInt(e.target.value) || 1) }))}
                            className="bg-black/25 border border-white/8 rounded px-3 py-2 text-white text-sm w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => {
                        const size = selectedSizes[modalProduct.id] || "M";
                        const qty = quantities[modalProduct.id] || 1;
                        handleCheckout([
                          { productId: modalProduct.id, size: size, quantity: qty }
                        ]);
                        closeModal();
                      }}
                      className="flex-1 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff1744] via-[#ff4f81] to-[#5b2cff] text-white font-semibold"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {
        ordersModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">My Orders</h3>
                <button onClick={() => setOrdersModalOpen(false)} className="text-white/50 hover:text-white">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingOrders ? (
                  <div className="text-center text-white/50 py-8">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center text-white/50 py-8">No orders found.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-xs text-white/50 mb-1">Order ID: {order.id}</div>
                          <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                            order.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-white/10 text-white/70'
                            }`}>
                            {order.status || 'UNKNOWN'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">₹{order.amount || order.totalAmount || 0}</div>
                          <button
                            onClick={() => checkOrderStatus(order.id)}
                            className="text-xs text-[#ff4f81] hover:underline mt-1"
                          >
                            Check Status
                          </button>
                        </div>
                      </div>
                      <div className="text-white/80 border-t border-white/5 pt-2 text-sm">{order.title}</div>
                      {order.size && <div className="text-sm text-white/50">Size: {order.size}</div>}

                      {order.payment_url && order.status !== 'PAID' && (
                        <div className="mt-3 pt-2 border-t border-white/10">
                          <a href={order.payment_url} className="block text-center w-full py-2 bg-[#ff4f81] hover:bg-[#ff1744] rounded-lg text-white font-medium text-sm transition-colors">
                            Complete Payment
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )
      }
      {
        notice && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-28 z-50 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-md">
            {notice}
          </div>
        )
      }
    </>
  );
}
