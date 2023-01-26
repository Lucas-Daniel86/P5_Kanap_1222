const id = getIdFromUrl();
if (id === null) {
    alert("page introuvable.");
    hidenDetails();
    throw new Error("page introuvable.");
}

// Intérroger l'API pour récupérer les détails d'un produit depuis son id.
fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => display(res))
    .catch((err) => {
        alert("Ce produit n'est pas disponible.");
        hidenDetails();
    });

document.querySelector("#addToCart").addEventListener("click", () => {
    //Récupération des éléments pour appliquer les valeurs souhaitées dans la nouvelle page.
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;

    if (isOrderInvalid(color, quantity)) return; // Message d'erreur
    //Les valeurs du produit à récupérer au click
    let product = {
        id: id,
        color: color,
        quantity: quantity,
    };
    saveOrder(product); //Les valeurs vont s'appliquer au produit pour la sauvegarde de la commande.
    redirectToCart(); // Redirection vers la page cart.js
});

//Insérer les détails du produit dans la page produit
function display(product) {
    const section = document.querySelector(".item");
    const imageBlock = section.querySelector(".item__img");
    imageBlock.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

    section.querySelector("#title").innerText = product.name;
    section.querySelector("#price").innerText = formatPrice(product.price);
    section.querySelector("#description").innerText = product.description;

    const colors = section.querySelector("#colors");
    product.colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.innerText = color;
        colors.appendChild(option);
    });
}

// Application de la notion "URLSearchParams" afin de savoir quel produit doit être affiché sur la page produit, depuis la page d'accueil.
function getIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("id");
}

// Message quand la page est vide.
function hidenDetails() {
    document.querySelector(".item").innerHTML = "Oops";
}

// Message d'alerte si la couleur n'a pas été avec certaines conditions.
function isColorInvalid(color) {
    if (color == null || color === "") {
        alert("Veuillez sélectionner une couleur");
        return true;
    }
    return false;
}

// Message d'alerte si la quantité n'a pas été choisie avec certaines conditions.
function isQuantityInvalid(quantity) {
    if (quantity == null) {
        alert("Veuillez sélectionner une quantité");
        return true;
    }
    if (quantity <= 0) {
        alert('Veuillez sélectionner une quantité supérieure ou égale à "1"');
        return true;
    }
    if (quantity > 100) {
        alert('Veuillez sélectionner une quantité inférieure ou égale à "100"');
        return true;
    }

    return false;
}

// Message d'alerte si la commande n'est pas remplie avec les conditions nécessaires.
function isOrderInvalid(color, quantity) {
    if (isColorInvalid(color) || isQuantityInvalid(quantity)) {
        return true;
    }
    return false;
}

//Redirection vers la page panier.
function redirectToCart() {
    window.location.href = "cart.html";
}

// Récupération du panier depuis le localStorage
function saveOrder(product) {
    let cart;
    // Si le panier est vide ...
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
            // Prendre le produit éxistant dans le localStorage.
            // Modifier la quantité si besoin.
            existingProduct.quantity =
                Number(existingProduct.quantity) + Number(product.quantity);
            //La quantité du produit ne va pas dépasser la valeur de "100".
            if (existingProduct.quantity > 100) {
                existingProduct.quantity = 100;
            }
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }
}