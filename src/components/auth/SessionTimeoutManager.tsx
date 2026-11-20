import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import {
  LAST_ACTIVITY_KEY,
  SESSION_EXPIRED_EVENT,
  SESSION_START_KEY,
  SESSION_TIMEOUT_MS,
  SESSION_WARNING_MS,
  clearStoredTokens,
} from "../../api/axios";

import { sessionExpired } from "../../redux/slices/Auth";
import type { AppDispatch, RootState } from "../../redux/store";

const GOLD = "var(--accent-gold, #FFC107)";
const CARD = "var(--bg-card, #11141D)";
const BORDER = "var(--border, rgba(255,255,255,0.09))";

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export default function SessionTimeoutManager() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [showWarning, setShowWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(SESSION_TIMEOUT_MS);

  const expiredRef = useRef(false);
  const warningDismissedRef = useRef(false);
  const lastActivityWriteRef = useRef(0);

  // Immediately clear auth state, notify via toast, and redirect to /login
  const expireSessionNow = useCallback(
    (reason?: string) => {
      if (expiredRef.current) return;
      expiredRef.current = true;

      clearStoredTokens();
      dispatch(sessionExpired());
      setShowWarning(false);

      toast.error(
        reason || "Your session expired due to inactivity. Please sign in again.",
        { id: "session-expired-toast" }
      );

      navigate("/login", { replace: true });
    },
    [dispatch, navigate]
  );

  // Reset guard once user logs back in
  useEffect(() => {
    if (isAuthenticated) {
      expiredRef.current = false;
      warningDismissedRef.current = false;
    } else {
      setShowWarning(false);
      setRemainingMs(SESSION_TIMEOUT_MS);
    }
  }, [isAuthenticated]);

  // Listen for backend 401 session expiration events
  useEffect(() => {
    const onBackendExpired = () => {
      if (!isAuthenticated && expiredRef.current) return;
      expireSessionNow("Your session expired. Please sign in again.");
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, onBackendExpired);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, onBackendExpired);
    };
  }, [expireSessionNow, isAuthenticated]);

  // Monitor inactivity deadline and update countdown
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
      setRemainingMs(Math.max(0, remaining));

      if (remaining <= 0) {
        expireSessionNow(
          "Your session timed out due to inactivity. Please sign in again."
        );
        return;
      }

      if (remaining > SESSION_WARNING_MS) {
        warningDismissedRef.current = false;
        setShowWarning(false);
      } else if (!warningDismissedRef.current) {
        setShowWarning(true);
      }
    };

    checkSession();
    const intervalId = window.setInterval(checkSession, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, expireSessionNow]);

  // Reset inactivity timestamp on user interaction
  useEffect(() => {
    if (!isAuthenticated || showWarning) return;

    const recordActivity = () => {
      if (expiredRef.current || warningDismissedRef.current) return;

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
  }, [isAuthenticated, showWarning]);

  const handleContinueSession = () => {
    if (expiredRef.current) return;

    const now = Date.now();
    warningDismissedRef.current = false;
    lastActivityWriteRef.current = now;
    sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now));
    setRemainingMs(SESSION_TIMEOUT_MS);
    setShowWarning(false);
  };

  return (
    <Dialog
      open={isAuthenticated && showWarning}
      onClose={() => {}}
      maxWidth="xs"
      fullWidth
      aria-labelledby="session-warning-title"
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: CARD,
          color: "var(--text-primary)",
          border: `1px solid ${BORDER}`,
          borderRadius: 2,
          padding: { xs: 1, sm: 2 },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
        <Box
          sx={{
            width: 58,
            height: 58,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: GOLD,
            backgroundColor: "rgba(255,193,7,0.12)",
          }}
        >
          <AccessTimeRoundedIcon sx={{ fontSize: 30 }} />
        </Box>
      </Box>

      <DialogTitle
        id="session-warning-title"
        sx={{ textAlign: "center", fontWeight: 700 }}
      >
        Your session is about to expire
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <Typography sx={{ color: "var(--text-secondary)" }}>
          You have been inactive for a while. Do you need more time to continue
          working?
        </Typography>

        <Typography
          sx={{
            color: GOLD,
            fontWeight: 800,
            mt: 2,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatTime(remainingMs)}
        </Typography>

        <Typography sx={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Your session will expire when this timer reaches zero.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          px: 2,
          pb: 2,
          "& > :not(style) ~ :not(style)": { ml: 0 },
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            warningDismissedRef.current = true;
            setShowWarning(false);
          }}
          sx={{
            color: "var(--text-primary)",
            borderColor: BORDER,
            textTransform: "none",
            borderRadius: "8px",
            py: 1.2,
          }}
        >
          No, continue
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={handleContinueSession}
          sx={{
            backgroundColor: GOLD,
            color: "#111111",
            fontWeight: 500,
            textTransform: "none",
            borderRadius: "8px",
            py: 1.2,
            "&:hover": { backgroundColor: "#E5AC00" },
          }}
        >
          Yes, continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}