// Define the saveUserDataLocally function
function saveUserDataLocally(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  // Variables
var dialog = document.querySelector('#customDialog');
var load = document.querySelector(".load");
var alertTitle = document.querySelector(".alertTitle");
var alertp = document.querySelector(".alertp");
var dialogo = document.getElementById('customDialog');

function displayUserDetails(userData) {
    var image = document.getElementById('image');
    var name = document.getElementById('name');
    var nameuser = document.getElementById('username');
    var phone = document.getElementById('phone');
    var email = document.getElementById('email');
    var rcElement = document.getElementById('rc'); // Renommé pour plus de clarté

    // Format rc pour afficher en K ou M
    var rcFormatted = formatPoints(userData.Points);

    // Vérifier si une image est disponible, sinon utiliser une image par défaut
    if(userData.Image) {
        image.src = userData.Image;
    } else {
        // Image par défaut
        image.src = '/images/icon.png';
    }

    // Affichage des détails de l'utilisateur
    name.textContent = `${userData.Name}`;
    nameuser.textContent = `${userData.Username}`;
    phone.textContent = `${userData.Phone}`;
    email.textContent = `${userData.Email}`;
    rcElement.textContent = rcFormatted;
}

function formatPoints(points) {
    if (points >= 1000000) {
        // Si les points sont supérieurs ou égaux à 1 million, affiche "xM" (1 million)
        return (points / 1000000).toFixed(1) + 'M';
    } else if (points >= 1000) {
        // Si les points sont supérieurs ou égaux à 1000, affiche "xK" (1 millier)
        return (points / 1000).toFixed(1) + 'K';
    } else {
        // Sinon, affiche simplement le nombre de points
        return points.toString();
    }
}


// Événement au chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les données utilisateur depuis le stockage local
    var userData = JSON.parse(localStorage.getItem('userData'));
    
    function fetchUserDataFromFirebase(email) {
        var usersRef = firebase.database().ref("users");

        usersRef.orderByChild('Email').equalTo(email).once('value')
            .then(function (snapshot) {
                if (snapshot.exists()) {
                    var userDataSnapshot = snapshot.val();
                    var userId = Object.keys(userDataSnapshot)[0];

                    if (userId) {
                        // Mise à jour des données utilisateur dans le stockage local
                        var updatedUserData = userDataSnapshot[userId];
                        localStorage.setItem('userData', JSON.stringify(updatedUserData));

                        // Affichage des détails de l'utilisateur sur la page de profil
                        displayUserDetails(updatedUserData);
                        //document.getElementById('connecte').style.display='block';
                       // document.getElementById('logout').style.display='none';
                        
                    } else {
                        console.log('User ID not found.');
                        document.getElementById('creatacount').style.color='gray';
                    }
                } else {
                    console.log("No user found with email:", email);
                }
            })
            .catch(function (error) {
                console.error('Error fetching user data from Firebase:', error);
            });
    }

    // Vérifier si l'utilisateur est connecté
    var isLoggedIn = userData !== null && userData !== undefined;
    
    if (isLoggedIn) {
        var email = userData.Email;
        fetchUserDataFromFirebase(email);
        
        //document.getElementById('creatacount').style.color='orangered';
    } else {
        // Utilisateur non connecté, afficher un message ou rediriger vers la page de connexion
        console.log("User is not logged in. Show a message or redirect to login page.");
        //document.querySelector('.showconnection').style.display='block';
    }
});


/*------------------ formulaire inscription -------------------------*/
