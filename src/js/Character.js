class Character {
    constructor(character) {
        this.x = character.x;
        this.y = character.y;
        this.id = character.id;
        this.name = character.name;

        this.elem = document.createElement("div");
        this.elem.className = "character";
        this.move(this.x, this.y);

        this.elem.innerHTML = "<span>" + this.name + "</span>";
        document.getElementsByTagName("body")[0].appendChild(this.elem);

        this.profileElem = document.createElement("div"); //span to text
        this.profileElem.className = 'profile';
        this.elem.addEventListener('click', (e) => {
            this.profileElem.style.display = 'block';
        });
        this.elem.appendChild(this.profileElem);
        this.profileElem.style.display = 'none';

        this.whiteProfileElem = document.createElement("div"); 
        this.whiteProfileElem.className = 'profile-back';
        this.elem.addEventListener('click', (e) => {
            this.whiteProfileElem.style.display = 'block';
        });
        this.elem.appendChild(this.whiteProfileElem);
        this.whiteProfileElem.style.display = 'none';

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

        this.buttons1 = document.createElement("div"); 
        this.buttons1.className = 'profile-button';
        this.elem.addEventListener('click', (e) => {
            this.buttons1.style.display = 'inline-block';
        });
        this.elem.appendChild(this.buttons1);
        this.buttons1.style.display = 'none';

        this.buttons2 = document.createElement("div"); 
        this.buttons2.className = 'profile-button';
        this.elem.addEventListener('click', (e) => {
            this.buttons2.style.display = 'inline-block';
        });
        this.elem.appendChild(this.buttons2);
        this.buttons2.style.display = 'none';

        this.buttons3 = document.createElement("div"); 
        this.buttons3.className = 'profile-button';
        this.elem.addEventListener('click', (e) => {
            this.buttons3.style.display = 'inline-block';
        });
        this.elem.appendChild(this.buttons3);
        this.buttons3.style.display = 'none';

        this.profile_name = document.createElement("div"); 
        this.profile_name.className = 'profile-text';
        this.profile_name.innerHTML = 'SAVANNAH LIU'; 

        this.school_name = document.createElement("div"); 
        this.school_name.className = 'sub-text';
        this.school_name.innerHTML = 'Massachusetts Institute of Tech';
        // this.elem.addEventListener('click', (e) => {
        //     this.gradProfileElem.style.display = 'block';
        // });
        // this.profile_name.className = 'profile-text';
        // this.elem.addEventListener('click', (e) => {
        //     this.profile_name.style.innerHTML = 'HIIII';
        // });
        this.whiteProfileElem.appendChild(this.profile_name);
        this.whiteProfileElem.appendChild(this.school_name);
        //this.profile_name.style.display = 'none';
        this.gradProfileElem.appendChild('class="fa fa-globe"');
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
