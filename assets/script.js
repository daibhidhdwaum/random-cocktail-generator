// create namespace function
const cocktailApp = {};

// Store base urls in variable
cocktailApp.cocktailDbUrl = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
cocktailApp.cocktailApiKey = `1`;

// ajax call to songsterr API to get requested song tab
cocktailApp.fetchCocktail = () => {
    // this call stored in a variable and then returned was built first
    const cocktailSearchResponse = $.ajax({
        url: `${cocktailApp.cocktailDbUrl}`,
        method: "GET",
        dataType: "json",
        data: {
            API: `${cocktailApp.cocktailApiKey}`
        }
    });
    return cocktailSearchResponse;
}



$("section").hide();

// function to filter object to return only ingredients or measures that were not null
cocktailApp.filterIngredientsAndMeasures = (array) => {

    const arrayOfPresentIngredientsAndMeasures = array.filter((item) => {
        if (item[1] !== null) {
            return true;
        }
    })

    const ingredientOrMeasureArray = arrayOfPresentIngredientsAndMeasures.map((item) => {
        return item[1];
    })

    return ingredientOrMeasureArray;
}


// create a function to display tab
cocktailApp.displayCocktail = () => {

    const cocktailData = cocktailApp.fetchCocktail();

    cocktailData.done((data) => {
        // console.log("This is the drink Data: ", data)
        const randomDrink = data.drinks[0];
        // each key value pair in the object is pushed to an array and stored in a varuable
        const randomDrinksArrays = Object.entries(randomDrink);

        // search randomDrinksArrays for any that contain "strIngredient" at the 0 index and store to variable
        const arrayOfIngredients = randomDrinksArrays.filter((item) => {
            if (item[0].includes("strIngredient")) {
                return true;
            }
        });
        // search randomDrinksArrays for any that contain "strMeasure" at the 1 index and store to variable
        const arrayOfMeasures = randomDrinksArrays.filter((item) => {
            if(item[0].includes("strMeasure")){
                return true;
            }
        })

        // pass the variables into the filter function
        const ingredients = cocktailApp.filterIngredientsAndMeasures(arrayOfIngredients);

        const measures = cocktailApp.filterIngredientsAndMeasures(arrayOfMeasures);
 
        // display the returned data on to the page
        measures.forEach((measure) => {
            $(".measures").append(`<p>${measure}</p>`);
        })
        ingredients.forEach((ingredient) => {
            $(".ingredients").append(`<p>${ingredient}</p>`);
        })

        // Add html to page
        $(".name").html(randomDrink.strDrink);
        $(".glass").html(randomDrink.strGlass);
        $(".instructions").html(randomDrink.strInstructions);
        
        let drinkImage = $(`
        <img src=${randomDrink.strDrinkThumb} 
        alt="randomly generated cocktail">
        `);
        $(".image").html(drinkImage);

    })
}

// create init function
cocktailApp.init = () => {
    $("button").on("click", () => {
        $("section").show();
        $(".measures").html(" ");
        $(".ingredients").html(" ");
        cocktailApp.displayCocktail();
    })
}
// create document ready function
$(() => {
    cocktailApp.init();
});