import * as password_hash from "password-hash";

/**
 * Service-Level Requirement number 1 - Privacy.
 */
export class Authentication {
    private static instance: Authentication;

    private constructor() {
    }

    /**
     * Singelton design pattern
     */
    public static getInstance(): Authentication {
        if(!Authentication.instance)
        {
            Authentication.instance = new Authentication();
        }
        return Authentication.instance;
    }

    /**
     *
     * @param password to hash - string
     * @return a hashed value of the provided string with salt
     */
    public hash(password: string): string {
        return password_hash.generate(password);
    }

    /**
     *
     * @param password as a string
     * @return if a password was hashed using the hashing function
     */
    public isHashed(password: string): boolean
    {
        return password_hash.isHashed(password);
    }

    /**
     *
     * @param password
     * @param hashed_password
     * @return true if the the hashed_password is the password's hashed value.
     */
    public verify(password:string, hashed_password:string):boolean
    {
        return password_hash.verify(password, hashed_password);
    }
}

