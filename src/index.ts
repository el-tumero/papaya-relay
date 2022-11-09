import "dotenv/config"
import { createServer } from "http"
import { Server } from "socket.io"
import express from "express"
import IMessageData from "./types/IMessageData"
import Web3 from "web3"
import cors from "cors"


const app = express()
const PORT = process.env.PORT
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
const web3 = new Web3()

app.use(express.json())
app.use(cors())

const db:IMessageData[] = []

const connectedAddresses:string[] = []

const message = "thats me"


app.get("/online", (req, res) => {
    res.json(connectedAddresses)
})

app.get("/messages", (req, res) => {
    if(req.query.address){
        const result = db.filter(element => element.to === req.query.address)
        res.json(result)
    }
})

io.use((socket, next) => {
    const address = socket.handshake.auth.address as string
    const signature = socket.handshake.auth.signature as string
    const addressOfSigner = web3.eth.accounts.recover(message, signature).toLowerCase()

    if(address == addressOfSigner) next()
    else next(new Error("unauthorized"))
})

io.on("connection", socket => {

    // console.log(`Address ${socket.handshake.auth.address} connected!`)
    connectedAddresses.push(socket.handshake.auth.address)

    socket.on("message", (data:IMessageData) => {
        db.push(data)
        io.emit(data.to, {timestamp: data.timestamp, from: data.from, content: data.content})
    })


    socket.on("disconnect", () => {
        console.log(`Address ${socket.handshake.auth.address} disconnected!`)
        const i = connectedAddresses.indexOf(socket.handshake.auth.address)
        connectedAddresses.splice(i, 1)
    })
})




server.listen(PORT, () => {
    console.log("Server is listening on port", PORT)
})