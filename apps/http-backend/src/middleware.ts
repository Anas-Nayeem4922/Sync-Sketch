import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "./types/custom-request";

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function auth(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.token as string;
    const decoded = jwt.verify(token, JWT_SECRET);
    if(decoded) {
        req.userId = (decoded as JwtPayload).id;
        next();
    }else{
        res.status(403).json({
            msg: "Unauthorised user"
        })
    }
}