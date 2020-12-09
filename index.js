const http= require('http');
const fs= require('fs');
var requests= require("requests");
//const { Transform, Readable, Writable, Duplex } = require('stream');

const homeFile=fs.readFileSync('home.html','utf-8');

const replaceVal= (tempval,orgval)=>{
    //console.log(orgval.sys.country);
    tempval=tempval.replace("{%tempval%}",(orgval.main.temp - 273.15).toFixed(2));
    tempval=tempval.replace("{%tempmin%}",(orgval.main.temp_min - 273.15).toFixed(2));
    tempval=tempval.replace("{%tempmax%}",(orgval.main.temp_max - 273.15).toFixed(2));
    tempval=tempval.replace("{%country%}",orgval.sys.country);
    tempval=tempval.replace("{%city%}",orgval.name);
    tempval=tempval.replace("{%tempstat%}",orgval.weather[0].main);
    return tempval;
}
const server= http.createServer((req,res)=>
{
    /* there are 4 types of streams ,listed below
    Readable
    Writable
    Duplex
    Transform */
    if(req.url=="/")
    {
        requests('http://api.openweathermap.org/data/2.5/weather?q=dhanbad&appid=e928e585472ec1456c18f9e27d1e4d10')
        .on('data', (chunk) =>{
            const objdata= JSON.parse(chunk);
            const arrData=[objdata];
            const realtimedata=arrData.map((val)=>{
           const realTimedata=replaceVal(homeFile,val);
           res.write(realTimedata);
        })
        })
        .on('end', (err) =>{
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        });
    }

});
server.listen(8000,"127.0.0.1");