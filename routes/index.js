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
    (db.general) ? oldNews = db.general: oldNews = [];
    db.general = [...oldNews, ...data];
    dataToWrite = db;
    break;
    case 'sports':
    (db.sports) ? oldNews = db.sports: oldNews = [];
    db.sports = [...oldNews, ...data];
    dataToWrite = db;
    break;
    case 'entertainment':
    (db.entertainment) ? oldNews = db.entertainment: oldNews = [];
    db.entertainment = [...oldNews, ...data];
    dataToWrite = db;
    break;
    case 'business':
    (db.business) ? oldNews = db.business: oldNews = [];
    db.business = [...oldNews, ...data];
    dataToWrite = db;
    break;
  }
  const dataString = JSON.stringify(db);
  fs.writeFileSync(dbPath, dataString, "utf8");
}

function filterArticles(db, totalArticles, category) {
  if (db[category]) {
    articlesFiltered = totalArticles.filter(item => {
      const check = db[category].find(art => art.url === item.url);
      // Quiero devolver el contrario de la comprobación
      // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
      return !Boolean(check);
    });

    db[category].forEach(article => {
      totalArticles.forEach(total_article => {
        if (total_article.id === article.id) {                    
          total_article.fav = article.fav;
        }
      })
    })
  } else {
    articlesFiltered = totalArticles;
  };
  return articlesFiltered;
}

router.get("/", function(req, res, next) {
  res.render("landing", { title: "NewsReader" });
});

router.get("/feed", async function(req, res) {  
  let category = req.query.category;
  console.log(category);
  
  if (category === undefined) {
    category = "general"
  }
  const urlQuery = `?category=${category}`  

  const news = await axios
    .get(`https://newsapi.org/v2/top-headlines${urlQuery}`, {
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
    fav: (article.fav) ? true : false
  }));

  let articlesFiltered = filterArticles(db, totalArticles, category);
 
  // Pinto en pantalla todos los que me vienen
  res.render("feed", {
    title: `NewsReader | ${category}`,
    noticias: totalArticles
  });
  
  // Guardo solo los que no tenía guardados antes
  saveOnDB(articlesFiltered, category);
});

// router.get("/feed/sports", async function(req, res) {
//   const news = await axios
//     .get("https://newsapi.org/v2/top-headlines?category=sports", {
//       params: {
//         country: "us",
//         apiKey: process.env.NEWS_API_KEY
//       }
//     })
//     .catch(e => res.status(500).send("error"));


//   const totalArticles = news.data.articles.map(article => ({
//     ...article,
//     id: uuid(article.url, uuid.URL),
//     rating: 0,
//     fav: (article.fav) ? true : false
//   }));

//   if (db.sports) {
//     articlesFiltered = totalArticles.filter(item => {
//       const check = db.sports.find(art => art.url === item.url);
//       // Quiero devolver el contrario de la comprobación
//       // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
//       return !Boolean(check);
//     });
//   } else {
//     articlesFiltered = totalArticles;
//   };

//   // Pinto en pantalla todos los que me vienen
//   res.render("feed", {
//     title: "NewsReader | Sports",
//     noticias: totalArticles
//   });

//   // Guardo solo los que no tenía guardados antes
//   saveOnDB(articlesFiltered, 'sports');
// });

// router.get("/feed/general", async function(req, res) {
//   const news = await axios
//     .get("https://newsapi.org/v2/top-headlines?category=general", {
//       params: {
//         country: "us",
//         apiKey: process.env.NEWS_API_KEY
//       }
//     })
//     .catch(e => res.status(500).send("error"));

//   const totalArticles = news.data.articles.map(article => ({
//     ...article,
//     id: uuid(article.url, uuid.URL),
//     rating: 0,
//     fav: (article.fav) ? true : false
//   }));

//   if (db.general) {
//     articlesFiltered = totalArticles.filter(item => {
//       const check = db.general.find(art => art.url === item.url);
//       // Quiero devolver el contrario de la comprobación
//       // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
//       return !Boolean(check);
//     });
//   } else {
//     articlesFiltered = totalArticles;
//   };

//   // Pinto en pantalla todos los que me vienen
//   res.render("feed", {
//     title: "NewsReader | General",
//     noticias: totalArticles
//   });

