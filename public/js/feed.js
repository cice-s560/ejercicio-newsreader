(function() {
  // DOM
  const feed = document.querySelector("[data-app=feed]");
  const form = document.querySelector("form");

  // Templates
  const card = document.querySelector("[data-template=card]").innerHTML;

  // Binding
  form.addEventListener("submit", e => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let searchValue = formData.get("search") ? formData.get("search") : "";
    let countryValue = formData.get("country") ? formData.get("country") : "us";
    let url = new URL(window.location.href);
    let categoryParam = url.searchParams.get("category")
      ? `&category=${url.searchParams.get("category")}`
      : "";

    fetch(
      `/feed?format=json&search=${searchValue}&country=${countryValue}${categoryParam}`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        renderCards(data, feed, card);
        e.target.reset();
      });
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
})();
