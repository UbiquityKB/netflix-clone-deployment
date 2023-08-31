import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "GET") {
            res.setHeader("Allow", "GET");
            return res.status(405).end();
        }
        
        const { currentUser } = await serverAuth(req, res);

        const favoritedMovies = await prismadb.movie.findMany({
            where: {
                id: {
                    in: currentUser?.favoriteIds,
                }
            }
        });

        return res.status(200).json(favoritedMovies);
    } catch (error) {
        console.log("Error fetching favorite movies:", error);
        return res.status(500).end();
    }
}