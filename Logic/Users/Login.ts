import {User} from "./User";
import {PasswordHandler} from "./PasswordHandler";

export interface Login {
    logged_users: User[]

    getInstance(): Login
    login(user_email: string, password: string): User | null
    logout(user_email: string) : void
    password_handler: PasswordHandler
}