// On récupère l'id du produit à partir de l'url de la page
let url = new URL(location.href); 
let itemId = url.searchParams.get("orderId"); 

// Affichage du numéro de commande
const orderId = document.getElementById("orderId");
orderId.innerHTML = `${itemId}`; 
console.log(itemId);

////// On vide le LocalStorage /////////
localStorage.clear();

