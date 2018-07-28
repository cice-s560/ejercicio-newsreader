// Country Selector
// const countrySelector = document.querySelector("#country-selector");
// countrySelector.addEventListener("change", e => {
//   document.querySelector("#country-form").submit();
// });

// Country Default Setting
// Hecho en PUG (layout.pug)
//
// const countryDefault = document.body.getAttribute("data-country");
// document.querySelector(`option[value="${countryDefault}"]`).setAttribute("selected", "selected");

// FILTROS POR AJAX
const searchForm = document.querySelector("#search-form");
const currentCategory = document.body.getAttribute("data-category");
searchForm.addEventListener("submit", askForNewData);

const changeCountry = document.querySelector("#country-selector");
changeCountry.addEventListener("change", askForNewData);

function askForNewData(e) {
  e.preventDefault();

  const searchTerm = document.querySelector("#search").value;
  const currentCountry =
    changeCountry.value || document.body.getAttribute("data-country");

  fetch(
    `http://localhost:3000/feed?search=${searchTerm}&country=${currentCountry}&category=${currentCategory}&isajax=true`
  )
    // FETCH devuelve obj de respuesta RAW
    // Necesitamos usar el método .json() (de FETCH) para parsear
    // Devuelve una promesa
    .then(resp => resp.json())
    .then(data => switchDataOnScreen(data))
    .catch(err => console.log(err));
}

function switchDataOnScreen(data) {
  console.log(data);

  document.querySelector("main .columns").innerHTML =
    "Ahora deberías pintar los datos que recibes en el JSON. (Mira la consola JS y su log)";
}
