import Joi from "joi";
import express from "express";

import { prisma } from "../utils/db";
import { now, validate } from "../utils/utils";
import { error, success } from "../utils/api";
import { getPayload } from "../utils/token";

const SCHEMA = Joi.object({
    token: Joi.string().required()
})

export default async (req: express.Request, res: express.Response) => {
    // make sure the body of the request is valid
    const valid = validate(SCHEMA, req.body || {})

    if (valid.error) {
        error(res, 401, valid.data)
        return
    }

    const data = valid.data

    const validToken = getPayload(data.token)

    if (validToken === false) {
        error(res, 401, "This is not a valid token.")
        return
    }

    await prisma.blacklisted_tokens.create({
        data: {
            token: data.token,
            logout_timestamp: now()
        }
    })

    success(
        res,
        undefined,
        "Successfully logged out."
    )
}