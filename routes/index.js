const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid/v3");
const dbPath = path.join(__dirname, "../db.json");
// !AVISO Necesitamos un /db.json ==> { "articles": [] }
const db = JSON.parse(fs.readFileSync(dbPath), "utf8");

function saveOnDB(data) {
  const oldNews = db.articles;
  const totalNews = [...oldNews, ...data]; // db.articles.concat(data)
  const dataToWrite = { articles: totalNews };
  const dataString = JSON.stringify(dataToWrite);

  fs.writeFileSync(dbPath, dataString, "utf8");
}

router.get("/", function(req, res, next) {
  res.render("landing", { title: "NewsReader" });
});

router.get("/feed", async function(req, res) {
  const filter = req.query.category;
  const urlToFetch = filter
    ? `https://newsapi.org/v2/top-headlines?category=${filter}`
    : "https://newsapi.org/v2/top-headlines";
  const news = await axios
    .get(urlToFetch, {
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
    fav: false,
    category: filter
  }));

  const articlesFiltered = totalArticles.filter(item => {
    const check = db.articles.find(art => art.url === item.url);
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
  saveOnDB(articlesFiltered);
});

router.get("/search", async function(req, res) {
  const search = req.query.q;
  const category = req.query.category;

  if(search && category) {
    urlToFetch = `https://newsapi.org/v2/top-headlines?q=${search}&category=${category}`;
  } else if(category) {
    urlToFetch = `https://newsapi.org/v2/top-headlines?category=${category}`;
  } else if(search) {
    urlToFetch = `https://newsapi.org/v2/top-headlines?q=${search}`;
  }
   else {
    urlToFetch = "https://newsapi.org/v2/top-headlines";
  }

  const news = await axios
    .get(urlToFetch, {
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
    const check = db.articles.find(art => art.url === item.url);
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

  return res
    .status(200)
    .json({ resp: "OK", dato: "algo", data: req.body.rating });
});

router.patch("/update-fav/:id", async function(req, res) {
  const article = db.articles.find(item => item.id === req.params.id);
  article.fav = !Boolean(article.fav);
  fs.writeFileSync(dbPath, JSON.stringify(db), "utf8");

  return res.status(200).send();
});

router.get("/favs", (req, res) => {
  const favArticles = db.articles.filter(item => item.fav === true);
  const filter = req.query.category;
  const favArticlesFiltered = favArticles.filter(
    item => item.category === filter
  );
  const articlesToShow = filter ? favArticlesFiltered : favArticles;

  res.render("feed", {
    title: "NewsReader | Favoritos",
    noticias: articlesToShow,
    isFavsPage: true
  });
});

function formatDate(format, date) {
  date = new Date(date);

  format = format.split("Y").join(date.getFullYear());
  format = format.split("m").join(("0" + (date.getMonth() + 1)).slice(-2));
  format = format.split("d").join(("0" + date.getDate()).slice(-2));

  return format;
}

module.exports = router;
