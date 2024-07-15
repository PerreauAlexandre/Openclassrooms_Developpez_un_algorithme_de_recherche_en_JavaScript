class RecipeTemplate {
    constructor(data) {
        this._id = data.id;
        this._image = data.image;
        this._name = data.name;
        this._ingredients = data.ingredients;
        this._time = data.time;
        this._description = data.description;
        this._appliance = data.appliance;
        this._ustensils = data.ustensils;
    }

    get name() {
        return this._name;
    }

    getRecipeCardDOM() {
        const article = document.createElement("article");
        article.classList.add("recipe-card");

        const a = document.createElement("a");
        a.href = "#";

        const img = document.createElement("img");
        img.src = `images/recettes/${this._image}`;
        img.alt = `Aperçu - ${this._name}`;
        a.appendChild(img);

        const divTime = document.createElement("div");
        divTime.textContent = `${this._time} min`
        divTime.classList.add("time");
        a.appendChild(divTime);

        const divContent = document.createElement("div");
        divContent.classList.add("card-content");

        const h2 = document.createElement("h2");
        h2.textContent = this._name;
        divContent.appendChild(h2);

        const h3Recette = document.createElement("h3");
        h3Recette.textContent = "RECETTE";
        divContent.appendChild(h3Recette);

        const description = document.createElement("p");
        description.textContent = this._description;
        divContent.appendChild(description);

        const h3ingredients = document.createElement("h3");
        h3ingredients.textContent = "INGREDIENTS";
        divContent.appendChild(h3ingredients);

        const divIngredients = document.createElement("div");
        divIngredients.classList.add("ingredients-list");

        for (let i = 0; i < this._ingredients.length; i++) {
            const divIngredient = document.createElement("div");
            divIngredient.classList.add("ingredient");

            const h4 = document.createElement("h4");
            h4.textContent = this._ingredients[i].ingredient;
            divIngredient.appendChild(h4);

            const divQuantity = document.createElement("div");
            const quantity = this._ingredients[i].quantity ? this._ingredients[i].quantity : " - ";
            const unit = this._ingredients[i].unit ? " " + this._ingredients[i].unit : "";
            divQuantity.textContent = quantity + unit;
            divIngredient.appendChild(divQuantity);

            divIngredients.appendChild(divIngredient);
        }

        divContent.appendChild(divIngredients);

        a.appendChild(divContent);

        article.appendChild(a);

        return (article);
    }
}