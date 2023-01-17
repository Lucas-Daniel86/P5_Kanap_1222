// Application de la notion "URLSearchParams" afin de savoir quel produit doit être affiché sur la page produit, depuis la page d'accueil.
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
if (id === null) {
    alert("page introuvable");
    throw new Error("page introuvable");
}
// Intérroger l'API pour récupérer les détails du produit.
fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => handleData(res));

//Insérer les détails du produit dans la page produit
function handleData(product) {
    const section = document.querySelector(".item");
    const imageBlock = section.querySelector(".item__img");
    imageBlock.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

    section.querySelector("#title").innerText = product.name;
    section.querySelector("#price").innerText = product.price;
    section.querySelector("#description").innerText = product.description;

    const colors = section.querySelector("#colors");
    product.colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.innerText = color;
        colors.appendChild(option);
    });
}

//Création de la constante pour récupérer l'élément button
const button = document.querySelector("#addToCart");
//Appeler l'évennement "click" pour renvoyer des données
button.addEventListener("click", () => {
    //Création des constantes pour la récupération des valeurs dans la nouvelle page
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;

    if (isOrderInvalid(color, quantity)) return; // Message d'erreur
    //Les valeurs du produit à récupérer au click
    let product = {
        id: id,
        color: color,
        quantity: quantity,
    };
    saveOrder(product); //Les données vont s'appliquer aux valeurs récupérées
    redirectToCart(); // Redirection vers la page Cart.js
});

// Récupération du panier depuis le localStorage
function saveOrder(product) {
    let cart;
    // Si le panier n'est pas dans le localStorage ...
    if (!localStorage.getItem("cart")) {
        cart = [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        // Si le panier existe déjà ...
        cart = JSON.parse(localStorage.getItem("cart"));
        const existingProduct = cart.find(
            (a) => a.id === product.id && a.color === product.color
        );

        if (existingProduct) {
            // Prendre le produit éxistant dans le localStorage, modifier la quantité si existe déjà un autre produit pareil
            //La quantité du produit ne va pas dépasser la valeur 100
            existingProduct.quantity =
                Number(existingProduct.quantity) + Number(product.quantity);
            if (existingProduct.quantity > 100) {
                existingProduct.quantity = 100;
            }
            // Afficher le panier en format JSON
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            // Ajouter le produit dans le panier
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }
}

function isOrderInvalid(color, quantity) {
    if (isColorInvalid(color) || isQuantityInvalid(quantity)) {
        return true;
    }
    return false;
}

function isColorInvalid(color) {
    if (color == null || color === "") {
        alert("Veuillez sélectionner une couleur");
        return true;
    }
    return false;
}

function isQuantityInvalid(quantity) {
    if (quantity == null) {
        alert("Veuillez sélectionner une quantité");
        return true;
    }
    if (quantity <= 0) {
        alert("Veuillez sélectionner une quantité supérieure ou égale à 1");
        return true;
    }
    if (quantity > 100) {
        alert("Veuillez sélectionner une quantité inférieure ou égale à 100");
        return true;
    }

    return false;
}

function redirectToCart() {
    window.location.href = "cart.html";
}

// Étape 7 : Ajouter des produits dans le panier
// La page Produit est en place, celle-ci affiche les détails d’un produit cliqué
// à partir de la page d’accueil. Il faut maintenant gérer la possibilité d’ajouter
// ce produit au panier.
// 📌 Recommandations :
// ● Techniquement parlant, le panier peut être un array qui
// contiendrait trois choses :
// ○ l’id du produit ;
// ○ la quantité du produit ;
// ○ la couleur du produit.
// ● Il est nécessaire d’utiliser localStorage pour pouvoir accéder à cet
// array depuis la page Panier.
// ● Lorsqu’on ajoute un produit au panier, si celui-ci n'était pas déjà
// présent dans le panier, on ajoute un nouvel élément dans l’array.
// ● Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent
// dans le panier (même id + même couleur), on incrémente
// simplement la quantité du produit correspondant dans l’array.
// ● Dans localStorage, attention de ne pas multiplier inutilement des
// éléments identiques.