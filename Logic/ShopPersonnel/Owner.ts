export interface Owner {
    user_email: string
    appointees_emails: string[]
    appointer_email?: string
}

export class OwnerImpl implements Owner {
    private _appointees_emails: string[];
    private _user_email: string;
    private _appointer_email?: string;


    constructor(user_email: string, appointer_email?: string) {
        this._appointees_emails = [];
        if (appointer_email) this._appointer_email = appointer_email;
        this._user_email = user_email;
    }

    get appointees_emails(): string[] {
        return this._appointees_emails;
    }

    set appointees_emails(value: string[]) {
        this._appointees_emails = value;
    }

    get appointer_email(): string | undefined {
        return this._appointer_email;
    }

    set appointer_email(value: string | undefined) {
        this._appointer_email = value;
    }

    get user_email(): string {
        return this._user_email;
    }

    set user_email(value: string) {
        this._user_email = value;
    }

    toString(): string {
        return `$Email: ${this.user_email}\t${this._appointer_email ? 
            "Appointer: " + this._appointer_email.concat("\t") : ""}Appointees: ${this.appointees_emails}\nRole: ${
            this._appointer_email ? "Original owner" : "Owner"}`;
    }
}