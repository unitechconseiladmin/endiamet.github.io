    // Reference to the "posts" node
    var postsRef = database.ref('Pubs');
    // Get the title from the URL
//const urlParams = new URLSearchParams(window.location.search);
//const title = urlParams.get('title');

// Decode the title
//const decodedTitle = decodeURIComponent(title);

// Now, you can use the decodedTitle to fetch the details from Firebase or display it on the page

 // Listen for changes in the data
 postsRef.on('value', function(snapshot) {
   // Clear existing posts
   document.getElementById('pub').innerHTML = '';

   // Loop through each post in the snapshot
   snapshot.forEach(function(childSnapshot) {
     var post = childSnapshot.val();
     var postId = childSnapshot.key;
     console.log(post);
     // Create HTML elements for each post
     document.getElementById('splash-screen').style.display = 'none';
     var postDiv = document.createElement('div');
     postDiv.className = 'post';
     postDiv.setAttribute('data-type', post.Type);

            // Assuming post.Times is a timestamp, convert it to a human-readable format
// Assuming post.Times is a timestamp
const postTime = new Date(post.Times);
const currentTime = new Date();
const timeDifference = currentTime - postTime;
const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours
const daysDifference = Math.floor(hoursDifference / 24); // Convert hours to days


const time = new Date(post.Times);
const hours = time.getHours();
const minutes = time.getMinutes();
const formattedTime = `${hours}h :${minutes < 10 ? '0' + minutes : minutes}mn`;

let timeDisplay;
if (hoursDifference < 24) {
// If less than 24 hours ago, display in hours
timeDisplay = `${formattedTime}`;
} else {
// If older than 24 hours, display in days
timeDisplay = `${daysDifference} days ago`;
}

postDiv.innerHTML = `

    <div class="img">
        <img onclick="btncl('${encodeURIComponent(post.Title || '')}')" src="${post.Image || ''}" alt="">
        <div>
            <h2>${post.Title}</h2>
        </div>
    </div>
`;

     console.log(post)
    
     // Append the post to the 'artice' div
     document.getElementById('pub').appendChild(postDiv);

   });
 });