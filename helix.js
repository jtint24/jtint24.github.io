const canvas = document.getElementById('helixCanvas');
const ctx = canvas.getContext('2d');

const fullText = "Aunt nell the patter flash and gardy loo! " +
    "Bijou, she trolls, bold, on lallies " +
    "slick as stripes down the Dilly. " +
    "She minces past the brandy latch " +
    "to vada dolly dish for trade, silly " +
    "with oomph and taste to park. " +
    "She’ll reef you on her vagaries – " +
    "should you be so lucky. She plans " +
    "to gam a steamer and tip the brandy, " +
    "but give her starters and she’ll be happy " +
    "to give up for the harva. Mais oui, " +
    "she’s got your number, duckie. " +
    "She’ll cruise an omi with fabulosa bod, " +
    "regard the scotches, the thews, the rod – " +
    "charpering a carsey for the trick. " +
    "Slick, she bamboozles the ogles " +
    "of old Lilly Law. She swishes " +
    "through town, ‘alf meshigener, and blows " +
    "lamors through the oxy at all " +
    "the passing trade. She’ll sass a drink " +
    "of aqua da vida, wallop with vera in claw. " +
    "Nellyarda her voche’s chant till the nochy " +
    "with panache becomes journo, till " +
    "the sparkle laus the munge out of guard. " +
    "But sharda she’s got nada, she aches " +
    "for an affaire, and dreams of pogey " +
    "through years of nix. The game nanti works " +
    "-not for her. She prefers a head " +
    "or back slum to the meat rack. Fact is, " +
    "she’ll end up in the charpering carsey " +
    "of Jennifer Justice. What is this " +
    "queer ken she’s in? Give her an auntie " +
    "or a mama. The bones isn’t needed just yet. " +
    "Though she’s a bimbo bit of hard, " +
    "she’s royal and tart. And girl, you know " +
    "vadaing her eek is always bona. " + "I met a traveller from an antique land " +
    "Who said: Two vast and trunkless legs of stone " +
    "Stand in the desart. Near them, on the sand, " +
    "Half sunk, a shattered visage lies, whose frown, " +
    "And wrinkled lip, and sneer of cold command, " +
    "Tell that its sculptor well those passions read " +
    "Which yet survive, stamped on these lifeless things, " +
    "The hand that mocked them and the heart that fed: " +
    "And on the pedestal these words appear: " +
    "\"My name is Ozymandias, King of Kings: " +
    "Look on my works, ye Mighty, and despair!\" " +
    "No thing beside remains. Round the decay " +
    "Of that colossal wreck, boundless and bare " +
    "The lone and level sands stretch far away. " +
    " "

// Config
const fontSize = 24;
const lineHeight = fontSize * 1.2;
const visibleChars = 50;
const scrollSpeed = 1; // pixels per frame
ctx.font = `${fontSize}px monospace`;
ctx.fillStyle = 'black';
ctx.textBaseline = 'top';
ctx.textAlign = 'center';

let scrollOffset = 0;
let charIndex = 0;
const radius = 150
const period = 100


const colors = [
    "#E63946",
    "#018E42",
    "#188FA7"
]

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;



    for (let i = 0; i < visibleChars + 1; i++) {
        const index = (charIndex + i) % fullText.length;
        const char = fullText[index];
        const lastChar = Math.max(0, fullText.indexOf(' ', index))
        const color = colors[lastChar % colors.length];
        console.log(color, lastChar);


        const y = i * lineHeight - scrollOffset;
        const x = Math.sin(y/period + Date.now()/5000) * radius + centerX;
        const z = Math.cos(y/period + Date.now()/5000)
        const scale = 0.01 + Math.abs(z);
        const alpha = 0.6 + 0.4 * z;

        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.scale(scale, 1);
        ctx.globalAlpha = alpha;
        ctx.fillText(char, 0, 0);
        ctx.restore();


        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.scale(scale, 1);
        ctx.globalAlpha = alpha;
        ctx.fillText(char, 0, 0);
        ctx.restore();
    }

    scrollOffset += scrollSpeed;

    if (scrollOffset >= lineHeight) {
        scrollOffset = 0;
        charIndex = (charIndex + 1) % fullText.length;
    }

    requestAnimationFrame(draw);
}

draw();
