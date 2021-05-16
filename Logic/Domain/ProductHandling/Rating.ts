export class Rating {
    number_of_rating: number = 0
    real_rating: number | undefined

    add_rating(rating: number): void {
        if (this.real_rating == undefined) {
            this.real_rating = rating
            this.number_of_rating++;
            return
        }
        const aggregator = this.real_rating * this.number_of_rating + rating
        this.number_of_rating++;
        this.real_rating = aggregator / this.number_of_rating
    }

    get_rating(): number | undefined {
        if (this.real_rating == undefined) return undefined
        return Math.round(this.real_rating)
    }
}