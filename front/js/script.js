//Requête de l'API pour demander l'ensemble des produits
fetch("http://localhost:3000/api/products")
   .then((response) => response.json())
   .then((data) => addProducts(data));
//Récupération de chaque produit de l'API
function addProducts(product) {
   for (let i = 0; i < product.length; i++) {
      // Récupération de tous les items de chaque produit.
      const {
         id = product._id,
         imageUrl = product.imageUrl,
         altTxt = product.altTxt,
         name = product.name,
         description = product.description,
      } = product[i];
      // Création de chaque élément HTML pour afficher les produits sur la age d'accueil"
      const anchor = makeAnchor(id);
      const image = makeImage(imageUrl, altTxt);
      const article = makeArticle();
      const h3 = makeH3(name);
      const p = makeParagraph(description);
      appendElementsToArticle(article, image, h3, p);
      appendArticleToAnchor(anchor, article);
   }
}
// Création des petites fonctions qui vont être appelées sur la fonction addProducts.
function appendElementsToArticle(article, image, h3, p) {
   article.appendChild(image);
   article.appendChild(h3);
   article.appendChild(p);
}

function appendArticleToAnchor(anchor, article) {
   const items = document.querySelector("#items");
   if (items != null) {
      items.appendChild(anchor);
      anchor.appendChild(article);
   }
}

function makeAnchor(id) {
   const anchor = document.createElement("a");
   anchor.href = "./product.html?id=" + id;
   return anchor;
}

function makeArticle() {
   return (article = document.createElement("article"));
}

function makeImage(imageUrl, altTxt) {
   const image = document.createElement("img");
   image.src = imageUrl;
   image.alt = altTxt;
   return image;
}

function makeH3(name) {
   const h3 = document.createElement("h3");
   h3.textContent = name;
   h3.classList.add("productName");
   return h3;
}

function makeParagraph(description) {
   const p = document.createElement("p");
   p.textContent = description;
   p.classList.add("productDescription");
   return p;
}
