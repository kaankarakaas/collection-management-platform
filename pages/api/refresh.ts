import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const apiRes = await fetch("https://maestro-api-dev.secil.biz/Auth/RefreshTokenLogin");
    const data = await apiRes.json();

    res.status(200).json(data)
}