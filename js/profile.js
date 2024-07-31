document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user data from local storage
    var userData = JSON.parse(localStorage.getItem('userData'));

    function displayUserDetails(userData) {
        var pimage = document.getElementById('profile-img');
        var pname = document.getElementById('pname');
        var pphone = document.getElementById('pphone');
        var pemail = document.getElementById('pemail');
        var pref = document.getElementById('pref');
        var pdes = document.getElementById('description');
        var prcElement = document.getElementById('prc'); // Renamed for clarity
       var rcRC =document.getElementById('rc').innerHTML; // Renamed for clarity
        // Format rc to display two decimal places
        var rcFormatted = parseFloat(userData.Points).toFixed(2);
         var convertPoints = rcFormatted * 0.005;
        console.log(convertPoints); 
        console.log(rcRC);

        // Display user details
        pimage.src = userData.Image;
        pname.textContent = `${userData.Name}`;
        pphone.textContent = `${userData.Phone}`;
        pemail.textContent = `${userData.Email}`;
        pref.textContent = `${userData.CodeReference}`;
        pdes.textContent = `${userData.Description}`;
        prcElement.textContent = rcFormatted;
    }
    

    // Fetch user data from Firebase
    var usersRef = firebase.database().ref("users");
    var email = userData.Email;

    usersRef.orderByChild('Email').equalTo(email).once('value')
        .then(function (snapshot) {
            if (snapshot.exists()) {
                var userDataSnapshot = snapshot.val();
                var userId = Object.keys(userDataSnapshot)[0];

                if (userId) {
                    // Update user data in local storage
                    var updatedUserData = userDataSnapshot[userId];
                    localStorage.setItem('userData', JSON.stringify(updatedUserData));

                    // Display user details on the profile page
                    displayUserDetails(updatedUserData);
                } else {
                    console.log('User ID not found.');
                }
            } else {
                console.log("No user found with email:", email);
            }
        })
        .catch(function (error) {
            console.error('Error fetching user data from Firebase:', error);
        });
});



function editProfile() {
    document.getElementById('profile-info').style.display = 'none';
    document.getElementById('edit-profile').style.display = 'block';

    // Fill input fields with current values
    document.getElementById('new-name').value = document.getElementById('name').innerText;
    document.getElementById('new-email').value = document.getElementById('email').innerText;
    document.getElementById('new-phone').value = document.getElementById('phone').innerText;
    document.getElementById('new-description').value = document.getElementById('description').innerText;
}

function cancelEdit() {
    document.getElementById('profile-info').style.display = 'flex';
    document.getElementById('edit-profile').style.display = 'none';
}

document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Update profile information
    document.getElementById('name').innerText = document.getElementById('new-name').value;
    document.getElementById('email').innerText = document.getElementById('new-email').value;
    document.getElementById('phone').innerText = document.getElementById('new-phone').value;
    document.getElementById('description').innerText = document.getElementById('new-description').value;

    // Hide edit form and display profile information
    document.getElementById('profile-info').style.display = 'flex';
    document.getElementById('edit-profile').style.display = 'none';
});

document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Update profile information in the HTML
    document.getElementById('name').innerText = document.getElementById('new-name').value;
    document.getElementById('email').innerText = document.getElementById('new-email').value;
    document.getElementById('phone').innerText = document.getElementById('new-phone').value;
    document.getElementById('description').innerText = document.getElementById('new-description').value;

    // Get updated profile information
    var newName = document.getElementById('new-name').value;
    var newEmail = document.getElementById('new-email').value;
    var newPhone = document.getElementById('new-phone').value;
    var newDescription = document.getElementById('new-description').value;



    // Update user profile data in Firebase Realtime Database
    firebase.database().ref('users/' + newName).update({
        Name: newName,
        Email: newEmail,
        Phone: newPhone,
        Description: newDescription
    })
    .then(function() {
        console.log("Profile updated successfully");
    })
    .catch(function(error) {
        console.error("Error updating profile: ", error);
    });

    // Hide edit form and display profile information
    document.getElementById('profile-info').style.display = 'flex';
    document.getElementById('edit-profile').style.display = 'none';
});


