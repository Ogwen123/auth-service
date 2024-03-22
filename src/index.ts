import express from "express"
import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"
import bodyParser from "body-parser"

import { prisma } from "./utils/db"
import { hash_password } from "./utils/password"
import { now } from "./utils/utils"

import register from "./routes/register"

dotenv.config()

const app = express()
const port = 3000

//app.use(express.json())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send({
        "message": "API is running"
    })
})

app.get("/api/test", async (req, res) => {
    const hash_data = await hash_password("Password100")
    await prisma.users.create({
        data: {
            id: uuidv4(),
            username: "admin",
            name: "Owen Jones",
            email: "owen.d.jones@btinternet.com",
            password_hash: hash_data[1],
            salt: hash_data[0],
            perm_flag: 1,
            created_at: now(),
            updated_at: now()
        }
    })

    res.send({
        "message": "success"
    })
})

app.post("/api/register", (req, res) => {
    register(req, res)
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})