import { auth } from "@/firebase/firebaseConfig";
import axios from "axios";
import {
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  User,
  UserCredential,
  AuthError,
} from "firebase/auth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

let inFlight = false;

type UseAppleAuthOptions = {
  preferRedirect?: boolean;
  locale?: string;
  apiRoute?: string;
};

const useAppleAuth = (options: UseAppleAuthOptions = {}) => {
  const {
    preferRedirect = true,
    locale,
    apiRoute = "/api/auth/appleAuth",
  } = options;

  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const provider = useMemo(() => {
    const p = new OAuthProvider("apple.com");
    p.addScope("email");
    p.addScope("name");
    if (locale) p.setCustomParameters({ locale });
    return p;
  }, [locale]);

  const finishSession = useCallback(
    async (user: User) => {
      const idToken = await user.getIdToken();
      if (!idToken) throw new Error("Unable to retrieve authentication token.");

      const payload = {
        accessToken: idToken,
        fcmToken: null,
        referralCode: null,
      };

      // ✅ FIXED: Removed withCredentials for same-origin requests
      // Configure apiUrl
      const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;
      const authUrl = process.env.NEXT_PUBLIC_APPLE_LOGIN_API_URL;

      // Run checks for missing url
      if (!baseUrl || !authUrl) {
        throw new Error("Missing environment variable");
      }

      // Concatenate urls
      const apiUrl = `${baseUrl}${authUrl}`;

      console.log(apiUrl);

      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("Response: " + response);

      const authToken = response.data?.data?.token;
      if (!authToken)
        throw new Error("No authentication token returned from server.");

      localStorage.setItem("authToken", authToken);
      localStorage.setItem("auth_token", authToken);

      // TODO: Unsafe, this might be accessible via XSS attack
      // TODO: Must be improved in the future
      // Store in a cookie
      const token = response.data.data.token;
      const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
      const secure = window.location.protocol === "https:" ? "Secure;" : "";

      document.cookie = `auth-token=${token}; Path=/; Max-Age=${maxAge}; ${secure} SameSite=Lax;`;

      if (response.data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }

      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");
      window.location.href =
        returnTo && returnTo.startsWith("/dashboard") ? returnTo : "/";
    },
    [apiRoute]
  );

  useEffect(() => {
    isMounted.current = true;

    const run = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result?.user) return;

        const t = toast.loading("Completing sign-in…");
        await finishSession(result.user);
        toast.dismiss(t);
      } catch {
        // ignore: no redirect result / transient errors
      }
    };

    run();
    return () => {
      isMounted.current = false;
    };
  }, [finishSession]);

  const signIn = useCallback(async () => {
    if (inFlight) return;
    inFlight = true;

    setLoading(true);
    const loadingToast = toast.loading("Signing you in securely. Please wait…");

    try {
      await setPersistence(auth, browserLocalPersistence);

      if (preferRedirect) {
        toast.dismiss(loadingToast);
        toast.loading("Opening sign-in…");
        await signInWithRedirect(auth, provider);
        return;
      }

      let firebaseResponse: UserCredential;

      try {
        firebaseResponse = await signInWithPopup(auth, provider);
        console.log(firebaseResponse);
      } catch (e) {
        const message = e instanceof Error ? e.message.toLowerCase() : "";
        const code = (e as AuthError)?.code || "";

        if (
          code === "auth/popup-blocked" ||
          code === "auth/popup-closed-by-user" ||
          message.includes("popup-blocked") ||
          message.includes("popup-closed-by-user")
        ) {
          toast.dismiss(loadingToast);
          toast.loading("Opening sign-in…");
          await signInWithRedirect(auth, provider);
          return;
        }

        throw e;
      }

      if (!firebaseResponse.user)
        throw new Error("User authentication failed.");
      await finishSession(firebaseResponse.user);

      toast.dismiss(loadingToast);
      toast.success("You have been signed in successfully.");
    } catch (error) {
      toast.dismiss(loadingToast);

      localStorage.removeItem("authToken");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      console.error(error);

      toast.error("Sign-in was unsuccessful. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
      inFlight = false;
    }
  }, [preferRedirect, provider, finishSession]);

  return { signIn, loading };
};

export default useAppleAuth;
