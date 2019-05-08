require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const dataURL = deviceID => `https://api.origins-china.cn/v1/lasereggs/${deviceID}?key=${process.env.APIKEY}`;
const uuids = fs.readFileSync('device-ids','utf-8').split("\n");

console.log('started polling!' + new Date());
console.log(uuids);

//for each id create a file if it doesn't exisit
uuids.forEach(id=>{
	if(!fs.existsSync(`./data/${id}.csv`)){
		const headerRow = 'ts, humidity, pm10, pm25, temp\n';
		fs.writeFileSync(`./data/${id}.csv`, headerRow)
	}
});
getData(uuids); //get the first lot of data

function getData(ids){
	ids.forEach(id=>{
		if(id){
			console.log("getting", id);
			fetch(dataURL(id))
				.then(res=>res.text())
				.then(body=>{
					const d = JSON.parse(body)['info.aqi'];
					const row = [d.ts, d.data.humidity, d.data.pm10, d.data.pm25, d.data.temp].join(',') + "\n";
					fs.appendFile(`./data/${id}.csv`, row, function(err){
						if(err){
							console.log(err);
						}else{
							console.log(`got ${id}`);
						};
					});
				})
		}
	})
}

setInterval(()=>{
	getData(uuids);
}, 60000);
