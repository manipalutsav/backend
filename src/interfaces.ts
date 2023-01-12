import { Request } from "express";
import { User } from "./models/User";

export interface UserRequest extends Request {
    user: User
}
