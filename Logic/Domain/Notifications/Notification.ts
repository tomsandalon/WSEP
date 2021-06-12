export class Notification {
    private readonly _message: string;

    constructor(message: string) {
        this._message = message;
    }

    get message(): string {
        return this._message;
    }

    static notificationsAreEqual(n1: Notification[], n2: Notification[]): boolean {
        return n1.every(n1 => n2.some(n2 => n1.message == n2.message))
    }
}