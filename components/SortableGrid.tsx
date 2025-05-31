import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {IconButton} from "@mui/material";

type SortableItemProps = {
    id: string
    imageUrl: string
    productCode: string
    onDelete: () => void
}

const getGridCols = (mode: string = "grid") => {
    switch (mode) {
        case "list":
            return "grid-cols-2"
        case "table":
            return "grid-cols-3"
        case "grid":
        default:
            return "grid-cols-4"
    }
}

export const SortableItem = ({ id, imageUrl, onDelete, productCode }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grabbing",
    }

    return (<div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="relative group"
        >
            <div
                key={id}
                className="border rounded-md text-center p-2 bg-white cursor-pointer overflow-hidden transition duration-200"
            >
                <img
                    src={imageUrl}
                    alt={productCode}
                    className="w-full h-42 object-cover rounded"
                />
                <div className="mt-2 font-medium text-sm mb-1">&nbsp;</div>
                <div className="text-sm font-medium">{productCode}</div>
            </div>

            <div
                className="absolute inset-0 flex items-center justify-center backdrop-blur-xs bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
                <IconButton
                    size="small"
                    sx={{
                        backgroundColor: "#fff !important",
                        color: "#000 !important",
                        "&:hover": {
                            backgroundColor: "#f0f0f0 !important",
                        },
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onDelete()
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <DeleteOutlinedIcon fontSize="medium" />
                </IconButton>
            </div>
        </div>

    )
}

export default function SortableGrid({ items, setItems, currentPage, itemsPerPage, onRemoveItem, viewMode = "grid" }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = items.findIndex(p => p.id === active.id)
            const newIndex = items.findIndex(p => p.id === over?.id)

            const updatedWithSequence = arrayMove(items, oldIndex, newIndex).map((item, i) => ({
                ...item,
                sequence: i + 1,
            }))
            setItems(updatedWithSequence);

        }
    }


    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(start, start + itemsPerPage);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => item.id)}
                strategy={rectSortingStrategy}
            >
                <div className={`my-4 grid xl:${getGridCols(viewMode)} md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8`}>
                    {paginatedItems.map((p) => (
                        <SortableItem key={p.id} id={p.id} imageUrl={p.imageUrl} productCode={p.productCode} onDelete={() => onRemoveItem(p.id)} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
