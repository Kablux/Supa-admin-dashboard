import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getGlobalConfig, updateGlobalConfig } from "../api/xhr";
import { DEFAULT_FORM } from "../components/settings/helpers/DefaultFormConfig";
import { FormState, toForm, RideTypeRow, toConfig } from "../components/settings/helpers/FormMapper";


export type SavingMode = false | "save" | "continue";

export function useGlobalConfigForm(onSaved?: () => void) {
  const [saving, setSaving] = useState<SavingMode>(false);
  const [hydrating, setHydrating] = useState(true);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [snapshot, setSnapshot] = useState(JSON.stringify(DEFAULT_FORM));
  // Guards against the fetch clobbering edits started during load.
  const hasEdited = useRef(false);

  useEffect(() => {
    let active = true;
    getGlobalConfig()
      .then((cfg) => {
        if (!active || hasEdited.current) return;
        const f = toForm(cfg);
        setForm(f);
        setSnapshot(JSON.stringify(f));
      })
      .catch((err) => {
        console.error("Failed to load global config", err);
        toast.error("Couldn't load saved config — showing defaults");
      })
      .finally(() => {
        if (active) setHydrating(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== snapshot,
    [form, snapshot],
  );

  const patch = (p: Partial<FormState>) => {
    hasEdited.current = true;
    setForm((f) => ({ ...f, ...p }));
  };

  const setExtra = (key: string, val: string) => {
    hasEdited.current = true;
    setForm((f) => ({ ...f, extra: { ...f.extra, [key]: val } }));
  };

  const patchRideType = (idx: number, p: Partial<RideTypeRow>) => {
    hasEdited.current = true;
    setForm((f) => ({
      ...f,
      rideTypes: f.rideTypes.map((r, i) => (i === idx ? { ...r, ...p } : r)),
    }));
  };

  const addRideType = () => {
    hasEdited.current = true;
    setForm((f) => ({
      ...f,
      rideTypes: [
        ...f.rideTypes,
        {
          name: "",
          per_km: "0",
          base_fare: "0",
          per_minute: "0",
          max_surge: "1.0",
        },
      ],
    }));
  };

  const removeRideType = (idx: number) => {
    hasEdited.current = true;
    setForm((f) => ({
      ...f,
      rideTypes: f.rideTypes.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async (mode: "save" | "continue") => {
    // Validate ride-type names: non-empty & unique.
    const names = form.rideTypes.map((r) => r.name.trim());
    if (names.some((n) => !n)) {
      toast.error("Every ride type needs a name");
      return;
    }
    if (new Set(names).size !== names.length) {
      toast.error("Ride type names must be unique");
      return;
    }

    setSaving(mode);
    try {
      const updated = await updateGlobalConfig(toConfig(form));
      const next = toForm(updated);
      setForm(next);
      setSnapshot(JSON.stringify(next));
      toast.success("Settings saved");
      if (mode === "save") onSaved?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (snapshot) setForm(JSON.parse(snapshot));
  };

  return {
    form,
    hydrating,
    saving,
    isDirty,
    patch,
    setExtra,
    patchRideType,
    addRideType,
    removeRideType,
    handleSave,
    discard,
  };
}