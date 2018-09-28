const express = require("express");
const router = express.Router();
const axios = require("axios");
const uuid = require("uuid/v3");
let dbClient;

function saveOnDB(data) {
  dbClient.insertMany(data, (err, res) => {
    if (err) throw err;
    console.log(res);
  });
}

router.get("/", async function(req, res, next) {
  // await dbClient
  //   .collection("news")
  //   .find({})
  //   .toArray((err, items) => {
  //     if (err) throw err;
  //     console.log(items);
  //   });

  res.render("landing", { title: "NewsReader" });
});

router.get("/feed", async function(req, res) {
  // Recojo los posibles parámetros por query
  const filterCategory =
    req.query.category && req.query.category !== "null"
      ? req.query.category
      : undefined;
  const filterSearch =
    req.query.search && req.query.search !== "null"
      ? req.query.search
      : undefined;
  const filterCountry =
    req.query.country && req.query.country !== "null"
      ? req.query.country
      : "us";
  const urlToFetch = "https://newsapi.org/v2/top-headlines";

  const news = await axios
    .get(urlToFetch, {
      params: {
        country: filterCountry,
        category: filterCategory,
        q: filterSearch,
        apiKey: process.env.NEWS_API_KEY
      }
    })
    .catch(e => res.status(500).send("error"));

  const totalArticles = news.data.articles.map(article => ({
    ...article,
    id: uuid(article.url, uuid.URL),
    rating: 0,
    fav: false,
    category: filterCategory
  }));

  const articlesFiltered = totalArticles.filter(item => {
    const check = db.articles.find(art => art.url === item.url);
    // Quiero devolver el contrario de la comprobación
    // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
    return !Boolean(check);
  });

  // Si la petición es AJAX
  // devuelvo datos apor AJAX y no sigo para renderizar
  if (req.query.isajax) {
    saveOnDB(articlesFiltered);

    return res.status(200).json({ articles: totalArticles });
  }

  // Pinto en pantalla todos los que me vienen
  res.render("feed", {
    title: "NewsReader | Feed",
    noticias: totalArticles,
    category: filterCategory,
    country: filterCountry
  });

  // Guardo solo los que no tenía guardados antes
  saveOnDB(articlesFiltered);
});

router.get("/detail/:id", async function(req, res) {
  const param = req.params.id;
  const article = await dbClient.findOne({ id: param }).catch(err => {
    console.log(err);
  });
  res.render("detail", { title: "NewsReader | Detail", article: article });
});

router.patch("/update-rating/:id", async function(req, res) {
  const param = req.params.id;
  await dbClient.findOneAndUpdate(
    { id: param },
    { $set: { rating: req.body.rating } }
  );
  return res
    .status(200)
    .json({ resp: "OK", dato: "algo", data: req.body.rating });
});

router.patch("/update-fav/:id", async function(req, res) {
  const param = req.params.id;
  const article = await dbClient.findOne({ id: param }).catch(err => {
    console.log(err);
  });
  const toggleFav = !Boolean(article.fav);
  await dbClient.findOneAndUpdate(
    { id: param },
    { $set: { fav: toggleFav } },
    (err, doc) => {
      if (err) throw err;
      console.log("Updated to Fav = " + doc);
    }
  );
  return res.status(200).send();
});

router.get("/favs", async function(req, res) {
  const favs = await dbClient.find({ fav: true });

  res.render("feed", {
    title: "NewsReader | Favoritos",
    noticias: favs,
    isFavsPage: true
  });
});

module.exports = {
  router,
  setDBClient: client => (dbClient = client.collection("news"))
};
