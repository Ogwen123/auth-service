import Joi from "joi";
import { validate } from "../utils/utils";
import { error } from "../utils/api";
import express from "express";

const SCHEMA = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
})

export default (req: express.Request, res: express.Response) => {
    const data = validate(SCHEMA, req.body || {})

    if (data.error) {
        console.log(data.data)
        return error(res, data.data)
    }


}