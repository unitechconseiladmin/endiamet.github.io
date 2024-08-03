
/*------------------ formulaire inscription -------------------------*/

let currentSection = 0;
let sections;

function nextSection() {
    sections[currentSection].classList.remove('active');
    currentSection = (currentSection + 1) % sections.length;
    sections[currentSection].classList.add('active');
}

function prevSection() {
    if (sections && sections.length > 0) {
        sections[currentSection].classList.remove('active');
        currentSection = (currentSection - 1 + sections.length) % sections.length;
        sections[currentSection].classList.add('active');
    } else {
        console.error('No sections found or sections not properly initialized.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('.formulaire');
    const contentForm = `
    <div class="form">
        <div class="btninscription">
            <button id="showlogin" onclick="showlogin()">Connectez-vous</button>
            <button id="showsignup" onclick="showsignup()">Inscrivez-vous</button>
        </div>
        <div id="login">
            <h1 id="displayuser">Connectez</h1>
            <div class="loginsection">
            <div class="input"><input type="text" id="login-phone" placeholder="Utilisateur / Email" required/></div>
        <div class="input"><input type="password" id="login-password" placeholder="mot de passe" required/></div>
        <button onclick="login()">Je me connecte</button>
            </div>
        </div>
        <div id="signup">
        <h1>Inscivez-vous</h1>
        <p id="result">Votre code</p>
            <section class="form-section active">
                <div class="input"><input type="text" id="names" placeholder="Votre nom complet" required/></div>
                <div class="input"><input type="email" id="emails" placeholder="Entrez votre mail" required/></div>
                <div class="input"><input type="text" id="utilisateur" placeholder="Nom utilisateur" required/></div>
                <div class="logbtn">
                <button type="button" class="first" onclick="nextSection()">Suivant</button>
                </div>
            </section>
            <section class="form-section">
                <div class="input select">
                    <select id="country" onchange="updateFlag()">
                        <option value="">Selectionnez votre pays</option>
                        <option value="ht" title="+509">Haiti</option>
                        <option value="us" title="+1">United States</option>
                        <option value="do" title="+1">Republique dominicaine</option>
                        <option value="ca" title="+1">Canada</option>
                        <option value="fr" title="+33">France</option>
                        <option value="uk" title="+44">United Kingdom</option>
                        <!-- Add more countries as needed -->
                        <option value="bf" title="+226">Burkina Faso</option>
                        <option value="bi" title="+257">Burundi</option>
                        <option value="cm" title="+237">Cameroon</option>
                        <option value="cf" title="+236">Central African Republic</option>
                        <option value="dz" title="+213">Algeria</option>
                        <option value="ao" title="+244">Angola</option>
                        <option value="bj" title="+229">Benin</option>
                        <option value="bw" title="+267">Botswana</option>
                        <option value="cv" title="+238">Cape Verde</option>
                        <option value="cf" title="+236">Central African Republic</option>
                        <option value="td" title="+235">Chad</option>
                        <option value="km" title="+269">Comoros</option>
                        <option value="cg" title="+242">Congo</option>
                        <option value="dj" title="+253">Djibouti</option>
                        <option value="eg" title="+20">Egypt</option>
                        <option value="gq" title="+240">Equatorial Guinea</option>
                        <option value="er" title="+291">Eritrea</option>
                        <option value="et" title="+251">Ethiopia</option>
                    </select>
                    <span id="selected-flag" class="flag flag-icon"></span>
                </div>
                <div class="input phone">
                    <p id="p"></p>
                    <input type="text" id="phones" placeholder="Votre Numéro" required/>
                </div>
                <div class="logbtn">
                    <button type="button" onclick="prevSection()">Précédent</button>
                    <button type="button" onclick="nextSection()">Suivant</button>
                </div>
            </section>
            <section class="form-section">
                <div class="input"><input type="password" id="passwords" placeholder="Votre mot de passe" required/></div>
                <div class="input"> <input type="text" id="codePromo" placeholder="Code Promo" required/></div>
                <input type="number" id="pointss" value="0" style="display: none;" disabled />
                <p id="showimg"></p>
                <div class="logbtn">
                    <button type="button" onclick="prevSection()">Précédent</button>
                    <button onclick="signup()" id="signupBtn">Je m'inscris</button>
                </div>            
            </section>
            <div id="user-data-container" style="display: none;">
                <h2>Signed Up User Data</h2>
                <p>Email: <span id="user-email"></span></p>
                <p>Username: <span id="user-username"></span></p>
                <p>Points: <span id="user-points"></span></p>
            </div>
        </div>
    </div>
    `;
    form.innerHTML = contentForm;

    form.innerHTML = contentForm;
    sections = document.querySelectorAll('.form-section');
    if (sections.length > 0) {
        sections[0].classList.add('active');
    } else {
        console.error('No form sections found.');
    }
});
/*------------------Fin formulaire inscription -------------------------*/



/*-----------------------------login--------------*/


/*-----------------------------login--------------*/



// Define the saveUserDataLocally function
function saveUserDataLocally(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  // Fonction de connexion mise à jour
  function login() {
      var emailOrUsername = document.getElementById('login-phone').value; // Email ou nom d'utilisateur
      var password = document.getElementById('login-password').value;
      var dialog = document.querySelector(".alert");
      var load = document.querySelector(".load");
      var alertTitle = document.querySelector(".alertTitle");
      var alertp = document.querySelector(".alertp");
  
      // Vérifiez si email/nom d'utilisateur et mot de passe sont fournis
      if (emailOrUsername && password) {
          var queryByEmail = database.ref('users').orderByChild('Email').equalTo(emailOrUsername);
          var queryByUsername = database.ref('users').orderByChild('Username').equalTo(emailOrUsername);
  
          // Rechercher d'abord par email
          queryByEmail.once('value')
              .then((snapshot) => {
                  if (snapshot.exists()) {
                      handleLogin(snapshot);
                  } else {
                      // Si pas trouvé par email, essayer avec le nom d'utilisateur
                      return queryByUsername.once('value');
                  }
              })
              .then((snapshot) => {
                  if (snapshot && snapshot.exists()) {
                      handleLogin(snapshot);
                  } else {
                      // Aucun utilisateur trouvé
                      console.error('User not found');
                      dialog.style.display = 'block';
                      alertTitle.textContent = 'Unitech Conseil';
                      alertp.textContent = 'Cet utilisateur n\'existe pas. Cliquez sur le bouton rouge pour vous inscrire.';
                  }
              })
              .catch((error) => {
                  console.error('Error fetching user data:', error);
              });
      } else {
          // Email/nom d'utilisateur et mot de passe requis
          console.error('Email/Username and password are required for login');
          dialog.style.display = 'block';
          alertTitle.textContent = 'Unitech Conseil';
          alertp.textContent = 'L\'adresse e-mail/nom d\'utilisateur et le mot de passe sont requis pour se connecter.';
      }
  }
  
  function handleLogin(snapshot) {
      var userData = null;
      snapshot.forEach((userSnapshot) => {
          userData = userSnapshot.val();
      });
  
      // Comparer les mots de passe
      if (userData.Password.toString() === document.getElementById('login-password').value) {
          // Mot de passe correct
          console.log('Login successful');
          var dialog = document.querySelector(".alert");
          var alertTitle = document.querySelector(".alertTitle");
          var alertp = document.querySelector(".alertp");
          dialog.style.display = 'block';
          alertTitle.textContent = 'Bienvenue ' + userData.Name;
          alertp.textContent = 'Merci!!';
          window.location.reload();
          // Sauvegarder les données utilisateur dans le stockage local
          saveUserDataLocally(userData);
      } else {
          // Mot de passe incorrect
          console.error('Incorrect password');
          var dialog = document.querySelector(".alert");
          var alertTitle = document.querySelector(".alertTitle");
          var alertp = document.querySelector(".alertp");
          dialog.style.display = 'block';
          alertTitle.textContent = 'Unitech Conseil';
          alertp.textContent = 'Mot de passe incorrect.';
      }
  }
  
    
    
    
  
  
  function signup() {
    // Retrieve values from the form
    var name = document.getElementById('names').value.trim();
    var username = document.getElementById('utilisateur').value.trim();
    var email = document.getElementById('emails').value.trim();
    var phone = document.getElementById('phones').value.trim();
    var password = document.getElementById('passwords').value.trim();
    var codePromo = document.getElementById('codePromo').value.trim();
    var p = document.getElementById('p').innerText;

    // Validate required fields
    if (!name || !username || !email || !phone || !password || !codePromo) {
        alert('Tous les champs doivent être remplis.');
        return;
    }

    // Generate a random number and alphanumeric string
    var randomNumber = Math.floor(Math.random() * 10000) + 10;
    var characters = 'abcdefghijklmnopqrstuvwxyz';
    var randomAlpha = '';
    for (var i = 0; i < 3; i++) {
        randomAlpha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    var result = 'uc-' + randomAlpha + randomNumber;
    document.getElementById('result').textContent = result;

    // Variables
    var dialog = document.querySelector(".alert");
    var alertTitle = document.querySelector(".alertTitle");
    var alertp = document.querySelector(".alertp");

    // Check if email exists
    firebase.database().ref('users').orderByChild('Email').equalTo(email).once('value')
        .then(function(emailSnapshot) {
            if (emailSnapshot.exists()) {
                dialog.style.display = 'block';
                alertTitle.textContent = 'Email existe déjà';
                alertp.textContent = 'Essayez un autre';
                return;
            }

            // Check if name exists
            firebase.database().ref('users').orderByChild('Name').equalTo(name).once('value')
                .then(function(nameSnapshot) {
                    if (nameSnapshot.exists()) {
                        dialog.style.display = 'block';
                        alertTitle.textContent = 'Nom existe déjà';
                        alertp.textContent = 'Essayez un autre';
                        return;
                    }

                    // Check promo code
                    firebase.database().ref('users').orderByChild('CodeReference').equalTo(codePromo).once('value')
                        .then(function(snapshot) {
                            if (snapshot.exists()) {
                                snapshot.forEach(function(childSnapshot) {
                                    var referredUserId = childSnapshot.key;
                                    var referredUserPoints = childSnapshot.val().Points || 0;
                                    var referredUserReferrals = childSnapshot.val().NbRef || 0;

                                    // Add 100 points
                                    var updatedPoints = referredUserPoints + 100;
                                    var updatedRef = referredUserReferrals + 1;

                                    // Update referred user's points and referrals
                                    firebase.database().ref('users/' + referredUserId).update({
                                        Points: updatedPoints,
                                        NbRef: updatedRef
                                    });

                                    console.log('Points added to referred user');
                                });
                            } else {
                                console.log('Invalid promo code');
                            }

                            // Save user details
                            firebase.database().ref('users/' + username).set({
                                Email: email,
                                Password: password,
                                Name: name,
                                Username: username,
                                Phone: p + phone,
                                Points: 100,
                                CodePromo: codePromo,
                                CodeReference: result
                            });

                            // Store user information in localStorage
                            localStorage.setItem('userData', JSON.stringify({
                                email: email,
                                username: username,
                                name: name,
                                phone: p + phone,
                                points: 100
                            }));

                            console.log('Signup successful');
                            document.getElementById('login').style.display = 'block';
                            document.getElementById('signup').style.display = 'none';
                            dialog.style.display = 'block';
                            alertTitle.textContent = 'Unitech Conseil';
                            alertp.textContent = 'Connexion réussie.';
                            window.location.reload();
                        })
                        .catch(function(error) {
                            console.error('Error checking promo code:', error);
                        });
                })
                .catch(function(error) {
                    console.error('Error checking name:', error);
                });
        })
        .catch(function(error) {
            console.error('Error checking email:', error);
        });
}


  /*------------------ formulaire inscription -------------------------*/
 
