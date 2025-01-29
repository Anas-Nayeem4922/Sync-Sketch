import express, { Request, Response } from "express";
const app = express();
const port = 3001;
import bcrypt from "bcryptjs";
require('dotenv').config();
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET as string;

import { RoomSchema, SigninSchema, SignupSchema } from "@repo/common/type"
import { client } from "@repo/db/db"
import { auth } from "./middleware";
import { CustomRequest } from "./types/custom-request";

app.use(express.json());

app.post("/signup", async(req: Request, res: Response) => {
    const data = SignupSchema.safeParse(req.body);
    if(data.success) {
        const hashedPassword = await bcrypt.hash(data.data.password, 3);
        const user = await client.user.create({
            data: {
                email: data.data.email,
                username: data.data.username,
                password: hashedPassword
            }
        })
        const token = jwt.sign({
            id: user.id
        }, JWT_SECRET);
        res.json({
            userId: user.id,
            token
        })
    }else{
        res.status(411).json({
            err: data.error
        })
    }
});

app.post("/signin", async(req: Request, res: Response) => {
    const data = SigninSchema.safeParse(req.body);
    if(data.success) {
        const user = await client.user.findFirst({
            where: {
                email: data.data.email
            }
        })
        if(user) {
            const userPassword = await bcrypt.compare(data.data.password, user.password);
            if(userPassword) {
                const token = jwt.sign({
                    id: user.id
                }, JWT_SECRET)
                res.json({
                    token
                })
            }else{
                res.status(411).json({
                    msg: "Incorrect password"
                })
            }
        }else{
            res.status(411).json({
                msg: "Incorrect email"
            })
        }
    }else{
        res.status(411).json({
            err: data.error
        })
    }
});

app.post("/room", auth, async(req: CustomRequest, res: Response) => {
    const data = RoomSchema.safeParse(req.body);
    const userId = req.userId as string;
    if(data.success) {
        const room = await client.room.create({
            data: {
                slug: data.data.slug,
                adminId: userId
            }
        });
        res.json({
            id: room.id
        })
    }else{
        res.status(403).json({
            msg: "Invalid inputs"
        })
    }
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})