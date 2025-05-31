import { useState, useEffect } from "react"
import Topbar from "@/components/Topbar"
import Sidebar from "@/components/Sidebar"
import {
    IconButton,
    Button,
    Tooltip,
    tooltipClasses,
    Box,
    Chip,
} from "@mui/material"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { styled } from "@mui/material/styles"
import FilterButtonWithModal from "@/components/FilterButtonWithModal"
import axios from "axios"
import { useRouter } from 'next/router'
import Error from "next/error"
import CustomModal from "@/components/CustomModal"
import SortableGrid from '@/components/SortableGrid'
import ViewSelector from "@/components/ViewSelector"

type Product = {
    productCode: string
    colorCode: string
    name: string | null
    outOfStock: boolean
    isSaleB2B: boolean
    imageUrl: string
    sequence: number
}


const CustomTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#fff",
        color: "#000",
        border: "1px solid #000",
        padding: 18,
        borderRadius: 6,
    },
}))

const InfoTooltip = () => {
    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen((prev) => !prev)
    }

    const indicators = [
        { color: "#f44336", label: "Tükendi", placement: "bottom" },
        { color: "#ff9800", label: "Yer Değiştirdi", placement: "top" },
        { color: "#4caf50", label: "Aktif", placement: "bottom" },
        { color: "#2196f3", label: "Pasif", placement: "top" },
    ]

    return (
        <CustomTooltip
            open={open}
            onClose={() => setOpen(false)}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={
                <Box display="flex" gap={1}>
                    {indicators.map((item, idx) => (
                        <Tooltip key={idx} title={item.label} placement={item.placement}
                                 componentsProps={{
                                     tooltip: {
                                         sx: {
                                             fontSize: "8px",
                                             padding: "2px 10px",
                                             borderRadius: "55px",
                                             border: "1px solid #a9a9a9",
                                             backgroundColor: "#d9d9d9",
                                             color: "#000",
                                         },
                                     },
                                     arrow: {
                                         sx: {
                                             color: "#fff",
                                         },
                                     },
                                 }}
                                 PopperProps={{
                                     modifiers: [
                                         {
                                             name: "offset",
                                             options: {
                                                 offset: [0, -11],
                                             },
                                         },
                                     ],
                                 }}
                        >
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: "#fff",
                                    border: `2px solid ${item.color}`,
                                    borderRadius: 1,
                                    cursor: "pointer",
                                }}
                            />
                        </Tooltip>
                    ))}
                </Box>
            }
            arrow
            placement="top"
            PopperProps={{
                modifiers: [
                    {
                        name: "offset",
                        options: {
                            offset: [0, -11],
                        },
                    },
                ],
            }}
        >
            <IconButton size="small" onClick={handleClick}>
                <InfoOutlinedIcon fontSize="medium" />
            </IconButton>
        </CustomTooltip>
    )
}

