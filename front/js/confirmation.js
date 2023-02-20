// On récupère l'id du produit à partir de l'url de la page
let url = new URL(location.href); 
let itemId = url.searchParams.get("orderId"); 

const orderId = document.getElementById("orderId");
orderId.innerHTML = `${itemId}`; 
console.log(itemId);

////// On vide le LocalStorage /////////
localStorage.clear();

/*let url = window.location.href;
let newUrl = new URL(url);
let searchParams = newUrl.searchParams;
let id = searchParams.get("orderId");

console.log(id); */

/*let url = new URL(window.location.href);
  let itemId = url.searchParams.get("orderId");
  if (itemId != undefined) {
    document.querySelector("#orderId").textContent = itemId;
  };*/