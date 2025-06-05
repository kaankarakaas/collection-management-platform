"use client"

import { useState, useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

export default function Login() {

    const firstInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        document.title = "Kullanıcı Girişi";
        firstInputRef.current?.focus()
    }, [])

    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [error, setError] = useState("")
    const [detailedErrors, setDetailedErrors] = useState<string[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setError("")
        setDetailedErrors([])

        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
            maxAge: rememberMe ? 30 * 24 * 60 * 60 : 8 * 60 * 60,
        })

        if (res?.error) {
            try {
                const decoded = decodeURIComponent(res.error)
                const parsed = JSON.parse(decoded)

                const cleanedMsg = parsed.message?.replace("Do�rulama hatalar�", "Doğrulama hataları")
                setError(cleanedMsg || "Giriş başarısız.")

                if (parsed?.data?.errors) {
                    const allErrors = Object.values(parsed.data.errors).flat()
                    setDetailedErrors(allErrors as string[])
                }
            } catch {
                setError("Giriş başarısız. Sunucudan hata alınamadı.")
            }
        }
        else if (res?.url) {
            router.push(res.url)
        }
        else {
            router.push("/collections")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: 790,
                    p: { xs: 5, md: 26 },
                    my: { xs: 1, md: 20 },
                    mx: 1,
                    border: "1px solid #9f9ea0",
                    borderRadius: 2,
                }}
                spellCheck={false}
            >
                <Box display="flex" justifyContent="center" sx={{ mb: { xs: 5, md: 20 } }}>
                    <img src="/logo.jpg" alt="Logo" style={{ height: 35, width: 125 }} />
                </Box>

                {error && (
                    <Box mb={2}>
                        <Typography variant="body2" color="warning" className="text-yellow-700">
                            {error}
                        </Typography>
                        {detailedErrors.length > 0 && (
                            <ul className="list-disc list-inside text-sm text-yellow-700">
                                {detailedErrors.map((msg, i) => (
                                    <li key={i}>{msg}</li>
                                ))}
                            </ul>
                        )}
                    </Box>
                )}

                <TextField
                    fullWidth
                    inputRef={firstInputRef}
                    label="E-Posta"
                    type="email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />

                <TextField
                    fullWidth
                    label="Şifre"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    margin="normal"
                    required

                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(prev => !prev)}
                                    edge="end"
                                    sx={{
                                        borderRadius: '50%',
                                        color: '#ccc',
                                        '&:hover': {
                                            color: '#555',
                                        },
                                    }}
                                >
                                    {showPassword ? <VisibilityOff sx={{ color: '#555', fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                    }
                    label="Beni Hatırla"
                    sx={{
                        "& .MuiFormControlLabel-label": {
                            color: "#000",
                            fontSize: "0.85rem",
                        },
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        backgroundColor: "#000",
                        mt: 1
                    }}
                >
                    Giriş Yap
                </Button>
            </Box>
        </div>
    )
}
