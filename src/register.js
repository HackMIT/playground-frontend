import './styles/register.scss'

document.getElementById("SMS").addEventListener("click", enterPhone);
document.getElementById("submit-button").addEventListener("click", redirect);
// document.getElementById("browser").addEventListener("click", testNotifications);

let userType = "hacker"
toggleMode(userType)

function toggleMode(userType) {
    if (userType === 'hacker') {
        document.getElementById('sponsor').style.display = "none";
    } else {
        document.getElementById('hacker').style.display = "none";
    }
}

function enterPhone() {
    var checkBox = document.getElementById("SMS");

    // users can enter phone number
    if (checkBox.checked === true){
        var input = document.createElement("input");
        input.type = 'text';
        input.id = 'phoneNum';

        var div = document.createElement("div");
        div.id = 'phoneNumField';
        div.innerHTML = "Enter your phone number (US) here: ";
        div.appendChild(input);
        div.style.display='block';

        document.getElementById("notifications").appendChild(div);
    } else {
        document.getElementById('phoneNumField').remove();
  }
}

function redirect() {

    var email = document.getElementById("email");
    var text = document.getElementById("SMS");
    var browser = document.getElementById("browser");

    var textdata = [];
    if (text.checked === true) {
        textdata = [true, document.getElementById("phoneNum").value];
    }

    // check if browser notifications are supported
    setNotifications()

    localStorage.setItem('email', JSON.parse(email.checked));
    localStorage.setItem('phone', JSON.stringify(textdata));
    localStorage.setItem('browser', JSON.parse(browser.checked));

    document.getElementById("submit-button").onclick = function () {
        window.location.href = "http://localhost:3000/character";
    }
}

/*
WARNING: in chrome, user must go to "chrome://flags" and disable 'Enable native notifications'
for this to work
*/

function setNotifications() {

    if (!("Notification" in window)) {
        console.log('This browser does not support desktop notification');
        alert("This browser does not support desktop notification");
    }
    
    else if (Notification.permission === "granted") {
        let notification = new Notification("Browser notifications enabled!");
        console.log("Browser notifications enabled!");
    }
    
    else if (Notification.permission !== "granted") {
        console.log("Browser notifications denied!");
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            let notification = new Notification("Welcome to HackPenguin notifications!");
            console.log(notification)
          }
        });
    }

}