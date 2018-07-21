// OLD SCHOOL
/*

(function() {
  var $a_inputs_rating = $("input[name=rating]");
  var idNoticia = $("article")
    .first()
    .data("idnoticia");

  // Seteamos rating
  var rate = $("article").attr("data-rate");
  var $inputRate = $(`input[value=${rate}]`);
  $inputRate.attr("checked", "checked");

  // Trabajamos el Fav
  var $fav = $(".fav");
  $fav.on("click", e => {
    $.ajax({
      url: `/update-fav/${idNoticia}`,
      type: "patch",
      success: resp => $fav.toggleClass("has-text-danger")
    });
  });

  // Eventos de Rating
  $a_inputs_rating.change(function() {
    updateRating(idNoticia, parseFloat(this.value));
  });

  function updateRating(idNoticia, rating) {
    $.ajax({
      data: {
        rating: rating
      },
      url: `/update-rating/${idNoticia}`,
      type: "patch"
    });
  }
})();

*/

//
// New school
//

(function(){

    // DOM
    const articulo = document.querySelector("article");
    const inputsRating = document.querySelectorAll(`input[name="rating"]`);
    const iconoFav = document.querySelector(".fav");

    // Datos
    const idNoticia = articulo.getAttribute("data-idnoticia");
    const ratingNoticia = articulo.getAttribute("data-rate");

    // Binding
    inputsRating.forEach(item => item.addEventListener("change", updateRating))
    iconoFav.addEventListener("click", updateFav);

    // Init
    document.querySelector(`input[value="${ratingNoticia}"]`).checked = true;

    // Funciones
    function updateRating(e){

        fetch(`/update-rating/${idNoticia}`, {
            method: "PATCH",
            body: JSON.stringify({
                rating: e.currentTarget.value
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

    }

    function updateFav(e){

        const icono = e.currentTarget;

        fetch(`/update-favorito/${idNoticia}`, {
            method: "PATCH",
            headers: new Headers()
        })
        .then(resp => {
            icono.classList.toggle("has-text-danger");
        });

    }

})()

