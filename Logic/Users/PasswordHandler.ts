import * as password_hash from "password-hash";
export class PasswordHandler{
    private static instance: PasswordHandler;

    private constructor() {
    }
    public static getInstance(): PasswordHandler {
        if(!PasswordHandler.instance)
        {
            PasswordHandler.instance = new PasswordHandler();
        }
        return PasswordHandler.instance;
    }

    /**
     *
     * @param password to hash - string
     * returns a hashed function
     */
    public hash(password: string): string {
        return password_hash.generate(password);
    }

    /**
     *
     * @param password as a string
     * return if a password was hashed using the hashing function or not
     */
    public isHashed(password: string): boolean
    {
        return password_hash.isHashed(password);
    }

    /**
     *
     * @param password
     * @param hashed_password
     * returns whether the password matches its hash value.
     */
    public verify(password:string, hashed_password:string)
    {
        return password_hash.verify(password, hashed_password);
    }
}

