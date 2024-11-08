// https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

class Symbols {
    constructor(start, end, nope) {
        this.start = start // The start of the character code (unicode? I think)
        this.end = end
        this.nope = nope

        this.span = this.end - this.start + 1 // Just getting the length of all characters
    }

    getRandom() {
        let candidate = Math.floor(Math.random() * this.span + this.start) // getting random letter within the character code

        if (this.nope.includes(candidate) || candidate == this.lastGenerated) // prevent getting the same letter twice or leatters you include in this.nope
            return this.getRandom()

        this.lastGenerated = candidate
        return candidate
    }

    getRandomSymbol() {
        return String.fromCharCode(this.getRandom())
    }
}

class Rain {
    constructor(style) {
        this.style = style;

        this.setSymbolGenerator();

        this.setup();
    }

    // picking which letters do you want, from multiple symbols list
    setSymbolGenerator() {
        if (!this.style) {
            this.symbolGenerator = SYMBOLS.katakana
        } else if (this.style == 'random') {
            let keys = Object.keys(SYMBOLS)
            let choice = keys[Math.floor(Math.random() * keys.length)]

            this.symbolGenerator = SYMBOLS[choice]
        } else {
            this.symbolGenerator = SYMBOLS[this.style]
        }
    }

    updateStyle(style) {
        this.style = style;
        this.setSymbolGenerator();

        this.symbols = this.getSymbols();
    }

    
    getSymbols() {
        let randomNumbers = Array.from(
            { length: this.nSymbols },
            () => this.symbolGenerator.getRandom()
        )

        return String.fromCharCode(...randomNumbers)
    }

    setup(color) {
        this.mutability = 3 * Math.random();

        this.symbolSize = Math.floor(random(6, 25));
        this.nSymbols = 5 + Math.floor(30 * Math.random());
        this.symbols = this.getSymbols();

        this.x = Math.floor((w - this.symbolSize) * Math.random());
        this.y = 0

        // this.y = Math.floor(h / 3 * Math.random())
        this.yStart = this.y;
        this.renderStart = 0;

        // this.speed = .1 + .2 * Math.random()
        this.speed = map(this.symbolSize, 6, 25, 0.1, 0.5);

        this.yCutoff = h; // this.yCutoff = h - h / 3 * Math.random()
        
        // 
        this.glitchInterval = setInterval(this.glitch.bind(this), 100 + 100 * Math.random());
        this.glitchy = Math.random() > .9;
        
        this.color = color || theme.a;
    }

    update() {
        this.y += this.speed * deltaTime; // get next position with speed*time

        if(this.y > this.yCutoff) { // When the symbol passed the cutoff at the bottom
            if(this.renderStart < this.nSymbols) {
                this.y -= this.symbolSize;
                this.renderStart += 1;
            } else {
                clearInterval(this.glitchInterval);

                this.setup(this.color);
            }
        }
    }

    glitch() {
        let toGlitch = Array.from(
            { length: Math.floor(this.mutability * Math.random()) },
            () => Math.floor(this.nSymbols * Math.random())
        )
        
        //always glitch 0
        this.symbols = this.symbols.replaceAt(0, this.symbolGenerator.getRandomSymbol()) 

        for(let idx of toGlitch) {
            this.symbols = this.symbols.replaceAt(idx, this.symbolGenerator.getRandomSymbol())
        }
    }

    getColor(i) {
        let c

        if(theme.name == 'dark') {
            c = color(
                this.color._getHue(),
                i / this.nSymbols * 100,
                100
            )
        } else {
            c = color(
                this.color._getHue(),
                100,
                i / this.nSymbols * 100
            )
        }

        return c
        // let s = map(i, 0 , this.nSymbols, themeSaturation, theme.bg._getSaturation())
        // let b = map(i, 0 , this.nSymbols, themeBrightness, theme.bg._getBrightness())
    }

    show() {
        textSize(this.symbolSize);
        textAlign(CENTER);
        
        if(this.glitchy) {
            push();

            drawingContext.shadowBlur = 4;
            drawingContext.shadowOffsetY = 3;
            drawingContext.shadowColor = '#ff14c0';
        }

        // + 1 to 'buffer' next character, else it's pretty glitchy
        let _toRender = (this.y + (this.renderStart * this.symbolSize) - this.yStart) / this.symbolSize + 1;
        for(let i = this.renderStart; i < _toRender; i++) {
            let _y = this.y - (i - this.renderStart) * this.symbolSize;
            let _symbol = this.symbols[i];

            let c = this.getColor(i);

            // drawingContext.shadowColor = c
            // stroke(c)
            // noStroke();
            fill(c);
            text(_symbol, this.x, _y, this.symbolSize);
        }

        if(this.glitchy) {
            pop();
        }
    }
}

class DigitalRain {
    constructor({kind, nStreams, color} = {}) {
        this.kind = kind || 'katakana';
        this.nStreams = nStreams || 2;
        this.Color = color || "black";
     }

    setup() {
        colorMode(HSB);

        // this.rs = Array.from({ length: 15 }, () => new Rain('katakana'))

        // to avoid a torrent start
        this.rs = [];
        let i = 0;
        let intervalId = setInterval(() => {
            this.rs.push(new Rain(this.kind));
            if(++i == this.nStreams) window.clearInterval(intervalId);
        }, 200);
        
        noStroke(); 
    }

    draw() {
        background(theme.bg);

        for (let r of this.rs) {
            r.update();
            r.show();
        }
    }

    updateTheme() { }

    mouseClicked(e) { }

    mouseWheel(e) { }
}

const SYMBOLS = {
    'greek': new Symbols(913, 969, [930]),
    'hebrew': new Symbols(1488, 1514, []),
    'arabic': new Symbols(1567, 1610, []),
    'thaana': new Symbols(1920, 1968, []),
    'tibetan': new Symbols(3840, 3863, []),
    'hangul': new Symbols(4352, 4441, []),
    'runic': new Symbols(5792, 5872, []),
    'math': new Symbols(8704, 8945, []),
    'chess': new Symbols(9812, 9817, []),
    'braile': new Symbols(10240, 10495, []),
    'hiragana': new Symbols(12353, 12436, []),
    'katakana': new Symbols(12449, 12538, []),
}