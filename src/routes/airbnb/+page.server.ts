import { ObjectId, Decimal128, MongoClient } from 'mongodb'
import type { PageServerLoad } from './$types'
import type { RequestEvent } from './$types'

async function validateImageUrl(url: string): Promise<string> {
    // Simply return the URL or a default if none provided
    return url || '/defaultMoviePoster.png'
}
function convertDecimal128FieldsToNumber(doc: unknown): unknown {
    if (typeof doc === 'object' && doc !== null) {
        for (let key in doc as Record<string, unknown>) {
            const value = (doc as Record<string, unknown>)[key];
            if (value instanceof Decimal128) {
                (doc as Record<string, unknown>)[key] = value.toString();
            } else if (typeof value === 'object' && value !== null) {
                (doc as Record<string, unknown>)[key] = convertDecimal128FieldsToNumber(value);
            }
        }
    }
    return doc;
}


export const load: PageServerLoad = async ({ locals }: RequestEvent) => {
  

    //let airbnbs = []

    const client = locals.mongoClient as MongoClient
    try {
        const airbnbDb = client.db('sample_airbnb')
        const airbnbCollection = airbnbDb.collection('listingsAndReviews')
        const airbnbArray = await airbnbCollection.find().limit(12).toArray()

        // Convert Decimal128 
        const airbnbs = airbnbArray.map((doc) => {
            return convertDecimal128FieldsToNumber(doc)
        })

        return { airbnbs }
    } catch (error) {
        // Return error for recoverable database issues
        console.error('Database error:', error);
        return {
            airbnbs: [],
            error: 'Failed to load listings'
        };
    }
}

export const actions = {
    submitReview: async ({ request, locals }: RequestEvent) => {
        const client = locals.mongoClient as MongoClient
        const data = await request.formData()
        const username = data.get('username') as string
        const rating = data.get('rating') as string
        const review = data.get('review') as string
        const listingName = data.get('listingName') as string
        try {
            await addReview(username, Number(rating), review, listingName, locals.mongoClient)
            const listingId = await getListingId(listingName, client)
            const reviewedListing = await locals.mongoClient.db('sample_airbnb').collection('listingsAndReviews')
            .findOne({ _id: listingId })

            const simplifiedReviews = reviewedListing.reviews.map((doc: any) => {
                return {
                    _id: doc._id.toString(),
                    comments: doc.comments,
                    date: doc.date,
                    listing_id: doc.listing_id,
                    rating: doc.rating,
                    reviewer_id: doc.reviewer_id,
                    reviewer_name: doc.reviewer_name
                }
            })

            return { success: true, message: 'Review submitted', reviews: simplifiedReviews || [] }

        } catch (error) {
            console.error('Database error:', error)
            return { success: false, message: 'Failed to submit review' }
        }
    }
}

async function addReview(username: string, rating: number, review: string, listingName: string, client: MongoClient): Promise<void> {
    console.log('addReview: ', username, rating, review, listingName)
    if (username === '') throw new Error('Username is required')
    if (listingName === '') throw new Error('Listing name is required')
    if (review === '') throw new Error('Review is required')
    
    // Add review to the database
    const userId = await getUserId(username, client)
    const listingId = await getListingId(listingName, client)
    try {
        const listingsWithReviews = client?.db('sample_airbnb').collection('listingsAndReviews')
        await listingsWithReviews?.updateOne(
            { _id: listingId },
            {
                $push: {
                    reviews: {
                        _id: new ObjectId().toString(),
                        date: new Date(),
                        listing_id: listingId.toString(),
                        reviewer_id: userId.toString(),
                        comments: review,
                        reviewer_name: username,
                        rating: rating
                    } as any
                }
            })

    } catch (error) {
        throw new Error('Failed to add review')
    }

    // Now, add the review to the user's reviews property
    try {
        const usersCollection = client?.db('dwdd-3780').collection('users')
        await usersCollection?.updateOne(
            { _id: userId },
            {
                $push: {
                    reviews: {
                        _id: new ObjectId().toString(),
                        date: new Date(),
                        listing_id: listingId.toString(),
                        listing_name: listingName,
                        comments: review,
                        rating: rating
                    } as any
                }
            }
        )

    } catch (error) {
        throw new Error('Failed to add review to user reviews property')
    }
}

async function getUserId(username: string, client: MongoClient): Promise<ObjectId> {
    // Get user ID from the database
    // connect to the database
    try {
        const userDb = client.db('dwdd-3780')
        const userCollection = userDb.collection('users')
        const user = await userCollection?.findOne({ name: username})
        if (!user) {
            // Create a new user
            const result = await userCollection?.insertOne({ name: username })
            return result.insertedId
        }
        return user?._id
    } catch (error) {
        throw new Error('Failed to get user ID')
    }
}

async function getListingId(listingName: string, client: MongoClient): Promise<ObjectId> {
    // Get listingId from the database
    // connect to the database
    try {
        const airbnbDB = client?.db('sample_airbnb')
        const airbnbCollection = airbnbDB.collection('listingsAndReviews')
        const listing = await airbnbCollection?.findOne({ name: listingName})
        if (!listing) {
            throw new Error('Listing not found')
        }
        return listing?._id
    } catch (error) {
        throw new Error('Failed to get listing id')
    }
}