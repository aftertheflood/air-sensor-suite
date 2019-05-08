const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const csvParse = require('d3-dsv').csvParse;

const availableFeeds = fs.readdirSync('../laser-egg-getter/data/');
console.log(availableFeeds);
const feedURL = (id) => `/${id.split('.csv')[0]}.json`;
const latestFeed = (id, count=50) =>`/latest/${count}/${id.split('.csv')[0]}.json`
const feedList = availableFeeds.map( f=>`<li><a href="${feedURL(f)}">${feedURL(f)}</a> | <a href="${latestFeed(f, 50)}">latest</a></li>` ).join('');

app.get('/', (req, res) => {
	res.send(`<html><body><ul>${feedList}</ul></body></html>`);
});

app.get('/:uuid.json', (req,res) => {
	fs.readFile(`../laser-egg-getter/data/${ req.params.uuid }.csv`, 'utf-8', function(err, data){	
		res.send(csvParse(data));
	});
});

app.get('/latest/:num/:uuid.json', (req,res) => {
	fs.readFile(`../laser-egg-getter/data/${ req.params.uuid }.csv`, 'utf-8', function(err, data){
		const parsed = csvParse(data);
		res.send(parsed.slice(Math.max(parsed.length - req.params.num, 1)));
	});
});

app.get('/:uuid.svg', (req,res) => {
	res.send('<svg width="400" height="400"><circle cx="200" cy="200" r="50" fill="#F00"></circle><svg>');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
