import {ManagerPermissions, Permissions} from "./Permissions";

export interface Manager {
    user_email: string
    permissions: Permissions
    appointer_user_email: string
}

export class ManagerImpl implements Manager {
    private _appointer_user_email: string;
    private _permissions: Permissions;
    private _user_email: string;

    constructor(user_email: string, appointer_user_email: string) {
        this._appointer_user_email = appointer_user_email;
        this._permissions = new ManagerPermissions();
        this._user_email = user_email;
    }

    get appointer_user_email(): string {
        return this._appointer_user_email;
    }

    set appointer_user_email(value: string) {
        this._appointer_user_email = value;
    }

    get permissions(): Permissions {
        return this._permissions;
    }

    set permissions(value: Permissions) {
        this._permissions = value;
    }

    get user_email(): string {
        return this._user_email;
    }

    set user_email(value: string) {
        this._user_email = value;
    }

    toString(): string {
        return `Email: ${this._user_email}\tAppointer: ${this._appointer_user_email}\nRole: manager\nPermissions:${
            this._permissions.toString()
        }`;
    }
}

