class Character {
    constructor(character) {
        this.x = character.x;
        this.y = character.y;
        this.id = character.id;
        this.name = character.name;

        this.chatElem = document.createElement("div");

        this.elem = document.createElement("div");
        this.elem.className = "character";
        this.move(this.x, this.y);

        this.elem.innerHTML = "<span class=\"name\">" + character.name + "</span>";
        document.getElementsByTagName("body")[0].appendChild(this.elem);
    }

    updateChatBubble(name, mssg) {
        var chatBubble = document.createElement('div');

        this.chatElem.className = 'mssg';
        this.chatElem.innerHTML = "<span class=\"mssg\">" + mssg + "</span>";
        
        var characters = document.querySelectorAll('div.character > span');

        for (var i = 0; i < characters.length; i++) {
            let charName = characters[i].innerHTML;
            if (charName === name){

                let char = document.getElementsByClassName('character')[i];

                chatBubble.className = 'text-bubble';
                
                chatBubble.appendChild(this.chatElem);
                char.appendChild(chatBubble);

                break;
            }
        }

        setTimeout(() => {
            this.chatElem.innerHTML = null;
            chatBubble = null;
        }, 5000);

    }

    move(x, y, callback) {
        let oldXpx = this.x * window.innerWidth;
        let oldYpx = this.y * window.innerHeight;
        let newXpx = x * window.innerWidth;
        let newYpx = y * window.innerHeight;
        let speed = 300; // pixels per second

        let duration = Math.sqrt(Math.pow(oldXpx - newXpx, 2) + Math.pow(oldYpx - newYpx, 2)) / speed;
        this.elem.style.transitionDuration = duration + "s";

        this.elem.style.left = x * 100 + "%";
        this.elem.style.top = y * 100 + "%";
        this.x = x;
        this.y = y;

        setTimeout(callback, duration * 1000);
    }

    remove() {
        this.elem.remove();
    }
}

export {
    Character
};
