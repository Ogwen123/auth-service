import Joi from "joi";
import express from "express";
import jwt from "jsonwebtoken"

import { prisma } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/password";
import { now, validate } from "../utils/utils";
import { error, success } from "../utils/api";

const SCHEMA = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().regex(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}"))
})

export default async (req: express.Request, res: express.Response) => {
    // make sure the body of the request is valid
    const valid = validate(SCHEMA, req.body || {})

    if (valid.error) {
        return error(res, 401, valid.data)
        return
    }

    const data = valid.data

    // make sure the user is in the database
    const userArr = await prisma.users.findMany({
        where: {
            username: data.username
        }
    })

    if (userArr.length === 0 || userArr.length > 1) {
        error(res, 400, "Incorrect password or username.")
        return
    }

    const user = userArr[0]

    // check the password
    const correctPassword = await checkPassword(user.password_hash, data.password)

    if (!correctPassword) {
        error(res, 401, "Incorrect password or username.")
        return
    }

    let token = jwt.sign({ id: user.id, expires: now() + 60 * 60 * 24 * 7 }, process.env.JWT_SECRET)

    if ((await prisma.blacklisted_tokens.findMany({
        where: {
            token
        }
    })).length > 0) {
        token = jwt.sign({ id: user.id, expires: now() + 60 * 60 * 24 * 7 }, process.env.JWT_SECRET)
    }

    success(
        res,
        {
            token
        },
        "Successfully loggin in."
    )
}