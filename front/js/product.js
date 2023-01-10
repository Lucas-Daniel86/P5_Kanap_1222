// Récupération de l'id via les paramétres de l'URL.
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("_id");
if (id != null) {
    let itemPrice = 0;
    let imgUrl, altText, articleName;
}
// Requête de l'API
fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => handleData(res));

// Récupération des informations des produit.
function handleData(ref) {
    const { altTxt, colors, description, imageUrl, name, price } = ref;
    itemPrice = price;
    imgUrl = imageUrl;
    altText = altTxt;
    articleName = name;
    makeImage(imageUrl, altTxt);
    makeTitle(name);
    makeDescription(description);
    makeColors(colors);
}
//Création de l'élément <img> qui contient l'image du produit et sa description, et qui a comme élément parent la classe "item__img".
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altTxt;
    const parent = document.querySelector(".item__img");
    if (parent != null) parent.appendChild(image);
}
// Création de l'élément <h1> qui contient le nom du produit.
function makeTitle(name) {
    const h1 = document.querySelector("#title");
    if (h1 != null) h1.textContent = name;
}
// Récupértion de la div "price" pour ajouter le prix du produit.
function makePrice(price) {
    const span = document.querySelector("#price");
    if (span != null) span.textContent = price;
}
// Récupération de la div "description" pour ajouter la description du produit.
function makeDescription(description) {
    const p = document.querySelector("#description");
    if (p != null) p.textContent = description;
}
// Récupération de la div "colors" dans l'élément <select>, qui contient la création de l'élément <option>, avec la couleur commme valeur.
function makeColors(colors) {
    const select = document.querySelector("#colors");
    if (select != null) {
        colors.forEach((color) => {
            const option = document.createElement("option");
            option.value = color;
            option.textContent = color;
            select.appendChild(option);
        });
    }
}
// récupération de la div "addToCart" pour déclencler un événement au click du bouton "Ajouter au panier".
const button = document.querySelector("#addToCart");
button.addEventListener("click", handleClick);
// Récupération de la div "colors" et "quantity" avec ses valeurs respectives.
// Si la commande n'est pas invalide, la commande est sauvegardée et redirigée à la page panier.
function handleClick() {
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;

    if (isOrderInvalid(color, quantity)) return;
    saveOrder(color, quantity);
    redirectToCart();
}

// Récupération du tableau du localStorage (sans le prix)
// La constante "key" porte l'id et la couleur du produit, et la constante "data" chaque item du produit.
function saveOrder(color, quantity) {
    const key = `${id}-${color}`;
    const data = {
        id: id,
        color: color,
        quantity: Number(quantity),
        imageUrl: imgUrl,
        altTxt: altText,
        name: articleName,
    };
    localStorage.setItem(key, JSON.stringify(data));
}
// Création d'une condition si la commande n'est pas valide, avec une alerte comme message.
function isOrderInvalid(color, quantity) {
    if (
        color == null ||
        color === "" ||
        quantity == null ||
        quantity <= 0 ||
        quantity > 100
    ) {
        alert("Please select a color and quantity between 1 and 100");
        return true;
    }
}
// Fonction qui renvoie l'URL du panier après avoir cliqué sur le bouton "Ajouter au panier", si la commande es valide.
function redirectToCart() {
    window.location.href = "cart.html";
}
