import express from "express"
import * as status from 'statuses'

export const success = (res: express.Response, data: any, message?: string) => {
    res.send({
        success: true,
        code: res.statusCode,
        message: message || status[res.statusCode.toString()],
        data
    })
}

export const error = (res: express.Response, error?: string) => {
    res.send({
        success: false,
        code: res.statusCode,
        message: error || status[res.statusCode.toString()]
    })
}