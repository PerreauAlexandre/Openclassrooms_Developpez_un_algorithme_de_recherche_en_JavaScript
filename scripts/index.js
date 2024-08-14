const recipeSection = document.querySelector(".recipe-section");
let initialRecipesModel = [];
let recipesModel = [];

initIndexPage();


async function initIndexPage() {
    const recipes = await getDatas();
    initialRecipesModel = recipes.map(recipe => new RecipeTemplate(recipe));
    recipesModel = initialRecipesModel;
    displayData(recipesModel);
    initSecondaryFilters();
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


/********** Filtre principal **********/

const mainSearchForm = document.querySelector(".main-search");
const mainSearchInput = document.querySelector(".main-search-input");
const searchBtn = document.querySelector(".search-btn");
const clearBtn = document.querySelector(".clear-btn");

mainSearchInput.addEventListener("input",  debounce(handleInput)); 

// Fonction de debounce
function debounce(func) {
    const wait = 500;
    let timeout;
    return function(event) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(event);
        }, wait);
    };
}

// Gestionnaire d'événement pour l'input avec debounce
function handleInput(e) {
    const inputValue = e.target.value
    if (inputValue.length >= 3) {
        clearBtn.style.display = "flex";

        recipesModel = [];

        for (let i = 0; i < initialRecipesModel.length; i++) {
            const recipeModel = initialRecipesModel[i];
            const recipeSearchDatas = recipeModel.getRecipeSearchDatas();
            
            const searchDataLower = recipeSearchDatas.toLowerCase();
            const inputValueLower = inputValue.toLowerCase();
            
            if (searchDataLower.indexOf(inputValueLower) !== -1) {
                recipesModel.push(recipeModel);
            }
        }
    }
    else {
        clearBtn.style.display = "none";
        recipesModel = initialRecipesModel;
    }

    displayData(recipesModel);
    initSecondaryFilters();
}

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
    initSecondaryFilters();
});


/********** Filtres secondaires **********/

// Gestion de l'affichage des filtres
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

// On crée un objet ingrédients
const ingredientsObject = {
    initialList: [],
    list: [],
    activeFilter: [],
    filter: document.querySelector(".filter--ingredients"),
    secondarySearchForm: document.querySelector(".filter--ingredients .secondary-search"),
    secondarySearchInput: document.querySelector(".filter--ingredients .secondary-search-input"),
    secondaryClearBtn: document.querySelector(".filter--ingredients .secondary-clear-btn"),
    selectedList: document.querySelector(".filter--ingredients .selected-secondary-filter"),
    filterList: document.querySelector(".filter--ingredients .secondary-filter-list") 
}

initSecondarySearch(ingredientsObject);

// On crée un objet appareils
const appareilsObject = {
    initialList: [],
    list: [],
    activeFilter: [],
    filter: document.querySelector(".filter--appareils"),
    secondarySearchForm: document.querySelector(".filter--appareils .secondary-search"),
    secondarySearchInput: document.querySelector(".filter--appareils .secondary-search-input"),
    secondaryClearBtn: document.querySelector(".filter--appareils .secondary-clear-btn"),
    selectedList: document.querySelector(".filter--appareils .selected-secondary-filter"),
    filterList: document.querySelector(".filter--appareils .secondary-filter-list") 
}

initSecondarySearch(appareilsObject);

// On crée un objet ustensiles
const ustensilesObject = {
    initialList: [],
    list: [],
    activeFilter: [],
    filter: document.querySelector(".filter--ustensiles"),
    secondarySearchForm: document.querySelector(".filter--ustensiles .secondary-search"),
    secondarySearchInput: document.querySelector(".filter--ustensiles .secondary-search-input"),
    secondaryClearBtn: document.querySelector(".filter--ustensiles .secondary-clear-btn"),
    selectedList: document.querySelector(".filter--ustensiles .selected-secondary-filter"),
    filterList: document.querySelector(".filter--ustensiles .secondary-filter-list") 
}

initSecondarySearch(ustensilesObject);

// On initialise les valeurs de filtres secondaire en fonction de la recherche principale
function initSecondaryFilters() {
    initSecondaryFilter(ingredientsObject);
    initSecondaryFilter(appareilsObject);
    initSecondaryFilter(ustensilesObject);
}

function initSecondaryFilter(filterObject) {
    fillFilter(recipesModel, filterObject);
    displayFilter(filterObject);
    filterObject.activeFilter = [];
    displayActiveFilter(filterObject);
}

// On rempli en fonction des attributs des recetes affichés sur la page le filtre secondaire passé en paramètre
function fillFilter(recipes, filterObject) {
    filterObject.initialList = [];
    recipes.forEach((recipeModel) => {
        if (filterObject.filter.classList.contains("filter--ingredients")) {
            filterObject.initialList = filterObject.initialList.concat(recipeModel.getRecipeIngredientsList());
        }
        else if (filterObject.filter.classList.contains("filter--appareils")) {
            filterObject.initialList.push(recipeModel.appliance);
        }
        else if (filterObject.filter.classList.contains("filter--ustensiles")) {
            filterObject.initialList = filterObject.initialList.concat(recipeModel.ustensils);
        }        
    });
    filterObject.initialList = [...new Set(filterObject.initialList)];
    filterObject.list = filterObject.initialList;
}

