function ajouterAuPanier(idArticle) {
  fetch('panier.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'action=ajouter&id=' + idArticle
  })
  .then(response => response.json())
  .then(data => majAffichagePanier(data));
}

function togglePanier() {
  const toast = document.getElementById('panierToast');
  toast.classList.toggle('visible');

  // Recharge panier à l'ouverture
  if (toast.classList.contains('visible')) {
    fetch('panier.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'action=voir'
    })
    .then(response => response.json())
    .then(data => majAffichagePanier(data));
  }
}

function majAffichagePanier(data) {
  const ul = document.getElementById('listePanier');
  ul.innerHTML = '';
  data.forEach(id => {
    const li = document.createElement('li');
    li.textContent = 'Article ' + id;
    ul.appendChild(li);
  });
}

function validerPanier() {
  fetch('valider.php', {
    method: 'POST'
  })
  .then(response => response.text())
  .then(msg => {
    alert(msg);
    document.getElementById('listePanier').innerHTML = '';
  });
}
