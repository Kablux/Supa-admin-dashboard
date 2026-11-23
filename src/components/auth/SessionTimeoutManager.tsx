import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  LAST_ACTIVITY_KEY,
  SESSION_EXPIRED_EVENT,
  SESSION_START_KEY,
  SESSION_TIMEOUT_MS,
  clearStoredTokens,
} from "../../api/axios";

import { sessionExpired } from "../../redux/slices/Auth";
import type { AppDispatch, RootState } from "../../redux/store";

export default function SessionTimeoutManager() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const expiredRef = useRef(false);
  const lastActivityWriteRef = useRef(0);

  const expireSessionNow = useCallback(
    (reason: string) => {
      if (expiredRef.current) return;
      expiredRef.current = true;

      clearStoredTokens();
      dispatch(sessionExpired());

      toast.error(reason, {
        id: "session-expired-toast",
        duration: 4500,
      });

      navigate("/login", { replace: true });
    },
    [dispatch, navigate]
  );

  // Reset expiration guard when user signs back in
  useEffect(() => {
    if (isAuthenticated) {
      expiredRef.current = false;
    }
  }, [isAuthenticated]);

  // Listen for backend 401 session expiration events
  useEffect(() => {
    const onBackendExpired = () => {
      if (!isAuthenticated && expiredRef.current) return;
      expireSessionNow(
        "Your session has expired due to inactivity. Please sign in again."
      );
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, onBackendExpired);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, onBackendExpired);
    };
  }, [expireSessionNow, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let lastActivity = Number(sessionStorage.getItem(LAST_ACTIVITY_KEY));

    if (!lastActivity || !Number.isFinite(lastActivity)) {
      const previousStart = Number(sessionStorage.getItem(SESSION_START_KEY));
      lastActivity =
        previousStart > 0 && Number.isFinite(previousStart)
          ? previousStart
          : Date.now();
      sessionStorage.setItem(LAST_ACTIVITY_KEY, String(lastActivity));
    }

    const checkSession = () => {
      if (expiredRef.current) return;

      const storedActivity = Number(sessionStorage.getItem(LAST_ACTIVITY_KEY));
      if (storedActivity > 0 && Number.isFinite(storedActivity)) {
        lastActivity = storedActivity;
      }

      const remaining = SESSION_TIMEOUT_MS - (Date.now() - lastActivity);

      if (remaining <= 0) {
        expireSessionNow(
          "Your session timed out due to inactivity. Please sign in again."
        );
      }
    };

    checkSession();
    const intervalId = window.setInterval(checkSession, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, expireSessionNow]);

  // Update last activity timestamp on user interaction
  useEffect(() => {
    if (!isAuthenticated) return;

    const recordActivity = () => {
      if (expiredRef.current) return;

      const now = Date.now();
      if (now - lastActivityWriteRef.current < 1000) return;

      lastActivityWriteRef.current = now;
      sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now));
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, recordActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, recordActivity);
      });
    };
  }, [isAuthenticated]);

  return null;
}