const getGridCols = (mode: string) => {
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

export default function EditPage() {
    const router = useRouter()
    const { id } = router.query
    const [collection, setCollection] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [filters, setFilters] = useState<{ id: string; value: string }[]>([])
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState({
        type: "success",
        title: "Başarılı",
        description: "",
        iconColor: "",
        buttons: [
            {
                label: "Tamam",
                color: "#33c39a",
                onClick: () => {
                    console.log('tamam');
                }
            },
        ],
    })
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    const totalPages = Math.ceil(selectedProducts.length / itemsPerPage)
    const [viewMode, setViewMode] = useState("table")

    const handleSelectProduct = (product: Product) => {
        const exists = selectedProducts.some((sp) => sp.id === product.id)
        if (exists) return

        const updated = [product, ...selectedProducts]
        const withSequence = updated.map((item, index) => ({
            ...item,
            sequence: index + 1,
        }))

        setSelectedProducts(withSequence)
        setCurrentPage(1);
    }


    useEffect(() => {
        if (!id) return

        const fetchCollection = async () => {
            try {
                const response = await axios.get("/api/collections")
                const found = response.data.data.find((c: any) => c.id === +id)
                if (!found) {
                    setNotFound(true)
                } else {
                    setCollection(found);
                }
            } catch (err) {
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }

        document.title = "Koleksiyon - " + id;
        fetchCollection()
    }, [id])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.post("/api/products", {
                    page: 1,
                    pageSize: 36,
                    additionalFilters: filters,
                })

                const rawProducts = res.data?.data?.data || []

                const productsWithMeta = rawProducts.map((product: any, index: number) => ({
                    ...product,
                    id: `${product.productCode}-${index}`
                }))

                setAllProducts(productsWithMeta);

                setSelectedProducts(productsWithMeta.slice(6, 12));
            } catch (err) {
                console.error("Ürünler alınamadı:", err)
            }
        }

        fetchProducts()
    }, [filters])


    if (loading) return <div>Yükleniyor...</div>
    if (notFound) return <Error statusCode={404} />

    const filteredProducts = allProducts

    const handleCancel = () => {
        router.back()
    }

    const handleSave = async () => {
        try {
            const response = await axios.post("/api/edit/save", {
                collectionId: id,
                products: {},
            })

            if (response.data.success) {
                setModalContent({
                    type: "success",
                    title: "Başarılı",
                    description: response.data.message || "Kaydedildi.",
                    buttons: [
                        {
                            label: "Tamam",
                            color: "#33c39a",
                        },
                    ]
                })
            } else {
                setModalContent({
                    type: "warning",
                    title: "Uyarı",
                    description: response.data.message || "İşlem tamamlanamadı.",
                    buttons: []
                })
            }
        } catch (err) {
            setModalContent({
                type: "error",
                title: "Hata",
                description: "Sunucuya ulaşılamadı.",
                buttons: []
            })
        } finally {
            setModalOpen(true)
        }
    }
    const handleRemoveItem = (productId: string) => {
        setModalContent({
            type: "warning",
            title: "Uyarı",
            description: "Sabitlerden Çıkarılacaktır Emin Misiniz?",
            iconColor: "red",
            buttons: [
                {
                    label: "Vazgeç",
                    color: "red",
                    onClick: () => {
                        setModalContent({
                            type: "warning",
                            title: "Uyarı!",
                            description: "Sabitler İçerisinden Çıkarılırken Hata Oluştu.",
                            iconColor: "red",
                            buttons: [
                                {
                                    label: "Tamam",
                                    color: "red",
                                },
                            ]
                        })
                    }
                },
                {
                    label: "Onayla",
                    color: "#33c39a",
                    onClick: () => {
                        const filtered = selectedProducts
                            .filter(item => item.id !== productId)
                            .map((item, index) => ({
                                ...item,
                                sequence: index + 1,
                            }));

                        try {
                            setSelectedProducts(filtered)
                            setModalContent({
                                type: "success",
                                title: "Başarılı",
                                description: "Sabitler İçerisinden Çıkarıldı.",
                                iconColor: "#33c39a",
                                buttons: [
                                    {
                                        label: "Tamam",
                                        color: "#33c39a",
                                    },
                                ]
                            })
                        } catch (e) {
                            setModalContent({
                                type: "warning",
                                title: "Uyarı!",
                                description: "Sabitler İçerisinden Çıkarılırken Hata Oluştu.",
                                iconColor: "red",
                                buttons: [
                                    {
                                        label: "Tamam",
                                        color: "red",
                                    },
                                ]
                            })
                        }

                    }
                },
            ],
        })
        setModalOpen(true)

    }

    return (
        <div className="flex min-my-3">

            <Sidebar />
            <div className="flex-1 flex flex-col   ml-3 md:ml-[45px]">
                <Topbar title="Sabitleri Düzenle" subtitle={`Koleksiyon - ${collection.id} / ${filteredProducts.length} ürün`} />
                <main className="min-w-full h-[calc(100vh-140px)] flex flex-col mt-4">
                    <div className="flex-1 overflow-auto bg-white rounded-md mr-3 border p-5 flex flex-col">
                        <div className="flex gap-15">
                            <Box
                                sx={{
                                    flex: 1,
                                    height: 50,
                                    border: "1px solid #ccc",
                                    borderRadius: 1,
                                    padding: "6px 8px",
                                    overflowX: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    fontSize: 13,
                                }}
                            >
                                {filters.map((f, i) => (
                                    <Chip
                                        key={i}
                                        label={typeof f === "string" ? f : `${f.label}: ${f.value}`}
                                        size="small"
                                        sx={{ fontSize: "12px", backgroundColor: "#f5f5f5" }}
                                    />
                                ))}
                            </Box>
                            <div className="flex flex-col">
                                <FilterButtonWithModal onApplyFilters={setFilters} collectionId={collection.id} />
                                <div className="flex gap-1 items-end ml-auto mt-5">
                                    <InfoTooltip />
                                    <ViewSelector viewMode={viewMode} setViewMode={setViewMode} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 h-[calc(100vh-300px)]">
                            {/* Sol: Koleksiyon Ürünleri */}
                            <div className="w-1/2 flex flex-col">
                                <h3 className="font-semibold text-xs mb-2 px-1 ">Koleksiyon Ürünleri</h3>
                                <div className="flex-1 border rounded-md overflow-hidden flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-2">
                                        <div className="my-4 grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
                                            {filteredProducts.map((p) => {
                                                const isSelected = selectedProducts.some(sp => sp.id === p.id);
                                                return (
                                                    <div className="relative">
                                                        <div
                                                            key={p.id}
                                                            className={`border rounded-md text-center p-2 bg-white cursor-pointer overflow-hidden transition duration-200 ${
                                                                isSelected ? "opacity-70 blur-[2px]" : ""
                                                            }`}
                                                            onClick={() => handleSelectProduct(p)}
                                                        >
                                                            <img
                                                                src={p.imageUrl}
                                                                alt={p.name}
                                                                className="w-full h-42 object-cover rounded"
                                                            />
                                                            <div className="mt-2 font-medium text-sm mb-1">&nbsp;</div>
                                                            <div className="text-sm font-medium">{p.productCode}</div>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full py-2 text-xs text-white bg-black text-center">
                                                                Eklendi
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sağ: Sabitler */}
                            <div className="w-1/2 flex flex-col">
                                <h3 className="font-semibold text-xs mb-2 px-1">Sabitler</h3>
                                <div className="flex-1 border rounded-md overflow-hidden flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-2">
                                        <SortableGrid
                                            currentPage={currentPage}
                                            itemsPerPage={itemsPerPage}
                                            setItems={setSelectedProducts} items={selectedProducts}
                                            onRemoveItem={handleRemoveItem}
                                            viewMode={viewMode}
                                        />
                                    </div>

                                    <div className="p-4 border-t flex justify-end gap-2 items-center">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="text-sm disabled:text-gray-400"
                                        >
                                            ❮
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-6 h-6 rounded text-sm ${
                                                    currentPage === i + 1 ? 'bg-black text-white' : 'hover:text-blue-600'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="text-sm disabled:text-gray-400"
                                        >
                                            ❯
                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: "#000",
                                    width: "150px",
                                }}
                                onClick={handleCancel}
                            >
                                Vazgeç
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: "#000",
                                    width: "150px",
                                }}
                                onClick={handleSave}
                            >
                                Kaydet
                            </Button>

                        </div>

                    </div>

                </main>
            </div>
            <CustomModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalContent.title}
                description={modalContent.description}
                type={modalContent.type}
                iconColor={modalContent.iconColor}
                buttons={modalContent.buttons}
            />
        </div>
    )
}
