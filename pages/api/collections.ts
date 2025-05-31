import type { NextApiRequest, NextApiResponse } from "next"
import collectionsData from "@/mockCollections.json"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { collectionId } = req.query

  if (collectionId) {
    const id = parseInt(collectionId as string, 10)
    const collection = collectionsData.data.find((item) => item.id === id)

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" })
    }

    return res.status(200).json({ data: collection, meta: null })
  }

  // Tüm koleksiyonlar ve meta bilgisi
  const meta = collectionsData.meta || {
    page: 1,
    pageSize: collectionsData.data.length,
    totalCount: collectionsData.data.length,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  }

  return res.status(200).json({ data: collectionsData.data, meta })
}
