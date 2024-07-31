     // Reference to the "posts" node




  // Reference to the "posts" node
  var postsRef = database.ref('WHATSAPP');

  // Listen for changes in the data
  postsRef.on('value', function(snapshot) {
      // Clear existing posts and filter bar
      document.getElementById('chaine').innerHTML = '';
      document.getElementById('filter-bar').innerHTML = '';
  
      // Initialize an object to store posts by type
      var postsByType = {};
  
      // Loop through each post in the snapshot
      snapshot.forEach(function(childSnapshot) {
          var post = childSnapshot.val();
          var postId = childSnapshot.key;
          
          // Check if the post has a type
          if (post.Type) {
              // Group posts by type
              if (!postsByType[post.Type]) {
                  postsByType[post.Type] = [];
              }
              postsByType[post.Type].push({ postId: postId, post: post });
          }
      });
  
      // Sort posts by type
      var sortedTypes = Object.keys(postsByType).sort();
      
      // Create filter button for "All"
      var allButton = document.createElement('button');
      allButton.textContent = 'All';
      allButton.addEventListener('click', function() {
          displayAllPosts();
      });
      document.getElementById('filter-bar').appendChild(allButton);
  
      sortedTypes.forEach(function(type) {
          // Create filter button for each type
          var filterButton = document.createElement('button');
          filterButton.textContent = type;
          filterButton.addEventListener('click', function() {
              filterPostsByType(type);
          });
          document.getElementById('filter-bar').appendChild(filterButton);
      });
  
      // Display all posts by default
      displayAllPosts();
  
      // Function to filter posts by type
      function filterPostsByType(type) {
          var postsOfType = postsByType[type];
          displayPosts(postsOfType);
      }
  
      // Function to display all posts
      function displayAllPosts() {
          var allPosts = [];
          sortedTypes.forEach(function(type) {
              allPosts = allPosts.concat(postsByType[type]);
          });
          displayPosts(allPosts);
      }
  
      // Function to display posts
      function displayPosts(posts) {
          document.getElementById('chaine').innerHTML = ''; // Clear existing posts
  
          // Loop through posts and display them
          posts.forEach(function(postObj) {
              var post = postObj.post;
              var postId = postObj.postId;
              
              // Create HTML elements for each post
              var postDiv = document.createElement('div');
              postDiv.className = 'card';
              postDiv.setAttribute('data-type', post.Type);
  
              // Convert post SendDateTime to a readable format
              var postDate = new Date(post.SendDateTime);
              var timeAgo = getTimeAgo(postDate);
  
              postDiv.innerHTML = `
              <div id="${postId}" class="filterDiv_${post.TypeChaine} postId">
                  <div class="cardItem">
                      <div class="textItem">
                          <div class="img">
                              <img src="${post.Image || post.LinkImage || '/images/icon.png'}" alt="">
                              <h3 class="Title" id="title_${postId}">${post.NomChaine || ''}</h3>
                          </div> 
                          <hr>
                          <h4 class="details">${post.Details || ''}</h4>
                          <p class="desc" id="des_${postId}">${post.Description || ''}</p>
                          <p class="time"><i class="fa fa-time"></i> ${postDate.toLocaleTimeString()} (${timeAgo} ago)</p>
                          <div class="btncard">
                              <button><i class="fa fa-whatsapp"></i><a id="lienchaine_${postId}" href="${post.LienChaine || ''}">Suivre</a></button>
                          </div>
                          <div class="btnpartage" >
                              <div class="barcomment">
                                  
                                  <button onclick="toggleComments('${postId}')">                                  <i class="fa fa-comment"></i>
                                  </button>
                                  <span class="count" id="comment-count-${postId}">
                                      ${post.Zcomments ? formatNumber(Object.keys(post.Zcomments).length) : '0'}
                                  </span>
                              </div>
                              <div class="barlike">
                                  <button onclick="likePost('${postId}')"><i class="fa fa-thumbs-up"></i></button>
                                  <span id="likecount_${postId}">${formatNumber(post.likes || 0)}</span>
                              </div>

                              <div class="bardislike">
                                  <button onclick="dislikePost('${postId}')"><i class="fa fa-thumbs-down"></i></button>
                                  <span id="dislikecount_${postId}">
                                    ${post.Dislikes ? formatNumber(Object.keys(post.Dislikes).length) : '0'}
                                  </span>

                              </div>

                              <div class="btnpartage">
                                    <span onclick="whatsapp('${postId}')"><i class="fa fa-whatsapp"></i></span>
                                    <span onclick="facebook('${postId}')"><i class="fa fa-facebook"></i></span>
                                    <span onclick="twitter('${postId}')"><i class="fa fa-twitter"></i></span>
                                    <span class="lireLaSuite" style="display: none;"><i>Lire la suite...</i></span>
                                </div>
                              
                              <span style="display: none;" class="more lireLaSuite" onclick="btncl('${encodeURIComponent(post.Title || '')}')"><i>Lire la suite</i></span>
                          </div>
                          <div id="comments-${postId}" style="display: none;">
                              <h3>Commentaires</h3>
                              <div id="comments-list-${postId}" class="comments-list"></div> <!-- Container for comments -->
                              <form id="comment-form-${postId}" class="comment-form" onsubmit="return addComment(event, '${postId}')">
                                  <input type="text" id="comment-input-${postId}" placeholder="Ajouter un commentaire..." required>
                                  <button type="submit"><i class="fa fa-send"></i></button>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          `;
              
              // Append the post to the 'chaine' div
              document.getElementById('chaine').appendChild(postDiv);

        // Load comments for each post
        loadComments(postId);
          });
      }
  });



  function whatsapp(postId) {
    var title = document.getElementById(`title_${postId}`).innerHTML;
    var details = document.getElementById(`des_${postId}`).innerHTML;
    var lien = document.getElementById(`lienchaine_${postId}`).getAttribute('href'); // Récupérer l'attribut href du lien
    var web ='www.unitechconseil.online/chaine';
    // Construire le message WhatsApp avec le titre, les détails, le lien et l'URL actuelle
    var message = `*${title}*\n\n${details}\n\nSuivez le lien : ${lien}\n\n_Trouvez d'autres chaînes ou groupes_\n${web}`;

    // Ouvrir une nouvelle fenêtre WhatsApp avec le message formaté
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
}




