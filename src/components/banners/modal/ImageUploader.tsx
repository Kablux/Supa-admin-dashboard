import React, { useRef } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (file: File | null, preview: string) => void;
}

export default function ImageUploader({
  label,
  value,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      onChange(file, reader.result as string);
    };

    reader.readAsDataURL(file);

    // Allows selecting the same file again
    e.target.value = '';
  };

  const handleRemove = () => {
    onChange(null, '');
  };

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 12,
          color: 'var(--text-muted)',
          mb: 0.75,
        }}
      >
        {label}
      </Typography>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        hidden
        onChange={handleFile}
      />

      {value ? (
        <Box
          sx={{
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <img
            src={value}
            alt="preview"
            style={{
              width: '100%',
              height: 100,
              objectFit: 'cover',
              display: 'block',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
            }}
          >
            <Tooltip title="Remove image">
              <IconButton
                size="small"
                onClick={handleRemove}
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(239,83,80,0.8)',
                  },
                }}
              >
                <DeleteOutlinedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            height: 80,
            borderRadius: '10px',
            border: '2px dashed var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            cursor: 'pointer',
            backgroundColor: 'var(--bg-secondary)',
            transition: 'border-color 0.15s',
            '&:hover': {
              borderColor: 'var(--accent-gold)',
            },
          }}
        >
          <ImageOutlinedIcon
            sx={{
              fontSize: 22,
              color: 'var(--text-muted)',
            }}
          />

          <Typography
            sx={{
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            Click to upload
          </Typography>
        </Box>
      )}
    </Box>
  );
}