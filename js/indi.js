
// Reference to the "posts" node
var postsRef = database.ref('INDIAMET/Indi');

// Listen for changes in the data
postsRef.on('value', function(snapshot) {
    // Clear existing posts and filter bar
    document.getElementById('Indi').innerHTML = '';

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

    // Create filter buttons
    var allButton = createFilterButton('All', displayAllPosts);
    document.getElementById('Indi').appendChild(allButton);

    sortedTypes.forEach(function(type) {
        var filterButton = createFilterButton(type, function() {
            filterPostsByType(type);
        });
        document.getElementById('Indi').appendChild(filterButton);
    });

    // Display all posts by default
    displayAllPosts();

    // Function to create a filter button
    function createFilterButton(text, onClick) {
        var button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    // Function to filter posts by type
    function filterPostsByType(type) {
        var postsOfType = postsByType[type] || [];
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
        var chaineElement = document.getElementById('Indi');
        chaineElement.innerHTML = ''; // Clear existing posts

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
                <div id="${postId}" class="filterDiv_${post.Type} postId">
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
                            <div class="btnpartage">
                                <button onclick="toggleComments('${postId}')"><i class="fa fa-comment"></i></button>
                                <span class="count" id="comment-count-${postId}">
                                    ${post.Zcomments ? formatNumber(Object.keys(post.Zcomments).length) : '0'}
                                </span>
                                <button onclick="likePost('${postId}')"><i class="fa fa-thumbs-up"></i></button>
                                <span id="likecount_${postId}">${formatNumber(post.likes || 0)}</span>
                                <button onclick="dislikePost('${postId}')"><i class="fa fa-thumbs-down"></i></button>
                                <span id="dislikecount_${postId}">
                                    ${post.Dislikes ? formatNumber(Object.keys(post.Dislikes).length) : '0'}
                                </span>
                                <span onclick="whatsapp('${postId}')"><i class="fa fa-whatsapp"></i></span>
                                <span onclick="facebook('${postId}')"><i class="fa fa-facebook"></i></span>
                                <span onclick="twitter('${postId}')"><i class="fa fa-twitter"></i></span>
                                <span class="lireLaSuite" style="display: none;"><i>Lire la suite...</i></span>
                                <span style="display: none;" class="more lireLaSuite" onclick="btncl('${encodeURIComponent(post.Title || '')}')"><i>Lire la suite</i></span>
                            </div>
                            <div id="comments-${postId}" style="display: none;">
                                <h3>Commentaires</h3>
                                <div id="comments-list-${postId}" class="comments-list"></div>
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
            chaineElement.appendChild(postDiv);

            // Load comments for each post
            loadComments(postId);
        });
    }
});



  function whatsapp(postId) {
    var title = document.getElementById(`title_${postId}`).innerHTML;
    var details = document.getElementById(`des_${postId}`).innerHTML;
    var lien = document.getElementById(`lienchaine_${postId}`).getAttribute('href'); // RÃ©cupÃ©rer l'attribut href du lien
    var web ='www.unitechconseil.online/chaine';
    // Construire le message WhatsApp avec le titre, les dÃ©tails, le lien et l'URL actuelle
    var message = `*${title}*\n\n${details}\n\nSuivez le lien : ${lien}\n\n_Trouvez d'autres chaÃ®nes ou groupes_\n${web}`;

    // Ouvrir une nouvelle fenÃªtre WhatsApp avec le message formatÃ©
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
}




function facebook(postId) {
    var title = document.getElementById(`title_${postId}`).innerHTML;
    var details = document.getElementById(`des_${postId}`).innerHTML;
    var lien = document.getElementById(`lienchaine_${postId}`).getAttribute('href'); // RÃ©cupÃ©rer l'attribut href du lien
    var web ='www.unitechconseil.online/chaine';
    // Construire le message WhatsApp avec le titre, les dÃ©tails, le lien et l'URL actuelle
    var message = `${title}\n\n${details}\n\nSuivez le lien : ${lien}\n\nTrouvez d'autres chaÃ®nes ou groupes\n${web}`;

     // Ouvrir le dialogue de partage Facebook (redirigÃ© vers l'interface web)
     window.open(`https://m.facebook.com/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`, '_blank');
}


function twitter(postId) {
    var title = document.getElementById(`title_${postId}`).innerHTML;
    var details = document.getElementById(`des_${postId}`).innerHTML;
    var lien = document.getElementById(`lienchaine_${postId}`).getAttribute('href'); // RÃ©cupÃ©rer l'attribut href du lien
    var web ='www.unitechconseil.online/chaine';
    // Construire le message WhatsApp avec le titre, les dÃ©tails, le lien et l'URL actuelle
    var message = `${title}\n\n${details}\n\nSuivez le lien : ${lien}\n\nTrouvez d'autres chaÃ®nes ou groupes\n${web}`;

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
        // DÃ©coder le titre encodÃ©
        const decodedTitle = decodeURIComponent(encodedTitle);
    
        // Remplacer les espaces par des underscores dans le titre
        const titleWithUnderscores = decodedTitle.replace(/ /g, "_");
    
        // Utiliser le titre mis Ã  jour selon vos besoins
        console.log(titleWithUnderscores);
    
        // Rediriger vers la nouvelle URL avec le titre mis Ã  jour
        window.location.href = `/s/anglais.html?l=${encodeURIComponent(titleWithUnderscores)}`;

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
