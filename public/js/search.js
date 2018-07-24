const input_search = document.querySelector('#search')
const input_category = document.querySelector('#category');

input_search.addEventListener("input", send_search);
input_category.addEventListener("change", send_search);

function send_search() {
let search = input_search.value;
let category = input_category.value;
  fetch('/search/?q='+search+'&category='+category).then(data => {

  })
  .catch(error => console.log('error', error))
};