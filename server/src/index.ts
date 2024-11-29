import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import * as dynamoose from "dynamoose";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { clerkMiddleware, createClerkClient, requireAuth } from "@clerk/express";


// ROUTE IMPORT
import courseRoutes from "./routes/coursesRoute";
import transactionRoute from "./routes/transactionRoute";
import userClerkRoute from "./routes/userClerkRoute";

// CONFIGURATIONS
dotenv.config()

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
    dynamoose.aws.ddb.local()
}


export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
})

const app = express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(clerkMiddleware())


// ROUTES

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use("/courses", courseRoutes)
app.use("/users/clerk", requireAuth(), userClerkRoute)
app.use("/transaction", requireAuth(), transactionRoute)
// SERVER

const port = process.env.PORT || 3000
if (!isProduction) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}