// On affiche dans le menu déroulant les différentes options du filtre secondaire passé en paramètre
function displayFilter(filterObject) {
    filterObject.filterList.innerHTML = "";
    filterObject.list.forEach((listElement) => {
        const li = document.createElement("li");
        li.textContent = listElement;
        filterObject.filterList.appendChild(li);
    })

    const DOMList = filterObject.filterList.querySelectorAll("li");
    DOMList.forEach((DOMElement) => {
        DOMElement.addEventListener("click", () => {
            filterObject.activeFilter.push(DOMElement.textContent);
            filterObject.activeFilter = [...new Set(filterObject.activeFilter)];
            displayActiveFilter(filterObject);
            filterObject.secondaryClearBtn.style.display = "none";
            filterObject.secondarySearchInput.value = "";
        });
    });
}

// On initialise la barre de recherche du filtre secondaire passé en paramètre
function initSecondarySearch(filterObject) {
    filterObject.secondarySearchInput.addEventListener("input", (e) => {
        const inputValue = e.target.value
        if (inputValue.length >= 3) {
            filterObject.secondaryClearBtn.style.display = "flex";
            filterObject.list = filterObject.initialList.filter((listElement) => {
                return listElement.toLowerCase().includes(inputValue.toLowerCase());
            });
        }
        else {
            filterObject.secondaryClearBtn.style.display = "none";
            filterObject.list = filterObject.initialList;
        }
        displayFilter(filterObject);
    });
    
    filterObject.secondarySearchForm.addEventListener("submit", (e) => e.preventDefault());
    
    filterObject.secondarySearchForm.querySelector('input[type="text"]').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
    
    filterObject.secondaryClearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        filterObject.secondaryClearBtn.style.display = "none";
        filterObject.secondarySearchInput.value = "";
        filterObject.list = filterObject.initialList;
        displayFilter(filterObject);
    });
}

// On affiche dans le menu déroulant les différents filtres actifs du filtre secondaire passé en paramètre 
const activeFiltersBanner = document.querySelector(".active-filters-banner");
function displayActiveFilter(filterObject) {
    filterObject.selectedList.innerHTML = "";

    filterObject.activeFilter.forEach((activeElement) => {
        const li = document.createElement("li");
        li.textContent = activeElement;
        filterObject.selectedList.appendChild(li); 
    })

    const DOMIActiveList = filterObject.selectedList.querySelectorAll("li");
    for (let i = 0; i < DOMIActiveList.length; i++) {
        const DOMActiveElement = DOMIActiveList[i];
        DOMActiveElement.addEventListener("click", () => {
            filterObject.activeFilter.splice(i, 1);
            displayActiveFilter(filterObject);
        });
    }

    displayActiveBanner();

    getSecondarySearchRecipesModel();
}

// On affiche la banière qui liste touts les filtres secondaires actifs
function displayActiveBanner() {
    activeFiltersBanner.innerHTML = "";
    const activeBannerFilters = ingredientsObject.activeFilter.concat(appareilsObject.activeFilter).concat(ustensilesObject.activeFilter);

    activeBannerFilters.forEach((activeElement) => {
        const li = document.createElement("li");
        li.textContent = activeElement;
        const closeLogo = document.createElement("i");
        closeLogo.classList.add("fa-solid");
        closeLogo.classList.add("fa-xmark");
        li.appendChild(closeLogo);
        activeFiltersBanner.appendChild(li);
    })

    const DOMActiveBanner = activeFiltersBanner.querySelectorAll("li");
    for (let i = 0; i < DOMActiveBanner.length; i++) {
        const DOMActiveElement = DOMActiveBanner[i];
        DOMActiveElement.addEventListener("click", () => {
            if (ingredientsObject.activeFilter.indexOf(DOMActiveElement.textContent) !== -1){
                const ingredientIndex = ingredientsObject.activeFilter.indexOf(DOMActiveElement.textContent);
                ingredientsObject.activeFilter.splice(ingredientIndex, 1);
                displayActiveFilter(ingredientsObject);
            }
            else if (appareilsObject.activeFilter.indexOf(DOMActiveElement.textContent) !== -1){
                const appareilIndex = appareilsObject.activeFilter.indexOf(DOMActiveElement.textContent);
                appareilsObject.activeFilter.splice(appareilIndex, 1);
                displayActiveFilter(appareilsObject);
            }
            else if (ustensilesObject.activeFilter.indexOf(DOMActiveElement.textContent) !== -1){
                const ustensileIndex = ustensilesObject.activeFilter.indexOf(DOMActiveElement.textContent);
                ustensilesObject.activeFilter.splice(ustensileIndex, 1);
                displayActiveFilter(ustensilesObject);
            }
        });
    }
}

// On met a jour l'affichage des recettes en fonction des filtres secondaires sélectionnés
function getSecondarySearchRecipesModel() {
    let secondarySearchRecipesModel = recipesModel;
    ingredientsObject.activeFilter.forEach((activeIngredient) => {
        secondarySearchRecipesModel = secondarySearchRecipesModel.filter((recipeModel) => {
            return (recipeModel.getRecipeIngredientsList().indexOf(activeIngredient) !== -1);
        });
    })
    appareilsObject.activeFilter.forEach((activeAppareil) => {
        secondarySearchRecipesModel = secondarySearchRecipesModel.filter((recipeModel) => {
            return (recipeModel.appliance === activeAppareil);
        });
    })
    ustensilesObject.activeFilter.forEach((activeUstensile) => {
        secondarySearchRecipesModel = secondarySearchRecipesModel.filter((recipeModel) => {
            return (recipeModel.ustensils.indexOf(activeUstensile) !== -1);
        });
    })

    displayData(secondarySearchRecipesModel);
    
    fillFilter(secondarySearchRecipesModel, ingredientsObject);
    displayFilter(ingredientsObject);
    fillFilter(secondarySearchRecipesModel, appareilsObject);
    displayFilter(appareilsObject);
    fillFilter(secondarySearchRecipesModel, ustensilesObject);
    displayFilter(ustensilesObject);
}