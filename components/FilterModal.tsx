import { useEffect, useState } from "react"
import axios from "axios"
import {
    Box,
    Typography,
    Select,
    MenuItem,
    Modal,
    Button,
    Divider,
    Chip,
    IconButton
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
type FilterValue = { value: string, valueName?: string }
type FilterGroup = { id: string, title: string, values: FilterValue[] }

type Props = {
    open: boolean
    onClose: () => void
    onApply: (filters: Record<string, string>) => void
    collectionId: string | number;
}


export default function FilterModal({ open, onClose, onApply, collectionId }: Props) {
    const [collection, setCollection] = useState(null)
    const [filters, setFilters] = useState<FilterGroup[]>([])
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!open || !collectionId) return;

        const fetchData = async () => {
            try {
                const [filtersRes, collectionsRes] = await Promise.all([
                    axios.get("/api/filters"),
                    axios.get("/api/collections"),
                ]);

                const allFilters = filtersRes.data?.data || [];
                const found = collectionsRes.data.data.find((c: any) => c.id === +collectionId);

                if (!found) return;

                setCollection(found);

                const activeFilters = found.filters.filters || [];

                const filteredFilters = allFilters
                    .map(group => {
                        // Grubu etkileyen değerler
                        const matched = activeFilters.filter(f => f.id === group.id);
                        if (matched.length === 0) return null;

                        const matchedValues = group.values.filter(v =>
                            matched.some(m => m.value === v.value)
                        );

                        return matchedValues.length > 0
                            ? { ...group, values: matchedValues }
                            : null;
                    })
                    .filter(Boolean); // null olanları at

                setFilters(filteredFilters);
            } catch (error) {
                console.error("Veri getirme hatası:", error);
            }
        };

        fetchData();
    }, [open, collectionId]);

    const handleChange = (key: string, val: string) => {
        setSelectedFilters(prev => {
            if (!val || val === "Tümü") {
                const updated = { ...prev }
                delete updated[key]
                return updated
            }
            return { ...prev, [key]: val }
        })
    }

    const handleApplyFilter = () => {
        const formatted = Object.entries(selectedFilters)
            .filter(([_, value]) => value && value !== "" && (!Array.isArray(value) || value.length > 0))
            .map(([key, value]) => {
                const meta = filters.find(f => f.id === key)
                const valueMeta = meta?.values.find(v => v.value === value)

                return {
                    key,
                    label: meta?.title || key,
                    value: valueMeta?.valueName || value
                }
            })

        onApply(formatted)
        onClose()
    }

    const handleClearAll = () => {
        setSelectedFilters({})
    }

    const appliedFilters = Object.entries(selectedFilters).map(([key, val]) => {
        const group = filters.find(f => f.id === key)
        const value = group?.values.find(v => v.value === val)?.valueName || val
        return { label: group?.title || key, value }
    })

    const handleRemoveFilter = ({ label }: { label: string }) => {
        const group = filters.find(f => f.title === label)
        if (group) {
            const updated = { ...selectedFilters }
            delete updated[group.id]
            setSelectedFilters(updated)
        }
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
                    bottom: 0,
                    right: { xs: 0, md: 100 },
                    left: { xs: 0, md: "auto" },
                    bgcolor: "white",
                    p: 4,
                    borderRadius: 2,
                    width: { xs: "100%", md: "79%" },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    border: "1px solid #000",
                    backdropFilter: "blur(4px)",
                }}
            >
                <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }} gap={2}>
                    {filters.map((filter) => (
                        <Box key={filter.id}>
                            <Typography fontWeight="bold">{filter.title}</Typography>
                            <Select
                                value={selectedFilters[filter.id] || ""}
                                displayEmpty
                                fullWidth
                                onChange={(e) => handleChange(filter.id, e.target.value)}
                                IconComponent={ArrowDropDownIcon}
                            >
                                <MenuItem value="">Tümü</MenuItem>
                                {filter.values.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.valueName || opt.value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    ))}
                </Box>

                {/* Kriterler */}
                <Box mt={3}>
                    <Typography fontWeight="bold" fontSize={13} mb={1}>
                        Uygulanan Kriterler
                    </Typography>
                    <Box
                        sx={{
                            border: "1px solid #000",
                            borderRadius: 1,
                            p: 1,
                            minHeight: 80,
                            maxHeight: 120,
                            overflowY: "auto"
                        }}
                    >
                        {appliedFilters.length > 0 ? (
                            appliedFilters.map((filter, idx) => (
                                <Chip
                                    key={idx}
                                    label={`${filter.label}: ${filter.value}`}
                                    onDelete={() => handleRemoveFilter(filter)}
                                    sx={{ margin: 0.5, fontSize: 12, backgroundColor: "#f0f0f0" }}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />
                <Box display="flex" justifyContent="center" gap={3} flexDirection={{ xs: "column", sm: "row" }}>
                    <Button
                        onClick={handleClearAll}
                        variant="contained"
                        color="inherit"
                        sx={{
                            backgroundColor: "#000",width: { xs: "100%", sm: 200 }, borderRadius: 1 }}
                    >
                        Seçimi Temizle
                    </Button>
                    <Button
                        onClick={handleApplyFilter}
                        variant="outlined"
                        sx={{
                            width: { xs: "100%", sm: 200 },
                            borderRadius: 1,
                            color: "#000",
                            border: 2,
                            borderColor: "#000",
                            fontWeight: "bold"
                        }}
                    >
                        Ara
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}
