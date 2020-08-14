class Character {
  constructor(character) {
    this.x = character.x;
    this.y = character.y;
    this.id = character.id;
    this.name = character.name;

    this.model = character.model;

    this.elem = document.createElement('div');
    this.elem.className = 'character';

    this.chatElem = document.createElement('div');
    this.chatElem.className = 'text-bubble';

    this.move(this.x, this.y);

    this.elem.innerHTML = `<span class="name">${character.name}</span>`;
    document.getElementById('game').appendChild(this.elem);
  }

  updateChatBubble(mssg) {
    this.chatElem.innerHTML = mssg;
    this.elem.appendChild(this.chatElem);

    setTimeout(() => {
      this.elem.removeChild(this.chatElem);
    }, 5000);
  }

  move(x, y, callback) {
    const oldXpx = this.x * window.innerWidth;
    const oldYpx = this.y * window.innerHeight;
    const newXpx = x * window.innerWidth;
    const newYpx = y * window.innerHeight;
    const speed = 400; // pixels per second

    const duration = Math.sqrt((oldXpx - newXpx) ** 2 + (oldYpx - newYpx) ** 2) / speed;
    this.elem.style.transitionDuration = `${duration}s`;

    this.elem.style.left = `${x * 100}%`;
    this.elem.style.top = `${y * 100}%`;
    this.x = x;
    this.y = y;

    setTimeout(callback, duration * 1000);
  }

  remove() {
    this.elem.remove();
  }

  update(deltaTime) {
    this.model.update(deltaTime);
  }
}

export default Character;
