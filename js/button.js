//--------------Toggle menu open and close--------------//
function toggleMenu() {
    var menu = document.querySelector('.menu');
    var openIcon = document.querySelector('.fa-bars');
    var closeIcon = document.querySelector('.fa-close');

    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        setTimeout(function(){
            menu.style.display = 'none';
        }, 600); // Délai pour masquer le menu après l'animation de fondu (0.6s * 1000)
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    } else {
        menu.style.display = 'block';
        setTimeout(function(){
            menu.classList.add('open');
        }, 100); // Délai pour activer la classe 'open' après l'affichage du menu
        openIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    }
}
//-------------fin-------------------------------//


function openform(){
    document.querySelector('.formulaire').style.display='block';
    document.querySelector('.formulairechaine').style.display='none';
    document.querySelector('.alert').style.display='none';
}

function showconnection(){
     document.querySelector('.formulaire').style.display='block'
     document.querySelector('.alert').style.display='none';
}

function showlogin(){
    document.getElementById('login').style.display='block';
    document.getElementById('signup').style.display='none';
}

function showsignup(){
    document.getElementById('login').style.display='none';
    document.getElementById('signup').style.display='block';
}

function closeDialog(){
    document.querySelector('.alert').style.display='none';
    //document.querySelector('.formulaire').style.display='none';
}

// Fonction pour afficher le profil de l'utilisateur
function profile() {
    var userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        window.location.href = "/profile.html";
    } else {
        document.querySelector('.formulaire').style.display='block';
    }
}

// Fonction de déconnexion
function logout() {
    // Effacer les données utilisateur du stockage local
    localStorage.removeItem('userData');

    // Recharger la page après la déconnexion
    console.log("Logging out...");
    window.location.reload();
}
