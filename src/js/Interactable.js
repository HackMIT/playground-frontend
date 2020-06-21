class Interactable {
    constructor(action, appearance, x, y) {
        this.action = action;
        this.appearance = appearance;
        this.x = x;
        this.y = y;

        this.elem = document.createElement("img");
        this.elem.className = "interactable";
        this.elem.style.left = x * 100 + "%";
        this.elem.style.top = y * 100 + "%";
        this.elem.src = appearance;
        // this.elem.onclick = * insert function here based on action *

        document.getElementsByTagName("body")[0].appendChild(this.elem);
    }

    remove() {
        this.elem.remove();
    }

    // TODO: add functions for specific actions
}

export {
    Interactable
};