import Joi from "joi";
import express from "express";
import jwt from "jsonwebtoken"

import { prisma } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/password";
import { now, validate } from "../utils/utils";
import { error, success } from "../utils/api";
import { flagBFToPerms } from "../utils/flags";
import { LoginResponse } from "../global/types";

const SCHEMA = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required().regex(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}")),
    sendData: Joi.boolean()
})

const checkEmailSchema = Joi.object({
    identifier: Joi.string().required().email(),
    password: Joi.string().required()
})

export default async (req: express.Request, res: express.Response) => {
    // make sure the body of the request is valid
    const valid = validate(SCHEMA, req.body || {})

    if (valid.error) {
        error(res, 400, valid.data)
        return
    }

    let isEmail = true

    if (validate(checkEmailSchema, req.body).error) {
        isEmail = false
    }

    const data = valid.data

    const query = isEmail ? { email: data.identifier } : { username: data.identifier }

    // make sure the user is in the database
    const userArr = await prisma.users.findMany({
        where: query
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

    const perms = flagBFToPerms(user.perm_flag)

    if (!perms.includes("ACTIVE")) {
        error(res, 401, "Your account is disabled.")
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

    let resBody: LoginResponse = {
        token
    }

    if (data.sendData !== undefined && data.sendData === true) {
        resBody = {
            ...resBody,
            username: user.username,
            permissions: perms,
            name: user.name
        }
    }

    success(
        res,
        resBody,
        "Successfully loggin in."
    )
}