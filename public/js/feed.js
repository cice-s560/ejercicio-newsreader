(function() {
  // DOM
  const inputSearch = document.querySelector("input[name=search]");
  const btnsSubmit = document.querySelectorAll("[data-app=submit]");
  const inputCountry = document.querySelector("select[name=country]");
  const feed = document.querySelector("[data-app=feed]");

  // Templates
  const card = document.querySelector("[data-template=card]").innerHTML;

  // Binding
  btnsSubmit.forEach(btn =>{
    btn.addEventListener("click", function(e){
      e.preventDefault();
      if(!this.getAttribute("name")) return false;
      let value;
      switch(this.getAttribute("name")){
        case "country":
          value = inputCountry.value ? inputCountry.value : "";
          break;
        case "search":
          value = inputSearch.value ? inputSearch.value : "";
      }
      fetchResults(this.getAttribute("name"), value)
        .then(data => renderCards(data, feed, card));
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

  function fetchResults(filter, value) {
    return new Promise((resolve, reject)=>{
      let urlParams = "";
      let url = new URL(window.location.href);
      
      let category = url.searchParams.get("category");
      if(category)
        urlParams = urlParams + `&category=${category}`;
        
      switch (filter) {
        case "country":
          urlParams = urlParams + `&country=${value}`;
          break;
        case "search":
          urlParams = urlParams + `&search=${value}`;
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
          resolve(data);
        })
        .catch( err => reject(err));
    });
  }
})();
