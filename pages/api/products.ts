import { NextApiRequest, NextApiResponse } from "next"
import allProducts from "@/mockProducts.json"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Sadece POST desteklenir." })
    }

    const { additionalFilters = [], page = 1, pageSize = 36 } = req.body

    const products = allProducts.data.data

    const filteredProducts = additionalFilters.reduce((acc, filter) => {
        return acc.filter(product => {
            const fieldValue = product[filter.key]
            return fieldValue === filter.value
        })
    }, products)

    const paginated = filteredProducts.slice(
        (page - 1) * pageSize,
        page * pageSize
    )

    return res.status(200).json({
        status: 200,
        message: "Başarılı",
        data: {
            meta: {
                page,
                pageSize,
                total: filteredProducts.length
            },
            data: paginated
        }
    })
}
