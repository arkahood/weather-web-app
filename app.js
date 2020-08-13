//jshint esversion:6
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("front-end"));
////////////////////ejs template//////////////////////////
app.set('view engine', 'ejs');
//////////////////////////////////////////////////////////

////////////////env var///////////////////////////////////
require('dotenv').config()
/////////////////////////////////////////////
app.get("/",function(req, res){
  ///////////////////////////////////////////////////////////
  res.sendFile(__dirname+"front-end/index.html");
  ///////////////////////////////////////////////////////////
});
////////////////date/////////////////////////////
const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let output = month  + '\n'+ day  + ',' + year;
////////////////////////////////////////////////

app.post("/",function(req, res){

  console.log(output);
  if(req.body.button === ""){
  const apiKey = process.env.APIKEY;
  const q = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+q+"&appid="+apiKey+"&units=metric";
  https.get(url, function(respond){
    console.log(respond.statusCode);
    if(respond.statusCode == 200){
    respond.on("data",function(data){
      //console.log(data);//return hexadecimal
      const weatherData = JSON.parse(data);//returns json format
      console.log(weatherData);
      const temp = weatherData.main.temp;
      const feels = weatherData.main.feels_like;
      const min = weatherData.main.temp_min;
      const max = weatherData.main.temp_max;
      const humidity = weatherData.main.humidity;
      const des = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgurl = "http://openweathermap.org/img/wn/"+icon+"@2x.png";


    res.render("index",{
      Temp :temp,
      feels : feels,
      min : min,
      max :max,
      humidity : humidity,
      des : des,
      url : imgurl,
      q :q,
      output :output
    });
  });
}
  else{

    res.render("failure");

  }


  });
}else{
  res.redirect("/");
}
});


app.listen(3000,function(req,res){
  console.log("server is up and running");
});
