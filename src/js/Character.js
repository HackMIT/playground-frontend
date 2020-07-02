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
        document.getElementById("game").appendChild(this.elem);

        this.profileElem = document.createElement("div"); //span to text
        this.profileElem.className = 'profile';
        this.elem.addEventListener('click', (e) => {
            this.profileElem.style.display = 'block';
        });
        this.elem.appendChild(this.profileElem);
        this.profileElem.style.display = 'none';

        this.yellowElem = document.createElement("div"); //span to text
        this.yellowElem.className = 'yellow-background';
        this.elem.addEventListener('click', (e) => {
            this.yellowElem.style.display = 'block';
        });
        this.elem.appendChild(this.yellowElem);
        this.yellowElem.style.display = 'none';

        this.whiteProfileElem = document.createElement("div"); 
        this.whiteProfileElem.className = 'profile-back';
        this.elem.addEventListener('click', (e) => {
            this.whiteProfileElem.style.display = 'block';
        });
        this.elem.appendChild(this.whiteProfileElem);
        this.whiteProfileElem.style.display = 'none';

        this.closeButton = document.createElement("div"); //span to text
        this.closeButton.className = 'close-button';
        this.closeButton.innerHTML = 'X';

        // document.getElementById("close-button").addEventListener('click', () => {
        //     console.log('here')
        //     this.profileElem.style.display = 'none';
        //     this.yellowElem.style.display = 'none';
        //     this.gradProfileElem.style.display = 'none';

        // })
        this.whiteProfileElem.appendChild(this.closeButton);
        //this.closeButton.style.display = 'none';

        this.gradProfileElem = document.createElement("div"); 
        this.gradProfileElem.className = 'profile-gradient';
        //this.gradProfileElem.innerHtml = 'This is a long long long bio. I have nothing to say but lets just fill it with as many words as I can. Yayy all filled.'
        this.elem.addEventListener('click', (e) => {
            this.gradProfileElem.style.display = 'block';
        });
        this.elem.appendChild(this.gradProfileElem);
        this.gradProfileElem.style.display = 'none';

        this.gradBioElem = document.createElement("div"); 
        this.gradBioElem.className = 'bio-gradient';
        this.elem.addEventListener('click', (e) => {
            this.gradBioElem.style.display = 'block';
        });
        this.elem.appendChild(this.gradBioElem);
        this.gradBioElem.style.display = 'none';

        this.bio = document.createElement("div"); 
        this.bio.className = 'bio-text';
        this.bio.innerHTML = 'This is a long long long bio. I have nothing to say but lets just fill it with as many words as I can. Yayy all filled.';
        this.gradBioElem.appendChild(this.bio);

        this.earth = document.createElement("div");
        this.earth.className = "earth";
        this.gradBioElem.appendChild(this.earth);

        // var c = document.getElementById("myCanvas");
        // console.log(c.getContext)
        // if (c.getContext) {
        //     var ctx = c.getContext("2d");
        //     ctx.beginPath();
        //     ctx.moveTo(0, 0);
        //     ctx.lineTo(300, 150);
        //     ctx.stroke();
        // }

        this.buttonContainer = document.createElement("div");
        this.buttonContainer.className = 'button-container';
        this.elem.addEventListener('click', (e) => {
            this.buttonContainer.style.display = 'block';
        });
        this.elem.appendChild(this.buttonContainer);
        this.buttonContainer.style.display = 'none';

        this.buttons1 = document.createElement("div"); 
        this.buttons1.className = 'profile-button';

        this.buttons2 = document.createElement("div"); 
        this.buttons2.className = 'profile-button';

        this.buttons3 = document.createElement("div"); 
        this.buttons3.className = 'profile-button';

        this.buttons4 = document.createElement("div"); 
        this.buttons4.className = 'profile-button';

        this.buttons5 = document.createElement("div"); 
        this.buttons5.className = 'profile-button';

        this.buttonContainer.appendChild(this.buttons1);
        this.buttonContainer.appendChild(this.buttons2);
        this.buttonContainer.appendChild(this.buttons3);
        this.buttonContainer.appendChild(this.buttons4);
        this.buttonContainer.appendChild(this.buttons5);

        this.profile_name = document.createElement("div"); 
        this.profile_name.className = 'profile-text';
        this.profile_name.innerHTML = character.name;

        this.school_name = document.createElement("div"); 
        this.school_name.className = 'sub-text';
        this.school_name.innerHTML = 'Massachusetts Institute of Tech';

        this.location_name = document.createElement("div"); 
        this.location_name.className = 'location-text';
        this.location_name.innerHTML = 'Arizona, United States';

        this.whiteProfileElem.appendChild(this.profile_name);
        this.whiteProfileElem.appendChild(this.school_name);
        this.gradProfileElem.appendChild(this.location_name)
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
        let speed = 400; // pixels per second

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
