import './styles/index.scss'
import homeBackground from './images/home.png'
import drwBackground from './images/drw.png'
import axios from 'axios'

const sponsorBaseURL = "http://localhost:8080/sponsor/";
var id = "";

var signInForm = document.getElementById("sign-in-form");
function handleSignIn(event) { 
    event.preventDefault();
    id = document.getElementById("id").value;
    axios.get(sponsorBaseURL + id).then((res) => {
        document.getElementById("data-dump").innerHTML = res.data;
        document.getElementById("sponsor-name").innerHTML = res.data.Name + " admin page";
        document.getElementById("secret-id").innerHTML = "Secret id: " + res.data.Id;
        document.getElementById("room-color").innerHTML = "Room color: " + res.data.Color;
    });
} 
signInForm.addEventListener('submit', handleSignIn);

var colorForm = document.getElementById("change-color");
function handleColorChange(event) { 
    event.preventDefault();
    var color = document.getElementById("new-color").value;
    console.log(color)
    console.log(id)
    axios.put(sponsorBaseURL + id, {
        "color": color
    }).then((res) => {
        document.getElementById("room-color").innerHTML = "Room color: " + color;
    });
} 
colorForm.addEventListener('submit', handleColorChange);




