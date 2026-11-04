import React, { useRef, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { BroadcastRetentionResponse } from "../../types/common.types";
import { broadcastRetention } from "../../api/xhr";
import toast from "react-hot-toast";


interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: 14,
    color: "var(--text-primary)",
    backgroundColor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "var(--border, rgba(255,255,255,0.12))" },
    "&:hover fieldset": { borderColor: "primary.main" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FFD700)" },
  },
  "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-gold, #FFD700)" },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.35)",
    opacity: 1,
  },
};

const prettySize = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export default function PushNotificationModal({
  isOpen,
  onClose,
}: PushNotificationModalProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [audience, setAudience] = useState<"rider" | "driver">("rider");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BroadcastRetentionResponse | null>(null);

  const reset = () => {
    setFile(null);
    setTitle("");
    setMessage("");
    setAudience("rider");
    setLoading(false);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const pickFile = (f?: File | null) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Please upload an .xlsx file");
      return;
    }
    setFile(f);
  };

  const canSend = !!file && title.trim() !== "" && message.trim() !== "" && !loading;

  const handleSend = async () => {
    if (!file) {
      toast.error("Upload an .xlsx file first");
      return;
    }
    if (!title.trim() || !message.trim()) {
      toast.error("Add a title and a message");
      return;
    }
    setLoading(true);
    try {
      const res = await broadcastRetention(file, title.trim(), message.trim(), audience);
      setResult(res);
      const skipped = res.unknown_ids?.length ?? 0;
      toast.success(
        `Push queued to ${res.notified} ${audience}${res.notified === 1 ? "" : "s"}` +
          (skipped ? ` · ${skipped} unknown ID${skipped === 1 ? "" : "s"} skipped` : ""),
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send push notification",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "var(--text-primary, #fff)",
          borderRadius: "18px",
          maxWidth: 500,
          width: "100%",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: 3,
          pt: 3,
          pb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
            Send Push Notification
          </Typography>
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Upload an .xlsx of rider IDs and compose your message
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: "secondary.main" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {result ? (
        /* ---------------- Result view ---------------- */
        <Box sx={{ px: 3, py: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <CheckCircleRoundedIcon sx={{ color: "#50c878", fontSize: 30 }} />
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                {result.queued ? "Broadcast queued" : "Broadcast processed"}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Push queued to {result.notified} {audience}
                {result.notified === 1 ? "" : "s"}.
              </Typography>
            </Box>
          </Box>

          {result.unknown_ids?.length > 0 && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                border: "1px solid var(--border, rgba(255,255,255,0.1))",
                backgroundColor: "rgba(255,255,255,0.015)",
              }}
            >
              <Typography
                sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.5 }}
              >
                {result.unknown_ids.length} unknown ID
                {result.unknown_ids.length === 1 ? "" : "s"} skipped
              </Typography>
              <Typography
                sx={{
                  fontSize: 11.5,
                  color: "var(--text-secondary)",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  maxHeight: 96,
                  overflowY: "auto",
                }}
              >
                {result.unknown_ids.join(", ")}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
            <Button
              onClick={reset}
              fullWidth
              sx={{
                height: 44,
                textTransform: "none",
                fontSize: 13.5,
                fontWeight: 600,
                borderRadius: "10px",
                color: "var(--text-primary)",
                border: "1px solid var(--border, rgba(255,255,255,0.15))",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.3)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                },
              }}
            >
              Send another
            </Button>
            <Button
              onClick={handleClose}
              fullWidth
              sx={{
                height: 44,
                textTransform: "none",
                fontSize: 13.5,
                fontWeight: 700,
                borderRadius: "10px",
                backgroundColor: "var(--accent-gold, #FFD700)",
                color: "#000",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--accent-gold, #FFD700)",
                  boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
                },
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      ) : (
        /* ---------------- Compose view ---------------- */
        <>
          <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>

         <FormControl size="small" fullWidth>
              <InputLabel
                id="audience-profile-label"
                sx={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  "&.Mui-focused": {
                    color: "#FFBE18",
                  },
                }}
              >
                Audience Profile
              </InputLabel>

              <Select
                labelId="audience-profile-label"
                value={audience}
                label="Audience Profile"
                onChange={(e) => setAudience(e.target.value as "rider" | "driver")}
                sx={{
                  borderRadius: 1,
                  backgroundColor: "var(--bg-secondary, #141721)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  minHeight: 44,

                  "& .MuiSelect-select": {
                    py: 1.25,
                  },

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--border)",
                  },

                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--accent-gold-dim, rgba(255,215,0,0.25))",
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--accent-gold, #FFD700)",
                    borderWidth: 1,
                  },

                  "& .MuiSelect-icon": {
                    color: "var(--text-muted)",
                  },
                }}
               MenuProps={{
                  slotProps: {
                    paper: {
                      sx: {
                        mt: 0.75,
                        backgroundColor: "var(--bg-secondary, #141721)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: 2,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",

                        "& .MuiMenuItem-root": {
                          fontSize: 14,
                          minHeight: 40,
                          borderRadius: 1,
                          mx: 0.75,
                          my: 0.25,

                          "&:hover": {
                            backgroundColor: "rgba(255,190,24,0.07)",
                          },

                          "&.Mui-selected": {
                            backgroundColor: "rgba(255,190,24,0.12)",
                            color: "var(--text-primary)",
                          },

                          "&.Mui-selected:hover": {
                            backgroundColor: "rgba(255,190,24,0.18)",
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="rider">Rider </MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
              </Select>
            </FormControl>

            {/* File upload */}
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            {file ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: "12px",
                  border: "1px solid rgba(255,215,0,0.25)",
                  backgroundColor: "rgba(255,215,0,0.06)",
                }}
              >
                <DescriptionRoundedIcon
                  sx={{ color: "var(--accent-gold, #FFD700)" }}
                />
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "var(--text-secondary)" }}
                  >
                    {prettySize(file.size)}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  size="small"
                  sx={{ color: "secondary.main" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box
                onClick={() => fileRef.current?.click()}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  py: 3,
                  borderRadius: "12px",
                  border: "1px dashed var(--border, rgba(255,255,255,0.25))",
                  backgroundColor: "rgba(255,255,255,0.015)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "var(--accent-gold, #FFD700)",
                    backgroundColor: "rgba(255,215,0,0.03)",
                  },
                }}
              >
                <UploadFileRoundedIcon
                  sx={{ color: "var(--text-secondary)", fontSize: 26 }}
                />
                <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                  Click to upload .xlsx
                </Typography>
                <Typography
                  sx={{ fontSize: 12, color: "var(--text-secondary)" }}
                >
                  Must include a user_id column (as in the rider export)
                </Typography>
              </Box>
            )}

            {/* Title */}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. We miss you!"
              size="small"
              fullWidth
              sx={inputSx}
            />

            {/* Message */}
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the notification body…"
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              sx={inputSx}
            />
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

          {/* Actions */}
          <Box sx={{ px: 3, py: 2.5, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <Button
              onClick={handleClose}
              sx={{
                height: 42,
                px: 2,
                textTransform: "none",
                fontSize: 14,
                fontWeight: 500,
                minWidth: 120,
                cursor: "pointer",
                borderRadius: "8px",
                color: "var(--text-primary)",
                border: "1px solid var(--border, rgba(255,255,255,0.15))",
                "&:hover": {
                  color: "var(--accent-gold, #FFD700)",
                  borderColor: "var(--border, rgba(255,255,255,0.3))",
                  backgroundColor: "rgba(255,255,255,0.03)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!canSend}
              startIcon={!loading && <SendRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                height: 42,
                px: 3,
                textTransform: "none",
                fontSize: 14,
                fontWeight: 500,
                borderRadius: "8px",
                minWidth: 150,
                backgroundColor: "var(--accent-gold, #FFD700)",
                color: "#000",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--accent-gold, #FFD700)",
                  boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "var(--accent-gold-dim, rgba(255,215,0,0.25))",
                  color: "rgba(255,255,255,0.4)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: "#000" }} />
              ) : (
                "Send push"
              )}
            </Button>
          </Box>
        </>
      )}
    </Dialog>
  );
}