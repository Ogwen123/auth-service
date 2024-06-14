import Joi from "joi";
import express from "express";
import jwt from "jsonwebtoken"

import { prisma } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/password";
import { filterErrors, iso, now, validate } from "../utils/utils";
import { error, success } from "../utils/api";
import { flagBFToPerms, services } from "../utils/flags";
import { LoginResponse } from "../global/types";
import { v4 as uuidv4 } from "uuid"

const SCHEMA = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required().regex(new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/)),
    sendData: Joi.boolean(),
    service: Joi.string().valid(...[...Object.keys(services), "ADMIN"]).required(),
    min_flag: Joi.number()
})

const checkEmailSchema = Joi.object({
    identifier: Joi.string().required().email(),
    password: Joi.string().required(),
    sendData: Joi.boolean(),
    service: Joi.string().valid(...[...Object.keys(services), "ADMIN"]).required(),
    min_flag: Joi.number()
})

export default async (req: express.Request, res: express.Response) => {
    // make sure the body of the request is valid
    const valid = validate(SCHEMA, req.body || {})

    let login_successful = { success: true, reason: "UNKNOWN" }

    if (valid.error) {
        error(res, 400, filterErrors(valid.data, "login"))
        login_successful = { success: false, reason: "INVALID_BODY" }
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
        login_successful = { success: false, reason: "INCORRECT_IDENTIFIER" }
    }

    const user = userArr[0]

    // check the password
    const correctPassword = await checkPassword(user.password_hash, data.password)

    if (!correctPassword) {
        error(res, 401, "Incorrect password or username.")
        login_successful = { success: false, reason: "INCORRECT_PASSWORD" }
    }

    if (!data.min_flag) {
        data.min_flag = 1
    }

    const perms = flagBFToPerms(user.perm_flag!)

    if ((data.min_flag & user.perm_flag!) !== data.min_flag) {
        error(res, 401, data.min_flag === 1 ? "Your account is disabled." : "You do not have the required permissions to access this site.")
        login_successful = { success: false, reason: data.min_flag === 1 ? "DISABLED_ACCOUNT" : "INSUFFICIENT_PERMISSIONS" }
    }

    let token = jwt.sign({ id: user.id, expires: now() + 60 * 60 * 24 * 7 }, process.env.JWT_SECRET)

    if ((await prisma.blacklisted_tokens.findMany({
        where: {
            token
        }
    })).length > 0) {
        token = jwt.sign({ id: user.id, expires: now() + 60 * 60 * 24 * 7 }, process.env.JWT_SECRET)
    }

    if (data.service !== "ADMIN") {
        let flag = services[data.service]
        if ((flag & user.services_flag) === flag) {
            error(res, 401, "You are not authorized to access this specific service.")
            login_successful = { success: false, reason: "INSUFFICIENT_SERVICE_PERMISSIONS" }
        }
    }

    let resBody: LoginResponse = {
        token
    }

    if (data.sendData !== undefined && data.sendData === true) {
        resBody = {
            ...resBody,
            username: user.username!,
            permissions: perms,
            name: user.name!
        }
    }

    success(
        res,
        resBody,
        "Successfully logged in."
    )

    // add login to database
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

    await prisma.logins.create({
        data: {
            id,
            user_id: user.id,
            created_at: iso(),
            generator: data.service,
            success: login_successful.success,
            reason: login_successful.success === true ? null : login_successful.reason || ""
        }
    })
}
