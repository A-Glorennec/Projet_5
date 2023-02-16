// Lien du localhost pour récupérer les données depuis l'API
const api = "http://localhost:3000/api/products";

// Fonction asynchrone qui effectue une requête vers l'api pour récupérer tous les produits du serveur
// et qui capte les eventuelles erreurs
async function getProductsFromApi() {
    try {
        const response = await fetch(api);
        const datas = await response.json();
        displayProductsFromApi(datas);
        //console.log(datas);
    } catch (error) {
        console.error(error);
        alert("Une erreur s'est produite : " + error);
    }
};
// Appel de la fonction 
getProductsFromApi();

// Fonction qui permet d'afficher les produits (datas) récupérées sur la page d'accueil
function displayProductsFromApi(datas) {
    // Boucle for pour itérer sur le tableau de produits
    for (let i = 0; i < datas.length; i++) {

        let data = datas[i];
        // Créations des balises HTML pour afficher le contenu des produits
        let a = document.createElement("a");
        a.setAttribute("href", `./product.html?id=${data._id}`);
        document.querySelector("#items").appendChild(a);
        a.innerHTML = `            
        <article>
            <img src="${data.imageUrl}" alt="${data.altTxt}, ${data.name}">
            <h3 class="productName">${data.name}</h3>
            <p class="productDescription">${data.description}</p>
        </article>`;
    }
}