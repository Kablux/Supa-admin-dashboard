import React from "react";
import { Box } from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import Section from "./Section";
import Field from "./helpers/Field";
import NumberField from "./helpers/NumberField";


interface Props {
  extra: Record<string, string>;
  setExtra: (key: string, val: string) => void;
}

export default function SystemSection({ extra, setExtra }: Props) {
  return (
    <Section
      icon={<TuneRoundedIcon fontSize="small" />}
      title="System"
      subtitle="Operational endpoints and reviewer routing"
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        <Field label="Admin base URL">
          <NumberField
            value={extra.admin_base_url ?? ""}
            onChange={(v) => setExtra("admin_base_url", v)}
            placeholder="https://api.example.com"
          />
        </Field>
        <Field label="KYC reviewer email">
          <NumberField
            value={extra.kyc_reviewer_email ?? ""}
            onChange={(v) => setExtra("kyc_reviewer_email", v)}
            placeholder="reviewer@example.com"
          />
        </Field>
      </Box>
    </Section>
  );
}