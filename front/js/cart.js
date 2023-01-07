const cart = [];
retrieveItemsFromCache();

// Appel de l'API pour récupérer les produits
fetch("http://localhost:3000/api/products")
    .then(function (response) {
        //console.log(response);
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (data) {
        products = data;
        cart.forEach((item) => {
            const foundItem = products.find((p) => p._id == item.id);
            console.log(foundItem);
            console.log(item);
            if (foundItem != undefined) {
                displayItem(item, foundItem);
            }
        });

        displayTotalQuantity();
        displayTotalPrice();
    })
    .catch(function (error) {
        // Une erreur est survenue
    });

function retrieveItemsFromCache() {
    const numberOfItems = localStorage.length;
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || "";
        const itemObject = JSON.parse(item);
        cart.push(itemObject);
    }
}

function displayItem(item, foundItem) {
    const article = makeArticle(item);
    const imageDiv = makeImageDiv(item);
    article.appendChild(imageDiv);
    const cartItemContent = makeCartContent(item, foundItem);
    article.appendChild(cartItemContent);
    displayArticle(article);
}

function displayTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity");
    const total = cart.reduce((total, item) => total + item.quantity, 0);
    totalQuantity.textContent = total;
    if (total == null || total <= 0 || total > 100) {
        alert("Please select a quantity between 1 and 100");
        return true;
    }
}

function displayTotalPrice() {
    const totalPrice = document.querySelector("#totalPrice");
    let total = 0;
    cart.forEach((item) => {
        const foundItem = products.find((p) => p._id == item.id);
        if (foundItem != undefined) {
            total += item.quantity * foundItem.price;
        }
    });
    totalPrice.textContent = total;
}

function makeCartContent(item, foundItem) {
    const cartItemContent = document.createElement("div");
    cartItemContent.classList.add("cart__item_content");
    const description = makeDescription(item, foundItem);
    const settings = makeSettings(item);
    cartItemContent.appendChild(description);
    cartItemContent.appendChild(settings);
    return cartItemContent;
}

function makeSettings(item) {
    const settings = document.createElement("div");
    settings.classList.add("cart__item__content__settings");

    addQuantityToSettings(settings, item);
    addDeleteToSettings(settings, item);
    return settings;
}

function addDeleteToSettings(settings, item) {
    const div = document.createElement("div");
    div.classList.add("cart__item__content__settings__Delete");
    div.addEventListener("click", () => deleteItem(item));
    const p = document.createElement("p");
    p.textContent = "Supprimer";
    div.appendChild(p);
    settings.appendChild(div);
}

function deleteItem(item) {
    const itemToDelete = cart.findIndex(
        (product) => product.id === item.id && product.color === item.color
    );
    cart.splice(itemToDelete, 1);
    displayTotalPrice();
    displayTotalQuantity();
    deleteDataFromCache(item);
    deleteArticleFromPage(item);
}

function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    );
    articleToDelete.remove();
}

function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div");
    quantity.classList.add("cart__item__content__settings__quantity");
    const p = document.createElement("p");
    p.textContent = "Qté : ";
    quantity.appendChild(p);
    const input = document.createElement("input");
    input.type = "number";
    input.classList.add("itemQuantity");
    input.name = "itemQuantity";
    input.min = "1";
    input.max = "100";
    input.value = item.quantity;
    input.addEventListener("input", () =>
        updatePriceAndQuantity(item.id, input.value, item)
    );
    quantity.appendChild(input);
    settings.appendChild(quantity);
}

function updatePriceAndQuantity(id, newValue, item) {
    const itemToUpdate = cart.find((item) => item.id === id);
    itemToUpdate.quantity = Number(newValue);
    item.quantity = itemToUpdate.quantity;
    displayTotalQuantity();
    displayTotalPrice();
    saveNewDataToCache(item);
}

function deleteDataFromCache(item) {
    const key = `${item.id}-${item.color}`;
    localStorage.removeItem(key);
}

function saveNewDataToCache(item) {
    const dataToSave = JSON.stringify(item);
    const key = `${item.id}-${item.color}`;
    localStorage.setItem(key, dataToSave);
}

function makeDescription(item, foundItem) {
    const description = document.createElement("div");
    description.classList.add("cart__item__content__description");

    const h2 = document.createElement("h2");
    h2.textContent = item.name;
    const p = document.createElement("p");
    p.textContent = item.color;
    const p2 = document.createElement("p");
    p2.textContent = foundItem.price + " €";

    description.appendChild(h2);
    description.appendChild(p);
    description.appendChild(p2);
    return description;
}

function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article);
}

