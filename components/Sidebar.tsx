"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material"
import React from "react"
import HomeIconOutlined from "@mui/icons-material/HomeOutlined"
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ShoppingCartIconOutlined from "@mui/icons-material/ShoppingCartOutlined"
import { useRouter } from "next/router"

export default function Sidebar() {
    const router = useRouter()
    const pathname = router.pathname

    const isActive = (path: string) => pathname?.startsWith(path)

    const activeStyles = {
        backgroundColor: "#FFFFFF",
        border: "1px solid #000",
    }


    return (
        <Drawer
            className="hidden md:flex"
            variant="permanent"
            sx={{
                width: 250,
                [`& .MuiDrawer-paper`]: {
                    width: 250,
                    border: 0,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                },
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    background: "#fff",
                    paddingTop: 30,
                    paddingBottom: 25,
                }}
            >
                <img src="/logo.jpg" alt="Logo" style={{ height: 35, width: 125 }} />
            </div>
            <List sx={{ width: "100%", border:1, borderRadius:2, px:2, py:4, flex:1,
                paddingRight:4, my:3 }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize:13 }}>
                    MENÜ
                </Typography>

                <ListItemButton
                    style={{marginTop: 15, padding: 7}}>
                    <ListItemIcon sx={{ minWidth: 27, mr: 1 }}>
                        <HomeIconOutlined sx={{ fontSize: 27 }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Dashboard"
                        primaryTypographyProps={{
                            fontSize: 12,
                        }}
                    />
                </ListItemButton>

                <ListItemButton
                    style={{marginBottom: 10, padding: 7}}>
                    <ListItemIcon sx={{ minWidth: 27, mr: 1 }}>
                        <ArchiveOutlinedIcon sx={{ fontSize: 27 }} />
                    </ListItemIcon>
                    <ListItemText primary="Ürünler"
                                  primaryTypographyProps={{
                                      fontSize: 12,
                                  }} />
                    <ExpandMoreIcon fontSize="small" />
                </ListItemButton>

                <Typography variant="caption" color="textSecondary" sx={{ fontSize:13 }}>
                    Satış
                </Typography>

                <ListItemButton
                    component={Link}
                    style={{marginTop: 15, padding: 5}}
                    href={"/collections"}
                    sx={activeStyles}
                >
                    <ListItemIcon sx={{ minWidth: 27, ml: 0.3, ml: 0.5, mr: 0.5 }}>
                        <ShoppingCartIconOutlined sx={{ fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText primary="Koleksiyon"
                                  primaryTypographyProps={{
                                      fontSize: 12,
                                  }} />
                </ListItemButton>
            </List>
        </Drawer>
    )
}
