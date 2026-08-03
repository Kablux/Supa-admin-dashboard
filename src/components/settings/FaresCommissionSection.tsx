import React from "react";
import { Box } from "@mui/material";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import Section from "./Section";
import Field from "./helpers/Field";
import { FormState } from "./helpers/FormMapper";
import NumberField from "./helpers/NumberField";


interface Props {
  form: FormState;
  patch: (p: Partial<FormState>) => void;
}

export default function FaresCommissionSection({ form, patch }: Props) {
  return (
    <Section
      icon={<PaymentsRoundedIcon fontSize="small" />}
      title="Fares & Commission"
      subtitle="Platform-wide defaults for pricing and revenue split"
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        <Field label="Base fare" hint="Default fallback base fare">
          <NumberField
            value={form.base_fare}
            onChange={(v) => patch({ base_fare: v })}
            start="₦"
          />
        </Field>
        <Field label="Commission rate" hint="Platform commission percentage">
          <NumberField
            value={form.commission_rate}
            onChange={(v) => patch({ commission_rate: v })}
            end="%"
          />
        </Field>
        <Field
          label="Driver earning percent"
          hint="Driver share after commission"
        >
          <NumberField
            value={form.driver_earning_percent}
            onChange={(v) => patch({ driver_earning_percent: v })}
            end="%"
          />
        </Field>
        <Field label="Max surge" hint="Global maximum surge multiplier">
          <NumberField
            value={form.max_surge}
            onChange={(v) => patch({ max_surge: v })}
            end="×"
          />
        </Field>
      </Box>
    </Section>
  );
}