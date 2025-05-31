// components/ViewSelector.tsx

import { IconButton } from "@mui/material"
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined"
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined"
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined"

interface ViewSelectorProps {
    viewMode: string
    setViewMode: (mode: string) => void
}

const ViewSelector = ({ viewMode, setViewMode }: ViewSelectorProps) => {
    const isActive = (mode: string) => viewMode === mode

    return (
        <div className="flex gap-2 hidden xl:flex">
            <IconButton
                size="small"
                onClick={() => setViewMode("list")}
                sx={{
                    backgroundColor: isActive("list") ? "rgba(0,255,76,0.19)" : "transparent",
                }}
            >
                <CheckBoxOutlineBlankOutlinedIcon fontSize="medium" />
            </IconButton>

            <IconButton
                size="small"
                onClick={() => setViewMode("table")}
                sx={{
                    backgroundColor: isActive("table") ? "rgba(0,255,76,0.19)" : "transparent",
                }}
            >
                <ViewColumnOutlinedIcon style={{ fontSize: 25 }} />
            </IconButton>

            <IconButton
                size="small"
                onClick={() => setViewMode("grid")}
                sx={{
                    backgroundColor: isActive("grid") ? "rgba(0,255,76,0.19)" : "transparent",
                }}
            >
                <GridViewOutlinedIcon fontSize="medium" />
            </IconButton>
        </div>
    )
}

export default ViewSelector
