import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'

import authController from './controllers/AuthController'
import userController from './controllers/UserController'
import movieController from './controllers/moviesController'

const app = express()

app.use((_, response, next) => {
	response.header('Access-Control-Allow-Origin', '*')
	response.header(
		'Access-Control-Allow-Methods',
		'GET,HEAD,OPTIONS,POST,PUT,PATCH'
	)
	response.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)
	response.header('Access-Control-Expose-Headers', 'x-total-count')

	return next()
})

export let cache = {}

const REQ_RES = {
	'get-trending-movies': 'trendingMovies',
	'get-trending-tv-shows': 'trendingTvShows',
	'get-latest-movies': 'latestMovies',
	'get-latest-tv-shows': 'latestTvShows',
}

function caching(req: Request, res: Response, next: NextFunction) {
	let url = req.url
	url = url.slice(1)

	if (cache[url] && Object.keys(cache[url]).length > 0) {
		console.log('USING CACHE', cache[url])
		let diff = Date.now() - cache[url].timestamp
		if (diff / 3600000 < 1) {
			res.json({ [REQ_RES[url]]: cache[url].data })
			return
		}
	}

	next()
}

app.use(caching)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/authenticate', authController)
app.use('/account', userController)
app.use('/movie', movieController)

app.get('/', (req, res) => {
	return res.json({ status: 'OK', data: new Date().toLocaleString() })
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`))
