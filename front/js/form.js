// Gestion du formulaire
//Appel des éléments du DOM
if (document.querySelector(".cart__order__form")) {
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

    lastName.addEventListener("input", () => {
        const valid = cityRegex.test(lastName.value);
        lastNameErrorMsg.innerHTML = valid ? "" : lastNameErrorMessage;
        lastNameValid = valid;
    });

    address.addEventListener("input", () => {
        const valid = addressRegex.test(address.value);
        addressErrorMsg.innerHTML = valid ? "" : addressErrorMessage;
        addressValid = valid;
    });

    city.addEventListener("input", () => {
        const valid = cityRegex.test(city.value);
        cityErrorMsg.innerHTML = valid ? "" : cityErrorMessage;
        cityValid = valid;
    });

    email.addEventListener("input", () => {
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
        if (firstNameValid && lastNameValid && addressValid && cityValid && emailValid) {
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
}