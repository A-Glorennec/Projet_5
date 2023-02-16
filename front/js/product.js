// GET ID OF THE PAGE'S PRODUCT
const params = new URLSearchParams(window.location.search);

const id = params.get('id');

const url = `http://localhost:3000/api/products/${id}`;


// NOW GET ITS DATAS BY FETCH REQUEST
async function getProductDatas() {
    try {
        const response = await fetch(url);
        const datas = await response.json();
        //console.log(datas);
        // Appel de la fonction pour afficher les informations du produit
        displayItemData(datas);
        //Appel de la fonction pour ajouter un produit au panier
        addItemToCart(datas);
    } catch {
        console.error(error);
        alert("Une erreur s'est produite");
    }
};
// Appel de la fonction
getProductDatas();


// Fonction qui permet d'afficher les informations du produit selectionné sur la page produit
function displayItemData(datas) {
    // Modification du contenu HTML en fonction du produit à afficher
    document.querySelector(".item__img").innerHTML = `<img src="${datas.imageUrl}" alt="${datas.altTxt}">`;
    document.querySelector("#title").innerText = `${datas.name}`;
    document.querySelector("#price").innerText = `${datas.price}`;
    document.querySelector("#description").innerText = `${datas.description}`;
    // Boucle pour afficher les différentes options de couleurs
    for (let i of datas.colors) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        document.querySelector("#colors").appendChild(option);
    }
}


let itemQuantity = document.querySelector("#quantity");
let itemColor = document.querySelector("#colors");
let addToCartButton = document.querySelector("#addToCart");


// Fonction pour créer le panier
function addItemToCart (datas)  {
    // Création d'un évènement qui se déclenche au clic
    addToCartButton.addEventListener('click', function () {
        // Si la quantité ou la couleur sont mal renseignées, on envoie un feedback
        if (itemQuantity.value <= 0 || itemQuantity.value > 100 || itemColor.value == "") {
            alert("Vous devez selectionner une couleur et une quantité");
        // Si les informations sont bien remplies, on créer le panier avec le produit selectionné    
        } else {
            let quantity = itemQuantity.value;
            let color = itemColor.value;
            let selectedItem = {
                id: id,
                img: datas.imageUrl,
                alt: datas.altTxt,
                description: datas.description,
                name: datas.name,
                quantity: parseInt(quantity),
                color: color
            };

            // Récupération des informations du panier existant (si il existe déjà)
            let cart = JSON.parse(localStorage.getItem("localCart"));

            // Mise à jour du localStorage
            addToCart = () => localStorage.setItem("localCart", JSON.stringify(cart));


            // Si le panier existe déjà dans le localStorage
            if (cart) {
                // On vérifie si le même produit est déjà dans le panier
                let sameItem = cart.find((item) => item.id === id && item.color === color);
                // Si le produit est déjà dans le panier, on rajoute la quantité selectionnée
                if (sameItem) {
                    
                    let addQuantity = parseInt(selectedItem.quantity) + parseInt(sameItem.quantity);
                    sameItem.quantity = addQuantity;
                    // Mise à jour du localStorage
                    addToCart();
                // Si le produit n'est pas dans le panier on l'ajout au panier    
                } else {
                    cart.push(selectedItem);
                    // Mise à jour du localStorage
                    addToCart();
                   
                }
            // Si le panier n'est pas encore présent dans le localStorage
            } else {
                // Initialisation d'un panier vide
                cart = [];
                // Ajout des produits selectionnés dans le panier
                cart.push(selectedItem);
                // Mise à jour du localStorage
                addToCart();
                
            }
            alert("Produit ajouté au panier");
        }
    });
}
