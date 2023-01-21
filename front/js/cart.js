//Création d'une constante qui récupère le produit du localStorage.
const localCart = localStorage.getItem("cart");
let apiProducts = null;
if (!localCart) {
    cartIsEmpty();
}
// Intérroger l'API pour récupérer la liste des produits.
fetch("http://localhost:3000/api/products")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (allProducts) {
        apiProducts = allProducts;
        const products = buildCompleteList(allProducts, JSON.parse(localCart));
        displayProducts(products);
        displayTotal(products);
    })
    .catch(function (error) {
        // Une erreur est survenue
    });
// Afficher la quantité et prix total
function displayTotal(products) {
    let totalQty = 0;
    let totalPrice = 0;
    products.forEach((product) => {
        totalQty = totalQty + Number(product.quantity);
        totalPrice = totalPrice + Number(product.quantity) * Number(product.price);
    });
    document.querySelector("#totalQuantity").innerText = totalQty;
    document.querySelector("#totalPrice").innerText = formatPrice(totalPrice);
}
// Afficher les éléments du produit avec ses valeurs.
function displayProducts(products) {
    products.forEach((product) => {
        createRow(product);
    });
}
// Création des éléments pour afficher le produit et ses valeurs.
function createRow(product) {
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = product.id;
    article.dataset.color = product.color;

    article.innerHTML = `
        <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p>${formatPrice(product.price)}</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity-${product.id
        } "min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    `;
    document.querySelector("#cart__items").appendChild(article);
    // Suppression du produit après click en "Supprimer"
    article.querySelector(".deleteItem").addEventListener("click", (e) => {
        const article = e.target.closest("article");
        removeProduct(article);
    });
    // Changement de la quantité du produit.
    article.querySelector(".itemQuantity").addEventListener("change", (e) => {
        const article = e.target.closest("article");
        const newQuantity = e.target.value;
        if (newQuantity > 0 && newQuantity <= 100) {
            updateProductQuantity(article, newQuantity);
        }
    });
}
// Création d'un tableau pour chaque item du produit.
function buildCompleteList(all, cart) {
    const list = [];
    cart.forEach((item) => {
        const foundItem = all.find((p) => p._id == item.id);
        if (foundItem != undefined) {
            item.name = foundItem.name;
            item.description = foundItem.description;
            item.altTxt = foundItem.altTxt;
            item.imageUrl = foundItem.imageUrl;
            item.price = foundItem.price;
            list.push(item);
        }
    });
    return list;
}
// Enlever le produit.
function removeProduct(article) {
    const productId = article.dataset.id;
    const color = article.dataset.color;
    const cart = JSON.parse(localStorage.getItem("cart"));
    const itemToDelete = cart.findIndex(
        (product) => product.id === productId && product.color === color
    );
    if (itemToDelete != null) {
        cart.splice(itemToDelete, 1);
        article.remove();
        localStorage.setItem("cart", JSON.stringify(cart));
        const products = buildCompleteList(apiProducts, cart);
        displayTotal(products);
        if (cart.length == 0) {
            localStorage.removeItem("cart");
            cartIsEmpty();
        }
    }
}
//Création d'un message si le panier est vide.
function cartIsEmpty() {
    document.querySelector("h1").innerText = "votre panier est vide";
    document.querySelector(".cart").remove();
    //throw new Error("Le panier est vide");
    console.error("Le panier est vide.");
}
// Ajouter la nouvelle quantité du produit.
function updateProductQuantity(article, newQuantity) {
    const productId = article.dataset.id;
    const color = article.dataset.color;
    const cart = JSON.parse(localStorage.getItem("cart"));
    const itemToUpdate = cart.findIndex(
        (product) => product.id === productId && product.color === color
    );
    if (itemToUpdate != null) {
        cart[itemToUpdate].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        const products = buildCompleteList(apiProducts, cart);
        displayTotal(products);
    }
}

