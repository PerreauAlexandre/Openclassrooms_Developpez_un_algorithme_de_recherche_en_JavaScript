const recipeSection = document.querySelector(".recipe-section");
let initialRecipesModel = [];
let recipesModel = [];

initIndexPage();


async function initIndexPage() {
    const recipes = await getDatas();
    initialRecipesModel = recipes.map(recipe => new RecipeTemplate(recipe));
    recipesModel = initialRecipesModel;
    displayData(recipesModel);
    initSecondaryFilter();
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
function displayData(recipes) {
    recipeSection.innerHTML = "";
    recipes.forEach((recipeModel) => {
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeSection.appendChild(recipeCardDOM);
    });

    // Affiche de nombre de recette
    displayRecipeNumber(recipes);
}


// Affiche le nombre de recettes
const recipeNumber = document.querySelector(".recipe-number");
function displayRecipeNumber(recipes) {
    recipeNumber.textContent = `${recipes.length} recettes`
}


// Filtre de recherche principal
const mainSearchForm = document.querySelector(".main-search");
const mainSearchInput = document.querySelector(".main-search-input");
const searchBtn = document.querySelector(".search-btn");
const clearBtn = document.querySelector(".clear-btn");

mainSearchInput.addEventListener("input", (e) => {
    const inputValue = e.target.value
    if (inputValue.length >= 3) {
        clearBtn.style.display = "flex";
        recipesModel = initialRecipesModel.filter((recipeModel) => {
            const recipeSearchDatas = recipeModel.getRecipeSearchDatas();
            return recipeSearchDatas.toLowerCase().includes(inputValue.toLowerCase());
        });
    }
    else {
        clearBtn.style.display = "none";
        recipesModel = initialRecipesModel;
    }
    displayData(recipesModel);
    initSecondaryFilter();
});

mainSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
});

mainSearchForm.querySelector('input[type="text"]').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearBtn.style.display = "none";
    mainSearchInput.value = "";
    recipesModel = initialRecipesModel;
    displayData(recipesModel);
    initSecondaryFilter();
});

// Filtres secondaires
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

let initialIngredientsList = [];
let ingredientsList = [];
let activeIngredientFilter = [];
const filterIngredients = document.querySelector(".filter--ingredients");
const selectedIngredientsList = filterIngredients.querySelector(".selected-secondary-filter");
const ingredientsFilterList = filterIngredients.querySelector(".secondary-filter-list");

function initSecondaryFilter() {
    fillIngredientFilter(recipesModel);
    displayIngredientFilter(initialIngredientsList);
    activeIngredientFilter = [];
    displayActiveIngredientFilter();
}

function fillIngredientFilter(recipes) {
    initialIngredientsList = [];
    recipes.forEach((recipeModel) => {
        const recipeIngredientsList = recipeModel.getRecipeIngredientsList();
        initialIngredientsList = initialIngredientsList.concat(recipeIngredientsList);
    });
    initialIngredientsList = [...new Set(initialIngredientsList)];
}

function displayIngredientFilter(ingredients) {
    ingredientsFilterList.innerHTML = "";
    ingredients.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsFilterList.appendChild(li);
    })

    const DOMIngredientList = ingredientsFilterList.querySelectorAll("li");
    DOMIngredientList.forEach((DOMIngredient) => {
        DOMIngredient.addEventListener("click", () => {
            activeIngredientFilter.push(DOMIngredient.textContent);
            activeIngredientFilter = [...new Set(activeIngredientFilter)];
            displayActiveIngredientFilter();
            secondarySearchInput.value = "";
        });
    });
}

const secondarySearchForm = document.querySelector(".secondary-search")
const secondarySearchInput = document.querySelector(".secondary-search-input")
const secondaryClearBtn = document.querySelector(".secondary-clear-btn");
secondarySearchInput.addEventListener("input", (e) => {
    const inputValue = e.target.value
    if (inputValue.length >= 3) {
        secondaryClearBtn.style.display = "flex";
        ingredientsList = initialIngredientsList.filter((ingredient) => {
            return ingredient.toLowerCase().includes(inputValue.toLowerCase());
        });
    }
    else {
        secondaryClearBtn.style.display = "none";
        ingredientsList = initialIngredientsList;
    }
    displayIngredientFilter(ingredientsList);
});

secondarySearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
});

secondarySearchForm.querySelector('input[type="text"]').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

secondaryClearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    secondaryClearBtn.style.display = "none";
    secondarySearchInput.value = "";
    displayIngredientFilter(initialIngredientsList);
});

const activeIngredientsBanner = document.querySelector(".active-ingredients");

function displayActiveIngredientFilter() {
    selectedIngredientsList.innerHTML = "";
    activeIngredientsBanner.innerHTML = "";
    activeIngredientFilter.forEach((activeIngredient) => {
        const li = document.createElement("li");
        li.textContent = activeIngredient;
        selectedIngredientsList.appendChild(li);

        const liActiveBanner = document.createElement("li");
        liActiveBanner.textContent = activeIngredient;
        const closeLogo = document.createElement("i");
        closeLogo.classList.add("fa-solid");
        closeLogo.classList.add("fa-xmark");
        liActiveBanner.appendChild(closeLogo)
        activeIngredientsBanner.appendChild(liActiveBanner);
    })

    const DOMIngredientActiveList = selectedIngredientsList.querySelectorAll("li");
    for (let i = 0; i < DOMIngredientActiveList.length; i++) {
        const DOMActiveIngredient = DOMIngredientActiveList[i];
        DOMActiveIngredient.addEventListener("click", () => {
            activeIngredientFilter.splice(i, 1);
            displayActiveIngredientFilter();
        });
    }

    const DOMActiveBanner = activeIngredientsBanner.querySelectorAll("li");
    for (let i = 0; i < DOMActiveBanner.length; i++) {
        const DOMActiveIngredient = DOMActiveBanner[i];
        DOMActiveIngredient.addEventListener("click", () => {
            activeIngredientFilter.splice(i, 1);
            displayActiveIngredientFilter();
        });
    }

    getSecondarySearchRecipesModel();
}

function getSecondarySearchRecipesModel() {
    let secondarySearchRecipesModel = recipesModel;
    activeIngredientFilter.forEach( (activeIngredient) => {
        secondarySearchRecipesModel = secondarySearchRecipesModel.filter((recipeModel) => {
            const recipeSearchDatas = recipeModel.getRecipeIngredientsList();
            return (recipeSearchDatas.indexOf(activeIngredient) !== -1);
        });
    })
    displayData(secondarySearchRecipesModel);
    fillIngredientFilter(secondarySearchRecipesModel);
    displayIngredientFilter(initialIngredientsList);
}