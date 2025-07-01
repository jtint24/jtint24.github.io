

function getRandomSphericalCoordinates(r) {
    const theta = 2 * Math.PI * Math.random();
    const phi = 2 * Math.PI * Math.random();
    const radius = r * (0.5 * Math.random() + 0.5 * Math.random());
    return [radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi)];
}

function getRandomSphericalCoordinatesAtSurface(r) {
    const theta = 2 * Math.PI * Math.random();
    const phi = 2 * Math.PI * Math.random();
    const radius = r
    return [radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi)];

}

function getRandomCylindricalCoordinatesAtSurface(r, h) {
    const theta = 2 * Math.PI * Math.random();
    const radius = r
    return [radius * Math.cos(theta), radius * Math.sin(theta), h * Math.random() - h/2];

}

class Select {
    constructor(seal_name, img, mass) {
        this.seal_name = seal_name;
        this.img = img;
        this.mass = mass
    }

    toButton(document) {
        const sealBox = document.createElement('div');
        sealBox.innerHTML = this.seal_name;
        sealBox.classList.add('sealBox');

        const sealActiveText = document.createElement("div");
        sealActiveText.classList.add("sealActiveText");
        sealActiveText.textContent = "inactive"


        const imgBox = document.createElement('div');
        imgBox.classList.add('sealImgBox');

        const img = document.createElement('img');
        img.classList.add('sealImg');
        img.src = this.img;

        imgBox.appendChild(img);
        sealBox.appendChild(imgBox);
        sealBox.appendChild(sealActiveText);

        sealBox.addEventListener('click', e => {
            if (sealBox.classList.contains("active")) {
                sealBox.classList.remove("active");
                const removeIdx = grav_bodies.findIndex(gb => gb.body_name === this.seal_name)
                grav_bodies.splice(removeIdx, 1);
                sealActiveText.textContent = "inactive"
            } else {
                sealBox.classList.add("active");
                const [x, y, z] = getRandomSphericalCoordinates(MAX_RADIUS)
                const [vx, vy, vz] = getRandomSphericalCoordinates(4)
                const body = new GravityBody(this.seal_name, this.img, x+MAX_RADIUS,y+MAX_RADIUS, z, this.mass, vx, vy, vz, false)
                sealActiveText.textContent = "ACTIVE"

                grav_bodies.push(body);
            }
        })

        return sealBox;
    }
}


selects_list = [
    new Select("Snorbler", "imgs/snorbler.png", 30),
    new Select("Goobus", "imgs/goobus.png", 25),
    new Select("Peepini", "imgs/peepini.png", 20),

    new Select("Eechichi-Eechichi", "imgs/eechichi.png", 20),
    new Select("Skwug", "imgs/skwug.png", 50),

    new Select("Torbid", "imgs/torbid.png", 10),
    new Select("Maximus", "imgs/maximus.png", 75),
    new Select("Smoochard <span class='tinyText'>and </span> Kissabelle", "imgs/smoochard-kissabelle.png", 50),
    new Select("John Carter,<span class='tinyText'> Prince of Mars </span>", "imgs/john carter.png", 60),

    new Select("Nuuber", "imgs/nuuber.png", 25),
    new Select("Squinch", "imgs/squinch.png", 10),
    new Select("Plehbrrry", "imgs/plehbrrry.png", 100),
]


let selectSelector = document.getElementById("selects-selector");


for (const select of selects_list) {
    selectSelector.appendChild(select.toButton(document));
}



