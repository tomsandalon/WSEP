export interface SpellChecker {
    getInstance(): SpellChecker,
    check(word: string, dictionary: string[]): string
}