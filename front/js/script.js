//Requêter l'API pour lui demander l'ensemble des produits
// Récupérer la réponse émise.
fetch("http://localhost:3000/api/products")
   .then((response) => response.json())
   .then((data) => display(data));

// Insérer chaque produit dans la page d'accueil
function display(products) {
   const items = document.querySelector("#items");
   products.forEach((product) => {
      const item = document.createElement("a");
      item.href = `./product.html?id=${product._id}`;
      item.innerHTML = `
            <article>
              <img src="${product.imageUrl}"alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
        `;
      items.appendChild(item);
   });
}
