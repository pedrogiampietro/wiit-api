const fetch = require('node-fetch')
const cheerio = require('cheerio')

function getMediaItemDetails(item: any, $: any, type: any) {
	const itemATag = $($(item).find('.film-detail')).find('.film-name').find('a')
	const itemName = itemATag.text()
	const itemLink = itemATag.attr('href').slice(1)
	const itemImage = $($(item).find('.film-poster')).find('img').attr('data-src')
	const itemReleaseDate = $($(item).find('.film-detail'))
		.find('.fd-infor')
		.find('.fdi-item')
		.text()
		.slice(0, 4)
	const itemDuration = $($(item).find('.film-detail'))
		.find('.fd-infor')
		.find('.fdi-duration')
		.text()

	return {
		id: itemLink,
		title: itemName,
		image: itemImage,
		releaseDate: itemReleaseDate,
		duration: itemDuration,
		type: type,
	}
}

async function getTrendingMedia({ movies, tvShows }: any) {
	const response = await fetch('https://flixhd.cc/')
	const data = await response.text()
	const $ = cheerio.load(data)

	let media = [] as any
	let mediaScrapeArr = [] as any
	let type: any

	if (movies) {
		mediaScrapeArr = $('#trending-movies').find('.film_list-wrap')
		type = 'Movie'
	} else if (tvShows) {
		mediaScrapeArr = $('#trending-tv').find('.film_list-wrap')
		type = 'TV Series'
	}

	mediaScrapeArr.find('.flw-item').each((i, el) => {
		const mediaItem = $(el)
		media.push(getMediaItemDetails(mediaItem, $, type))
	})

	return media
}

async function getLatestMedia({ movies, tvShows }: any) {
	const response = await fetch('https://flixhd.cc/')
	const data = await response.text()
	const $ = cheerio.load(data)

	let latestDiv
	let media = [] as any
	let type: any

	if (movies) {
		latestDiv = $("h2:contains('Latest Movies')")
		type = 'Movie'
	} else if (tvShows) {
		latestDiv = $("h2:contains('Latest TV Shows')")
		type = 'TV Series'
	}

	const mediaListDiv = $(latestDiv.parent().parent().siblings()[0]).find(
		'.film_list-wrap'
	)

	mediaListDiv.find('.flw-item').each((i: any, el: any) => {
		const mediaItem = $(el)
		media.push(getMediaItemDetails(mediaItem, $, type))
	})

	return media
}

module.exports = {
	getTrendingMedia: getTrendingMedia,
	getLatestMedia: getLatestMedia,
}
