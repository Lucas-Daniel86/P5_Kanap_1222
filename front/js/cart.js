//Création d'une constante qui récupère le produit du localStorage.
const localCart = localStorage.getItem("cart");
let apiProducts = null;
if (!localCart) {
    cartIsEmpty();
} else {
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
}

// Création d'un tableau pour chaque item du produit.
function buildCompleteList(allProducts, cart) {
    const list = [];
    cart.forEach((item) => {
        let foundItem = allProducts.find((p) => p._id == item.id);
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

//Création d'un message si le panier est vide.
function cartIsEmpty() {
    document.querySelector("h1").innerText = "votre panier est vide";
    document.querySelector(".cart").remove();
    //throw new Error("Le panier est vide");
    console.error("Le panier est vide.");
}

// Création de tous les éléments nécessaires pour afficher le produit et ses valeurs.
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

        let messageErrorQuantity = false;
        if (newQuantity > 0 && newQuantity <= 100) {
            updateProductQuantity(article, newQuantity);
        } else {
            e.value = article.newQuantity;
            messageErrorQuantity = true;
        }
        if (messageErrorQuantity) {
            alert("La quantité de l'article doit être comprise entre 1 et 100. Merci de rectifier la quantité choisie.")
        }
    });
}

// Afficher chaque élément du produit et ses valeurs.
function displayProducts(products) {
    products.forEach((product) => {
        createRow(product);
    });
}

// Afficher la quantité et prix total.
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

// Ajouter la nouvelle quantité du produit.
function updateProductQuantity(article, newQuantity) {
    const productId = article.dataset.id;
    const color = article.dataset.color;
    const cart = JSON.parse(localStorage.getItem("cart"));
    const itemToUpdate = cart.findIndex(
        (product) => product.id === productId && product.color === color);
    if (itemToUpdate != null) {
        cart[itemToUpdate].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        const products = buildCompleteList(apiProducts, cart);
        displayTotal(products);
    }
}