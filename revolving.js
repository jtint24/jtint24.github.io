
var c = document.getElementById("universe");
var ctx = c.getContext("2d");


const MAX_WIDTH = 1200
const MAX_HEIGHT = 800
const MAX_RADIUS = Math.min(MAX_WIDTH, MAX_HEIGHT) / 2;


const G_FACTOR = 1

window.requestAnimationFrame(draw);

function sq(x) {
    return x*x;
}

function getNormalForce(x, y, z, vx, vy, vz, x2, y2, z2) {
    // Find the difference
    const dx = x - x2
    const dy = y - y2
    const dz = z - z2;

    // Find the projection of the velocity onto the difference vector

    const multiplier = (dx * vx + dy * vy + dz * vz) / (sq(dx) + sq(dy) + sq(dz))
    const px = multiplier * dx
    const py = multiplier * dy
    const pz = multiplier * dz
    console.log(`normal force vector: ${px}, ${py}, ${pz}`)
    return [-px, -py, -pz]
}

class GravityBody {
    constructor(name, img_src, x, y, z, mass, velocityX, velocityY, velocityZ, isStatic) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.mass = mass;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.velocityZ = velocityZ;
        this.isStatic = isStatic;
        if (img_src != null) {
            this.img = new Image(30, 30);
            this.img.src = img_src;
        } else {
            this.img = null
        }
        this.body_name = name;
    }

    run(otherBodies) {
        //otherBodies: List[GravityBody]

        if (!this.isStatic) {

            // update velocity based on other positions

            for (const otherBody of otherBodies) {
                const deltaX = otherBody.x - this.x;
                const deltaY = otherBody.y - this.y;
                const deltaZ = otherBody.z - this.z;
                const distanceSq = (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)

                if (distanceSq === 0) {
                    continue
                }

                const distance = Math.sqrt(distanceSq);
                const multiplier = G_FACTOR * otherBody.mass / Math.max(100, distanceSq);
                const unitX = deltaX / distance;
                const unitY = deltaY / distance;
                const unitZ = deltaZ / distance;

                this.velocityX += unitX * multiplier;
                this.velocityY += unitY * multiplier;
                this.velocityZ += unitZ * multiplier;

                if (distance < 20) {
                    const [px, py, pz] = getNormalForce(this.x, this.y, this.z, this.velocityX, this.velocityY, this.velocityZ, otherBody.x, otherBody.y, otherBody.z);
                    this.velocityX += px
                    this.velocityY += py
                    this.velocityZ += pz
                }
            }

            // Update position
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.z += this.velocityZ;

            const distance = Math.sqrt(sq(this.x - MAX_WIDTH/2) + sq(this.y - MAX_HEIGHT/2) + sq(this.z))

            if (distance > MAX_RADIUS) {
                console.log("Hit the wall!")

                this.x = (this.x - MAX_WIDTH/2) * (MAX_RADIUS / distance) + MAX_WIDTH/2;
                this.y = (this.y - MAX_HEIGHT/2) * (MAX_RADIUS / distance) + MAX_HEIGHT/2;
                this.z = (this.z) * (MAX_RADIUS / distance);

                const otherX = (this.x - MAX_WIDTH/2) * 1.1 + MAX_WIDTH/2;
                const otherY = (this.y - MAX_HEIGHT/2) * 1.1 + MAX_HEIGHT/2;
                const otherZ = this.z * 1.1;
                const [px, py, pz] = getNormalForce(this.x, this.y, this.z, this.velocityX, this.velocityY, this.velocityZ, otherX, otherY, otherZ);
                this.velocityX += px
                this.velocityY += py
                this.velocityZ += pz

            }
        }
    }


    draw(ctx) {

        const time = Date.now()
        const theta = (Math.atan2(this.x-MAX_WIDTH/2, this.z) || 0) // + time/10000;

        console.log("theta", theta)


        const radius = Math.sqrt(sq(this.x - MAX_WIDTH/2) + sq(this.z));


        if (this.img == null) {
            ctx.beginPath();
            const grd = ctx.createRadialGradient(radius * Math.sin(theta) + MAX_WIDTH/2, this.y, 3, radius * Math.sin(theta) + MAX_WIDTH/2, this.y, 10);

            grd.addColorStop(0.5, "rgba(255,100,0, 1)");
            grd.addColorStop(1, "rgba(255,255,0, 0)");

            grd.addColorStop(0, "white");

            ctx.arc(radius * Math.sin(theta) + MAX_WIDTH/2, this.y, 20, 0, 2 * Math.PI);
            ctx.fillStyle = grd;


            ctx.fill()
        } else {
            const scale = (this.z / MAX_RADIUS) * 10 + 30;
            const contrast = Math.max(0, -(this.z / MAX_RADIUS))
            ctx.filter = `blur(${contrast}px)`;
            ctx.drawImage(this.img, radius * Math.sin(theta) - scale/2 + MAX_WIDTH/2, this.y-scale/2, scale, scale)
            ctx.filter = "none"
        }
    }
}

