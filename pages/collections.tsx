import { useEffect, useState } from "react"
import Topbar from "../components/Topbar"
import Sidebar from "../components/Sidebar"
import HighlightAltOutlinedIcon from '@mui/icons-material/HighlightAltOutlined'
import { tooltipClasses } from "@mui/material/Tooltip"
import { Tooltip, IconButton, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import Link from "next/link"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import ViewListIcon from "@mui/icons-material/ViewList"

const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip title="Sabitleri Düzenle" placement="right-end" {...props} classes={{ popper: className }}>
      <IconButton>
        <HighlightAltOutlinedIcon fontSize="medium" />
      </IconButton>
    </Tooltip>
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #000",
    borderRadius: 20,
    fontSize: 11,
    padding: "0 5px",
  },
}))

type Filter = {
  id: string
  title: string
  value: string
  valueName: string
}

type Product = {
  productCode: string
  name: string
  imageUrl: string
}

type Collection = {
  id: number
  filters: {
    useOrLogic: boolean
    filters: Filter[] | null
  }
  info: {
    name: string
    description: string
  }
  salesChannelId: number
  products: Product[] | null
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [pageCount, setPageCount] = useState(0)
  const [paginatedItems, setPaginatedItems] = useState<Collection[]>([])
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  useEffect(() => {
    document.title = "Koleksiyonlar";
    axios.get("/api/collections")
        .then(res => {
          const raw = res.data.data || []
          setCollections(raw)
        })
        .catch(err => console.error("Collections fetch error:", err))
  }, [])

  useEffect(() => {
    const totalPages = Math.ceil(collections.length / itemsPerPage)
    setPageCount(totalPages)
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    setPaginatedItems(collections.slice(start, end))
  }, [collections, page, itemsPerPage])

  return (
      <div className="flex min-my-3">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-3 md:ml-[45px]">
          <Topbar title="Koleksiyon" subtitle="Koleksiyon Listesi" />
          <main className="min-w-full h-[calc(100vh-145px)] flex flex-col mt-5">

            <div className="flex-1 overflow-auto bg-white rounded-md mr-3 border p-10 flex flex-col">
              <div className="flex justify-end mb-10">
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, val) => val && setViewMode(val)}
                    size="small"
                >
                  <ToggleButton value="table"><ViewListIcon /></ToggleButton>
                  <ToggleButton value="grid"><ViewModuleIcon /></ToggleButton>

                </ToggleButtonGroup>
              </div>
              {viewMode === "table" ? (
                  <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full text-sm">
                      <thead>
                      <tr className="text-center border-b-1 text-xs">
                        <th className="p-4">Başlık</th>
                        <th className="p-4">Ürün Koşulları</th>
                        <th className="p-4">Satış Kanalı</th>
                        <th className="p-4">İşlemler</th>
                        <th className="p-4"></th>
                      </tr>
                      </thead>
                      <tbody>
                      {paginatedItems.map((col) => (
                          <tr key={col.id} className="border-b">
                            <td className="p-4 font-medium">Koleksiyon - {col.id}</td>
                            <td className="p-4 whitespace-pre-line">
                              {col.filters?.filters?.map((f, i) => (
                                  <div key={i}>
                                    {f.title} bilgisi Şuna Eşit: <strong>{f.valueName}</strong>
                                  </div>
                              ))}
                            </td>
                            <td className="p-4">Satış Kanalı – {col.salesChannelId}</td>
                            <td className="p-4 text-center">
                              <Link href={`/edit/${col.id}`} passHref>
                                <CustomTooltip />
                              </Link>
                            </td>
                            <td></td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedItems.map(col => (
                        <div key={col.id} className="border rounded p-4 shadow-sm">
                          <h3 className="font-semibold text-sm mb-2">Koleksiyon - {col.id}</h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {col.filters?.filters?.map((f, i) => (
                                <span key={i}>
                                                    {f.title}: <strong>{f.valueName}</strong><br />
                                                </span>
                            ))}
                          </p>
                          <p className="text-xs mb-2">Satış Kanalı – {col.salesChannelId}</p>
                          <Link href={`/edit/${col.id}`} passHref>
                            <CustomTooltip />
                          </Link>
                        </div>
                    ))}
                  </div>
              )}

              <div className="mt-auto pt-4">
                <div className="flex justify-end">
                  <ul className="inline-flex items-center gap-1 text-sm select-none">
                    <li>
                      <button
                          className="px-2 py-1 cursor-pointer hover:text-[#186eb2]"
                          disabled={page === 1}
                          onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      >
                        ❮
                      </button>
                    </li>
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                        <li key={n}>
                          <button
                              className={`w-10 h-10 rounded cursor-pointer text-center ${
                                  page === n ? "bg-[#186eb2] text-white" : "hover:text-[#186eb2]"
                              }`}
                              onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        </li>
                    ))}
                    <li>
                      <button
                          className="px-2 py-1 cursor-pointer hover:text-[#186eb2]"
                          disabled={page === pageCount}
                          onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
                      >
                        ❯
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}