//   // Guardo solo los que no tenía guardados antes
//   saveOnDB(articlesFiltered, 'general');
// });

// router.get("/feed/business", async function(req, res) {
//   const news = await axios
//     .get("https://newsapi.org/v2/top-headlines?category=business", {
//       params: {
//         country: "us",
//         apiKey: process.env.NEWS_API_KEY
//       }
//     })
//     .catch(e => res.status(500).send("error"));

//   const totalArticles = news.data.articles.map(article => ({
//     ...article,
//     id: uuid(article.url, uuid.URL),
//     rating: 0,
//     fav: (article.fav) ? true : false
//   }));

//   if (db.business) {
//     articlesFiltered = totalArticles.filter(item => {
//       const check = db.business.find(art => art.url === item.url);
//       // Quiero devolver el contrario de la comprobación
//       // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
//       return !Boolean(check);
//     });
//   } else {
//     articlesFiltered = totalArticles;
//   };

//   // Pinto en pantalla todos los que me vienen
//   res.render("feed", {
//     title: "NewsReader | Business",
//     noticias: totalArticles
//   });

//   // Guardo solo los que no tenía guardados antes
//   saveOnDB(articlesFiltered, 'business');
// });

// router.get("/feed/entertainment", async function(req, res) {
//   const news = await axios
//     .get("https://newsapi.org/v2/top-headlines?category=entertainment", {
//       params: {
//         country: "us",
//         apiKey: process.env.NEWS_API_KEY
//       }
//     })
//     .catch(e => res.status(500).send("error"));

//   const totalArticles = news.data.articles.map(article => ({
//     ...article,
//     id: uuid(article.url, uuid.URL),
//     rating: 0,
//     fav: (article.fav) ? true : false
//   }));

//   if (db.entertainment) {
//     articlesFiltered = totalArticles.filter(item => {
//       const check = db.entertainment.find(art => art.url === item.url);
//       // Quiero devolver el contrario de la comprobación
//       // Si encuentro el artículo por URL, entonces es un false (no quiero duplicar)
//       return !Boolean(check);
//     });
//   } else {
//     articlesFiltered = totalArticles;
//   };

//   // Pinto en pantalla todos los que me vienen
//   res.render("feed", {
//     title: "NewsReader | Entertainment",
//     noticias: totalArticles
//   });

//   // Guardo solo los que no tenía guardados antes
//   saveOnDB(articlesFiltered, 'entertainment');
// });

router.get("/detail/:id", async function(req, res) {
  const param = req.params.id;
  let articles = [];
  const keys = Object.keys(db);
  keys.forEach(key => articles.push(...db[key]));  
  const article = articles.find(item => item.id === param);
  if (article !== undefined) {
    res.render("detail", { title: "NewsReader | Detail", article });
  } else {
    let error = {
      message: "Article not found",
      status: 404
    }
    res.render("error", { title: "NewsReader | Error 404", error});
  }
  
});

router.get("/feed/favourites", async function(req, res) {
  const param = req.params.id;
  let articles = [];
  const keys = Object.keys(db);
  keys.forEach(key => articles.push(...db[key]));  
  let favourites = [];
  articles.forEach(item => {
    if (item.fav) {
      favourites.push(item);
    }
  });

  if (favourites.length > 0) {
    res.render("feed", {title: "NewsReader | Favourites",noticias: favourites});
  } else {
    let error = {
      message: "No favourites articles found",
      status: 404
    }
    res.render("error", {title: "NewsReader | Not Result",error });
  }
  
});

router.patch("/update-rating/:id", async function(req, res) {
  let articles = [];
  const keys = Object.keys(db);
  keys.forEach(key => articles.push(...db[key]));    
  articles.forEach(article => {    
    if (article.id === req.params.id) article.rating = req.body.rating;
  });
  fs.writeFileSync(dbPath, JSON.stringify(db), "utf8");

  return res.status(200).send();
});

router.patch("/update-fav/:id", async function(req, res) {
  let articles = [];
  const keys = Object.keys(db);
  keys.forEach(key => articles.push(...db[key]));    
  const article = articles.find(item => item.id === req.params.id);
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
