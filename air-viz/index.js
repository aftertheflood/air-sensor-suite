const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const csvParse = require('d3-dsv').csvParse;


app.get('/', (req, res) => {
	res.send('Hello air monitors!')
})

app.get('/:uuid.json', (req,res)=>{
	fs.readFile(`../laser-egg-getter/data/${req.params.uuid}.csv`, 'utf-8', function(err, data){	
		res.send(csvParse(data));
	})
});

app.get('/:uuid.svg', (req,res)=>{
	res.send('<svg width="400" height="400"><circle cx="200" cy="200" r="50" fill="#F00"></circle><svg>');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
