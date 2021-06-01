export class Rating {
    number_of_rating: number = 0
    real_rating: number = 0
    raters_email: string[] = []

    constructor(number_of_rating: number, real_rating: number, raters_email: string[]) {
        this.number_of_rating = number_of_rating;
        this.real_rating = real_rating;
        this.raters_email = raters_email;
    }

    static create() {
        return new Rating(0, 0, [])
    }

    static createFromDB(rates: { user_email: string; score: number }[]) {
        const sum = rates.map(r => r.score).reduce((a, b) => a + b, 0);
        const avg = (sum / rates.length) || 0;

        return new Rating(rates.length, avg, rates.map(r => r.user_email))
    }

    add_rating(rating: number, rater: string): void {
        this.raters_email = this.raters_email.concat([rater])
        const aggregator = this.real_rating * this.number_of_rating + rating
        this.number_of_rating++;
        this.real_rating = aggregator / this.number_of_rating
    }

    get_rating(): number | undefined {
        if (this.real_rating == undefined) return undefined
        return Math.round(this.real_rating)
    }

    static ratingsAreEqual(r1: Rating, r2: Rating) {
        return r1.number_of_rating == r2.number_of_rating &&
            Math.abs(r1.real_rating - r2.real_rating) < 0.1 &&
            r1.raters_email.length == r2.raters_email.length &&
            r1.raters_email.every(r1 => r2.raters_email.some(r2 => r1 == r2))
    }
}