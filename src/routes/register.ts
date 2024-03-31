import Joi from "joi";
import express from "express";
import { v4 as uuidv4 } from "uuid"

import { prisma } from "../utils/db";
import { hashPassword } from "../utils/password";
import { filterErrors, now, validate } from "../utils/utils";
import { error, success } from "../utils/api";

const SCHEMA = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required().regex(RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/))
})

export default async (req: express.Request, res: express.Response) => {
    const valid = validate(SCHEMA, req.body || {})

    if (valid.error) {
        error(res, 400, filterErrors(valid.data))
        return
    }

    const data = valid.data
    const emailExists = await prisma.users.findMany({
        where: {
            email: data.email
        }
    })

    const validUsernameFormat = validate(Joi.object({ username: Joi.string().required().email() }), { username: data.username }).error


    if (!validUsernameFormat) {
        error(res, 400, "Your username cannot be in the form of an email.")
        return
    }

    if (emailExists.length > 0) {
        error(res, 409, "Email already exists.")
        return
    }

    const usernameExists = await prisma.users.findMany({
        where: {
            username: data.username
        }
    })

    if (usernameExists.length > 0) {
        error(res, 409, "Username already exists.")
        return
    }

    // hash the password
    const hashData = await hashPassword(data.password)

    // get a unique id - even though chance of getting a duplicate id is practically 0
    let id = ""
    let unique = false
    while (!unique) {
        id = uuidv4()
        unique = (await prisma.users.findMany({
            where: {
                id
            }
        })).length === 0
    }


    await prisma.users.create({
        data: {
            id,
            username: data.username,
            name: data.name,
            email: data.email,
            password_hash: hashData,
            perm_flag: 1,
            created_at: String(now()),
            updated_at: String(now())
        }
    })

    return success(res, undefined, "Successfully created account.", 201)
}