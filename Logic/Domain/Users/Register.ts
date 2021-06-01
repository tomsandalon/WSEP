import {Authentication} from "./Authentication";
import {UserInfoTrio} from "./UserInfoTrio";
import {logger} from "../Logger";

export interface Register {
    registered_users: UserInfoTrio[]

    register(user_email: string, password: string, age?: number): boolean

    loginVerification(user_email: string, hashed_password: string): boolean
}

export class RegisterImpl implements Register {
    private static instance: RegisterImpl;
    private _password_handler: Authentication
    private readonly _registered_users: UserInfoTrio[]

    private constructor() {
        this._password_handler = Authentication.getInstance();
        this._registered_users = []
    }

    get registered_users(): UserInfoTrio[] {
        return this._registered_users
    }

    /**
     * Singelton design pattern.
     */
    public static getInstance(reset?: boolean): RegisterImpl {
        if (!RegisterImpl.instance || reset) {
            RegisterImpl.instance = new RegisterImpl();
        }
        return RegisterImpl.instance;
    }

    /**
     * @param user_email
     * @param password
     * @return true if the user email and password are of a registered user.
     */
    loginVerification(user_email: string, password: string): boolean {
        const value = this._registered_users.filter(element => element.user_email === user_email && this._password_handler.verify(password, element.hashed_password))
        if (value.length == 0) {
            logger.Error("Login failed - user doesnt exist.")
            return false;
        }
        return true;
    }

    /**
     * Requirement number 2.3
     * Saves the newly registered user in the registered user's list.
     * @param user_email
     * @param password
     * @param age
     * @return true if the user's email password is unique and valid.
     */
    register(user_email: string, password: string, age?: number): boolean {
        if (this.validateEmail(user_email)) {
            const hashed_password = this._password_handler.hash(password);
            this._registered_users.push(new UserInfoTrio(user_email, hashed_password, age))
            return true;
        }
        return false;
    }

    /** checks if the user_email actually exists in the system
     *
     * @param user_email
     * @return true if the user_email exists
     */
    verifyUserEmail(user_email: string): boolean {
        return this._registered_users.filter(pair => pair.user_email == user_email).length > 0
    }

    /**
     *
     * @param user_email
     * @return true if the email is not in use.
     */
    private alreadyExists(user_email: string): boolean {
        const value = this._registered_users.filter(element => user_email == element.user_email)
        if (value.length > 0) {
            logger.Error("Email is already in use by another user");
            return false;
        }
        return true;
    }

    /**
     * validates user email and checks if the format is correct.
     * @param user_email
     * @return true if the format of the email is correct and the email is not in use.
     */
    private validateEmail(user_email: string): any {
        //regular expression which represents a example@example.example template
        let re = /\S+@\S+\.\S+/;
        if (!re.test(user_email)) {
            logger.Error("Email is not of correct format")
            return false;
        }
        return this.alreadyExists(user_email);
    }
}


