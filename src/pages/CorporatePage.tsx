import { Box, Typography, Divider } from "@mui/material";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import { fetchCorporateData } from "../api/xhrHelper";
import CorporateInfoCard from "../components/corporate/InfoCard";
import CorporateTransactionTable from "../components/corporate/CorporateTable";

export default function CorporatePage() {
  const dispatch = useAppDispatch();

  const { stats, owners, companyInfo, isLoading } = useAppSelector(
    (state) => state.corporate,
  );

  useEffect(() => {
    dispatch(fetchCorporateData());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3,1fr)",
              md: "repeat(4,1fr)",
            },
            gap: 2,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              loading={isLoading}
              delay={index * 100}
            />
          ))}
        </Box>

        {companyInfo && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 4,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {/* Left Side: Company Name */}
              <Box>
                <Typography sx={{ fontSize: 14, color: "secondary.main", mb: 0.5 }}>
                  Company Name:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {companyInfo.companyName}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "secondary.main", mt: 1 }}>
                  ibrahimvictor2001@gmail.com
                </Typography>
              </Box>

              {/* Right Side: Contact Person */}
              <Box>
                <Typography sx={{ fontSize: 14, color: "secondary.main", mb: 0.5 }}>
                  Contact Person:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {companyInfo.contactPerson}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mt: 1,
                  }}
                >
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "#A0A0A0", borderWidth: 1 }}
                  />
                  <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
                    090777543366
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* --- Bottom Section: Stats Row --- */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* 1. Staff */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DirectionsCarOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {companyInfo.staff}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
                  Staff
                </Typography>
              </Box>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "rgba(255,255,255,0.2)", my: 0.5 }}
              />

              {/* 2. Amount */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccountBalanceOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    N{companyInfo.accountBalance.toLocaleString()}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
                  Amount
                </Typography>
              </Box>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "rgba(255,255,255,0.2)", my: 0.5 }}
              />

              {/* 3. Unique Code */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AdjustOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {companyInfo.uniqueCode}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
                  Unique Code
                </Typography>
              </Box>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "rgba(255,255,255,0.2)", my: 0.5 }}
              />

              {/* 4. Expiring */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BadgeOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {companyInfo.year}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
                  Expiring
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Feature Cards */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 3,
          mb:4
        }}
      >
        <CorporateInfoCard
          title="Corporate Reports"
          subtitle="Summary"
          items={[
            "Ride usage summary",
            "Cost per department",
            "Peak ride times",
            "Corporate savings & promo usage",
          ]}
        />
        <CorporateInfoCard
          title="Billing & Invoicing"
          subtitle="transactions"
          items={[
            "Monthly invoice generation",
            "Auto-calculated taxes",
            "Payment status (paid, pending, overdue)",
            "Download invoice PDF or export CSV",
          ]}
        />
      </Box>

      {/* Transactions Table */}
      
      <CorporateTransactionTable data={owners} isLoading={isLoading} />
    </Box>
  );
}