// Gestion du formulaire
//Appel des éléments du DOM
const form = document.querySelector(".cart__order__form");
const firstName = document.querySelector("#firstName");
const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const lastName = document.querySelector("#lastName");
const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const address = document.querySelector("#address");
const addressErrorMsg = document.querySelector("#addressErrorMsg");
const city = document.querySelector("#city");
const cityErrorMsg = document.querySelector("#cityErrorMsg");
const email = document.querySelector("#email");
const emailErrorMsg = document.querySelector("#emailErrorMsg");
const order = document.querySelector("#order");

// Création de variables d'état.
let firstNameValid = false,
    lastNameValid = false,
    addressValid = false,
    cityValid = false,
    emailValid = false;

// création des regex.
const addressRegex = /[a-zA-Z0-9\s]{8,32}/,
    cityRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i,
    emailRegex = /[a-zA-Z0-9.-_]+@{1}[a-zA-Z0-9.-_]+\.{1}[a-z]{1,10}/;

// Variables contenant un message d'erreur.
const firstNameErrorMessage =
    'Merci de remplir le champ "Prénom" avec seulement des lettres.',
    lastNameErrorMessage =
        'Merci de remplir le champ "Nom" avec seulement des lettres.',
    addressErrorMessage = "Adresse incorrecte.",
    cityErrorMessage =
        'Merci de remplir le champ "Ville" avec seulement des lettres.',
    emailErrorMessage = "L'email n'est pas valide.";

//Écoute sur chaque input et changement de la valeur de la variable d'état pour traiter le bouton order selon qu'il y ait une erreur ou non.
firstName.addEventListener("keyup", () => {
    const valid = cityRegex.test(firstName.value);
    firstNameErrorMsg.innerHTML = valid ? "" : firstNameErrorMessage;
    firstNameValid = valid;
});

lastName.addEventListener("keyup", () => {
    const valid = cityRegex.test(lastName.value);
    lastNameErrorMsg.innerHTML = valid ? "" : lastNameErrorMessage;
    lastNameValid = valid;
});

address.addEventListener("keyup", () => {
    const valid = addressRegex.test(address.value);
    addressErrorMsg.innerHTML = valid ? "" : addressErrorMessage;
    addressValid = valid;
});

city.addEventListener("keyup", () => {
    const valid = cityRegex.test(city.value);
    cityErrorMsg.innerHTML = valid ? "" : cityErrorMessage;
    cityValid = valid;
});

email.addEventListener("keyup", () => {
    const valid = emailRegex.test(email.value);
    emailErrorMsg.innerHTML = valid ? "" : emailErrorMessage;
    emailValid = valid;
});

//Envoi des données de la commande à l'API
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!firstNameValid) {
        firstNameErrorMsg.innerHTML = firstNameErrorMessage;
    }
    if (!lastNameValid) {
        lastNameErrorMsg.innerHTML = lastNameErrorMessage;
    }
    if (!addressValid) {
        addressErrorMsg.innerHTML = addressErrorMessage;
    }
    if (!cityValid) {
        cityErrorMsg.innerHTML = cityErrorMessage;
    }
    if (!emailValid) {
        emailErrorMsg.innerHTML = emailErrorMessage;
    }
    if (
        firstNameValid &&
        lastNameValid &&
        addressValid &&
        cityValid &&
        emailValid
    ) {
        //Création de l'objet contenant les informations clients.
        const contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
        };

        // Création du tableau contenant les informations clients
        const products = [];
        const cart = localStorage.getItem("cart");
        const data = JSON.parse(cart);
        data.forEach((product) => {
            products.push(product.id);
        });

        //Création de l'objet contenant les informations clients et "id" des produits.
        let sendData = { contact, products };
        // Méthode POST pour l'envoi des données
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sendData),
        };
        fetch("http://localhost:3000/api/products/order", options)
            .then((response) => response.json())
            .then((data) => {
                if (data.orderId !== undefined) {
                    window.location.href = "./confirmation.html?orderId=" + data.orderId;
                }
                console.error("Impossible de valider la commande");
            });
    }
});