(function() {
  // DOM
  const articulo = document.querySelector("article");
  const inputsRating = document.querySelectorAll(`input[name="rating"]`);
  const iconoFav = document.querySelector(".fav");

  // Datos
  const idNoticia = articulo.getAttribute("data-idnoticia");
  const ratingNoticia = articulo.getAttribute("data-rate");

  // Binding
  inputsRating.forEach(item => item.addEventListener("change", updateRating));
  iconoFav.addEventListener("click", updateFav);

  // Init
  document.querySelector(`input[value="${ratingNoticia}"]`).checked = true;

  // Funciones
  function updateRating(e) {
    fetch(`/update-rating/${idNoticia}`, {
      method: "PATCH",
      body: JSON.stringify({
        rating: e.currentTarget.value
      }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });
  }

  function updateFav(e) {
    const icono = e.currentTarget;

    fetch(`/update-favorito/${idNoticia}`, {
      method: "PATCH",
      headers: new Headers()
    }).then(resp => {
      icono.classList.toggle("has-text-danger");
    });
  }
})();
