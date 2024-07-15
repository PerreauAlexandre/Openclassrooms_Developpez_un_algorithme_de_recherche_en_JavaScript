const recipeSection = document.querySelector(".recipe-section");
let initalRecipesModel = [];
let recipesModel = [];

initIndexPage();


async function initIndexPage() {
    const recipes = await getDatas();
    initalRecipesModel = recipes.map(recipe => new RecipeTemplate(recipe));
    recipesModel = initalRecipesModel;
    console.log(recipesModel.length, initalRecipesModel.length);
    console.log(recipesModel[0])
    console.log(recipesModel[0].name);
    displayData();
}


// Récupération des recettes depuis l'API
async function getDatas() {
    const reponse = await fetch(getOriginURL(window.location.href) + "/data/recipes.json");
    const datas = await reponse.json();
    return datas;
}


// Récupère l'url de base
function getOriginURL(url) {
    // On crée un objet URL à partir de l'URL de la page
    const objectURL = new URL(url);
    // On récupère l'origine de l'URL
    const parsedURL = objectURL.origin;
    // Retourner l'URL modifiée
    if (parsedURL === "https://perreaualexandre.github.io") {
        return "https://perreaualexandre.github.io/Openclassrooms_Developpez_un_algorithme_de_recherche_en_JavaScript";
    }
    else {
        return parsedURL;
    }
}


// Affiche les recettes
function displayData() {
    recipesModel.forEach((recipeModel) => {
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeSection.appendChild(recipeCardDOM);
    });
    displayRecipeNumber();
}


// Affiche le nombre de recettes
const recipeNumber = document.querySelector(".recipe-number");
function displayRecipeNumber() {
    recipeNumber.textContent = `${recipesModel.length} recettes`
}


// Filtre de recherche principal
const mainSearchInput = document.querySelector(".main-search-input");

mainSearchInput.addEventListener("input", function(event) {
    const inputValue = event.target.value
    if (inputValue.length >= 3) {
        recipesModel = recipesModel.filter((recipeModel) => recipeModel.name.includes(inputValue));
        console.log(recipesModel.length, initalRecipesModel.length);
    }
    // else {
    //     newRecipesModel = initalRecipesModel;
    // }
    // if (newRecipesModel)
});


// Choix des ingrédients 
const filters = document.querySelectorAll(".filter");
filters.forEach((filter) => {
    let dropBtnOpen = false;
    const dropBtn = filter.querySelector(".drop-btn");
    const filterDropdown = filter.querySelector(".filter-dropdown");
    const chevron = filter.querySelector(".fa-chevron-down");
    dropBtn.addEventListener("click", () => {
        if (!dropBtnOpen) {
            dropBtn.style.borderRadius = "11px 11px 0 0";
            chevron.style.transform = "rotateX(180deg)";
            filterDropdown.style.display = "block";
            dropBtnOpen = true;
        }
        else {
            dropBtn.style.borderRadius = "11px";
            chevron.style.transform = "rotateX(0deg)";
            filterDropdown.style.display = "none";
            dropBtnOpen = false;
        }
    });
});
