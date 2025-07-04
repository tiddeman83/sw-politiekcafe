import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";

const SuccessModal = ({ open, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const REDIRECT_URL = "https://samenwerktwijkbijduurstede.nl";

  useEffect(() => {
    if (!open) {
      setCountdown(5);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Close modal and redirect to main website
          onClose();
          setTimeout(() => {
            window.location.href = REDIRECT_URL;
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, onClose]);

  const handleManualRedirect = () => {
    onClose(); // Close modal first
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, 100);
  };

  const progressValue = ((5 - countdown) / 5) * 100;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500",
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <CheckCircle
            sx={{
              fontSize: 80,
              color: "#4caf50",
              mb: 2,
              filter: "drop-shadow(0 4px 8px rgba(76,175,80,0.3))",
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 600,
            background: "linear-gradient(45deg, #e53935, #4caf50)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Bedankt voor uw aanmelding!
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
          Uw aanmelding voor het politiek café is succesvol verzonden.
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          U ontvangt binnen enkele minuten een bevestigingsmail op het door u
          opgegeven e-mailadres. Wij nemen zo spoedig mogelijk contact met u op.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              fontWeight: 500,
              color: "primary.main",
            }}
          >
            U wordt over {countdown} seconde{countdown !== 1 ? "n" : ""}{" "}
            doorverwezen naar de hoofdpagina
          </Typography>

          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(0,0,0,0.1)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(45deg, #e53935, #4caf50)",
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "primary.main",
            cursor: "pointer",
            textDecoration: "underline",
            "&:hover": {
              color: "primary.dark",
            },
          }}
          onClick={handleManualRedirect}
        >
          Klik hier om direct door te gaan naar samenwerktwbd.nl
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
