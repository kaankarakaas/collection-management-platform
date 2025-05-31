"use client"

import { Box, Modal as MuiModal, Typography, Button } from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

type ModalProps = {
    open: boolean
    onClose: () => void
    title: string
    description: string
    type: "success" | "warning" | "error"
}

const iconStyles = {
    fontSize: 48,
    mb: 2,
}

export default function Modal({ open, onClose, title, description, type }: ModalProps) {
    const renderIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircleOutlineIcon sx={{ ...iconStyles, color: "#00C48C" }} />
            case "warning":
                return <WarningAmberIcon sx={{ ...iconStyles, color: "#FFA726" }} />
            case "error":
                return <ErrorOutlineIcon sx={{ ...iconStyles, color: "#F44336" }} />
        }
    }

    return (
        <MuiModal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                }}
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    {title}
                </Typography>
                {renderIcon()}
                <Typography variant="body1" mb={3}>
                    {description}
                </Typography>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: "#00C48C", ":hover": { bgcolor: "#00A67E" } }}
                    onClick={onClose}
                >
                    TAMAM
                </Button>
            </Box>
        </MuiModal>
    )
}
