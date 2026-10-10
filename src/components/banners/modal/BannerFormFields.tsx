import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { BannerPayload, BannerFormErrors, BannerAudience, BannerCtaType } from '../../../types/common.types';
import ImageUploader from './ImageUploader';

export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: 12,
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'var(--accent-gold)' },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--accent-gold)',
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: 12,
    color: 'var(--text-muted)',
    '&.Mui-focused': { color: 'var(--accent-gold)' },
  },
  '& .MuiFormHelperText-root': { fontSize: 12, ml: 0 },
} as const;

export const selectSx = {
  borderRadius: '10px',
  fontSize: 13.5,
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--accent-gold)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--accent-gold)',
    borderWidth: '1px',
  },
  '& .MuiSelect-icon': { color: 'var(--text-muted)' },
} as const;

const switchSx = {
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'var(--accent-gold)',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var(--accent-gold)',
  },
};

interface BannerFormFieldsProps {
  values: BannerPayload;
  errors: BannerFormErrors;
  disabled: boolean;
  smallImagePreview: string;
  largeImagePreview: string;
  set: <K extends keyof BannerPayload>(
    key: K,
    value: BannerPayload[K],
  ) => void;
  onSmallImageChange: (
    file: File | null,
    preview: string,
  ) => void;
  onLargeImageChange: (
    file: File | null,
    preview: string,
  ) => void;
}

export default function BannerFormFields({
  values,
  errors,
  disabled,
  smallImagePreview,
  largeImagePreview,
  set,
  onSmallImageChange,
  onLargeImageChange,
}: BannerFormFieldsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Title"
        placeholder="e.g. Summer Promo 2026"
        value={values.title}
        onChange={(e) => set('title', e.target.value)}
        error={Boolean(errors.title)}
        helperText={errors.title}
        fullWidth
        disabled={disabled}
        sx={fieldSx}
      />

      <TextField
        label="Body / Description"
        placeholder="Banner subtitle or supporting copy (optional)"
        value={values.body}
        onChange={(e) => set('body', e.target.value)}
        fullWidth
        multiline
        rows={2}
        disabled={disabled}
        sx={fieldSx}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
        }}
      >
        <ImageUploader
          label="Image — Small"
          value={smallImagePreview || values.image_small}
          onChange={onSmallImageChange}
        />
        <ImageUploader
          label="Image — Large"
          value={largeImagePreview || values.image_large}
          onChange={onLargeImageChange}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel
            sx={{
              fontSize: 13.5,
              color: 'var(--text-muted)',
              '&.Mui-focused': { color: 'var(--accent-gold)' },
            }}
          >
            Audience
          </InputLabel>
          <Select
            value={values.audience}
            label="Audience"
            onChange={(e) => set('audience', e.target.value as BannerAudience)}
            disabled={disabled}
            sx={selectSx}
          >
            <MenuItem value="all" sx={{ fontSize: 13.5 }}>🌐 All</MenuItem>
            <MenuItem value="rider" sx={{ fontSize: 13.5 }}>🧍 Riders</MenuItem>
            <MenuItem value="driver" sx={{ fontSize: 13.5 }}>🚗 Drivers</MenuItem>
          </Select>
          {errors.audience && (
            <Typography sx={{ fontSize: 11.5, color: 'error.main', mt: 0.5 }}>
              {errors.audience}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="Sort Order"
          type="number"
          value={values.sort_order}
          onChange={(e) => set('sort_order', Number(e.target.value))}
          fullWidth
          disabled={disabled}
          sx={fieldSx}
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          label="Starts At"
          type="datetime-local"
          value={values.starts_at}
          onChange={(e) => set('starts_at', e.target.value)}
          error={Boolean(errors.starts_at)}
          helperText={errors.starts_at}
          fullWidth
          disabled={disabled}
          sx={fieldSx}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Ends At"
          type="datetime-local"
          value={values.ends_at}
          onChange={(e) => set('ends_at', e.target.value)}
          error={Boolean(errors.ends_at)}
          helperText={errors.ends_at}
          fullWidth
          disabled={disabled}
          sx={fieldSx}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={values.is_active}
              onChange={(e) => set('is_active', e.target.checked)}
              disabled={disabled}
              sx={switchSx}
            />
          }
          label={
            <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Active
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.is_clickable}
              onChange={(e) => set('is_clickable', e.target.checked)}
              disabled={disabled}
              sx={switchSx}
            />
          }
          label={
            <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Clickable
            </Typography>
          }
        />
      </Box>

      {values.is_clickable && (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
            Call-to-Action
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel
                sx={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  '&.Mui-focused': { color: 'var(--accent-gold)' },
                }}
              >
                CTA Type
              </InputLabel>
              <Select
                value={values.cta_type}
                label="CTA Type"
                onChange={(e) => set('cta_type', e.target.value as BannerCtaType)}
                disabled={disabled}
                sx={selectSx}
              >
                <MenuItem value="NONE" sx={{ fontSize: 14 }}>None</MenuItem>
                <MenuItem value="URL" sx={{ fontSize: 14 }}>URL</MenuItem>
                <MenuItem value="SCREEN" sx={{ fontSize: 14 }}>Screen</MenuItem>
              </Select>
            </FormControl>

            {values.cta_type !== 'NONE' && (
              <TextField
                label={values.cta_type === 'URL' ? 'URL' : 'Screen'}
                placeholder={values.cta_type === 'URL' ? 'https://...' : 'app://screen'}
                value={values.cta_value}
                onChange={(e) => set('cta_value', e.target.value)}
                error={Boolean(errors.cta_value)}
                helperText={errors.cta_value}
                fullWidth
                disabled={disabled}
                sx={fieldSx}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}