const localStorageCartName = "localCart";

initPage();

// Fonction pour initialise la page
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
        if (localCart === null) {
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
        console.error(err);
    }
}

// Afficher les produits du panier dans la page
async function showCart(cart, catalog) {
    if (cart.length == 0) {
        displayEmptyCart();
    } else {

        for (let i = 0; i < cart.length; i++) {
            let item = cart[i];

            productData = catalog.find(product => product._id === item._id);
            createCartItem(item, productData);
        }

        setListenerToQuantityInput(cart, catalog);
        setListenerToRemoveButton(cart, catalog);
    }

    setTotalQuantity(cart, catalog);
}

// Fonction pour afficher la quantité et le prix des produits du panier
function setTotalQuantity(cart, catalog) {

    let totalQuantity = 0;
    let totalPrice = 0;
    //console.log(catalog);
    // Boucle pour calculer le prix des produits du panier par rapport à la quantité selectionnée
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];

        totalQuantity += parseInt(item.quantity);

        productData = catalog.find(product => product._id === item._id);
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
                let idItem = this.closest(".cart__item").dataset.id;
                let colorItem = this.closest(".cart__item").dataset.color;
                // Chercher si le produit est déjà dans le panier en comparant son id et sa couleur à ceux déjà dans le panier 
                let itemInCart = cart.find((item) => item.color == colorItem && item._id === idItem);
                //console.log(itemInCart);

                // Si le panier est vide, on le créer
                if (itemInCart === undefined) {
                    cart.push({ _id: idItem, color: colorItem, quantity: parseInt(this.value) });
                    // Si il y a déjà un produit identique dans le panier, on met à jour sa quantité
                } else {
                    itemInCart.quantity = parseInt(this.value);
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
            let itemToDelete = cart.find((item) => item.colors == colorItem && item._id === idItem);
            let itemIndexToDelete = cart.indexOf(itemToDelete);
            // retirer le produit du local storage
            cart.splice(itemIndexToDelete, 1);
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
    article.setAttribute("data-id", item._id);
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

/////////////////////////////Formulaire//////////////////////////////////////////

// Récupération des éléments HTML pour les inputs
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const adressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");
const orderButton = document.getElementById("order");

// Récupération des éléments HTML pour les messages d'erreur
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

// Regex pour valider le formualaire
const regexFirstName = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const regexLastName = regexFirstName;
const regexAddress = /^[a-zA-Z0-9\s,.'-]{3,}$/;
const regexCity = regexFirstName;
const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i;


// Ajout d'un écouteur d'événements pour chaque champ de saisie
firstNameInput.addEventListener("input", validateFirstName);
lastNameInput.addEventListener("input", validateLastName);
adressInput.addEventListener("input", validateAddress);
cityInput.addEventListener("input", validateCity);
emailInput.addEventListener("input", validateEmail);


// Fonction pour valider le prénom
function validateFirstName() {
    const firstName = firstNameInput.value;
    if (!firstName || !regexFirstName.test(firstName)) {
        firstNameErrorMsg.innerHTML = "Veuillez saisir un prénom valide";
        return false;
    } else {
        firstNameErrorMsg.innerHTML = "";
        return true;
    }
}

// Fonction pour valider le nom de famille
function validateLastName() {
    const lastName = lastNameInput.value;
    if (!lastName || !regexLastName.test(lastName)) {
        lastNameErrorMsg.innerHTML = "Veuillez saisir un nom valide";
        return false;
    } else {
        lastNameErrorMsg.innerHTML = "";
        return true;
    }
}

// Fonction pour valider l'adresse
function validateAddress() {
    const address = adressInput.value;
    if (!address || !regexAddress.test(address)) {
        addressErrorMsg.innerHTML = "Veuillez saisir une adresse valide";
        return false;
    } else {
        addressErrorMsg.innerHTML = "";
        return true;
    }
}

// Fonction pour valider la ville
function validateCity() {
    const city = cityInput.value;
    if (!city || !regexCity.test(city)) {
        cityErrorMsg.innerHTML = "Veuillez saisir une ville correcte";
        return false;
    } else {
        cityErrorMsg.innerHTML = "";
        return true;
    }
}

// Fonction pour valider l'adresse email
function validateEmail() {
    const email = emailInput.value;
    if (!email || !regexEmail.test(email)) {
        emailErrorMsg.innerHTML = "Veuillez saisir une adresse e-mail valide";
        return false;
    } else {
        emailErrorMsg.innerHTML = "";
        return true;
    }
}

// Ajout d'un écouteur d'événements pour le bouton de commande
orderButton.addEventListener("click", function (event) {
    // Empêche le formulaire d'être envoyé s'il est vide ou invalide
    event.preventDefault();

    // Validation de chaque champ de saisie
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isAddressValid = validateAddress();
    const isCityValid = validateCity();
    const isEmailValid = validateEmail();

    // Vérification que tous les champs de saisie sont valides avant de soumettre le formulaire
    if (isFirstNameValid && isLastNameValid && isAddressValid && isCityValid && isEmailValid) {
        // Récupération de la valeur des champs de saisie du formulaire
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const address = adressInput.value;
        const city = cityInput.value;
        const email = emailInput.value;

        // Récupération des produits dans le panier
        const cart = getCartFromLocalStorage();
        if (cart.length === 0) {
            alert("Le panier est vide, ajoutez des produits avant de passer une commande");
            return;
        }

        // Création de l'objet contact
        const contact = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email,
        };

        // Création du tableau products contenant les IDs des produits
        const products = cart.map(item => item._id);

        // Création de l'objet finalOrderItem contenant l'objet contact et le tableau products
        const finalOrderItem = { contact, products };

        // Envoi de la requête POST à l'API pour passer la commande
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(finalOrderItem),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            // Vérification de la réponse HTTP
            if (!response.ok) {
                throw new Error("Erreur lors de la soumission du formulaire");
            }

            // Récupération de l'ID de commande
            return response.json();
        })
        .then(data => {
            // Redirection vers la page de confirmation de commande avec l'ID de commande
            window.location.href = `confirmation.html?orderId=${data.orderId}`;
        })
        .catch(error => {
            // Affichage d'un message d'erreur en cas d'échec de la requête
            alert(`Impossible de passer la commande : ${error}`);
        });
    } else {
        // Si les champs de saisie ne sont pas valides, affichage d'un message d'erreur
        alert("Veuillez saisir des informations valides avant de passer une commande");
    }
});
