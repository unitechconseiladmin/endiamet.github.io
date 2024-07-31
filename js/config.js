        // Get the title from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get('title');
        
        // Decode the title
        const decodedTitle = decodeURIComponent(title);


document.addEventListener("DOMContentLoaded", function () {
  // Reference to your database
  const database = firebase.database();

  // Get the current page URL
  const postUrl = window.location.href;

  // Encode the post URL to make it Firebase-friendly
  const encodedPostUrl = encodeURIComponent(postUrl).replace(/[.#$/[\]]/g, '_');

  // Fetch IP information and send data to Firebase
  fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((res) => {
          // Log IP information
          console.log(res);
          console.log(res.country);
          console.log(res.ip);
          console.log(res.org);
          console.log(res.country_calling_code);
          console.log(res.region);

          // Check if the IP address already exists for the current page in Firebase
          const ipToCheck = res.ip.toString();
          //const visiteursRef = database.ref(`Visiteurs/${res.region}/${encodedPostUrl}`);

          // Get the current timestamp
          const currentTimestamp = firebase.database.ServerValue.TIMESTAMP;

          // Perform a query to check if the IP address already exists
          visiteursRef.once("value", function (snapshot) {
              if (!snapshot.exists()) {
                  // IP address does not exist for the current page, send data to Firebase
                  const newData = {
                      Pages: encodedPostUrl,
                      pays: res.country,
                      ip: ipToCheck,
                      model: res.org,
                      codep: res.country_calling_code,
                      Region: res.region,
                      visitCount: 1,  // Initialize the visit count to 1
                      visitTimestamp: currentTimestamp  // Add the timestamp
                  };

                  // Push data to Firebase
                  //visiteursRef.set(newData);
                  console.log("Data sent to Firebase!");
              } else {
                  // IP address already exists for the current page, increment visit count
                  const currentData = snapshot.val();
                  const newVisitCount = (currentData.visitCount || 0) + 1;

                  // Update the visit count and timestamp in Firebase
                  visiteursRef.update({ visitCount: newVisitCount, visitTimestamp: currentTimestamp });
                  console.log("Visit count incremented. Data not sent.");
              }
          });
      });
});
