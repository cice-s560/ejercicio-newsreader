// let sessionFavs = [];
// let sessionRates = [];

$(document).ready(() => {
    $(".toggleFav").on("click", function() {
        let icon = $(this).find("i")
        $(icon).toggleClass("far fas");
    })

    $(".toggleRate").on("click", function() {
        let icon = $(this).find("i");
        $(icon).toggleClass("far fas");

        // let notRate;
        // let rateItem;      
        // let notIndex = $(this).attr("data-notIndex");
        let rate = $(this).attr("data-rate");

        $(".toggleRate").each(function() {
            let rIcon = $(this).find("i")
            let dRate = $(this).attr("data-rate");
            
            if (dRate > rate && $(rIcon).hasClass("fas")) {
                $(rIcon).removeClass("fas").addClass("far");
                notRate = rate;
                return;
            }
            if (dRate < rate && $(rIcon).hasClass("far")) {
                $(rIcon).removeClass("far").addClass("fas");
                notRate = rate;
                return;
            }         

            // rateItem = {
            //     "notIndex": notIndex,
            //     "notRate": notRate
            // }
            
        })
        // sessionRates.push(rateItem);
        // console.log(sessionRates);
        // sessionStorage.setItem("rates", JSON.stringify(sessionRates));
    })
})

