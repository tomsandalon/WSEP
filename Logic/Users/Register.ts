import {User} from "./User";
import {PasswordHandler} from "./PasswordHandler";

export interface Register {
    register(user_email: string, password: string): boolean
    password_handler: PasswordHandler
}