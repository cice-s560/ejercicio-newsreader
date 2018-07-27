const selectInput = document.querySelector("#select");
const searchInput = document.querySelector("#search");

selectInput.addEventListener("change", updateFeed)

function updateFeed(e) {
  const country = e.target.value;  
  updateCountry(country)
}


function updateCountry (country) {
    fetch(`/feed?country=${country}`, {
        method: "GET"
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
    console.log(myJson);
    })
    .catch(e => console.log("ERROR: ", e))
}