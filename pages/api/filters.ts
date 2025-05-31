import type { NextApiRequest, NextApiResponse } from 'next'
import filters from '@/mockFilters.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // const apiRes = await fetch("https://maestro-api-dev.secil.biz/Collection/GetAll");
    // const data = await apiRes.json();

    res.status(200).json(filters)
}



