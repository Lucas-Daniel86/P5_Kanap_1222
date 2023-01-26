const orderId = getOrderId();
displayOrderId(orderId);
removeAllCache();

// Afficher le numéro de commande.
function displayOrderId(orderId) {
    const orderIdElement = document.getElementById("orderId");
    orderIdElement.textContent = orderId;
}

// Récupération numéro de commande.
function getOrderId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("orderId");
}

// Effacer tous les informations du localStorage.
function removeAllCache() {
    const cache = window.localStorage;
    cache.clear();
}