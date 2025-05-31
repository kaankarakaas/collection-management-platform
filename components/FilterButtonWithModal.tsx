"use client"

import { useState } from "react"
import { Button } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import FilterModal from "@/components/FilterModal"

type FilterType = { label: string; value: string }

type Props = {
    onApplyFilters: (filters: FilterType[]) => void;
    collectionId: string | number;
}

export default function FilterButtonWithModal({ onApplyFilters, collectionId }: Props) {
    const [open, setOpen] = useState(false)

    const handleApply = (selected: FilterType[]) => {
        onApplyFilters(selected)
        setOpen(false)
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="outlined"
                endIcon={<FilterListIcon />}
                sx={{
                    backgroundColor: open ? "#000" : "transparent",
                    color: open ? "#fff" : "#000",
                    borderColor: "#000",
                    width: 150,
                    fontSize: "0.8rem",
                    textTransform: "none",
                    height: 50,
                    justifyContent: "space-between",
                    px: 2,
                    fontWeight: 600
                }}
            >
                Filtreler
            </Button>

            <FilterModal collectionId={collectionId} open={open} onClose={() => setOpen(false)} onApply={handleApply} />
        </>
    )
}
