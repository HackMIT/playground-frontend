import axios from 'axios'

window.onload = function() {
    axios.get('http://localhost:8080/rooms/home').then(res => {
        console.log(res)
    })
};

