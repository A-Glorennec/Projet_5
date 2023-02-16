const localStorageCartName = "localCart";

initPage();

// Récupère les données du panier depuis le localStorage
async function initPage() {
    let cart = getCartFromLocalStorage();
    let catalog = await getProductCatalog();

    showCart(cart, catalog);
}



// Fonction pour récupérer les données du panier depuis le localStorage et les retourne sous forme de tableau
function getCartFromLocalStorage() {
    let localCart = [];

    try {
        localCart = JSON.parse(localStorage.getItem(localStorageCartName));
        if (localCart === null) {
            localCart = [];
        }
    } catch {
        console.error(error);
    } finally {
        // Si les données récupérées sont nulles, on initialise localCart à un tableau vide 
        if (localCart === null){
            localCart = [];
        }
        else {
            localCart = localCart;
        }
    }

    return localCart;
}

// Ecrire dans le panier dans le local storage
function setCartFromLocalStorage(cart) {
    localStorage.setItem(localStorageCartName, JSON.stringify(cart));
}

//Fonction pour récupérer le catalogue donné par l'API
async function getProductCatalog() {
    try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();

        return data;
    }
    catch {
        console.error(error);
    }
}

// Afficher les produits du panier dans la page
async function showCart(cart, catalog) {
    if (cart.length == 0) {
        displayEmptyCart();
    } else {

        for (let i = 0; i < cart.length; i++) {
            let item = cart[i];

            productData = catalog.find(product => product._id === item.id);

            createCartItem(item, productData);
        }

        setListenerToQuantityInput(cart, catalog);
        setListenerToRemoveButton(cart, catalog);
    }

    setTotalQuantity(cart, catalog);
}

// Fonction pour afficher la quantité et le prix des produits du panier
function setTotalQuantity(cart, catalog) {
    // Récupération de tous les éléments HTML
    let totalQuantity = 0;
    let totalPrice = 0;
    console.log(catalog);
    // Boucle pour calculer le prix des produits du panier par rapport à la quantité selectionnée
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];

        totalQuantity += parseInt(item.quantity);

        productData = catalog.find(product => product._id === item.id);
        totalPrice += parseInt(item.quantity * productData.price);
    }

    document.querySelector("#totalQuantity").innerText = totalQuantity;
    document.querySelector("#totalPrice").innerHTML = totalPrice;
};

// Fonction pour modifier la quantité du panier
function setListenerToQuantityInput(cart, catalog) {
    const inputQuantity = document.querySelectorAll(".itemQuantity");
    // Boucle pour ajouter un évènement sur chaque produit
    inputQuantity.forEach((quantityInput) => {
        // Création d'un évènement qui se déclenche au changement de quantité
        quantityInput.addEventListener("change", function () {

            let modifiedValue = this.value;

            // Feedback si la quantité saisie est incorrecte
            if (modifiedValue > 100 || modifiedValue < 0) {
                alert("La quantité saisie est incorrecte");

            } else {
                // récupérer les informations d'id et de couleur depuis le HTML
                let idItem = this.closest(".cart__item").dataset._id;
                let colorItem = this.closest(".cart__item").dataset.colors;
                // Chercher si le produit est déjà dans le panier en comparant son id et sa couleur à ceux déjà dans le panier 
                let itemInCart = cart.find((e) => e.colors == colorItem && e._id === idItem);
                console.log(itemInCart);

                // Si le panier est vide, on le créer
                if (itemInCart === undefined) {
                    cart.push({ _id: idItem, colors: colorItem, quantity: parseInt(this.value)});
                    // Si il y a déjà un produit identique dans le panier, on met à jour sa quantité
                } else {
                    cart.find(item => item._id === idItem).quantity = parseInt(this.value);
                }

                // mettre à jour le localStorage
                setCartFromLocalStorage(cart);

                // mettre à jour l'interface : pour le total
                setTotalQuantity(cart, catalog);
            }
        })
    });
};

// Ajoute un event listener sur les boutons Supprimer
function setListenerToRemoveButton(cart, catalog) {

    const deleteButtons = document.querySelectorAll(".deleteItem");
    // Création d'un évènement sur chaque élément HTML qui se déclenche au clic
    for (let i = 0; i < deleteButtons.length; i++) {

        deleteButtons[i].addEventListener("click", function () {

            const cartItem = this.closest(".cart__item");
            let idItem = cartItem.dataset._id;
            let colorItem = cartItem.dataset.colors;
            // Cherche l'objet à supprimer en comparant son id et sa couleur avec les produits dans le panier et le supprime
            let itemToDelete = cart.find((e) => e.colors == colorItem && e._id === idItem);
            let itemIndexToDelete = cart.indexOf(itemToDelete);
            console.log(itemIndexToDelete);
            cart.splice(itemIndexToDelete, 1);
            // retirer le produit du local storage
            setCartFromLocalStorage(cart);
            // retirer le produit de l'affichage
            cartItem.remove();
            // Mettre à jour le total
            setTotalQuantity(cart, catalog);
            //console.log(cart)
            if (cart.length === 0) {
                displayEmptyCart();
            }

        })
    }

};


// Fonction pour afficher un message si le panier est vide 
function displayEmptyCart() {
    let h1 = document.querySelector('h1');
    h1.innerText = "Votre panier est vide";
};

// Fonction pour créer un article de produit dans le panier
function createCartItem(item, productData) {
    let article = document.createElement('article');
    article.className = "cart__item";
    article.setAttribute("data-id", item.id);
    article.setAttribute("data-color", item.color);
    document.querySelector("#cart__items").appendChild(article);
    article.innerHTML += `<div class="cart__item__img">
                                 <img src="${item.img}" alt="${item.alt}">
                              </div>
                              <div class="cart__item__content">
                               <div class="cart__item__content__description">
                                 <h2>${item.name}</h2>
                                  <p>${item.color}</p>
                                  <p>${productData.price} €</p>
                               </div>
                              <div class="cart__item__content__settings">
                                 <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                     <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                                 </div>
                                 <div class="cart__item__content__settings__delete">
                                   <p class="deleteItem">Supprimer</p>
                                  </div>
                                </div>
                              </div>`;
};

