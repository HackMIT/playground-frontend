class Interactable {
    constructor(action, appearance, x, y) {
        this.action = action;
        this.appearance = appearance;
        this.x = x;
        this.y = y;

        this.elem = document.createElement("input");
        this.elem.type = "image";
        this.elem.className = "interactable";
        this.elem.style.left = x * 100 + "%";
        this.elem.style.top = y * 100 + "%";
        this.elem.src = appearance;

        document.getElementsByTagName("body")[0].appendChild(this.elem);

        if (action == "coffee-chat") {
            this.elem.className = "interactable open-modal";
            this.elem.setAttribute("data-open", "modal1");
            this.addCoffeeChat();
        }
    }

    addCoffeeChat() {
        const openEls = document.querySelectorAll("[data-open]");
        const isVisible = "is-visible";
        for (const el of openEls) {
            el.addEventListener("click", function () {
                const modalId = this.dataset.open;
                document.getElementById(modalId).classList.add(isVisible);
            });
        }

        const closeEls = document.querySelectorAll("[data-close]");

        for (const el of closeEls) {
            el.addEventListener("click", function () {
                this.parentElement.parentElement.parentElement.classList.remove(isVisible);
            });
        }
        document.addEventListener("click", e => {
            if (e.target == document.querySelector(".modal.is-visible")) {
                document.querySelector(".modal.is-visible").classList.remove(isVisible);
            }
        });

        document.addEventListener("keyup", e => {
            if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
                document.querySelector(".modal.is-visible").classList.remove(isVisible);
            }
        });
    }
}

export {
    Interactable
};
