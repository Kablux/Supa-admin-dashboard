import React, { useState } from 'react';
import {
  Box, Typography, Avatar, Tabs, Tab, IconButton, Chip, Divider,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreVertIcon        from '@mui/icons-material/MoreVert';
import { messagesData } from '../../data/mockData.js';
import { Message } from '../../types/common.types.js';

interface MessageRowProps {
  msg: Message;
  isLast: boolean;
}

function MessageRow({ msg, isLast }: MessageRowProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          py: 1.1, px: 0.75, borderRadius: '10px',
          cursor: 'pointer', transition: 'background 0.15s',
          '&:hover': { backgroundColor: 'var(--accent-gold-glow)' },
        }}
      >
        {/* Avatar */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            sx={{
              width: 33, height: 33,
              backgroundColor: 'var(--border)',
              border: '1.5px solid var(--border)',
              fontSize: 12, fontWeight: 700,
              color: 'var(--text-secondary)',
            }}
          >
            {msg.avatar}
          </Avatar>
          {!msg.read && (
            <Box
              sx={{
                position: 'absolute', bottom: 0, right: 0,
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: 'var(--accent-gold)',
                border: '1.5px solid var(--bg-card)',
              }}
            />
          )}
        </Box>

        {/* Name + plate */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {msg.name}
          </Typography>
          <Typography
            sx={{
              fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {msg.plate}
          </Typography>
        </Box>

        {/* Complaint + time */}
        <Box sx={{ textAlign: 'right', flexShrink: 0, maxWidth: 110 }}>
          <Typography
            sx={{
              fontSize: 11, color: 'var(--text-secondary)', mb: 0.25,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {msg.complaint}
          </Typography>
          <Typography sx={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {msg.time}
          </Typography>
        </Box>

        <IconButton size="small" sx={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <MoreVertIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
      {!isLast && <Divider sx={{ borderColor: 'var(--border-subtle)', mx: 0.75 }} />}
    </>
  );
}

export default function MessagesPanel() {
  const [tab, setTab] = useState<number>(0);
  const messages = tab === 0 ? messagesData.drivers : messagesData.riders;
  const unread   = messages.filter(m => !m.read).length;

  return (
    <Box
      sx={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        p: 2.25,
        display: 'flex', flexDirection: 'column',
        transition: 'background-color 0.25s ease',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.25 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{  fontWeight: 700, fontSize: 14.5, color: 'var(--text-primary)' }}>
              Messages
            </Typography>
            {unread > 0 && (
              <Chip
                label={unread}
                size="small"
                sx={{
                  height: 18, fontSize: 10, fontWeight: 700,
                  backgroundColor: 'rgba(245,197,24,0.13)',
                  color: 'var(--accent-gold)',
                  border: '1px solid rgba(245,197,24,0.22)',
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            )}
          </Box>
          <Typography sx={{ fontSize: 11, color: 'var(--text-muted)' }}>
            SOS / Complains
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{ color: 'var(--text-muted)', backgroundColor: 'var(--border)', width: 24, height: 24 }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 0.75, minHeight: 30,
          '& .MuiTabs-indicator': { backgroundColor: 'var(--accent-gold)', height: 2 },
          '& .MuiTab-root': {
            minHeight: 30, py: 0.5, px: 1.5,
            fontSize: 12.5, fontWeight: 500, textTransform: 'none',
            color: 'var(--text-muted)',
            '&.Mui-selected': { color: 'var(--accent-gold)', fontWeight: 600 },
          },
        }}
      >
        <Tab label="Drivers" />
        <Tab label="Riders" />
      </Tabs>

      {/* List */}
      <Box sx={{ overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <MessageRow key={msg.id} msg={msg} isLast={i === messages.length - 1} />
        ))}
      </Box>
    </Box>
  );
}
