import jwt from "jsonwebtoken"
import { TokenPayload } from "../global/types"

export const getPayload = (token: string): TokenPayload | false => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        return (decoded as TokenPayload)
    } catch (e) {
        return false
    }
}