import Joi from "joi"
import express from "express"
import { validate } from "../utils/utils"
import { error, success } from "../utils/api"
import { prisma } from "../utils/db"
import { getPayload } from "../utils/token"
import { TokenPayload } from "../global/types"

export default async (req: express.Request, res: express.Response) => {
    // validate token
    let token;

    token = req.get("Authorization")?.split(" ")[1]

    if (token === undefined) {
        error(res, 401, "Invalid token")
        return
    }

    let validToken = getPayload(token)

    if (validToken === false) {
        error(res, 401, "This is not a valid token.")
        return
    }

    validToken = validToken as TokenPayload

    const userData = await prisma.users.findUnique({
        where: {
            id: validToken.id
        }
    })

    if (userData === null) {
        error(res, 404, `User data not found for ${validToken.id}`)
        return
    }
    success(res, {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        perm_flag: userData.perm_flag,
        created_at: userData.created_at
    },
        "Successfully fetched user data."
    )
}