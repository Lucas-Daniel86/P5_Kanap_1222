// Appel de l'API pour récupérer les produits
fetch("http://localhost:3000/api/products")
   .then((res) => res.json())
   .then((data) => addProducts(data));
// Tableau des produits
function addProducts(refs) {
   refs.forEach((ref) => {
      const { _id, imageUrl, altTxt, name, description } = ref;
      const anchor = makeAnchor(_id);
      const article = document.createElement("article");
      const image = makeImage(imageUrl, altTxt);
      const h3 = makeH3(name);
      const p = makeParagraph(description);

      appendElementsToArticle(article, [image, h3, p]);
      appendArticleToAnchor(anchor, article);
   });
}
// Items du produit ajoutés dans l'élément <article>
function appendElementsToArticle(article, array) {
   array.forEach((item) => {
      article.appendChild(item);
   });
}
// Création de l'élément <a> qui contient le lien du produit
function makeAnchor(_id) {
   const anchor = document.createElement("a");
   anchor.href = "./product.html?_id=" + _id;
   return anchor;
}
// Récupération de la div "items" qui contient le lien et l'article du produit. l'élément <article> est à l'interieur de l'élément <a>
function appendArticleToAnchor(anchor, article) {
   const items = document.querySelector("#items");
   if (items != null) {
      items.appendChild(anchor);
      anchor.appendChild(article);
   }
}
// Création de l'élément <img> qui contient l'image et la description de l'image du produit.
function makeImage(imageUrl, altTxt) {
   const image = document.createElement("img");
   image.src = imageUrl;
   image.alt = altTxt;
   return image;
}
// Création de l'élément <h3> qui contient le nom du produit
function makeH3(name) {
   const h3 = document.createElement("h3");
   h3.textContent = name;
   h3.classList.add("productName");
   return h3;
}
// Création de l'élément <p> qui contient la description du produit.
function makeParagraph(description) {
   const p = document.createElement("p");
   p.textContent = description;
   p.classList.add("productDescription");
   return p;
}
