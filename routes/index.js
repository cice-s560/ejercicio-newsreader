const express = require('express');
const router = express.Router();
const axios = require("axios");

router.get('/', function(req, res, next) {

    res.render('landing', { title: 'NewsReader' });

});

router.get('/feed', async function(req, res, next) {

    const news = await axios.get("https://newsapi.org/v2/top-headlines", {
            params: {
            country: "us",
            apiKey: process.env.NEWS_API_KEY
        }
    }).catch(e => res.status(500).send("error"));

    res.render('feed', {
        title: 'NewsReader | Feed', 
        noticias: news.data.articles 
    });

});

router.post('/detail', async function(req, res, next) {

    if(req.body.publishedAt)
        req.body.publishedAt = formatDate("Y-m-d", req.body.publishedAt);

    res.render('detail', {
        title: 'NewsReader | Noticia', 
        noticia: req.body
    });

});

function formatDate(format, date){

    date = new Date(date);
    
    format = format.split("Y").join(date.getFullYear());
    format = format.split("m").join(("0" + (date.getMonth()+1)).slice(-2));
    format = format.split("d").join(("0" + date.getDate()).slice(-2));

    return format;

}

module.exports = router;
