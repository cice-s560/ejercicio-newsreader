// OLD SCHOOL

// (function() {
//   var $a_inputs_rating = $("input[name=rating]");
//   var idNoticia = $("article")
//     .first()
//     .data("idnoticia");

//   // Seteamos rating
//   var rate = $("article").attr("data-rate");
//   var $inputRate = $(`input[value=${rate}]`);
//   $inputRate.attr("checked", "checked");

//   // Trabajamos el Fav
//   var $fav = $(".fav");
//   $fav.on("click", e => {
//     $.ajax({
//       url: `/update-fav/${idNoticia}`,
//       type: "patch",
//       success: resp => $fav.toggleClass("has-text-danger")
//     });
//   });

//   // Eventos de Rating
//   $a_inputs_rating.change(function() {
//     updateRating(idNoticia, parseFloat(this.value));
//   });

//   function updateRating(idNoticia, rating) {
//     $.ajax({
//       data: {
//         rating: rating
//       },
//       url: `/update-rating/${idNoticia}`,
//       type: "patch"
//     });
//   }
// })();

const inputsRating = document.querySelectorAll("input[name=rating]");
const idNoticia = document
  .querySelector("article")
  .getAttribute("data-idnoticia");



function changeFav() {
  fetch(`/update-fav/${idNoticia}`, {
    method: "PATCH"
  })
    .then(resp => fav.classList.toggle("has-text-danger"))
    .catch(e => console.log("ERROR", e));
}

const fav = document.querySelector(".fav");
fav.addEventListener("click", changeFav);



const rate = document.querySelector("article").getAttribute("data-rate");
const inputRate = document.querySelector(`input[value="${rate}"]`);

if (inputRate) {
  inputRate.setAttribute("checked", "checked");
}

function updateRating(e) {
  fetch(`/update-rating/${idNoticia}`, {
    method: "PATCH",
    body: JSON.stringify({
      rating: e.currentTarget.value
    }),
    headers: { "Content-Type": "application/json" }
  }).catch(e => console.log("ERROR", e));
}

inputsRating.forEach(item => item.addEventListener("change", updateRating));