function makeArticle(item) {
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = item.id;
    article.dataset.color = item.color;
    return article;
}

function makeImageDiv(item) {
    const div = document.createElement("div");
    div.classList.add("cart__item__img");
    const image = document.createElement("img");
    image.src = item.imageUrl;
    image.alt = item.altTxt;
    div.appendChild(image);
    return div;
}

// Gestion du formulaire
//Appel des éléments du DOM
const form = document.querySelector(".cart__order__form"),
    firstName = document.querySelector("#firstName"),
    firstNameErrorMsg = document.querySelector("#firstNameErrorMsg"),
    lastName = document.querySelector("#lastName"),
    lastNameErrorMsg = document.querySelector("#lastNameErrorMsg"),
    address = document.querySelector("#address"),
    addressErrorMsg = document.querySelector("#addressErrorMsg"),
    city = document.querySelector("#city"),
    cityErrorMsg = document.querySelector("#cityErrorMsg"),
    email = document.querySelector("#email"),
    emailErrorMsg = document.querySelector("#emailErrorMsg"),
    order = document.querySelector("#order");

// Création de variables d'état
let firstNameMode = false,
    lastNameMode = false,
    addressMode = false,
    cityMode = false,
    emailMode = false;

// création des regex
const addressRegex = /[a-zA-Z0-9\s]{8,32}/,
    cityRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i,
    emailRegex = /[a-zA-Z0-9.-_]+@{1}[a-zA-Z0-9.-_]+\.{1}[a-z]{1,10}/;

// Variables contenant un message d'erreur
const firstNameErrorMessage =
    'Merci de remplir le champ "Prénom" avec seulement des caractères.',
    lastNameErrorMessage =
        'Merci de remplir le champ "Nom" avec seulement des caractères.',
    addressErrorMessage = "Adresse incorrecte.",
    cityErrorMessage =
        'Merci de remplir le champ "Ville" avec seulement des caractères.',
    emailErrorMessage = "L'email n'est pas valide.";

//Écoute sur chaque input et changement de la valeur de la variable d'état pour traiter le bouton order selon qu'il y ait une erreur ou non
firstName.addEventListener("keyup", (read) => {
    read = cityRegex.test(firstName.value);
    firstNameErrorMsg.innerHTML = read ? "" : firstNameErrorMessage;
    firstNameMode = read ? true : false;
});

lastName.addEventListener("keyup", (read) => {
    read = cityRegex.test(lastName.value);
    lastNameErrorMsg.innerHTML = read ? "" : lastNameErrorMessage;
    lastNameMode = read ? true : false;
});

address.addEventListener("keyup", (read) => {
    read = addressRegex.test(address.value);
    addressErrorMsg.innerHTML = read ? "" : addressErrorMessage;
    addressMode = read ? true : false;
});

city.addEventListener("keyup", (read) => {
    read = cityRegex.test(city.value);
    cityErrorMsg.innerHTML = read ? "" : cityErrorMessage;
    cityMode = read ? true : false;
});

email.addEventListener("keyup", (read) => {
    read = emailRegex.test(email.value);
    emailErrorMsg.innerHTML = read ? "" : emailErrorMessage;
    emailMode = read ? true : false;
});

//Envoi des données de la commande à l'API
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) {
        alert(
            "Veuillez ajouter un ou plusieurs articles au panier afin de valider la commande"
        );
    } else if (cart.length >= 1) {
        if (!firstNameMode) {
            firstNameErrorMsg.innerHTML = firstNameErrorMessage;
        }
        if (!lastNameMode) {
            lastNameErrorMsg.innerHTML = lastNameErrorMessage;
        }
        if (!addressMode) {
            addressErrorMsg.innerHTML = addressErrorMessage;
        }
        if (!cityMode) {
            cityErrorMsg.innerHTML = cityErrorMessage;
        }
        if (!emailMode) {
            emailErrorMsg.innerHTML = emailErrorMessage;
        }
        if (firstNameMode && lastNameMode && addressMode && cityMode && emailMode) {
            //Création de l'objet contenant les iinformations clients
            const contact = {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value,
            };

            // Création du tableau contenant les informations clients
            const products = [];
            for (let i = 0; i < cart.length; i++) {
                products.push(cart[i].id);
            }

            //Création de l'objet contenant les infos clients et le id des produits
            let sendData = { contact, products };

            // Méthode POST pour l'envoi des donnés
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sendData),
            };
            console.log(options);
            fetch("http://localhost:3000/api/products/order", options)
                .then((response) => response.json())
                .then((data) => {
                    window.location.href = "./confirmation.html?id=" + data.orderId;
                });
        }
    }
});
