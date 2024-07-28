import Joi from "joi";
import express from "express";

import { prisma } from "../utils/db";
import { filterErrors, now, validate } from "../utils/utils";
import { error, success } from "../utils/api";
import { getPayload } from "../utils/token";
import { TokenPayload } from "../global/types";
import { flagBFToPerms, services } from "../utils/flags";

const SCHEMA = Joi.object({
    service: Joi.string().valid(...[...Object.values(services), "ADMIN"]).required(),
})

export default async (req: express.Request, res: express.Response) => {
    // make sure the body of the request is valid
    const valid = validate(SCHEMA, req.body || {})
    if (valid.error) {
        error(res, 400, valid.data)
        return
    }

    let data = valid.data

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

    const userPerms = flagBFToPerms(user.perm_flag!)

    if (!userPerms.includes("ACTIVE")) {
        error(res, 401, "This user is disabled.")
        return
    }

    if (data.service !== "ADMIN") {
        let flag = parseInt(Object.keys(services)[Object.values(services).indexOf(data.service)])
        if ((flag & user.services_flag) === flag) {
            error(res, 401, "You are not authorized to access this specific service.")
            return
        }
    }

    success(
        res,
        {
            id: validToken.id,
            perms: userPerms
        },
        "Successfully validated token."
    )
}