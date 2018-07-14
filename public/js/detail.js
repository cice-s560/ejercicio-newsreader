(function(){

    var $a_inputs_rating = $("input[name=rating]");
    var idNoticia = $("article").first().data("idnoticia");

    $a_inputs_rating.change(function(){
        console.log("Update rating");
        updateRating(idNoticia, parseFloat(this.value));
    });

    function updateRating(idNoticia, rating){

        $.ajax({
            data: {
                id: idNoticia,
                rating: rating
            },
            url: "/update-rating",
            type: "post"
        });

    }
    
})()