const axios = require('axios');
const config = require('./configs/beauty');
const fs = require('fs');
const cheerio = require('cheerio');

let categoryLinks = [];
const bestsellersLink = 'https://www.amazon.in/gp/bestsellers/?ref_=nav_cs_bestsellers';

let getLinksForCategories = () => {
	axios
		.get(bestsellersLink)
		.then(res => getLinks(res.data))
		.catch(err => console.log(err));
};

let getLinks = html => {
	const $ = cheerio.load(html);
	$('ul#zg_browseRoot ul li a').each((i, elem) => {
		categoryLinks.push({ name: $(elem).text(), link: $(elem).attr('href') });
	});
	for (let i = 0; i < categoryLinks.length; i++) {
		console.log(categoryLinks[i].name);
		axios
			.get(categoryLinks[i].link)
			.then(res => getData(res.data, categoryLinks[i].name))
			.catch(err => console.log(err));
	}
};

let getData = (html, category) => {
	data = [];
	const $ = cheerio.load(html);
	$('.zg-item-immersion').each((i, elem) => {
		data.push({
			category: category,
			rank: $(elem)
				.find('span.zg-badge-text')
				.text(),
			image: $(elem)
				.find('img')
				.attr('src'),
			name: $(elem)
				.find('img')
				.attr('alt'),
			price: $(elem)
				.find('span.p13n-sc-price')
				.text(),
		});
	});
	writeToFile(category, JSON.stringify(data));
};

let writeToFile = (category, data) => {
	fs.writeFile('' + category + '.json', data, function(err) {
		if (err) {
			console.log(err);
		}
		console.log('File was saved.');
	});
};
getLinksForCategories();
