import Joi from "joi";
import express from "express";

import { prisma } from "../utils/db";
import { now, validate } from "../utils/utils";
import { error, success } from "../utils/api";
import { getPayload } from "../utils/token";
import { TokenPayload } from "../global/types";
import { flagBFToPerms } from "../utils/flags";

export default async (req: express.Request, res: express.Response) => {
    // make sure the body of the request is valid

    const token = req.get("Authorization")?.split(" ")[1]

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

    const blacklisted = await prisma.blacklisted_tokens.findUnique({
        where: {
            token: token
        }
    })

    if (blacklisted !== null) {
        error(res, 401, "Expired token")
        return
    }

    if (validToken.expiry < now()) {
        error(res, 401, "Expired token")
        return
    }

    const user = await prisma.users.findUnique({
        where: {
            id: validToken.id
        }
    })

    if (user === null) {
        error(res, 400, "User does not exist.")
        return
    }

    const userPerms = flagBFToPerms(user.perm_flag)

    success(
        res,
        {
            perms: userPerms
        },
        "Successfully validated token."
    )
}