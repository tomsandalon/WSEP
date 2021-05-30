export interface PasswordHandler {
    getInstance(): PasswordHandler
    hash(s: string): string //One way
}