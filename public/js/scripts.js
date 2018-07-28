// Country Selector
const countrySelector = document.querySelector("#country-selector");
countrySelector.addEventListener("change", e => {
    document.querySelector("#country-form").submit();
});


// Country Default Setting
    // Hecho en PUG (layout.pug)
    //
// const countryDefault = document.body.getAttribute("data-country");
// document.querySelector(`option[value="${countryDefault}"]`).setAttribute("selected", "selected"); 
