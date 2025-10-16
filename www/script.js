// Nom de la clé de stockage
const STORAGE_KEY = 'panierFromages';

function togglePanier() {
    const toast = document.getElementById('panierToast');
    toast.classList.toggle('visible');

    if (toast.classList.contains('visible')) {
        afficherPanier(); // lit le localStorage et met à jour la liste
    }
}

// --- GESTION DU PANIER ---

function chargerPanier() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Map(JSON.parse(data)) : new Map();
}

function sauvegarderPanier(panier) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(panier.entries())));
}

function ajouterProduit(id, nom, prix, quantite = 1) {
    const panier = chargerPanier();
    if (panier.has(id)) {
        let prod = panier.get(id);
        prod.quantite += quantite;
        panier.set(id, prod);
    } else {
        panier.set(id, { nom, prix, quantite });
    }
    sauvegarderPanier(panier);
    majCompteurPanier();
}

function supprimerProduit(id) {
    const panier = chargerPanier();
    panier.delete(id);
    sauvegarderPanier(panier);
    majCompteurPanier();
    afficherPanier();
}

function majQuantite(id, nouvelleQuantite) {
    const panier = chargerPanier();
    if (panier.has(id)) {
        let prod = panier.get(id);
        prod.quantite = nouvelleQuantite;
        panier.set(id, prod);
        sauvegarderPanier(panier);
    }
    majCompteurPanier();
    afficherPanier();
}

function viderPanier() {
    localStorage.removeItem(STORAGE_KEY);
    majCompteurPanier();
    afficherPanier();
}

// --- AFFICHAGE ---

function afficherPanier() {
    const liste = document.getElementById('listePanier');
    liste.innerHTML = '';

    const panier = chargerPanier();
    panier.forEach((prod, id) => {
        const li = document.createElement('li');
        li.textContent = `${prod.nom} - ${prod.prix}€ x ${prod.quantite}`;

        // Bouton suppression
        const btn = document.createElement('button');
        const img = document.createElement('img');
        img.src = '/.images/corbeille.png';
        img.alt = 'Supprimer';
        btn.appendChild(img);
        btn.addEventListener('click', () => supprimerProduit(id));

        li.appendChild(btn);
        liste.appendChild(li);
    });
}

function majCompteurPanier() {
    const compteur = document.getElementById('btnPanier');
    const panier = chargerPanier();
    let totalQuantite = 0;
    panier.forEach(prod => totalQuantite += prod.quantite);
    compteur.firstChild.textContent = totalQuantite; // modifie le texte avant l'image
}

// --- INIT ---

document.addEventListener('DOMContentLoaded', () => {
    // Attacher les écouteurs aux boutons "Ajouter au panier"
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const nom = btn.dataset.nom;
            const prix = parseFloat(btn.dataset.prix);
            ajouterProduit(id, nom, prix, 1);
        });
    });

    // Initialiser l'affichage
    majCompteurPanier();
    afficherPanier();
});

function validerCommande() {
    const panier = document.getElementById('listePanier');

    fetch('./utils/send_mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panier })
    })
    .then(r => r.text())
    .then(t => console.log(t));

    alert("Votre commande a été envoyé ! \nNous vous recontacterons lorsque la commande sera prête");
    viderPanier();
}