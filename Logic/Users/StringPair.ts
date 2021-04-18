export class StringPair{
    private _user_email:string;
    private _hashed_password:string;

    /**
     * Represents a string pair consisting of the user email and its hashed password.
     * @param user_email
     * @param hashed_password
     */
    constructor(user_email:string, hashed_password:string) {
        this._user_email = user_email;
        this._hashed_password = hashed_password;
    }
    get user_email():string {
        return this._user_email;
    }
    get hashed_password():string {
        return this._hashed_password;
    }
    set user_email(val:string){
        this._user_email = val;
    }
    set hashed_password(val:string){
        this._hashed_password = val;
    }

}