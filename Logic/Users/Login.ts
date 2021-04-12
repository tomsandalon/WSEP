import {UserImpl} from "./User";
import {RegisterImpl} from "./Register";
import {PasswordHandler} from "./PasswordHandler";
import {logger} from "../Logger";

export interface Login {
    login(user_email: string, password: string): UserImpl | string
    logout(user_email: string) : void
}

export class LoginImpl  implements  Login{
    private _logged_users: string[]
    private readonly _existing_users: UserImpl[]
    private _password_handler:PasswordHandler
    private _register:RegisterImpl
    private static instance: LoginImpl;

    private constructor() {
        this._logged_users = [];
        this._existing_users = []
        this._password_handler = PasswordHandler.getInstance();
        this._register = RegisterImpl.getInstance();
    }

    /**
     * Singelton design pattern.
     */
    public static getInstance(): LoginImpl {
        if(!LoginImpl.instance)
        {
            LoginImpl.instance = new LoginImpl();
        }
        return LoginImpl.instance;
    }

    /**
     * Requirement number 2.4
     * checks whether the user is registered to the system and whether its his first session or not and puts him in the logged user's list.
     * @param user_email
     * @param password
     * @return The user that tried to logging in to the system.
     */
    login(user_email: string, password: string): UserImpl | string {
        if(this._register.loginVerification(user_email,password)){ // user is registered.
            if(this._logged_users.filter(element => element === user_email).length == 0){ // user not logged in
                const value = this._existing_users.filter(element => element.user_email === user_email)
                if(value.length === 0){ // first time login
                    const new_user = new UserImpl(user_email,this._password_handler.hash(password),false); //TODO every user is not an admin, maybe only the admin can set this attribute later on?
                    this._existing_users.push(new_user);
                    this._logged_users.push(user_email);
                    return new_user;
                }
                else{ // already logged in before so just return the user
                    this._logged_users.push(user_email);
                    return value[0];
                }
            }
            logger.Error(`${user_email} already logged in the system.`);
            return `${user_email} already logged in the system.`;
        }
        logger.Error(`${user_email} isn't a registered in the system.`);
        return `${user_email} isn't a registered in the system.`;
    }

    /**
     * Requirement number 3.1
     * Removes the user from the logged user's list.
     * @param user_email
     */
    logout(user_email: string): void {
       let value = this._logged_users.filter(element => element !== user_email);
       if(value.length == 0) {
           logger.Error(`${user_email} isn't logged in the system therefore cant logged out.`)
           return;
       }
       this._logged_users = value;
    }



    get logged_users(): string[]{
        return this._logged_users;
    }
    get existing_users(): UserImpl[]{
        return this._existing_users;
    }

}