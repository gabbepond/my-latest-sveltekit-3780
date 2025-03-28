import type { MovieType } from '$lib/types/MovieType'
import { json } from '@sveltejs/kit'

async function validateImageUrl(url: string): Promise<string> {
    // Simply return the URL or a default if none provided
    return url || '/defaultMoviePoster.png'
}

export const POST = async ({ request, locals }) => {
    const {
        yearRange: [startYear, endYear],
        selectedRatings,
        scoreRange: [minScore, maxScore]
    } = await request.json()

    let movies
    let client

    try {
        const client = locals.mongoClient

        const movieDb = client?.db('sample_mflix')

        const moviesCollection = movieDb?.collection('movies')

        const movieArray = await moviesCollection
            ?.find({
                $and: [
                    { year: { $gte: startYear, $lte: endYear } },
                    { 'imdb.rating': { $gte: minScore, $lte: maxScore } },
                    { rated: { $in: selectedRatings } }
                ]
            })
            .toArray()

        movies = await Promise.all(
            (movieArray ?? []).map(async (movie: MovieType) => ({
                id: movie._id.toString(),
                title: movie.title,
                year: movie.year,
                poster: await validateImageUrl(movie.poster)
            }))
        )

        //console.log('Movies: ', movies)
    } catch (error) {
        console.error('MongoDB connection error:', error)
        return json({ error: 'Internal Server Error' }, { status: 500 })
    }
    return json(movies, { status: 200 })
}
