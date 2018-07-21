(function() {
  // DOM
  const inputSearch = document.querySelector("input[name=search]");
  const btnSearch = document.querySelector("[data-app=submitSearch]");
  const inputCountry = document.querySelector("select[name=country]");
  const btnCountry = document.querySelector("[data-app=submitCountry]");
  const feed = document.querySelector("[data-app=feed]");

  // Templates
  const card = document.querySelector("[data-template=card]").innerHTML;

  // Binding
  btnSearch.addEventListener("click", e => {
    e.preventDefault();
    if (!inputSearch.value) return console.log("Missing search value");
    fetchResults("search", inputSearch.value);
  });
  btnCountry.addEventListener("click", e => {
    e.preventDefault();
    if (!inputCountry.value) return console.log("Missing country value");
    fetchResults("country", inputCountry.value);
  });

  // Funciones
  function renderCards(a_data, target, template) {
    let html = "";
    a_data.forEach(item => {
      let card = template;
      card = card.split("{{urlToImage}}").join(item.urlToImage);
      card = card.split("{{title}}").join(item.title);

      if (item.author) card = card.split("{{author}}").join(item.author);
      else card = card.split("{{author}}").join("newsapi");

      if (item.description)
        card = card.split("{{description}}").join(item.description);
      else card = card.split("{{description}}").join("");

      card = card.split("{{sourceName}}").join(item.source.name);
      card = card.split("{{publishedAt}}").join(item.publishedAt);
      card = card.split("{{id}}").join(item.id);
      html = html + card;
    });
    target.innerHTML = html;
  }

  function fetchResults(filter, value) {
    let urlParams = "";
    switch (filter) {
      case "country":
        urlParams = `&country=${value}`;
        break;
      case "search":
        urlParams = `&search=${value}`;
        break;
    }
    fetch(`/feed?format=json${urlParams}`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/json"
      })
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        renderCards(data, feed, card);
      });
  }
})();
