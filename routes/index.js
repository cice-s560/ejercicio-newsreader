const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid/v3");
const dbPath = path.join(__dirname, "../db.json");
// !AVISO Necesitamos un /db.json ==> { "articles": [] }
const db = JSON.parse(fs.readFileSync(dbPath), "utf8");

function saveOnDB(data,section) {
  let oldNews;
  let totalNews;
  let dataToWrite;
  switch (section) {
    case 'general':
    oldNews = db.general;
    db.general = [...oldNews, ...data];
    dataToWrite = db;
    break;
    case 'sports':
    oldNews = db.sports;
    db.sports = [...oldNews, ...data];
    dataToWrite = db;
    break;
    case 'entertainment':
    oldNews = db.entertainment;
    db.entertainment = [...oldNews, ...data];
    dataToWrite = db;
    break;
    case 'business':
    oldNews = db.business;
    db.business = [...oldNews, ...data];
    dataToWrite = db;
    break;
  }

  const dataString = JSON.stringify(db);
  fs.writeFileSync(dbPath, dataString, "utf8");
}

router.get("/", function(req, res, next) {
  res.render("landing", { title: "NewsReader" });
});

router.get("/feed", async function(req, res) {
  const news = await axios
    .get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        apiKey: process.env.NEWS_API_KEY
      }
    })
    .catch(e => res.status(500).send("error"));

  const totalArticles = news.data.articles.map(article => ({
    ...article,
    id: uuid(article.url, uuid.URL),
    rating: 0,
    fav: false
  }));

  const articlesFiltered = totalArticles.filter(item => {
    const check = db.general.find(art => art.url === item.url);
    // Quiero devolver el contrario de la comprobación
    // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
    return !Boolean(check);
  });

  // Pinto en pantalla todos los que me vienen
  res.render("feed", {
    title: "NewsReader | Feed",
    noticias: totalArticles
  });

  // Guardo solo los que no tenía guardados antes
  saveOnDB(articlesFiltered, 'general');
});

router.get("/feed/sports", async function(req, res) {
  const news = await axios
    .get("https://newsapi.org/v2/top-headlines?category=sports", {
      params: {
        country: "us",
        apiKey: process.env.NEWS_API_KEY
      }
    })
    .catch(e => res.status(500).send("error"));

  const totalArticles = news.data.articles.map(article => ({
    ...article,
    id: uuid(article.url, uuid.URL),
    rating: 0,
    fav: false
  }));

  const articlesFiltered = totalArticles.filter(item => {
    const check = db.sports.find(art => art.url === item.url);
    // Quiero devolver el contrario de la comprobación
    // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
    return !Boolean(check);
  });

  // Pinto en pantalla todos los que me vienen
  res.render("feed", {
    title: "NewsReader | Sports",
    noticias: totalArticles
  });

  // Guardo solo los que no tenía guardados antes
  saveOnDB(articlesFiltered, 'sports');
});

router.get("/feed/general", async function(req, res) {
  const news = await axios
    .get("https://newsapi.org/v2/top-headlines?category=general", {
      params: {
        country: "us",
        apiKey: process.env.NEWS_API_KEY
      }
    })
    .catch(e => res.status(500).send("error"));

  const totalArticles = news.data.articles.map(article => ({
    ...article,
    id: uuid(article.url, uuid.URL),
    rating: 0,
    fav: false
  }));

  const articlesFiltered = totalArticles.filter(item => {
    const check = db.general.find(art => art.url === item.url);
    // Quiero devolver el contrario de la comprobación
    // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
    return !Boolean(check);
  });

  // Pinto en pantalla todos los que me vienen
  res.render("feed", {
    title: "NewsReader | General",
    noticias: totalArticles
  });

  // Guardo solo los que no tenía guardados antes
  saveOnDB(articlesFiltered);
});

router.get("/feed/business", async function(req, res) {
  const news = await axios
    .get("https://newsapi.org/v2/top-headlines?category=business", {
      params: {
        country: "us",
        apiKey: process.env.NEWS_API_KEY
      }
    })
    .catch(e => res.status(500).send("error"));

  const totalArticles = news.data.articles.map(article => ({
    ...article,
    id: uuid(article.url, uuid.URL),
    rating: 0,
    fav: false
  }));

  const articlesFiltered = totalArticles.filter(item => {
    const check = db.business.find(art => art.url === item.url);
    // Quiero devolver el contrario de la comprobación
    // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
    return !Boolean(check);
  });

  // Pinto en pantalla todos los que me vienen
  res.render("feed", {
    title: "NewsReader | Business",
    noticias: totalArticles
  });

  // Guardo solo los que no tenía guardados antes
  saveOnDB(articlesFiltered);
});

router.get("/feed/entertainment", async function(req, res) {
  const news = await axios
    .get("https://newsapi.org/v2/top-headlines?category=entertainment", {
      params: {
        country: "us",
        apiKey: process.env.NEWS_API_KEY
      }
    })
    .catch(e => res.status(500).send("error"));

  const totalArticles = news.data.articles.map(article => ({
    ...article,
    id: uuid(article.url, uuid.URL),
    rating: 0,
    fav: false
  }));

  const articlesFiltered = totalArticles.filter(item => {
    const check = db.entertainment.find(art => art.url === item.url);
    // Quiero devolver el contrario de la comprobación
    // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
    return !Boolean(check);
  });

  // Pinto en pantalla todos los que me vienen
  res.render("feed", {
    title: "NewsReader | Entertainment",
    noticias: totalArticles
  });

  // Guardo solo los que no tenía guardados antes
  saveOnDB(articlesFiltered);
});

router.get("/detail/:id", async function(req, res) {
  const param = req.params.id;
  const article = db.articles.find(item => item.id === param);

  res.render("detail", { title: "NewsReader | Detail", article });
});

router.patch("/update-rating/:id", async function(req, res) {
  db.articles.forEach(article => {
    if (article.id === req.params.id) article.rating = req.body.rating;
  });
  fs.writeFileSync(dbPath, JSON.stringify(db), "utf8");

  return res.status(200).send();
});

router.patch("/update-fav/:id", async function(req, res) {
  const article = db.articles.find(item => item.id === req.params.id);
  article.fav = !Boolean(article.fav);
  fs.writeFileSync(dbPath, JSON.stringify(db), "utf8");

  return res.status(200).send();
});

function formatDate(format, date) {
  date = new Date(date);

  format = format.split("Y").join(date.getFullYear());
  format = format.split("m").join(("0" + (date.getMonth() + 1)).slice(-2));
  format = format.split("d").join(("0" + date.getDate()).slice(-2));

  return format;
}

module.exports = router;
