import {Modal, Box, Typography, Button} from "@mui/material"
import ErrorIcon from "@mui/icons-material/Error"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import React from "react";

type ModalType = "success" | "warning" | "error";

interface CustomModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    type: ModalType;
    buttons?: { label: string, onClick?: () => void, color?: string }[]
    iconColor?: string
    children?: React.ReactNode
}


export default function CustomModal({
                                        open,
                                        onClose,
                                        title,
                                        description,
                                        type,
                                        iconColor,
                                        buttons = [],
                                        children,
                                    }: CustomModalProps) {

    const iconMap: Record<ModalType, React.ReactNode> = {
        success: <VerifiedOutlinedIcon sx={{ fontSize: 62, color: iconColor || '#33c39a' }} />,
        error: <ErrorIcon sx={{ fontSize: 62, color: iconColor || '#33c39a' }} />,
        warning: <WarningAmberIcon sx={{ fontSize: 62, color: iconColor || '#33c39a' }} />,
    }

    return (
        <Modal open={open} onClose={onClose}
               slots={{ backdrop: "div" }}
               slotProps={{
                   backdrop: {
                       style: {
                           backdropFilter: "blur(2px)",
                           WebkitBackdropFilter: "blur(2px)",
                           backgroundColor: "rgba(255, 255, 255, 0.2)",
                           height: "100%",
                       },
                   },
               }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "1px solid #ccc",
                    width: "90%",
                    maxWidth: 765,
                    height: 635,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    textAlign: "center",
                    boxShadow: "0 5px 3px #00000020",
                    padding:15,
                }}
            >
                <Typography variant="h4" component="h2" style={{fontWeight: "bold", color: "#000"}}>
                    {title}
                </Typography>
                {iconMap[type]}
                <Typography variant="h5">
                    {description}
                </Typography>
                <Box mt={2}>{children}</Box>
                <Box display="flex" justifyContent="center" gap={2} mt={2} width="100%">
                    {buttons.map((btn, i) => (
                        <Button
                            key={i}
                            variant="contained"
                            onClick={btn.onClick || onClose}
                            style={{
                                color: "#fff",
                            }}
                            sx={{
                                backgroundColor: btn.color,
                                color: "#fff",
                                width: 330,
                                height: 50,
                                borderRadius: 5,
                            }}
                        >
                            {btn.label}
                        </Button>
                    ))}
                </Box>

            </Box>
        </Modal>
    )
}
