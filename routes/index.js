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
    
    // Establecemos los parametros de busqueda
    let urlparams = "";
    let currentCategory = "top20";
    switch(req.query.category){
        case "sports":
            urlparams = "?category=sports"
            currentCategory = "sports";
            break;
        case "technology":
            urlparams = "?category=technology"
            currentCategory = "technology";
            break;
    }

    // Noticias recuperadas desde la API
    const news = await axios
        .get(`https://newsapi.org/v2/top-headlines${urlparams}`, {
        params: {
            country: "us",
            apiKey: process.env.NEWS_API_KEY
        }
        })
        .catch(e => res.status(500).send("error"));

    // Articulos nuevos formateados con propiedades necesarias para app
    const a_newArticles = [];
    const a_renderArticles = [];
    news.data.articles.forEach( newArticle =>{

        newArticle.rating = 0;
        newArticle.fav = false;
        newArticle.id = uuid(newArticle.url, uuid.URL);
        newArticle.category = currentCategory;
        if(newArticle.publishedAt)
            newArticle.publishedAt = formatDate("d-m-Y", newArticle.publishedAt);

        const dbArticle = db.articles.find(dbArticle => dbArticle.id === newArticle.id);   

        if(dbArticle){

            // Articulo esta en db
            a_renderArticles.push(dbArticle);

        }else{

            // Articulo no esta en db
            a_newArticles.push(newArticle);
            a_renderArticles.push(newArticle);

        }

    });

    res.render("feed", {
        title: "NewsReader | Feed",
        noticias: a_renderArticles
    });
    res.status(200).send();
    saveOnDB(a_newArticles);
    
});

router.get("/favourites", (req, res) => {

    res.render("feed", { 
        title: "NewsReader | Favoritos", 
        noticias: db.articles.filter(dbArticle => dbArticle.fav)
    });

    res.status(200).send();

});

router.get("/detail/:id", function(req, res) {
  const param = req.params.id;
  const article = db.articles.find(item => item.id === param);

  res.render("detail", { title: "NewsReader | Detail", article });
});

router.patch("/update-rating/:id", async function(req, res) {
  db.articles.forEach(article => {
    if (article.id === req.params.id) article.rating = req.body.rating;
  });
  res.status(200).send();
  fs.writeFileSync(dbPath, JSON.stringify(db), "utf8");
  
});

router.patch("/update-favorito/:id", async function(req, res) {
  
    console.log("Requested update favoritos");
    const article = db.articles.find(item => item.id === req.params.id)
    article.fav = !Boolean(article.fav);
    res.status(200).send();
    fs.writeFileSync(dbPath, JSON.stringify(db), "utf8");

});

function formatDate(format, date) {
  date = new Date(date);

  format = format.split("Y").join(date.getFullYear());
  format = format.split("m").join(("0" + (date.getMonth() + 1)).slice(-2));
  format = format.split("d").join(("0" + date.getDate()).slice(-2));

  return format;
}

module.exports = router;