class Meteor extends GravityBody {
    constructor(select) {
        super();
        this.mass = 5
        const [vx, vy, vz] = getRandomSphericalCoordinates(3)
        this.velocityX = vx
        this.velocityY = vy
        this.velocityZ = vz
        const [x,y,z] = getRandomCylindricalCoordinatesAtSurface(Math.max(MAX_WIDTH/2, MAX_HEIGHT/2), 100)
        this.x = x + MAX_WIDTH/2;
        this.y = y + MAX_HEIGHT/2;
        this.z = z
        this.body_name = `Meteor ${Math.random()}`
        this.img = new Image(20, 20);
        this.img.src = select.img;
        this.trail = []
    }

    run(otherBodies) {
        this.velocityX *= 1.01
        this.velocityY *= 1.01
        this.velocityZ *= 1.01
        this.trail.push([this.x, this.y, this.z])
        if (this.trail.length > 50) {
            this.trail.shift()
        }

        for (const otherBody of otherBodies) {
            const deltaX = otherBody.x - this.x;
            const deltaY = otherBody.y - this.y;
            const deltaZ = otherBody.z - this.z;
            const distanceSq = (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)

            if (distanceSq === 0) {
                continue
            }

            const distance = Math.sqrt(distanceSq);
            const multiplier = G_FACTOR * otherBody.mass / Math.max(100, distanceSq);
            const unitX = deltaX / distance;
            const unitY = deltaY / distance;
            const unitZ = deltaZ / distance;

            this.velocityX += unitX * multiplier;
            this.velocityY += unitY * multiplier;
            this.velocityZ += unitZ * multiplier;

            if (distance < 20) {
                const [px, py, pz] = getNormalForce(this.x, this.y, this.z, this.velocityX, this.velocityY, this.velocityZ, otherBody.x, otherBody.y, otherBody.z);
                this.velocityX += px
                this.velocityY += py
                this.velocityZ += pz
            }
        }


        this.x += this.velocityX;
        this.y += this.velocityY;
        this.z += this.velocityZ;
    }

    draw(ctx) {

        let i = 0
        for (const trailPoint of this.trail) {
            ctx.fillStyle = "#5599ff44"
            ctx.beginPath();
            ctx.arc(trailPoint[0], trailPoint[1], i, 0, 2 * Math.PI);
            ctx.fill()

            i+= 0.15
        }
        ctx.filter = "grayscale(90%) hue-rotate(200deg) saturate(150%)";

        super.draw(ctx);
        ctx.filter = "none"

    }

}

class Alien extends GravityBody {

}

function drawBackground() {
    const grd = ctx.createRadialGradient(MAX_WIDTH/2,MAX_HEIGHT/2,0,MAX_WIDTH/2,MAX_HEIGHT/2,1.1*MAX_RADIUS)
    grd.addColorStop(0, "rgb(100,100,100)")
    grd.addColorStop(1, "rgba(100,100,100,0)")


    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(MAX_WIDTH/2, MAX_HEIGHT/2, MAX_RADIUS, 0, 2 * Math.PI);
    ctx.fill();

    ctx.closePath();

    ctx.fillStyle = "#000";


    const time = Date.now()
    const theta = (time/5000) % (2*Math.PI);


    // ctx.beginPath();
    // ctx.ellipse(MAX_WIDTH/2, MAX_HEIGHT/2, Math.abs(Math.sin(theta) * MAX_RADIUS), MAX_RADIUS, 0, 0, 2*Math.PI)
    // ctx.stroke();
    // ctx.closePath();
    //
    // ctx.beginPath();
    // ctx.ellipse(MAX_WIDTH / 2, MAX_HEIGHT / 2, Math.abs( Math.cos(theta) * MAX_RADIUS), MAX_RADIUS, 0, 0, 2 * Math.PI)
    // ctx.stroke();
    //
    //
    // ctx.closePath();

}


grav_bodies = [
    new GravityBody("Sun", null, MAX_WIDTH/2,MAX_HEIGHT/2,0,100,0,0,0, true),
]




function draw() {
    ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);


    drawBackground()

    if (Math.random() < 0.001) {
        const random = Math.floor(Math.random() * selects_list.length);

        grav_bodies.push(new Meteor(selects_list[random]));
    }


    for (const body of grav_bodies) {
        body.run(grav_bodies);
        console.log(`${body.body_name} velocity (${body.velocityX}, ${body.velocityY}, ${body.velocityZ})`);
        console.log(`${body.body_name} coords   (${body.x}, ${body.y}, ${body.z})`);
    }

    grav_bodies = grav_bodies.filter(gb => !(gb instanceof Meteor && gb.trail.length > 40 && (gb.x < 0 || gb.x > MAX_WIDTH || gb.y < 0 || gb.y > MAX_HEIGHT)  ))

    for (const body of grav_bodies.toSorted((a, b) => a.z - b.z)) {
        body.draw(ctx);
    }


    window.requestAnimationFrame(draw);
}



