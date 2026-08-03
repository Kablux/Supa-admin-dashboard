import React from "react";
import { Box } from "@mui/material";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import Section from "./Section";
import Field from "./helpers/Field";
import { FormState } from "./helpers/FormMapper";
import NumberField from "./helpers/NumberField";


const ttlHint = (v: string) => {
  const n = Number(v);
  if (!n || Number.isNaN(n)) return "seconds";
  const m = Math.round((n / 60) * 10) / 10;
  return `${n} seconds ≈ ${m} min`;
};

interface Props {
  form: FormState;
  patch: (p: Partial<FormState>) => void;
}

export default function RequestTimingSection({ form, patch }: Props) {
  return (
    <Section
      icon={<TimerRoundedIcon fontSize="small" />}
      title="Request Timing"
      subtitle="How long requests and offers stay live"
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        <Field label="Ride request TTL" hint={ttlHint(form.ride_request_ttl)}>
          <NumberField
            value={form.ride_request_ttl}
            onChange={(v) => patch({ ride_request_ttl: v })}
            end="sec"
          />
        </Field>
        <Field label="Driver offer TTL" hint={ttlHint(form.driver_offer_ttl)}>
          <NumberField
            value={form.driver_offer_ttl}
            onChange={(v) => patch({ driver_offer_ttl: v })}
            end="sec"
          />
        </Field>
      </Box>
    </Section>
  );
}