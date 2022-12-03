import express from 'express'
import { cache } from '../server'

const router = express.Router()

router.get('/get-trending-movies', async (request, response) => {
	const trendingMovies = await getTrendingMedia({ movies: true })
	response.json({ trendingMovies: trendingMovies })

	console.log('SCRAPING TRENDING MOVIES')

	cache['get-trending-movies'] = {
		timestamp: Date.now(),
		data: trendingMovies,
	}
})

router.get('/get-trending-tv-shows', async (request, response) => {
	const trendingTvShows = await getTrendingMedia({ tvShows: true })
	response.json({ trendingTvShows: trendingTvShows })

	console.log('SCRAPING TRENDING SHOWS')

	cache['get-trending-tv-shows'] = {
		timestamp: Date.now(),
		data: trendingTvShows,
	}
})

router.get('/get-latest-movies', async (request, response) => {
	const latestMovies = await getLatestMedia({ movies: true })
	response.json({ latestMovies: latestMovies })

	console.log('SCRAPING LATEST MOVIES')

	cache['get-latest-movies'] = {
		timestamp: Date.now(),
		data: latestMovies,
	}
})

router.get('/get-latest-tv-shows', async (request, response) => {
	const latestTvShows = await getLatestMedia({ tvShows: true })
	res.json({ latestTvShows: latestTvShows })

	console.log('SCRAPING LATEST TV SHOWS')

	cache['get-latest-tv-shows'] = {
		timestamp: Date.now(),
		data: latestTvShows,
	}
})

export default router
