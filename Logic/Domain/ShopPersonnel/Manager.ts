import {ManagerPermissions, Permissions} from "./Permissions";

export interface Manager {
    user_email: string
    permissions: Permissions
    appointer_user_email: string
}

export class ManagerImpl implements Manager {
    constructor(user_email: string, appointer_user_email: string) {
        this._appointer_user_email = appointer_user_email;
        this._permissions = new ManagerPermissions();
        this._user_email = user_email;
    }

    private _appointer_user_email: string;

    get appointer_user_email(): string {
        return this._appointer_user_email;
    }

    set appointer_user_email(value: string) {
        this._appointer_user_email = value;
    }

    private _permissions: Permissions;

    get permissions(): Permissions {
        return this._permissions;
    }

    set permissions(value: Permissions) {
        this._permissions = value;
    }

    private _user_email: string;

    get user_email(): string {
        return this._user_email;
    }

    set user_email(value: string) {
        this._user_email = value;
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

