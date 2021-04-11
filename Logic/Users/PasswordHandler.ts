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
     * @param a password to hash - string
     * returns a hashed function
     */
    public hash(password: string): string {
        let passwordHash = require('password-hash');
        return passwordHash.generate(password);
    }

    /**
     *
     * @param password as a string
     * return if a password was hashed using the hashing function or not
     */
    public isHashed(password: string): boolean
    {
        let passwordHash = require('password-hash');
        return passwordHash.isHashed(password);
    }

    /**
     *
     * @param password
     * @param hashed_password
     * returns whether the password matches its hash value.
     */
    public verify(password:string, hashed_password:string)
    {
        let passwordHash = require('password-hash');
        return passwordHash.verify(password, hashed_password);
    }
}

