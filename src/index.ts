import express from "express"
import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"
import bodyParser from "body-parser"

import { prisma } from "./utils/db"
import { hashPassword } from "./utils/password"
import { now } from "./utils/utils"

import register from "./routes/register"
import login from "./routes/login"
import logout from "./routes/logout"
import verifyToken from "./routes/verifyToken"

//@ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

dotenv.config()

const app = express()
const port = 3000

//app.use(express.json())
app.use(bodyParser.json())

app.use('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PATCH,DELETE,OPTIONS")
    res.header("Access-Control-Max-Age", "86400")
    next();
});

app.get('/', (req, res) => {
    res.send({
        "message": "API is running"
    })
})

app.post("/api/register", (req, res) => {
    register(req, res)
})

app.post("/api/login", (req, res) => {
    login(req, res)
})

app.post("/api/logout", (req, res) => {
    logout(req, res)
})

app.get("/api/verify-token", (req, res) => {
    verifyToken(req, res)
})

app.listen(port, () => {
    console.log(`auth service loaded, ${port}`)
})