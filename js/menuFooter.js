document.addEventListener('DOMContentLoaded', function () {

    var userData = JSON.parse(localStorage.getItem('userData'));
    var isLoggedIn = userData !== null; // VÃ©rifiez si userData est diffÃ©rent de null
    var menu = document.getElementById('menu');
    var amount = isLoggedIn ? userData.Points * 0.005 : 0; // Assurez-vous que userData n'est pas null avant d'accÃ©der Ã  ses propriÃ©tÃ©s
 
    const content = `
        <div class="menutop">
                <div class="topbtn toggle">
                    <i onclick="toggleMenu()" class="fa fa-bars"></i>
                    <i onclick="toggleMenu()" id="close" class="fa fa-close"></i>
                </div>
                <button class="showconnection" onclick="showconnection()">Connectez</button>
                <div class="topbtn rc">
                        <strong>Rc</strong> 
                        <span id="rc">0.00</span>
                    <br>
                        <strong>HTG</strong> 
                        <span id="amount">${(amount).toFixed(2)}</span>
                </div>
            </div>
            <div class="menu sidenav">
                <div>
                    <div class="art-myuser">
                        <h1>Profile</h1> <hr>
                        <img id="image" src="images/icon.png" alt="">
                        <p id="name">Unitech Conseil</p>
                        <p id="username"></p>
                        <p id="phone">00.00.00.00</p>
                        <p id="email">@gmail</p>
                    </div>
                    <div class="sideItem">
                        <p><a href="/index.html"><i class="fa fa-home"></i> Accueil</a></p>
                        <p><a href="/c/concours.html"><i class="fa fa-home"></i> Concours</a></p>
                        <p id="profile"><a onclick="profile()"><i class="fa fa-user"></i> Profile</a></p>
                        ${isLoggedIn ? `
                        <p id="logout"><a onclick="logout()"><i class="fa fa-unlock"></i> Déconnectez</a></p>
                    ` :  `<p id="connect" onclick="openform()"><i class="fa fa-lock"></i>Connectez</p>
                    `}
                    </div>
                </div>
            </div>
    `;
    menu.innerHTML = content;
    

    // Added script
    if (isLoggedIn) {
      // document.getElementById("connect").style.display='none';
       document.querySelector('.showconnection').style.display='none';
    } else {
        document.querySelector('.showconnection').style.display='block';
    }
});


/*------------------ Footer -------------------------*/
document.addEventListener('DOMContentLoaded', function () {
var footer = document.querySelector('.mobile-footer');
const contentFooter = `
    <div class="footer-content">
        <div class="footer-list">
            <a href="/index.html" class="footer-item"><i class="fa fa-home"></i> Accueil</a>
            <a href="/statues.html" class="footer-item"><i class="fa fa-comment"></i> Statues</a>
            <a href="/p/texte.html" class="footer-item"><i class="fa fa-comment"></i> Texte</a>
            <a href="/p/livres.html" class="footer-item"><i id="podcastIcon" class="fa fa-book"></i>Livres</a>
            <a href="/p/cours.html" class="footer-item"><i class="fa fa-android"></i>Cours</a>
            <a href="/p/articles.html" class="footer-item"><i class="fa fa-square"></i>Blog</a>
        </div>
    </div>
`;
footer.innerHTML = contentFooter;
});