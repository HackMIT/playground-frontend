class Character {
    constructor(name, x = 0.5, y = 0.5) {
        this.x = x;
        this.y = y;
        this.name = name;

        this.elem = document.createElement("div");
        this.elem.className = "character";
        this.move(x, y);

        this.elem.innerHTML = "<span>" + name + "</span>";
        document.getElementsByTagName("body")[0].appendChild(this.elem);
    }

    move(x, y) {
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
    }

    remove() {
        this.elem.remove();
    }
}

export {
    Character
};
