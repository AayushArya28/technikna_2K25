import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { usePopup } from "../context/usePopup.jsx";
import { useEntitlements } from "../context/useEntitlements.jsx";
import { Loader2 } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function FlipCard({ flipped, front, back, minHeightClassName }) {
    return (
        <div className={`relative w-full ${minHeightClassName || "min-h-[420px]"} [perspective:1000px]`}>
            <div
                className={
                    "absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] " +
                    (flipped ? "[transform:rotateY(180deg)]" : "")
                }
            >
                <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
            </div>
        </div>
    );
}

const DelegateGroupRegistration = () => {
    const navigate = useNavigate();
    const popup = usePopup();
    const { loading: entitlementsLoading, canAccessDelegate } = useEntitlements();

    const BASE_API_URL = "https://api.technika.co";

    const [authUser, setAuthUser] = useState(null);
    const [userReady, setUserReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    const [apiError, setApiError] = useState("");
    const [notice, setNotice] = useState("");

    const [checkingSelfStatus, setCheckingSelfStatus] = useState(false);
    const [selfRegistered, setSelfRegistered] = useState(false);

    useEffect(() => {
        if (entitlementsLoading) return;
        if (canAccessDelegate) return;
        popup.info("BIT Mesra email detected. Delegate pages are locked for BIT students.");
        navigate("/", { replace: true });
    }, [canAccessDelegate, entitlementsLoading, navigate, popup]);

    const ROOM_CACHE_KEY = "technika_delegate_room";
    const readCachedRoom = () => {
        try {
            const raw = localStorage.getItem(ROOM_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") return null;
            return parsed;
        } catch {
            return null;
        }
    };
    const writeCachedRoom = ({ uid, roomId, role }) => {
        try {
            localStorage.setItem(
                ROOM_CACHE_KEY,
                JSON.stringify({ uid, roomId, role, ts: Date.now() })
            );
        } catch {
            // ignore
        }
    };
    const clearCachedRoom = () => {
        try {
            localStorage.removeItem(ROOM_CACHE_KEY);
        } catch {
            // ignore
        }
    };

    // The backend may be eventually-consistent right after create/join.
    // Keep the room visible for a short grace period even if status endpoint returns 404.
    const pendingRoomRef = useRef({ roomId: "", ts: 0 });
    const markPendingRoom = (roomId) => {
        pendingRoomRef.current = { roomId, ts: Date.now() };
    };
    const clearPendingRoom = () => {
        pendingRoomRef.current = { roomId: "", ts: 0 };
    };
    const getPendingRoomIdIfFresh = () => {
        const pending = pendingRoomRef.current;
        if (!pending?.roomId) return "";
        // 12s grace window
        if (Date.now() - pending.ts > 12_000) return "";
        return pending.roomId;
    };

    const [activeMode, setActiveMode] = useState(null); // 'owner' | 'member' | null

    const [selectedMode, setSelectedMode] = useState("owner"); // 'owner' | 'member'

    const [ownerForm, setOwnerForm] = useState({
        name: "",
        phone: "",
        college: "",
    });

    const [memberForm, setMemberForm] = useState({
        name: "",
        phone: "",
        college: "",
        roomId: "",
    });

    const [status, setStatus] = useState({
        isOwner: false,
        isMember: false,
        roomId: "",
    });

    const [room, setRoom] = useState(null);

    const [copied, setCopied] = useState(false);

    const canCreateOrJoin = useMemo(() => !status.isOwner && !status.isMember, [status]);

    const lockedMode = useMemo(() => {
        if (status.isOwner) return "owner";
        if (status.isMember) return "member";
        return null;
    }, [status.isOwner, status.isMember]);

    const groupBlockedBySelf = useMemo(() => selfRegistered && canCreateOrJoin, [selfRegistered, canCreateOrJoin]);

    const flipOwnerCard = Boolean(status.isMember && status.roomId);
    const flipMemberCard = Boolean(status.isOwner && status.roomId);

    const ownerCardDisabled = canCreateOrJoin && activeMode === "member";
    const memberCardDisabled = canCreateOrJoin && activeMode === "owner";

    const getAuthHeaders = async ({ json = true } = {}) => {
        if (!authUser) throw new Error("Not authenticated");
        const token = await authUser.getIdToken();
        return {
            Authorization: `Bearer ${token}`,
            ...(json ? { "Content-Type": "application/json" } : {}),
        };
    };

    const clearRoomState = (msg = "") => {
        clearCachedRoom();
        clearPendingRoom();
        setApiError("");
        setRoom(null);
        setStatus({ isOwner: false, isMember: false, roomId: "" });
        if (msg) setNotice(msg);
    };

    const fetchRoomDetails = async (roomId) => {
        const headers = await getAuthHeaders({ json: false });
        const resp = await fetch(`${BASE_API_URL}/delegate/status/room/${roomId}`, {
            headers,
        });
        if (!resp.ok) {
            // If room was deleted, notify and reset UI (especially important for members)
            if (resp.status === 404) {
                clearRoomState("This group was deleted by the owner.");
                return false;
            }
            const data = await resp.json().catch(() => ({}));
            throw new Error(data.message || "Failed to fetch room details");
        }
        const data = await resp.json();

        // Support a few common response shapes
        // - { owner, users, roomId }
        // - { room: { owner, users, roomId } }
        setRoom(data?.room || data);
        return true;
    };

    const verifyAndOpenRoom = async (candidateRoomId) => {
        if (!candidateRoomId) return false;
        try {
            const headers = await getAuthHeaders({ json: false });
            const resp = await fetch(`${BASE_API_URL}/delegate/status/room/${candidateRoomId}`, { headers });

            if (resp.ok) {
                const dataRoom = await resp.json();
                const roomObj = dataRoom.room || dataRoom;

                const myEmail = (authUser.email || "").toLowerCase();
                const myUid = authUser.uid;

                const isOwner = roomObj.owner?.email?.toLowerCase() === myEmail || roomObj.owner?.uid === myUid;
                const isMember = Array.isArray(roomObj.users) && roomObj.users.some(
                    u => (u.email?.toLowerCase() === myEmail) || (u.uid === myUid)
                );

                if (isOwner || isMember) {
                    setStatus({
                        isOwner: !!isOwner,
                        isMember: !!isMember,
                        roomId: candidateRoomId,
                    });
                    setRoom(roomObj);
                    writeCachedRoom({
                        uid: authUser.uid,
                        roomId: candidateRoomId,
                        role: isOwner ? "owner" : "member"
                    });
                    return true;
                }
            }
        } catch (e) {
            console.error(e);
        }
        return false;
    };

    const refreshStatus = async () => {
        setApiError("");
        const headers = await getAuthHeaders({ json: false });
        const resp = await fetch(`${BASE_API_URL}/delegate/status/user`, { headers });

        if (!resp.ok) {
            // Treat 404 as "no room"
            if (resp.status === 404) {
                const pendingRoomId = getPendingRoomIdIfFresh();
                // If we just created/joined, keep showing the optimistic room UI.
                if (pendingRoomId) {
                    try {
                        const ok = await fetchRoomDetails(pendingRoomId);
                        if (!ok) return;
                    } catch (err) {
                        console.error(err);
                    }
                    return;
                }

                // Fallback to cached room on refresh (scoped to this user)
                const cached = readCachedRoom();
                if (cached?.uid && cached?.roomId && authUser?.uid && cached.uid === authUser.uid) {
                    setStatus({
                        isOwner: cached.role === "owner",
                        isMember: cached.role === "member",
                        roomId: cached.roomId,
                    });
                    try {
                        const ok = await fetchRoomDetails(cached.roomId);
                        if (!ok) return;
                    } catch (err) {
                        console.error(err);
                    }
                    return;
                }

                clearRoomState();
                return;
            }
            const data = await resp.json().catch(() => ({}));
            throw new Error(data.message || "Failed to fetch user status");
        }

        const data = await resp.json();
        const roomId = data.roomId || data?.room?.roomId || "";

        // If server says user is not in a room, reset quickly unless we have a pending room OR we find ourselves in the cached room OR in Firestore profile
        if (!roomId) {
            const pendingRoomId = getPendingRoomIdIfFresh();
            const cached = readCachedRoom();
            let targetRoomId = pendingRoomId || cached?.roomId;

            if (targetRoomId) {
                const recovered = await verifyAndOpenRoom(targetRoomId);
                if (recovered) return;
            }

            // FALLBACK: Check Firestore Profile (as requested by user hint)
            // If the backend API is failing to return the status (read path broken), 
            // but the user is registered (write path worked), the roomId might be in their profile doc.
            if (authUser?.uid) {
                try {
                    // 1. Check Auth Profile
                    const docSnap = await getDoc(doc(db, "auth", authUser.uid));
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        const firestoreRoomId = userData.roomId || userData.delegateGroupId || userData.groupId || userData.group_id;

                        if (firestoreRoomId && firestoreRoomId !== targetRoomId) {
                            const recovered = await verifyAndOpenRoom(firestoreRoomId);
                            if (recovered) return;
                        }
                    }

                    // 2. Check 'delegates' collection (as explicitly requested/shown by user)
                    // The user said "whether it is single or grouped", so we look for a doc with their email.
                    // This doc should contain the roomId if they are in a group.
                    if (authUser.email) {
                        const delegatesRef = collection(db, "delegates");
                        const q = query(delegatesRef, where("email", "==", authUser.email));
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            // detailed check of the first matching doc
                            const delegateDoc = querySnapshot.docs[0].data();
                            // Check for direct room ID fields
                            const foundId = delegateDoc.roomId || delegateDoc.groupId || delegateDoc.delegateGroupId || delegateDoc.room_id || delegateDoc.code;

                            if (foundId && foundId !== targetRoomId) {
                                const recovered = await verifyAndOpenRoom(foundId);
                                if (recovered) return;
                            }

                            // Edge Case: If the doc itself IS the room (e.g. if they are owner)
                            // The doc ID might be the roomId? Unlikely if we queried by email, unless email is a field in the room doc.
                            // But usually registration docs have a pointer to the room.
                        }
                    }

                } catch (fsErr) {
                    console.error("Firestore check failed", fsErr);
                }
            }

            // Real absence confirmed
            clearRoomState();
            return;
        }

        setStatus({
            isOwner: Boolean(data.isOwner),
            isMember: Boolean(data.isMember),
            roomId,
        });

        if (roomId && authUser?.uid) {
            writeCachedRoom({
                uid: authUser.uid,
                roomId,
                role: data.isOwner ? "owner" : "member",
            });
        } else {
            clearCachedRoom();
        }

        if (roomId && roomId === pendingRoomRef.current.roomId) {
            clearPendingRoom();
        }

        if (roomId) {
            const ok = await fetchRoomDetails(roomId);
            if (!ok) return;
        } else {
            setRoom(null);
        }
    };

    // While in a room, poll status so members are updated when owner deletes the room.
    useEffect(() => {
        if (!authUser) return;
        if (!status.roomId) return;

        const id = setInterval(() => {
            refreshStatus().catch(() => {
                // ignore transient errors
            });
        }, 8000);

        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, status.roomId]);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            setAuthUser(user || null);
            setUserReady(true);

            // Hydrate from cache immediately so a refresh/login doesn't flash the create/join forms.
            if (user?.uid) {
                const cached = readCachedRoom();
                if (cached?.uid === user.uid && cached?.roomId) {
                    setStatus({
                        isOwner: cached.role === "owner",
                        isMember: cached.role === "member",
                        roomId: cached.roomId,
                    });
                    markPendingRoom(cached.roomId);
                }
            }

            if (user?.displayName || user?.email) {
                const displayName =
                    user.displayName || (user.email ? user.email.split("@")[0] : "");
                setOwnerForm((prev) => ({ ...prev, name: prev.name || displayName }));
                setMemberForm((prev) => ({ ...prev, name: prev.name || displayName }));
            }
        });
        return () => unsub();
    }, []);

    const refreshSelfDelegateStatus = async () => {
        if (!authUser) {
            setSelfRegistered(false);
            return;
        }

        setCheckingSelfStatus(true);
        try {
            const token = await authUser.getIdToken();
            const resp = await fetch(`${BASE_API_URL}/delegate/status/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!resp.ok) {
                setSelfRegistered(false);
                return;
            }

            const data = await resp.json().catch(() => ({}));
            const statusVal = String(data?.status || "").toLowerCase();
            const registered = ["success", "paid", "confirmed"].includes(statusVal);
            setSelfRegistered(registered);
        } catch (err) {
            console.error(err);
            setSelfRegistered(false);
        } finally {
            setCheckingSelfStatus(false);
        }
    };

    useEffect(() => {
        if (!canCreateOrJoin) return;
        if (activeMode === "owner") {
            const empty = !ownerForm.name.trim() && !String(ownerForm.phone).trim() && !ownerForm.college.trim();
            if (empty) setActiveMode(null);
        }
        if (activeMode === "member") {
            const empty =
                !memberForm.name.trim() &&
                !String(memberForm.phone).trim() &&
                !memberForm.college.trim() &&
                !String(memberForm.roomId).trim();
            if (empty) setActiveMode(null);
        }
    }, [activeMode, ownerForm, memberForm, canCreateOrJoin]);

    useEffect(() => {
        const run = async () => {
            if (!userReady) return;

            if (!authUser) {
                setStatus({ isOwner: false, isMember: false, roomId: "" });
                setRoom(null);
                setCheckingStatus(false);
                setSelfRegistered(false);
                setNotice("");
                return;
            }

            setCheckingStatus(true);
            try {
                await refreshSelfDelegateStatus();
                await refreshStatus();
            } catch (err) {
                console.error(err);
            } finally {
                setCheckingStatus(false);
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userReady, authUser]);

    useEffect(() => {
        if (status.isOwner) setSelectedMode("owner");
        else if (status.isMember) setSelectedMode("member");
    }, [status.isOwner, status.isMember]);

    const onOwnerChange = (e) => {
        if (activeMode !== "owner") {
            setActiveMode("owner");
            setMemberForm((prev) => ({ ...prev, name: "", phone: "", college: "", roomId: "" }));
        }
        setOwnerForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onMemberChange = (e) => {
        if (activeMode !== "member") {
            setActiveMode("member");
            setOwnerForm((prev) => ({ ...prev, name: "", phone: "", college: "" }));
        }

        if (e.target.name === "roomId") {
            const raw = String(e.target.value || "");
            const sanitized = raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 15);
            setMemberForm((prev) => ({ ...prev, roomId: sanitized }));
            return;
        }

        setMemberForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRoomIdPaste = (e) => {
        const text = String(e.clipboardData?.getData("text") || "");
        const sanitized = text.replace(/[^A-Za-z0-9]/g, "").slice(0, 15);
        e.preventDefault();
        setActiveMode("member");
        setOwnerForm((prev) => ({ ...prev, name: "", phone: "", college: "" }));
        setMemberForm((prev) => ({ ...prev, roomId: sanitized }));
    };

    const validateBasics = (payload) => {
        if (!payload.name.trim()) {
            popup.error("Please enter your name.");
            return false;
        }
        if (String(payload.phone).trim().length < 10) {
            popup.error("Please enter a valid phone number (at least 10 digits).");
            return false;
        }
        if (!payload.college.trim()) {
            popup.error("Please enter your college / institute.");
            return false;
        }
        return true;
    };

    const handleCreateRoom = async () => {
        if (!authUser) {
            popup.error("Please login first.");
            navigate("/login");
            return;
        }
        if (!canCreateOrJoin) {
            popup.error("You are already in a group. Please leave first.");
            return;
        }
        if (selfRegistered) {
            popup.error("You are already registered as an individual delegate.");
            return;
        }
        setApiError("");
        const payload = {
            name: String(ownerForm.name).trim(),
            phone: String(ownerForm.phone).trim(),
            college: String(ownerForm.college).trim(),
        };
        if (!validateBasics(payload)) return;

        setLoading(true);
        try {
            const headers = await getAuthHeaders({ json: true });
            const resp = await fetch(`${BASE_API_URL}/delegate/create`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: payload.name,
                    phone: payload.phone,
                    college: payload.college,
                }),
            });

            const data = await resp.json().catch(() => ({}));
            if (!resp.ok) {
                const message = data.message || "Failed to create room";

                if (resp.status === 409 || resp.status === 400 || message.toLowerCase().includes("already a member") || message.toLowerCase().includes("already in a group")) {
                    // Force refresh to trigger self-healing
                    setApiError("You are already in a group. restoring session...");
                    await refreshStatus();
                    return;
                }

                setApiError(message);
                popup.error(message);
                return;
            }

            const roomId = data.roomId || data?.roomId || data?.room?.roomId || data?.data?.roomId || "";
            if (!roomId) {
                const message = "Room created but Room ID was not returned by the server.";
                setApiError(message);
                popup.error(message);
                return;
            }

            markPendingRoom(roomId);

            if (authUser?.uid) {
                writeCachedRoom({ uid: authUser.uid, roomId, role: "owner" });
            }

            // Optimistic update so the UI shows something immediately
            setStatus({ isOwner: true, isMember: false, roomId });
            setMemberForm((prev) => ({ ...prev, roomId }));

            try {
                await fetchRoomDetails(roomId);
            } catch (err) {
                console.error(err);
            }

            // Then reconcile with server truth
            // Delay slightly to avoid immediately hitting a 404 from the status endpoint
            setTimeout(() => {
                refreshStatus().catch((err) => console.error(err));
            }, 900);
        } catch (err) {
            console.error(err);
            const message = "Failed to create room. Please try again.";
            setApiError(message);
            popup.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!authUser) {
            popup.error("Please login first.");
            navigate("/login");
            return;
        }
        if (!canCreateOrJoin) {
            popup.error("You are already in a group. Please leave first.");
            return;
        }
        if (selfRegistered) {
            popup.error("You are already registered as an individual delegate.");
            return;
        }
        setApiError("");
        const payload = {
            name: String(memberForm.name).trim(),
            phone: String(memberForm.phone).trim(),
            college: String(memberForm.college).trim(),
            roomId: String(memberForm.roomId).trim(),
        };
        if (!validateBasics(payload)) return;
        if (!payload.roomId) {
            popup.error("Please enter a Room ID.");
            return;
        }
        if (!/^[A-Za-z0-9]{15}$/.test(payload.roomId)) {
            popup.error("Room ID must be exactly 15 letters/digits.");
            return;
        }

        setLoading(true);
        try {
            const headers = await getAuthHeaders({ json: true });
            const resp = await fetch(`${BASE_API_URL}/delegate/join`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: payload.name,
                    phone: payload.phone,
                    college: payload.college,
                    roomId: payload.roomId,
                }),
            });

            const data = await resp.json().catch(() => ({}));
            if (!resp.ok) {
                const message = data.message || "Failed to join room";

                if (resp.status === 409 || resp.status === 400 || message.toLowerCase().includes("already a member") || message.toLowerCase().includes("already in a group")) {
                    // Force refresh with the typed Room ID to trigger self-healing
                    setApiError("You are already in a group. restoring session...");
                    const recovered = await verifyAndOpenRoom(payload.roomId); // Try the ID they typed!
                    if (recovered) return;

                    // Fallback to generic refresh if typed ID failed (maybe they typed a different one?)
                    await refreshStatus();
                    return;
                }

                setApiError(message);
                popup.error(message);
                return;
            }

            const roomId = payload.roomId || data.roomId || data?.room?.roomId || "";
            if (roomId) markPendingRoom(roomId);
            if (roomId && authUser?.uid) {
                writeCachedRoom({ uid: authUser.uid, roomId, role: "member" });
            }
            setStatus({ isOwner: false, isMember: true, roomId });
            try {
                await fetchRoomDetails(roomId);
            } catch (err) {
                console.error(err);
            }
            setTimeout(() => {
                refreshStatus().catch((err) => console.error(err));
            }, 900);
        } catch (err) {
            console.error(err);
            const message = "Failed to join room. Please try again.";
            setApiError(message);
            popup.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveRoom = async () => {
        if (!authUser) return;
        setLoading(true);
        try {
            const headers = await getAuthHeaders({ json: true });
            const resp = await fetch(`${BASE_API_URL}/delegate/leave`, {
                method: "DELETE",
                headers,
                body: JSON.stringify({ roomId: status.roomId || "" }),
            });

            const data = await resp.json().catch(() => ({}));
            if (!resp.ok) {
                popup.error(data.message || "Failed to leave room");
                return;
            }

            // Immediately reflect updated state without manual refresh.
            clearCachedRoom();
            clearPendingRoom();
            setApiError("");
            setStatus({ isOwner: false, isMember: false, roomId: "" });
            setRoom(null);

            await refreshStatusWithRetry();
        } catch (err) {
            console.error(err);
            popup.error("Failed to leave room. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async () => {
        if (!authUser) return;
        if (!confirm("Delete this room? Members will be removed.")) return;

        setLoading(true);
        try {
            const headers = await getAuthHeaders({ json: true });
            const resp = await fetch(`${BASE_API_URL}/delegate/delete`, {
                method: "DELETE",
                headers,
                body: JSON.stringify({ roomId: status.roomId || "" }),
            });

            const data = await resp.json().catch(() => ({}));
            if (!resp.ok) {
                popup.error(data.message || "Failed to delete room");
                return;
            }

            // Immediately reflect updated state without manual refresh.
            clearCachedRoom();
            clearPendingRoom();
            setApiError("");
            setStatus({ isOwner: false, isMember: false, roomId: "" });
            setRoom(null);

            await refreshStatusWithRetry();
        } catch (err) {
            console.error(err);
            popup.error("Failed to delete room. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async () => {
        if (!authUser) {
            popup.error("Please login first.");
            navigate("/login");
            return;
        }

        if (!status.isOwner || !status.roomId) {
            popup.error("Only the room owner can initiate payment.");
            return;
        }

        // Try to open in a new tab. If blocked, fall back to same-tab redirect.
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
            popup.info("Popup blocked in your browser. Continuing to payment in this tab…");
        }

        setLoading(true);
        setApiError("");
        try {
            const headers = await getAuthHeaders({ json: true });
            const resp = await fetch(`${BASE_API_URL}/delegate/register/group`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    roomId: status.roomId,
                    callbackUrl: window.location.href,
                }),
            });

            const data = await resp.json().catch(() => ({}));
            if (!resp.ok) {
                const message = data.message || "Failed to start payment. Please try again.";
                setApiError(message);
                popup.error(message);
                closePaymentTab();
                return;
            }

            const statusVal = String(data?.status || "").toLowerCase();
            const isConfirmed = ["success", "paid", "confirmed"].includes(statusVal);

            if (isConfirmed) {
                popup.success("Group delegate registration confirmed.");
                await refreshSelfDelegateStatus();
                await refreshStatusWithRetry();
                closePaymentTab();
                return;
            }

            const paymentUrl = data.paymentUrl || data.url || "";
            if (paymentUrl) {
                if (willUseNewTab) {
                    try {
                        if (paymentTab && !paymentTab.closed) {
                            paymentTab.location.href = paymentUrl;
                            return;
                        }
                    } catch {
                        closePaymentTab();
                    }
                }

                closePaymentTab();
                window.location.href = paymentUrl;
                return;
            }

            closePaymentTab();
            popup.error("Payment link not received. Please try again.");
        } catch (err) {
            console.error(err);
            closePaymentTab();
            popup.error("Failed to start payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyRoomId = async () => {
        if (!status.roomId) return;
        try {
            await navigator.clipboard.writeText(status.roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            popup.error("Copy failed. Please copy manually.");
        }
    };

    const shareRoomId = async () => {
        if (!status.roomId) return;
        const shareText = `Join my Technika delegate room: ${status.roomId}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Technika Delegate Room",
                    text: shareText,
                });
            } catch {
                // ignored
            }
        } else {
            await copyRoomId();
        }
    };

    const refreshRoom = async () => {
        if (!status.roomId) return;
        setLoading(true);
        try {
            await fetchRoomDetails(status.roomId);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const refreshStatusWithRetry = async ({ attempts = 4, delayMs = 700 } = {}) => {
        for (let i = 0; i < attempts; i++) {
            try {
                await refreshStatus();
                return;
            } catch (err) {
                console.error(err);
                if (i < attempts - 1) {
                    await new Promise((r) => setTimeout(r, delayMs));
                }
            }
        }
    };

    const MemberListPanel = (
        <div className="relative h-full overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-6 backdrop-blur-lg">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.18),_transparent_65%)]" />
            <div className="relative space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                            Room Members
                        </div>
                        <div className="mt-2 font-mono text-xs text-white/60">
                            Room ID: <span className="text-white">{status.roomId || "—"}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={refreshRoom}
                        className={`rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/20 ${loading ? "pointer-events-none opacity-60" : ""}`}
                    >
                        Refresh
                    </button>
                </div>

                {room?.owner && (
                    <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                        <div className="text-xs uppercase tracking-[0.3em] text-white/50 mb-1">Owner</div>
                        <div className="text-white font-medium">{room.owner.name}</div>
                        <div className="text-xs text-white/60 break-all">{room.owner.email}</div>
                    </div>
                )}

                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    Joined Members
                </div>
                {Array.isArray(room?.users) && room.users.length > 0 ? (
                    <div className="grid gap-3">
                        {room.users.map((u, idx) => (
                            <div key={idx} className="rounded-2xl border border-white/10 bg-black/50 p-4">
                                <div className="text-white font-medium">{u.name}</div>
                                <div className="text-xs text-white/60 break-all">{u.email}</div>
                                <div className="mt-1 text-xs text-white/50">{u.phone} • {u.college}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-white/60 italic">No members joined yet.</div>
                )}

            </div>
        </div>
    );

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#15000d] to-black px-6 pb-24 pt-32 text-white">

            {/* Background Decorative Elements */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-8 left-16 h-72 w-72 rounded-full bg-[#ff0045]/12 blur-[140px]" />
                <div className="absolute bottom-14 right-20 h-72 w-72 rounded-full bg-[#3200ff]/12 blur-[150px]" />
                <div className="absolute top-[18%] right-[12%] text-8xl font-black opacity-[0.06] select-none">✦</div>
                <div className="absolute bottom-[18%] left-[15%] text-7xl font-black opacity-[0.05] select-none">*</div>
            </div>

            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/12 bg-black/55 p-6 md:p-10 shadow-[0_45px_140px_rgba(255,0,48,0.25)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.2),_transparent_65%)]" />

                <div className="relative mb-8 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/delegate')}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg text-white transition hover:bg-white/20"
                        aria-label="Back to delegate overview"
                    >
                        ←
                    </button>
                    <div>
                        <h2 className="text-3xl font-semibold tracking-[0.25em] text-white drop-shadow-[0_0_18px_rgba(255,0,48,0.55)] md:text-4xl">
                            Group Delegate Registration
                        </h2>
                        <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-white/60">
                            organise & manage your team in one place
                        </p>
                    </div>
                </div>

                {(!authUser && userReady) && (
                    <div className="relative rounded-3xl border border-white/12 bg-white/5 p-4 backdrop-blur-lg">
                        <div className="text-sm text-white/70">
                            Login required to create/join a room.
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="ml-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/20"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}

                {(authUser && checkingStatus) && (
                    <div className="flex items-center justify-center py-14">
                        <Loader2 className="h-7 w-7 animate-spin text-white/70" />
                    </div>
                )}

                {(userReady && authUser && !checkingStatus) && (
                    <div className="relative space-y-8">
                        {notice && (
                            <div className="rounded-2xl border border-white/12 bg-white/5 p-4 text-sm text-white/80 backdrop-blur-lg">
                                <span className="font-semibold uppercase tracking-[0.25em] text-white/60">Notice:</span>{" "}
                                {notice}
                            </div>
                        )}

                        {(checkingSelfStatus || groupBlockedBySelf) && (
                            <div className="rounded-2xl border border-white/12 bg-white/5 p-4 text-sm text-white/80 backdrop-blur-lg">
                                {checkingSelfStatus ? (
                                    <span className="uppercase tracking-[0.25em] text-white/60">Checking registration...</span>
                                ) : (
                                    <>
                                        <span className="font-semibold uppercase tracking-[0.25em] text-white/60">Notice:</span>{" "}
                                        You are already registered as an individual delegate.
                                    </>
                                )}
                            </div>
                        )}

                        {apiError && (
                            <div className="rounded-2xl border border-white/12 bg-white/5 p-4 text-sm text-white/80 backdrop-blur-lg">
                                <span className="font-semibold uppercase tracking-[0.25em] text-white/60">Error:</span>{" "}
                                {apiError}
                            </div>
                        )}

                        <div
                            role="radiogroup"
                            aria-label="Select registration mode"
                            className="grid gap-3 sm:grid-cols-2"
                        >
                            <button
                                type="button"
                                role="radio"
                                aria-checked={selectedMode === "owner"}
                                onClick={() => {
                                    if (lockedMode && lockedMode !== "owner") return;
                                    if (groupBlockedBySelf) return;
                                    setSelectedMode("owner");
                                }}
                                disabled={Boolean(groupBlockedBySelf) || Boolean(lockedMode && lockedMode !== "owner")}
                                aria-disabled={Boolean(groupBlockedBySelf) || Boolean(lockedMode && lockedMode !== "owner")}
                                className={
                                    "rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] transition " +
                                    ((groupBlockedBySelf || (lockedMode && lockedMode !== "owner")) ? " opacity-50 pointer-events-none " : " ") +
                                    (selectedMode === "owner"
                                        ? "border-white/30 bg-white/15 text-white"
                                        : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10")
                                }
                            >
                                Create Room (Owner)
                            </button>
                            <button
                                type="button"
                                role="radio"
                                aria-checked={selectedMode === "member"}
                                onClick={() => {
                                    if (lockedMode && lockedMode !== "member") return;
                                    if (groupBlockedBySelf) return;
                                    setSelectedMode("member");
                                }}
                                disabled={Boolean(groupBlockedBySelf) || Boolean(lockedMode && lockedMode !== "member")}
                                aria-disabled={Boolean(groupBlockedBySelf) || Boolean(lockedMode && lockedMode !== "member")}
                                className={
                                    "rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] transition " +
                                    ((groupBlockedBySelf || (lockedMode && lockedMode !== "member")) ? " opacity-50 pointer-events-none " : " ") +
                                    (selectedMode === "member"
                                        ? "border-white/30 bg-white/15 text-white"
                                        : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10")
                                }
                            >
                                Join Room (Member)
                            </button>
                        </div>

                        <div className={(status.roomId ? "grid gap-6 md:grid-cols-2" : "grid gap-6")}>
                            {/* OWNER CARD */}
                            {selectedMode === "owner" && (
                                <div className={ownerCardDisabled ? "blur-sm opacity-50 pointer-events-none" : ""}>
                                    <FlipCard
                                        flipped={flipOwnerCard}
                                        minHeightClassName="min-h-[480px]"
                                        front={
                                            <div className="relative h-full overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-6 backdrop-blur-lg">
                                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.18),_transparent_60%)]" />
                                                <div className="relative space-y-4">
                                                    <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                                                        Create Room (Owner)
                                                    </div>

                                                    {status.isOwner && status.roomId ? (
                                                        <>
                                                            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                                                                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Room ID</div>
                                                                <div className="mt-2 font-mono text-white text-lg break-all">{status.roomId}</div>
                                                            </div>

                                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                                <button
                                                                    type="button"
                                                                    onClick={copyRoomId}
                                                                    className="w-full rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white/90"
                                                                >
                                                                    {copied ? "Copied" : "Copy Room ID"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={shareRoomId}
                                                                    className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/20"
                                                                >
                                                                    Share
                                                                </button>
                                                            </div>

                                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                                <button
                                                                    type="button"
                                                                    disabled={loading}
                                                                    onClick={handlePay}
                                                                    className={`w-full rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white/90 ${loading ? "pointer-events-none opacity-60" : ""}`}
                                                                >
                                                                    Pay
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    disabled={loading}
                                                                    onClick={handleDeleteRoom}
                                                                    className={`w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/20 ${loading ? "pointer-events-none opacity-60" : ""}`}
                                                                >
                                                                    Delete Room
                                                                </button>
                                                            </div>

                                                            <div className="text-xs text-white/50">
                                                                Member panel shows the live room list.
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="grid gap-3">
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={ownerForm.name}
                                                                    onChange={onOwnerChange}
                                                                    placeholder="Your name"
                                                                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40"
                                                                />
                                                                <input
                                                                    type="tel"
                                                                    name="phone"
                                                                    value={ownerForm.phone}
                                                                    onChange={onOwnerChange}
                                                                    placeholder="Phone"
                                                                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="college"
                                                                    value={ownerForm.college}
                                                                    onChange={onOwnerChange}
                                                                    placeholder="College / Institute"
                                                                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                disabled={groupBlockedBySelf || loading || !authUser}
                                                                onClick={handleCreateRoom}
                                                                className={`w-full rounded-full bg-white py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/90 ${loading ? "pointer-events-none opacity-60" : ""}`}
                                                            >
                                                                {loading ? "Working..." : "Create Room"}
                                                            </button>
                                                            <div className="text-xs text-white/50">
                                                                Filling this form will blur and clear the member form.
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        }
                                        back={MemberListPanel}
                                    />
                                </div>
                            )}

                            {selectedMode === "owner" && Boolean(status.roomId) && (
                                <div className="hidden md:block">
                                    {MemberListPanel}
                                </div>
                            )}

                            {/* MEMBER CARD */}
                            {selectedMode === "member" && (
                                <div className={memberCardDisabled ? "blur-sm opacity-50 pointer-events-none" : ""}>
                                    <FlipCard
                                        flipped={flipMemberCard}
                                        minHeightClassName="min-h-[480px]"
                                        front={
                                            <div className="relative h-full overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-6 backdrop-blur-lg">
                                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(70,0,255,0.18),_transparent_60%)]" />
                                                <div className="relative space-y-4">
                                                    <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                                                        Join Room (Member)
                                                    </div>

                                                    {status.isMember && status.roomId ? (
                                                        <>
                                                            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                                                                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Room ID</div>
                                                                <div className="mt-2 font-mono text-white text-lg break-all">{status.roomId}</div>
                                                            </div>

                                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                                <button
                                                                    type="button"
                                                                    onClick={copyRoomId}
                                                                    className="w-full rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white/90"
                                                                >
                                                                    {copied ? "Copied" : "Copy Room ID"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={shareRoomId}
                                                                    className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/20"
                                                                >
                                                                    Share
                                                                </button>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                disabled={loading}
                                                                onClick={handleLeaveRoom}
                                                                className={`w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/20 ${loading ? "pointer-events-none opacity-60" : ""}`}
                                                            >
                                                                Leave Room
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="grid gap-3">
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={memberForm.name}
                                                                    onChange={onMemberChange}
                                                                    placeholder="Your name"
                                                                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40"
                                                                />
                                                                <input
                                                                    type="tel"
                                                                    name="phone"
                                                                    value={memberForm.phone}
                                                                    onChange={onMemberChange}
                                                                    placeholder="Phone"
                                                                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="college"
                                                                    value={memberForm.college}
                                                                    onChange={onMemberChange}
                                                                    placeholder="College / Institute"
                                                                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="roomId"
                                                                    value={memberForm.roomId}
                                                                    onChange={onMemberChange}
                                                                    onPaste={handleRoomIdPaste}
                                                                    placeholder="Room ID"
                                                                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                disabled={groupBlockedBySelf || loading || !authUser}
                                                                onClick={handleJoinRoom}
                                                                className={`w-full rounded-full bg-white py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/90 ${loading ? "pointer-events-none opacity-60" : ""}`}
                                                            >
                                                                {loading ? "Working..." : "Join Room"}
                                                            </button>
                                                            <div className="text-xs text-white/50">
                                                                Filling this form will blur and clear the owner form.
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        }
                                        back={MemberListPanel}
                                    />
                                </div>
                            )}

                            {selectedMode === "member" && Boolean(status.roomId) && (
                                <div className="hidden md:block">
                                    {MemberListPanel}
                                </div>
                            )}
                        </div>

                        {Boolean(status.roomId) && (
                            <div className="md:hidden">
                                {MemberListPanel}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="h-12"></div>
        </div>
    );
};

export default DelegateGroupRegistration;
