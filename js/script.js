

function save() {
    // Get values from input fields
    const title = document.querySelector('#nomChaine').value.trim();
    const details = document.querySelector('#details').value.trim();
    const lienimage = document.querySelector('#lienimage').value.trim();
    const lienvideo = document.querySelector('#lienvideo').value.trim();
    const typeChaine = document.querySelector('#typeChaine').value.trim();
 
        const dataToSave = {};

    // Check and add non-empty fields to the data object
    
    if (title !== '') dataToSave.Titre = title;
    if (details !== '') dataToSave.Message = details;
    if (lienvideo !== '') dataToSave.Video = lienvideo;
    if (lienimage !== '') dataToSave.image = lienimage;
    if (typeChaine !== '') dataToSave.Type = typeChaine;

    // Check if there are any non-empty fields to save
    if (Object.keys(dataToSave).length === 0) {
        // Display alert to user
        document.querySelector('.alert').style.display = 'block';
        document.querySelector('.btnconnection').style.display = 'none';
        document.querySelector('.message').innerHTML = 'Please fill in at least one field before saving.';
        return; // Stop the save operation
    }

    dataToSave.Username = name;
    // Add send date and time
    dataToSave.SendDateTime = new Date().toISOString();

    // Save data to Firebase (example: using console.log instead of Firebase)
    console.log('Data to save:', dataToSave);
    // Replace with actual Firebase database code
     database.ref('INDIAMET/Indi/' + title).set(dataToSave);

    // Optionally, clear input fields after saving
    document.querySelector('#nomChaine').value = '';
    document.getElementById('details').value = '';
    document.getElementById('description').value = '';
    document.getElementById('lienchaine').value = '';
    document.getElementById('typeChaine').value = '';


    
}




function mwhatsapp() {
    var h1 = document.querySelector('.h1').textContent;
    var desc = document.querySelector('.desc').innerHTML;
    var web ='www.unitechconseil.online/chaine';

    // Construire le message WhatsApp avec le titre, les détails, le lien et l'URL actuelle
    var message = `*${h1}*\n\n${desc}\n\nSuivez le lien : ${web}\n\n_Partager ce message a vos amis_`;

    // Ouvrir une nouvelle fenêtre WhatsApp avec le message formaté
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
}




function mfacebook(postId) {
    var h1 = document.querySelector('.h1').textContent;
    var desc = document.querySelector('.desc').innerHTML;
    var web ='www.unitechconseil.online/chaine';

    // Construire le message WhatsApp avec le titre, les détails, le lien et l'URL actuelle
    var message = `*${h1}*\n\n${desc}\n\nSuivez le lien : ${web}\n\n_Partager ce message a vos amis_`;
     // Ouvrir le dialogue de partage Facebook (redirigé vers l'interface web)
     window.open(`https://m.facebook.com/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`, '_blank');
}


function mtwitter(postId) {
    var h1 = document.querySelector('.h1').textContent;
    var desc = document.querySelector('.desc').innerHTML;
    var web ='www.unitechconseil.online/chaine';

    // Construire le message WhatsApp avec le titre, les détails, le lien et l'URL actuelle
    var message = `*${h1}*\n\n${desc}\n\nSuivez le lien : ${web}\n\n_Partager ce message a vos amis_`;
    // Ouvrir le dialogue de partage Twitter
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`, '_blank');
}


document.addEventListener('DOMContentLoaded', function () {
    var menu = document.getElementById('customDialog');

    const content = `
                <div class="dialog-content">
                    <span class="close-button" onclick="closeDialog()">&times;</span>
                    <h2 class="alertTitle">Unitech Conseil</h2>
                    <p class="alertp">Vous etes un ami de Unitech conseil</p>
                    <button onclick="openform()" class="btnconnection">Connectez-vous</button>
                </div>
    `;
    menu.innerHTML = content;
 
});
