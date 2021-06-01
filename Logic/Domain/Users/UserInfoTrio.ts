export class UserInfoTrio {
    /**
     * Represents a string pair consisting of the user email and its hashed password.
     * @param user_email
     * @param hashed_password
     * @param underaged
     */
    constructor(user_email: string, hashed_password: string, underaged?: number) {
        this._user_email = user_email;
        this._hashed_password = hashed_password;
        this._underaged = underaged
    }

    private _user_email: string;

    get user_email(): string {
        return this._user_email;
    }

    set user_email(val: string) {
        this._user_email = val;
    }

    private _hashed_password: string;

    get hashed_password(): string {
        return this._hashed_password;
    }

    set hashed_password(val: string) {
        this._hashed_password = val;
    }

    private _underaged: number | undefined

    get underaged(): number | undefined {
        return this._underaged;
    }

    set underaged(value: number | undefined) {
        this._underaged = value;
    }

}