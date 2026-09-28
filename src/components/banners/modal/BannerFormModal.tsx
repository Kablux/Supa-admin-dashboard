import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { editBanner, addBanner } from '../../../api/xhrHelper';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { clearMutateError } from '../../../redux/slices/Banner';
import { BannerPayload, BannerFormErrors, Banner } from '../../../types/common.types';
import AppButton from '../../common/AppButton';
import BannerFormFields from './BannerFormFields';
import { validateForm } from '../../../utils/bannerHelpers';
import { fetchUploadById, uploadFiles } from '../../../api/xhr';

const EMPTY: BannerPayload = {
  title: '',
  body: '',
  image_small: '',
  image_large: '',
  audience: 'all',
  is_active: true,
  sort_order: 0,
  starts_at: '',
  ends_at: '',
  is_clickable: false,
  cta_type: 'NONE',
  cta_value: '',
};

interface BannerFormModalProps {
  open: boolean;
  banner: Banner | null;
  onClose: () => void;
}

export default function BannerFormModal({
  open,
  banner,
  onClose,
}: BannerFormModalProps) {
  const dispatch = useAppDispatch();
  const { mutateStatus, mutateError } = useAppSelector((s) => s.banners);
  const isEdit = Boolean(banner);
  const isSubmitting = mutateStatus === 'loading';
  const disabled = isSubmitting;

  const [values, setValues] = useState<BannerPayload>(EMPTY);
  const [errors, setErrors] = useState<BannerFormErrors>({});
  const [smallImageFile, setSmallImageFile] = useState<File | null>(null);
  const [largeImageFile, setLargeImageFile] = useState<File | null>(null);
  const [smallImagePreview, setSmallImagePreview] = useState<string>('');
  const [largeImagePreview, setLargeImagePreview] = useState<string>('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;

    setSaved(false);
    setErrors({});
    dispatch(clearMutateError());
    setSmallImageFile(null);
    setLargeImageFile(null);

    setValues(
      banner
        ? {
            ...banner,
            starts_at: banner.starts_at?.slice(0, 16) ?? '',
            ends_at: banner.ends_at?.slice(0, 16) ?? '',
          }
        : EMPTY,
    );

    const loadExistingImages = async () => {
      if (!banner) {
        setSmallImagePreview('');
        setLargeImagePreview('');
        return;
      }
      try {
        const [smallData, largeData] = await Promise.all([
          banner.image_small
            ? fetchUploadById(banner.image_small)
            : Promise.resolve(null),
          banner.image_large
            ? fetchUploadById(banner.image_large)
            : Promise.resolve(null),
        ]);

        setSmallImagePreview(smallData?.file || '');
        setLargeImagePreview(largeData?.file || '');
      } catch (error) {
        console.error('Failed to load banner images', error);
        setSmallImagePreview('');
        setLargeImagePreview('');
      }
    };

    loadExistingImages();
  }, [open, banner, dispatch]);

  const set = <K extends keyof BannerPayload>(
    key: K,
    value: BannerPayload[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof BannerFormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    try {
      const payload: Partial<BannerPayload> = {
        ...values,
        starts_at: new Date(values.starts_at).toISOString(),
        ends_at: new Date(values.ends_at).toISOString(),
        cta_value:
          values.is_clickable && values.cta_type !== 'NONE'
            ? values.cta_value
            : '',
        cta_type: values.is_clickable ? values.cta_type : 'NONE',
      };

      /*
       * Upload newly selected small image explicitly
       */
      if (smallImageFile) {
        const smallUpload = await uploadFiles([smallImageFile]);
        const uploadedSmall = smallUpload.results?.[0];
        if (!uploadedSmall) {
          throw new Error('Small banner image upload failed.');
        }
        payload.image_small = uploadedSmall.id;
      }

      /*
       * Upload newly selected large image explicitly
       */
      if (largeImageFile) {
        const largeUpload = await uploadFiles([largeImageFile]);
        const uploadedLarge = largeUpload.results?.[0];
        if (!uploadedLarge) {
          throw new Error('Large banner image upload failed.');
        }
        payload.image_large = uploadedLarge.id;
      }

      /*
       * Create / update banner
       */
      const result =
        isEdit && banner
          ? await dispatch(
              editBanner({
                id: banner.id,
                payload: payload as BannerPayload,
              }),
            )
          : await dispatch(
              addBanner(payload as BannerPayload),
            );

      const succeeded = isEdit
        ? editBanner.fulfilled.match(result)
        : addBanner.fulfilled.match(result);

      if (succeeded) {
        setSaved(true);
        setTimeout(() => {
          onClose();
        }, 1100);
      }
    } catch (error) {
      console.error('Banner submission failed:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            backgroundImage: 'none',
            maxHeight: '92vh',
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {isEdit ? 'Edit Banner' : 'Create Banner'}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'var(--text-muted)', mt: 0.25 }}>
              {isEdit
                ? 'Update the banner details below.'
                : 'Fill in the details to publish a new app banner.'}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ color: 'var(--text-muted)' }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider sx={{ borderColor: 'var(--border)', mt: 2 }} />

      <form id="banner-form" onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {saved && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: '10px', fontSize: 13 }}>
              Banner {isEdit ? 'updated' : 'created'} successfully!
            </Alert>
          )}
          {mutateError && !saved && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: 13 }}>
              {mutateError}
            </Alert>
          )}

          <BannerFormFields
            values={values}
            errors={errors}
            disabled={disabled || saved}
            smallImagePreview={smallImagePreview}
            largeImagePreview={largeImagePreview}
            set={set}
            onSmallImageChange={(file, preview) => {
              setSmallImageFile(file);
              setSmallImagePreview(preview);
              set('image_small', preview);
            }}
            onLargeImageChange={(file, preview) => {
              setLargeImageFile(file);
              setLargeImagePreview(preview);
              set('image_large', preview);
            }}
          />
        </DialogContent>

        <Divider sx={{ borderColor: 'var(--border)' }} />

        <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
          <AppButton sx={{background:"var(--accent-gold-dimmer)"}} onClick={onClose} disabled={isSubmitting || saved}>
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            form="banner-form"
            loading={isSubmitting}
            disabled={saved}
          >
            {saved ? '✓ Saved' : isEdit ? 'Save Changes' : 'Create Banner'}
          </AppButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}