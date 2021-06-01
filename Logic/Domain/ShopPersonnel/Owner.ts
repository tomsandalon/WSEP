export interface Owner {
    user_email: string
    appointed_managers: string[]
    appointed_owners: string[]
    appointer_email?: string

    appointees_emails(): string[]
}

export class OwnerImpl implements Owner {
    appointed_managers: string[];
    appointed_owners: string[];

    private constructor(_appointed_managers: string[], _appointed_owners: string[], _appointer_email: string | undefined, user_email: string) {
        this.appointed_managers = _appointed_owners
        this.appointed_owners = _appointed_owners
        this._appointer_email = _appointer_email
        this._user_email = user_email
    }

    private _user_email: string;

    get user_email(): string {
        return this._user_email;
    }

    set user_email(value: string) {
        this._user_email = value;
    }

    private _appointer_email?: string;

    get appointer_email(): string | undefined {
        return this._appointer_email;
    }

    set appointer_email(value: string | undefined) {
        this._appointer_email = value;
    }

    static createFromDB(_appointed_managers: string[], _appointed_owners: string[], _appointer_email: string | undefined, user_email: string) {
        return new OwnerImpl(_appointed_managers, _appointed_owners, _appointer_email, user_email)
    }

    static create(user_email: string, appointer_email?: string) {
        let _appointed_managers = [];
        let _appointed_owners = [];
        let _appointer_email = (appointer_email) ? appointer_email : undefined;
        return new OwnerImpl(_appointed_managers, _appointed_owners, _appointer_email, user_email)
    }

    static ownersAreEqual(o1: Owner, o2: Owner) {
        return o1.user_email == o2.user_email &&
            o1.appointer_email == o2.appointer_email &&
            o1.appointed_owners.length == o2.appointed_owners.length &&
            o1.appointed_managers.length == o2.appointed_managers.length &&
            o1.appointed_owners.every(o1 => o2.appointed_owners.some(o2 => o1 == o2)) &&
            o1.appointed_managers.every(m1 => o2.appointed_managers.some(m2 => m1 == m2))
    }

    appointees_emails(): string[] {
        return this.appointed_owners.concat(this.appointed_managers)
    }

    toString(): string {
        return JSON.stringify(this)
    }
}