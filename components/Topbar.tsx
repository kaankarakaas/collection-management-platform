"use client"

import { useState } from "react"
import { Badge, IconButton, Switch, Divider } from "@mui/material"
import { styled } from "@mui/material/styles"
import LightModeIconOutlined from "@mui/icons-material/LightModeOutlined"
import DarkModeIconOutlined from "@mui/icons-material/DarkModeOutlined"
import LanguageIconOutlined from "@mui/icons-material/LanguageOutlined"
import NotificationsIconOutlined from "@mui/icons-material/NotificationsOutlined"
import MailIconOutlined from "@mui/icons-material/MailOutlined"
import TuneIcon from "@mui/icons-material/Tune"

const CustomSwitch = styled(Switch)(({ theme }) => ({
    width: 50,
    height: 26,
    padding: 0,
    margin: 0,
    display: "flex",
    '& .MuiSwitch-switchBase': {
        padding: 1,
        color: theme.palette.primary.main,
        '&.Mui-checked': {
            transform: 'translateX(24px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.primary.main,
                opacity: 1,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 24,
        height: 24,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#ececeb',
        opacity: 1,
    },
}))
interface HeaderProps {
    title: string
    subtitle: string
}
export default function Topbar({ title, subtitle }: HeaderProps) {


    const [checked, setChecked] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
    }
    return (
        <header className="bg-white border rounded-md px-6 py-3 flex justify-between items-center mr-3 mt-3">
            <div>
                <h2 className="font-bold text-lg mb-2">{title}</h2>
                <span className="text-sm">{subtitle}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 hidden sm:flex">
                    <LightModeIconOutlined style={{ color: checked ? "#9e9e9e" : "#186eb2" }} fontSize="small" />
                    <CustomSwitch checked={checked} onChange={handleChange} />
                    <DarkModeIconOutlined style={{ color: checked ? "#186eb2" : "#9e9e9e" }} fontSize="small" />
                </div>
                <Divider orientation="vertical" flexItem sx={{  mx: 1, my: 1 }} />
                <IconButton>
                    <LanguageIconOutlined />
                </IconButton>

                <IconButton>
                    <Badge badgeContent={12} color="primary">
                        <NotificationsIconOutlined />
                    </Badge>
                </IconButton>

                <IconButton>
                    <MailIconOutlined />
                </IconButton>

                <IconButton>
                    <TuneIcon />
                </IconButton>

                <IconButton>
                    <div className="w-11 h-11 rounded-full bg-gray-300" />
                </IconButton>
            </div>
        </header>
    )
}
