import './styles/register.scss'

document.getElementById("SMS").addEventListener("click", enterPhone);
document.getElementById("submit-button").addEventListener("click", redirect);

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

    localStorage.setItem('email', JSON.parse(email.checked));
    localStorage.setItem('phone', JSON.stringify(textdata));
    localStorage.setItem('browser', JSON.parse(browser.checked));

    document.getElementById("submit-button").onclick = function () {
        window.location.href = "http://localhost:3000/character";
    }
}