function facebook(postId) {
    var title = document.getElementById(`title_${postId}`).innerHTML;
    var details = document.getElementById(`des_${postId}`).innerHTML;
    var lien = document.getElementById(`lienchaine_${postId}`).getAttribute('href'); // Récupérer l'attribut href du lien
    var web ='www.unitechconseil.online/chaine';
    // Construire le message WhatsApp avec le titre, les détails, le lien et l'URL actuelle
    var message = `${title}\n\n${details}\n\nSuivez le lien : ${lien}\n\nTrouvez d'autres chaînes ou groupes\n${web}`;

     // Ouvrir le dialogue de partage Facebook (redirigé vers l'interface web)
     window.open(`https://m.facebook.com/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`, '_blank');
}


function twitter(postId) {
    var title = document.getElementById(`title_${postId}`).innerHTML;
    var details = document.getElementById(`des_${postId}`).innerHTML;
    var lien = document.getElementById(`lienchaine_${postId}`).getAttribute('href'); // Récupérer l'attribut href du lien
    var web ='www.unitechconseil.online/chaine';
    // Construire le message WhatsApp avec le titre, les détails, le lien et l'URL actuelle
    var message = `${title}\n\n${details}\n\nSuivez le lien : ${lien}\n\nTrouvez d'autres chaînes ou groupes\n${web}`;

    // Ouvrir le dialogue de partage Twitter
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`, '_blank');
}



  
  // Function to handle liking a post
  function likePost(postId) {
    var userData = JSON.parse(localStorage.getItem('userData'));
    var name = document.getElementById('name').innerHTML;
    if (userData){
        var postRef = database.ref(`WHATSAPP/${postId}/Zlikes/` +name);
        postRef.set({
            Username: name,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    }else{
        document.querySelector('.alert').style.display = 'block';
        document.querySelector('.btnconnection').style.display = 'block';
        document.querySelector('.message').innerHTML = 'connectez-vous';
    }
  }
  
  // Function to handle disliking a post
  function dislikePost(postId) {
    var userData = JSON.parse(localStorage.getItem('userData'));
    var name = document.getElementById('name').innerHTML;
    if (userData){
        var postRef = database.ref(`WHATSAPP/${postId}/Dislikes/` +name);
        postRef.set({
            Username: name,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    }else{
        document.querySelector('.alert').style.display = 'block';
        document.querySelector('.btnconnection').style.display = 'block';
        document.querySelector('.message').innerHTML = 'connectez-vous ';
    }
  }


// Function to load comments for a post
function loadComments(postId) {
    var commentsRef = database.ref(`WHATSAPP/${postId}/Zcomments`);
    commentsRef.on('value', function(snapshot) {
        var commentsList = document.getElementById(`comments-list-${postId}`);
        commentsList.innerHTML = ''; // Clear existing comments

        snapshot.forEach(function(childSnapshot) {
            var commentData = childSnapshot.val();
            var commentusername = commentData.Username;
            var commentText = commentData.comment;
            var commentTime = commentData.timestamp;

            var commentElement = document.createElement('div');
            commentElement.classList.add('comment');

            var commentuser = document.createElement('h2');
            commentuser.textContent = commentusername;

            var commentTextElement = document.createElement('p');
            commentTextElement.textContent = commentText;

            var commentTimeElement = document.createElement('span');
            commentTimeElement.textContent = formatCommentTime(commentTime);

            commentElement.appendChild(commentuser);
            commentElement.appendChild(commentTextElement);
            commentElement.appendChild(commentTimeElement);
           

            commentsList.appendChild(commentElement);
        });

        // Update comment count
        var commentCountElement = document.getElementById(`comment-count-${postId}`);
        commentCountElement.textContent = formatNumber(snapshot.numChildren());
    });
}

// Function to format comment timestamp
function formatCommentTime(timestamp) {
    var commentDate = new Date(timestamp);
    return commentDate.toLocaleString(); // Adjust format as needed
}

// Function to toggle comments visibility
function toggleComments(postId) {
    var commentsDiv = document.getElementById(`comments-${postId}`);
    commentsDiv.style.display = commentsDiv.style.display === 'none' ? 'block' : 'none';
}



// Function to add a comment
function addComment(event, postId) {
    event.preventDefault();
    var userData = JSON.parse(localStorage.getItem('userData'));
    var name = document.getElementById('name').innerHTML;
    console.log(name);
    if(userData){
        var commentInput = document.getElementById(`comment-input-${postId}`);
        var commentText = commentInput.value.trim();
        if (commentText !== '') {
            var postRef = database.ref(`WHATSAPP/${postId}/Zcomments`);
            postRef.push({
                Username: name,
                comment: commentText,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            commentInput.value = '';
        }
        return false;
    }else{
        document.querySelector('.alert').style.display = 'block';
        document.querySelector('.btnconnection').style.display = 'block';
        document.querySelector('.message').innerHTML = 'connectez-vous pour laisser un commentaire';
    }

}
  
  // Function to format numbers with commas
  function formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Function to calculate time ago from a given date
  function getTimeAgo(postDate) {
      var now = new Date();
      var timeDifference = now - postDate;
      var hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      var timeAgo;
      if (hoursDifference >= 24) {
          var daysDifference = Math.floor(hoursDifference / 24);
          timeAgo = `${daysDifference} days`;
      } else {
          timeAgo = `${hoursDifference} hours`;
      }
      return timeAgo;
  }
  
  


     function btncl(encodedTitle) {
        // Décoder le titre encodé
        const decodedTitle = decodeURIComponent(encodedTitle);
    
        // Remplacer les espaces par des underscores dans le titre
        const titleWithUnderscores = decodedTitle.replace(/ /g, "_");
    
        // Utiliser le titre mis à jour selon vos besoins
        console.log(titleWithUnderscores);
    
        // Rediriger vers la nouvelle URL avec le titre mis à jour
        window.location.href = `/s/anglais.html?l=${encodeURIComponent(titleWithUnderscores)}`;

    }

  document.getElementById('toggleSearchBtn').addEventListener('click', function () {
    var searchContainer = document.getElementById('searchContainer');
    var buttons = document.querySelectorAll('.btn');

    if (searchContainer.style.display === 'none' || searchContainer.style.display === '') {
        searchContainer.style.display = 'block';
        buttons.forEach(function (button) {
            button.style.display = 'none';
        });
    } else {
        searchContainer.style.display = 'none';
        buttons.forEach(function (button) {
            button.style.display = 'block';
        });
    }
});


  
  function formatNumber(number) {
    if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'k';
    } else if (number >= 100) {
        return (number / 100).toFixed(1) + 'c';
    } else {
        return number.toString();
    }
}


  function filterSelection(category) {
    var posts = document.getElementsByClassName('post');
    var searchInput = document.getElementById('searchInput').value.toLowerCase();

    // Loop through posts and show/hide based on category and search input
    for (var i = 0; i < posts.length; i++) {
        var postCategory = posts[i].getAttribute('data-type');
        var sousTitle = posts[i].getElementsByTagName('h1')[0].innerText.toLowerCase();

        // Check if the post matches the category and search input
        if ((category === 'all' || postCategory === category) &&
            (sousTitle.includes(searchInput))) {
            posts[i].style.display = 'block';
        } else {
            posts[i].style.display = 'none';
        }
    }
}

// Call filterSelection when a filter button is clicked
document.getElementById('filtrecategorie').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        // Remove 'active' class from all buttons
        var buttons = document.getElementsByClassName('btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }

        // Add 'active' class to the clicked button
        event.target.classList.add('active');

        // Call filterSelection with the category of the clicked button
        filterSelection(event.target.getAttribute('data-filter'));
    }
});

// Add event listener for the search input
document.getElementById('searchInput').addEventListener('input', function () {
    // Call filterSelection with the current category and updated search input
    filterSelection(document.querySelector('.btn.active').getAttribute('data-filter'));
});



function add() {
    document.querySelector('.formulairechaine').style.display = 'block';
}

function fermer() {
    document.querySelector('.formulairechaine').style.display = 'none';
    document.querySelector('.formulaire').style.display = 'none';
}
function closealert() {
    document.querySelector('.alert').style.display = 'none';
}

function save() {
    // Get values from input fields
    const title = document.querySelector('#nomChaine').value.trim();
    const details = document.querySelector('#details').value.trim();
    const description = document.querySelector('#description').value.trim();
    const lienchaine = document.querySelector('#lienchaine').value.trim();
    const typeChaine = document.querySelector('#typeChaine').value.trim();
    var userData = JSON.parse(localStorage.getItem('userData'));
    // Create an object to store non-empty fields
    var name = document.getElementById('name').innerHTML;
    if(userData){
        const dataToSave = {};

    // Check and add non-empty fields to the data object
    
    if (title !== '') dataToSave.NomChaine = title;
    if (details !== '') dataToSave.Details = details;
    if (description !== '') dataToSave.Description = description;
    if (lienchaine !== '') dataToSave.LienChaine = lienchaine;
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
     database.ref('WHATSAPP/' + title).set(dataToSave);

    // Optionally, clear input fields after saving
    document.querySelector('#nomChaine').value = '';
    document.getElementById('details').value = '';
    document.getElementById('description').value = '';
    document.getElementById('lienchaine').value = '';
    document.getElementById('typeChaine').value = '';

    // Optionally, provide feedback to the user
    document.querySelector('.alert').style.display = 'block';
        document.querySelector('.btnconnection').style.display = 'none';
        document.querySelector('.message').innerHTML = 'Data saved successfully!';
    }else{
        alert('connectez-vous');
        document.querySelector('.alert').style.display = 'block';
        document.querySelector('.btnconnection').style.display = 'block';
        document.querySelector('.alertp').innerHTML = 'connectez-vous';
    }
    
}


