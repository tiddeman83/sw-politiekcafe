import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        color: "white",
        py: 6,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(1px)",
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="SamenWerkt Logo"
            sx={{
              height: { xs: 80, md: 120 },
              mb: 3,
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Aanmelden voor het politiek café
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: 400,
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            Welkom bij SamenWerkt. Vul onderstaand formulier aan om je aan te
            melden voor het politiek cafe op 8 september 2025. 19:30 uur, Wijkse
            Stekkie
          </Typography>
        </Box>
      </Container>

      {/* Decorative elements with brand colors */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(229, 57, 53, 0.15)", // Red accent
          opacity: 0.7,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(76, 175, 80, 0.15)", // Green accent
          opacity: 0.7,
        }}
      />
      {/* Brand accent line */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #e53935 0%, #4caf50 100%)",
        }}
      />
    </Box>
  );
};

export default Header;
