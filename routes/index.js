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
  }).catch(e => console.log(e));  

  const news_array = news.data.articles;

  res.render('feed', { title: 'NewsReader | Feed', news_array: news_array});
});

module.exports = router;
