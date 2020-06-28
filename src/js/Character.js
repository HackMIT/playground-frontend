class Character {
    constructor(character) {
        this.x = character.x;
        this.y = character.y;
        this.id = character.id;
        this.name = character.name;

        this.chatElem = document.createElement('div');
        this.chatElem.className = 'text-bubble';

        this.elem = document.createElement('div');
        this.elem.className = 'character';
        this.move(this.x, this.y);

        this.elem.innerHTML = '<span class="name">' + character.name + '</span>';
        document.getElementsByTagName('body')[0].appendChild(this.elem);
    }

    updateChatBubble(mssg) {
        this.chatElem.innerHTML = mssg;
        this.elem.appendChild(this.chatElem);

        setTimeout(() => {
            this.elem.removeChild(this.chatElem);
        }, 5000);
    }

    move(x, y, callback) {
        let oldXpx = this.x * window.innerWidth;
        let oldYpx = this.y * window.innerHeight;
        let newXpx = x * window.innerWidth;
        let newYpx = y * window.innerHeight;
        let speed = 300; // pixels per second

        let duration = Math.sqrt(Math.pow(oldXpx - newXpx, 2) + Math.pow(oldYpx - newYpx, 2)) / speed;
        this.elem.style.transitionDuration = duration + 's';

        this.elem.style.left = x * 100 + '%';
        this.elem.style.top = y * 100 + '%';
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
