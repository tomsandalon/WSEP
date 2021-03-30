import {User} from "./User";
import {PasswordHandler} from "./PasswordHandler";

export interface Login {
    login(user_email: string, password: string): User | null
    password_handler: PasswordHandler
}