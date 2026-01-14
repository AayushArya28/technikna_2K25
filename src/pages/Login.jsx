import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { usePopup } from "../context/usePopup.jsx";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Login() {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const popup = usePopup();
  const [signIn, setSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const didShowBitSignupNoticeRef = useRef(false);

  useEffect(() => {
    if (signIn) {
      didShowBitSignupNoticeRef.current = false;
      return;
    }
    if (didShowBitSignupNoticeRef.current) return;

    popup.info(
      "If you're currently a BIT Patna Student then use your college email ID to sign up.",
      { ttlMs: 8000 }
    );
    didShowBitSignupNoticeRef.current = true;
  }, [popup, signIn]);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const normalizedPhone = String(phone || "")
      .replace(/\D/g, "")
      .trim();

    if (!signIn) {
      if (!name.trim()) {
        setError("Please enter your name.");
        setLoading(false);
        return;
      }

      if (!college.trim()) {
        setError("Please enter your college.");
        setLoading(false);
        return;
      }

      if (
        !normalizedPhone ||
        normalizedPhone.length < 10 ||
        normalizedPhone.length > 15
      ) {
        setError("Please enter a valid phone number.");
        setLoading(false);
        return;
      }
    }

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError("Please enter a valid password (min 6 characters).");
      setLoading(false);
      return;
    }

    const key = signIn ? "loginCooldown" : "signupCooldown";
    const lastTime = localStorage.getItem(key);

    if (lastTime) {
      const elapsed = Date.now() - Number(lastTime);

      if (elapsed < 30_000) {
        const remaining = Math.ceil((30_000 - elapsed) / 1000);
        setLoading(false);
        setError(`Please wait ${remaining}s before trying again.`);
        return;
      }

      localStorage.removeItem(key);
    }

    try {
      if (signIn) {
        localStorage.setItem("loginCooldown", Date.now());

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (!userCredential.user.emailVerified) {
          try {
            await sendEmailVerification(userCredential.user);
          } finally {
            await signOut(auth);
          }

          setError(
            "Please verify your email to sign in. We just sent you a verification email (check spam too)."
          );
          return;
        }

        setSuccess("Login successful!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        localStorage.setItem("signupCooldown", Date.now());

        setSuccess("Creating account...");
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // IMMEDIATE ACTION: Handle Verification Email
        // We use the auth.currentUser to be absolutely sure we have the active user instance
        const user = auth.currentUser || userCredential.user;

        setSuccess("Account created! Sending verification email...");
        console.log("Acc created. processing verification for:", user.email);

        try {
          // 1. Force a reload to ensure fresh state (good practice)
          await user.reload();

          // 2. Send the email and AWAIT it
          await sendEmailVerification(user);

          console.log("Verification email command completed successfully.");
          setSuccess("Verification email sent! Saving profile...");
        } catch (emailError) {
          console.error(
            "CRITICAL: Error sending verification email:",
            emailError
          );
          // Don't stop, just warn.
        }

        // 3. Save the user document to Firestore
        try {
          await setDoc(doc(db, "auth", user.uid), {
            name,
            college,
            email,
            phone: normalizedPhone,
            password,
            createdAt: new Date(),
          });
        } catch (docError) {
          console.error("Error saving auth doc:", docError);
        }

        // 4. CRITICAL DELAY: Give the backend/network time to actually dispatch the email
        // before we kill the session with signOut().
        setSuccess("Finalizing registration...");
        await new Promise((resolve) => setTimeout(resolve, 3000));

        await signOut(auth);

        setSuccess(
          "Account created! Please verify your email (we sent you a link), then sign in."
        );
      }
    } catch (err) {
      if (signIn) localStorage.setItem("loginCooldown", Date.now());
      else localStorage.setItem("signupCooldown", Date.now());
      if (err.code === "auth/invalid-credential") {
        setError("Wrong password, try again.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Please enter your email above to reset password.");
      return;
    }

    const lastTime = localStorage.getItem("lastResetRequest");

    if (lastTime) {
      const elapsed = Date.now() - Number(lastTime);

      if (elapsed < 30_000) {
        const remaining = Math.ceil((30_000 - elapsed) / 1000);
        setError(`Please wait ${remaining}s before trying again.`);
        return;
      }
      localStorage.removeItem("lastResetRequest");
    }

    try {
      setSuccess("Generating reset link... Please wait a moment.");

      localStorage.setItem("lastResetRequest", Date.now());
      const q = query(
        collection(db, "auth"),
        where("email", "==", email.trim())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setSuccess("");
        setError("No account found with this email. Create an account first.");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setSuccess(
        "Password reset link sent to your email. Check spam folder if not found"
      );
    } catch (err) {
      console.error("sendPasswordResetEmail error:", err);
      setSuccess("");
      setError(
        err?.message || "Failed to send reset link. Please check your email."
      );
    }
  };

  if (isMobile) {
    return (
      <div
        className="md:hidden mt-[120px] max-w-sm mx-auto bg-[#141414] border border-red-500/40 rounded-2xl p-6 backdrop-blur-xl text-gray-100 flex flex-col"
        style={{ width: "clamp(200px, 90vw, 700px)" }}
      >
        {/* SIGN IN VIEW */}
        {signIn ? (
          <>
            <h1 className="font-bold text-3xl jp-font text-center underline decoration-1 underline-offset-4 tracking-[2px] mb-6">
              SIGN IN
            </h1>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900/60 w-full rounded-md p-3 my-2 border border-white/10"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/60 w-full rounded-md p-3 my-2 border border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>

            <button
              className="text-xs text-gray-300 mt-2 underline"
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </button>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-full mt-6"
            >
              Sign In
            </button>

            <p className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setSignIn(false);
                  setError("");
                  setSuccess("");
                }}
                className="underline text-blue-300"
              >
                Create an account
              </button>
            </p>
          </>
        ) : (
          /* SIGN UP VIEW */
          <>
            <h1 className="font-bold text-3xl jp-font tracking-[2px] underline decoration-1 underline-offset-4 text-center mb-6">
              SIGN UP
            </h1>

            {/* Name */}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-900/60 w-full rounded-md p-3 my-2 border border-white/10"
            />

            {/* College */}
            <input
              type="text"
              placeholder="College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="bg-slate-900/60 w-full rounded-md p-3 my-2 border border-white/10"
            />

            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-900/60 w-full rounded-md p-3 my-2 border border-white/10"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900/60 w-full rounded-md p-3 my-2 border border-white/10"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/60 w-full rounded-md p-3 my-2 border border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-full mt-6"
            >
              Sign Up
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setSignIn(true);
                  setError("");
                  setSuccess("");
                }}
                className="underline text-blue-300"
              >
                Sign In instead
              </button>
            </p>
          </>
        )}

        {/* Error / Success Messages */}
        {error && (
          <p className="text-red-300 text-xs bg-red-900/60 border border-red-500/40 px-3 py-2 rounded w-full my-3">
            {error}
          </p>
        )}
        {success && (
          <p className="text-emerald-300 text-xs bg-emerald-900/60 border border-emerald-500/40 px-3 py-2 rounded w-full my-3">
            {success}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050509] bg-[url('/images/login-samurai-bg.jpg')] bg-cover bg-center bg-fixed px-4 py-10 pt-[100px]">
      {/* changed font to website font*/}
      <div className="relative ks-font w-full max-w-4xl md:max-w-5xl min-h-[420px] sm:min-h-[460px] bg-black/80 border border-red-500/40 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden font-[Montserrat] text-gray-100 backdrop-blur-xl">
        {/* ================= SIGN UP PANEL ================= */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-500 ease-in-out
          ${
            signIn
              ? "opacity-0 pointer-events-none z-[1]"
              : "translate-x-full opacity-100 pointer-events-auto z-[5]"
          }`}
        >
          <form
            className="bg-transparent flex items-center justify-center flex-col px-6 sm:px-[50px] h-full text-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h1 className="text-red-400 font-bold text-lg sm:text-xl mb-2">
              Create Account
            </h1>
            <input
              type="text"
              placeholder="Name"
              className="bg-slate-900/70 border border-white/10 text-gray-100 placeholder-gray-400 font-bold rounded-md py-2.5 sm:py-3 px-3 sm:px-4 my-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="College"
              className="bg-slate-900/70 border border-white/10 text-gray-100 placeholder-gray-400 font-bold rounded-md py-2.5 sm:py-3 px-3 sm:px-4 my-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="bg-slate-900/70 border border-white/10 text-gray-100 placeholder-gray-400 font-bold rounded-md py-2.5 sm:py-3 px-3 sm:px-4 my-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-slate-900/70 border border-white/10 text-gray-100 placeholder-gray-400 font-bold rounded-md py-2.5 sm:py-3 px-3 sm:px-4 my-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/70 border border-white/10 text-gray-100 placeholder-gray-400 font-bold rounded-md py-2.5 sm:py-3 px-3 sm:px-4 my-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold sm:text-xs text-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full border border-red-500/70 text-white bg-red-600/90 text-xs sm:text-sm font-bold py-2.5 sm:py-3 px-10 sm:px-12 uppercase tracking-wider active:scale-95 focus:outline-none hover:bg-red-500 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>
            {error && !signIn && (
              <p className="text-red-300 text-[11px] font-bold sm:text-xs bg-red-900/60 border border-red-500/40 px-3 py-2 rounded w-full my-2 text-left">
                {error}
              </p>
            )}
            {success && !signIn && (
              <p className="text-emerald-300 text-[11px] sm:text-xs bg-emerald-900/60 border border-emerald-500/40 px-3 py-2 rounded w-full my-2 text-left">
                {success}
              </p>
            )}
          </form>
        </div>

        {/* ================= SIGN IN PANEL ================= */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-500 ease-in-out
          ${
            signIn
              ? "opacity-100 pointer-events-auto z-[2]"
              : "translate-x-full opacity-0 pointer-events-none z-0"
          }`}
        >
          <form
            className="bg-transparent flex items-center justify-center flex-col px-6 sm:px-[50px] h-full text-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h1 className="text-red-400 font-bold text-lg sm:text-xl mb-2">
              Sign in
            </h1>
            <input
              type="email"
              placeholder="Email"
              className="bg-slate-900/70 border border-white/10 text-gray-100 placeholder-gray-400 font-bold rounded-md py-2.5 sm:py-3 px-3 sm:px-4 my-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/70 border border-white/10 text-gray-100 placeholder-gray-400 font-bold rounded-md py-2.5 sm:py-3 px-3 sm:px-4 my-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold sm:text-xs text-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button
              className="text-[11px] sm:text-xs text-gray-300 font-semibold hover:text-red-300 my-2"
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full border border-red-500/70 text-white bg-red-600/90 text-xs sm:text-sm font-bold py-2.5 sm:py-3 px-10 sm:px-12 uppercase tracking-wider active:scale-95 focus:outline-none hover:bg-red-500 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Please wait..." : "Sign In"}
            </button>
            {error && signIn && (
              <p className="text-red-300 text-[11px] font-bold sm:text-xs bg-red-900/60 border border-red-500/40 px-3 py-2 rounded w-full my-2 text-left">
                {error}
              </p>
            )}
            {success && signIn && (
              <p className="text-emerald-300 text-[11px] sm:text-xs bg-emerald-900/60 border border-emerald-500/40 px-3 py-2 rounded w-full my-2 text-left">
                {success}
              </p>
            )}
          </form>
        </div>

        {/* ================= OVERLAY (ANIMATION) ================= */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-[100] ${
            !signIn ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`bg-gradient-to-br from-red-800 via-red-600 to-red-900 text-white bg-no-repeat bg-cover bg-left relative left-[-100%] h-full w-[200%] transition-transform duration-500 ease-in-out ${
              !signIn ? "translate-x-1/2" : ""
            }`}
          >
            {/* Left overlay (for sign-in view) */}
            <div
              className={`absolute flex items-center justify-center flex-col px-6 sm:px-10 text-center top-0 h-full w-1/2 transition-transform duration-500 ease-in-out ${
                !signIn ? "translate-x-0" : "-translate-x-1/5"
              }`}
            >
              <h1 className="font-bold text-2xl sm:text-3xl">Welcome Back!</h1>
              <p className="text-xs sm:text-sm font-bold leading-5 tracking-wide my-4 sm:my-6  text-red-100 max-w-xs">
                To keep connected with us please login with your personal info.
              </p>
              <button
                type="button"
                className="rounded-full border border-white/80 bg-transparent text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 px-10 sm:px-12 uppercase tracking-wider active:scale-95 focus:outline-none hover:bg-white/10 cursor-pointer"
                onClick={() => {
                  setSignIn(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Sign In
              </button>
            </div>

            {/* Right overlay (for sign-up view) */}
            <div
              className={`absolute right-0 flex items-center justify-center flex-col px-6 sm:px-10 text-center top-0 h-full w-1/2 transition-transform duration-500 ease-in-out ${
                !signIn ? "translate-x-1/5" : "translate-x-0"
              }`}
            >
              <h1 className="font-bold text-2xl sm:text-3xl">HELP SAMURAI!!</h1>
              <p className="text-xs sm:text-sm font-bold leading-5 tracking-wide my-4 sm:my-6 text-red-100 max-w-xs">
                Enter your personal details and start journey with us.
              </p>
              <button
                type="button"
                className="rounded-full border border-white/80 bg-transparent text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 px-10 sm:px-12 uppercase tracking-wider active:scale-95 focus:outline-none hover:bg-white/10 cursor-pointer"
                onClick={() => {
                  setSignIn(false);
                  setError("");
                  setSuccess("");
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