function sendRc() {
    var userData = JSON.parse(localStorage.getItem('userData'));
    var usersRef = firebase.database().ref("users");
    var email = userData.Email;

    var msgRc = document.getElementById('converRc'); 

    var rcElement = document.getElementById('prc'); // Correction: utilise textContent
    var rcElements = document.getElementById('rc'); // Correction: utilise textContent
    console.log(rcElement.textContent);
    var rc = parseFloat(rcElement.textContent);
    var rcN = parseFloat(rcElements.textContent);

    var recipientEmail = document.getElementById('emailRc').value;
    var rcAmount = parseFloat(document.getElementById('montanRc').value);

    if (rc >= rcAmount && rcN >= rcAmount) {
        var newRc = rc - rcAmount; // Calculate new RC locally
        var newRcN = rcN - rcAmount; // Calculate new RC locally
    
        // Update local data optimistically
        userData.Points = newRc;
       // userData.PointsN = newRcN; // Correction: Update PointsN as well
        localStorage.setItem('userData', JSON.stringify(userData));
        msgRc.textContent = "Envoi en cours..."; // Update message
    
        usersRef.orderByChild('Email').equalTo(email).once('value')
            .then(function (snapshot) {
                if (snapshot.exists()) {
                    var userDataSnapshot = snapshot.val();
                    var userId = Object.keys(userDataSnapshot)[0];
    
                    if (userId) {
                        // Update Firebase
                        return usersRef.child(userId).update({ Points: newRc, PointsN: newRcN })
                            .then(function() {
                                // After Firebase update, update recipient's points
                                return usersRef.orderByChild('Email').equalTo(recipientEmail).once('value')
                                    .then(function (recipientSnapshot) {
                                        if (recipientSnapshot.exists()) {
                                            var recipientUserId = Object.keys(recipientSnapshot.val())[0];
                                            var recipientPoints = recipientSnapshot.val()[recipientUserId].Points || 0;
                                           // var recipientPointsN = recipientSnapshot.val()[recipientUserId].PointsN || 0;
                                            var newRecipientPoints = recipientPoints + rcAmount;
                                           // var newRecipientPointsN = recipientPointsN + rcAmount;
                                            return usersRef.child(recipientUserId).update({
                                                Points: newRecipientPoints,
                                                //PointsN: newRecipientPointsN
                                            });
                                        } else {
                                            throw new Error("Destinataire non trouvé.");
                                        }
                                    });
                            })
                            .then(function() {
                                // After recipient's points update, display success message
                                msgRc.textContent = "RC envoyés avec succès au destinataire!";
                                // Update prcElement with new RC
                                rcElement.textContent = newRc.toFixed(2);
                                rcElements.textContent = newRcN.toFixed(2);
                            })
                            .catch(function (error) {
                                console.error("Erreur lors de la mise à jour des points:", error);
                                msgRc.textContent = "Erreur lors de la mise à jour des points: " + error;
                                // Revert local data on error
                                localStorage.setItem('userData', JSON.stringify(userData));
                            });
                    } else {
                        throw new Error("Identifiant utilisateur non trouvé.");
                    }
                } else {
                    throw new Error("Utilisateur non trouvé avec l'e-mail: " + email);
                }
            })
            .catch(function (error) {
                console.error("Erreur lors de la recherche de l'utilisateur:", error);
                msgRc.textContent = "Erreur lors de la recherche de l'utilisateur: " + error;
            });
    } else {
        console.error("Vous n'avez pas assez de RC pour envoyer cette quantité.");
        msgRc.textContent = "Vous n'avez pas assez de RC pour envoyer cette quantité.";
    }
}

