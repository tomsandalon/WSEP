import {UserImpl} from "./User";
import {RegisterImpl} from "./Register";
import {Authentication} from "./Authentication";
import {logger} from "../Logger";
import {UserPurchaseHistoryImpl} from "./UserPurchaseHistory";
import {User as UserFromDB} from "../../DataAccess/Getters";
import {CreateAdminIfNotExist} from "../../DataAccess/API";

export interface Login {
    login(user_email: string, password: string): number | string

    guestLogin(): number

    logout(user_email: string): void

    exit(user_id: number): void

    getUserId(user_email: string): number | undefined
}

export class LoginImpl implements Login {
    private static instance: LoginImpl;
    private _existing_user_guests: UserImpl[]
    private readonly _existing_users: UserImpl[]
    private _password_handler: Authentication
    private _register: RegisterImpl

    private constructor(reset?: boolean) {
        this._logged_users = [];
        this._logged_guests = []
        this._existing_user_guests = []
        this._existing_users = []
        this._password_handler = Authentication.getInstance();
        this._register = RegisterImpl.getInstance(reset);
        UserPurchaseHistoryImpl.getInstance(reset)
    }

    private _logged_users: string[]

    get logged_users(): string[] {
        return this._logged_users;
    }

    private _logged_guests: number[]

    get logged_guests(): number[] {
        return this._logged_guests;
    }

    get existing_users(): UserImpl[] {
        return this._existing_users;
    }

    /**
     * Singleton design pattern.
     */
    public static getInstance(reset?: boolean): LoginImpl {
        if (!LoginImpl.instance || reset) {
            LoginImpl.instance = new LoginImpl(reset);
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
    login(user_email: string, password: string): number | string {
        if (this._register.loginVerification(user_email, password)) { // user is registered.
            if (this._logged_users.filter(element => element === user_email).length == 0) { // user not logged in
                const value = this._existing_users.filter(element => element.user_email === user_email)
                if (value.length === 0) { // first time login
                    const new_user = UserImpl.create(user_email, this._password_handler.hash(password), false);
                    this._existing_users.push(new_user);
                    this._logged_users.push(user_email);
                    return new_user.user_id;
                } else { // already logged in before so just return the user
                    this._logged_users.push(user_email);
                    return value[0].user_id;
                }
            }
            logger.Error(`${user_email} already logged in the system.`);
            return `${user_email} already logged in the system.`;
        }
        if (user_email == '') {
            logger.Error(`Email can't be empty!`);
            return `Email can't be empty!`;
        }
        logger.Error(`${user_email} isn't a registered user in the system.`);
        return `${user_email} isn't a registered user the system.`;
    }

    /**
     * Requirement number 3.1
     * Removes the user from the logged user's list.
     * @param user_email
     */
    logout(user_email: string): void {
        let value = this._logged_users.filter(element => element === user_email);
        if (value.length == 0) {
            logger.Error(`${user_email} isn't logged in the system therefore cant logged out.`)
            return;
        }
        this._logged_users = this._logged_users.filter(element => element !== user_email);
    }

    /**
     * Requirement number 2.2
     * removes the current user_id from the guest list / users list
     */
    exit(user_id: number): void {
        const user = this._existing_user_guests.filter(user => user.user_id == user_id);
        if (user.length == 0) { //not a guest
            const logged_user = this._existing_users.filter(user => user.user_id == user_id)
            if (logged_user.length == 0) {
                logger.Error(`User id ${user_id} which is neither a guest nor a user tried to exit system`)
                return
            } else {
                this.logout(logged_user[0].user_email);
            }
        } else {
            this._existing_user_guests = this._existing_user_guests.filter(user => user.user_id != user_id)
            this._logged_guests = this._logged_guests.filter(guest => guest != user_id);
        }
    }

    /**
     * Requirement number 2.1
     * adds a new guest to the system
     */
    guestLogin(): number {
        let user = UserImpl.create();
        this._logged_guests.push(user.user_id)
        this._existing_user_guests.push(user);
        return user.user_id;

    }

    retrieveUser(user_id: number): UserImpl | string {
        const user = this._existing_user_guests.filter(guest => guest.user_id == user_id);
        if (user.length == 0) {
            const logged_user = this._existing_users.filter(user => user.user_id == user_id)
            if (logged_user.length == 0) {
                logger.Error(`${user_id} isn't a guest nor a registered user`);
                return `${user_id} isn't a guest nor a registered user`
            } else
                return logged_user[0]
        } else {
            return user[0]
        }
    }

    getUserId(user_email: string): number | undefined {
        const result = this.existing_users.concat(this._existing_user_guests).find(u => u.user_email == user_email)
        if (!result) return undefined
        return result.user_id
    }

    isLoggedIn(user: string | number): boolean {
        let email = ""
        if (typeof user == 'string')
            email = user
        else {
            const result = this.retrieveUser(user)
            if (typeof result == 'string') return false
            email = result.user_email
        }
        return this._logged_users.some(u => u == email)
    }

    reloadUser(entry: UserFromDB) {
        this.existing_users.push(UserImpl.createFromEntry(entry))
    }

    createAdmin(): Promise<void> {
        return CreateAdminIfNotExist(0, "admin@gmail.com", this._password_handler.hash("admin"), 999);
    }
}