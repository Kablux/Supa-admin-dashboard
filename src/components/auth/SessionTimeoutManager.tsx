
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

import {
  LAST_ACTIVITY_KEY,
  SESSION_START_KEY,
  SESSION_TIMEOUT_MS,
  SESSION_WARNING_MS,
  clearStoredTokens,
} from "../../api/axios";

import { sessionExpired } from "../../redux/slices/Auth";
import type { AppDispatch, RootState } from "../../redux/store";

const GOLD = "var(--accent-gold, #FFC107)";
const MUTED = "var(--text-muted, #8A92A6)";
const CARD = "var(--bg-card, #11141D)";
const BORDER = "var(--border, rgba(255,255,255,0.09))";

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
};

export default function SessionTimeoutManager() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [showWarning, setShowWarning] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [remainingMs, setRemainingMs] = useState(SESSION_TIMEOUT_MS);

  // Prevent repeated expiration while the expired modal is open.
  const expiredRef = useRef(false);
  const warningDismissedRef = useRef(false);
  // Used to throttle storage updates during mouse movement.
  const lastActivityWriteRef = useRef(0);
  const logoutAfterAcknowledgement = useCallback(() => {
    clearStoredTokens();
    dispatch(sessionExpired());

    setShowWarning(false);
    setShowExpired(false);

    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  // Monitor the deadline and update the countdown.
  useEffect(() => {
    if (!isAuthenticated) {
      setShowWarning(false);
      setShowExpired(false);
      setRemainingMs(SESSION_TIMEOUT_MS);
      expiredRef.current = false;
      return;
    }

    expiredRef.current = false;

    let lastActivity = Number(
      sessionStorage.getItem(LAST_ACTIVITY_KEY)
    );

    // Migrate sessions created before LAST_ACTIVITY_KEY existed.
    if (!lastActivity || !Number.isFinite(lastActivity)) {
      const previousStart = Number(
        sessionStorage.getItem(SESSION_START_KEY)
      );

      lastActivity =
        previousStart > 0 && Number.isFinite(previousStart)
          ? previousStart
          : Date.now();

      sessionStorage.setItem(
        LAST_ACTIVITY_KEY,
        String(lastActivity)
      );
    }

    const checkSession = () => {
      if (expiredRef.current) return;

      const storedActivity = Number(
        sessionStorage.getItem(LAST_ACTIVITY_KEY)
      );

      if (storedActivity > 0 && Number.isFinite(storedActivity)) {
        lastActivity = storedActivity;
      }

      const remaining = SESSION_TIMEOUT_MS - (Date.now() - lastActivity);

      setRemainingMs(Math.max(0, remaining));

      if (remaining <= 0) {
        expiredRef.current = true;
        setShowWarning(false);
        setShowExpired(true);

        // Intentionally do not log out yet.
        // Wait until the user closes or acknowledges the modal.
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
  }, [isAuthenticated]);

  // Reset inactivity time when the user interacts with the app.
  useEffect(() => {
    if (!isAuthenticated || showWarning || showExpired) return;

    const recordActivity = () => {
  if (expiredRef.current || warningDismissedRef.current) {
    return;
  }

  const now = Date.now();

  // Avoid writing to sessionStorage on every mouse movement.
  if (now - lastActivityWriteRef.current < 1000) {
    return;
  }

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
      window.addEventListener(event, recordActivity, {
        passive: true,
      });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, recordActivity);
      });
    };
  }, [isAuthenticated, showWarning, showExpired]);

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
    <>
      {/* Session warning */}
      <Dialog
        open={showWarning && !showExpired}
        onClose={() => {
        }}
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
          sx={{ textAlign: "center", fontWeight: 800 }}
        >
          Your session is about to expire
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center" }}>
          <Typography sx={{ color: "var(--text-secondary)",  }}>
            You have been inactive for a while. Do you need more
            time to continue working?
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

      {/* Expired session */}
      <Dialog
        open={showExpired}
        onClose={logoutAfterAcknowledgement}
        maxWidth="xs"
        fullWidth
        aria-labelledby="session-expired-title"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: CARD,
            color: "#FFFFFF",
            border: `1px solid ${BORDER}`,
            borderRadius: "18px",
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
            <SecurityRoundedIcon sx={{ fontSize: 30 }} />
          </Box>
        </Box>

        <DialogTitle
          id="session-expired-title"
          sx={{
            textAlign: "center",
            color: GOLD,
            fontWeight: 800,
          }}
        >
          Session Timed Out
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center" }}>
          <Typography sx={{ color: "var(--text-secondary)", fontSize:"14px",lineHeight: 1.8 }}>
            Your session has expired due to inactivity. please return to the login page and sign in
            again to continue using the Supa admin dashboard
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={logoutAfterAcknowledgement}
            sx={{
              backgroundColor: GOLD,
              color: "#111111",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "10px",
              py: 1.2,
              "&:hover": { backgroundColor: "#E5AC00" },
            }}
          >
            Return to Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
