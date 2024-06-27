const SKETCHES = {
    'Graph': Graph,
    'Digital Rain': DigitalRain,
    'Circles': CirclesBrushStrokes
}

class Meta {
    constructor(name, showHover, sketchOptions) {
        this.name = name;
        this.showHover = showHover;
        this.sketchOptions = sketchOptions;

        this.sketchNames = Object.keys(SKETCHES);

        this.container = document.getElementById('sidebar-sketch');
        this.canvas = createCanvas();

        this.fullScreen = false;

        // FPS stuff
        this.fps = 0, this.fpsInterval = 300, this.fpsDisplay = false;

        setInterval(() => {
            this.fps = frameRate().toFixed(2);
        }, this.fpsInterval);

        this.setup();
    }

    setup() {
        if(this.container === null) {
            noLoop();
            return;
        }

        this.canvas.parent(this.container);
        this.windowResized();

        // drawingContext.reset();
        // we will pop on sketch change!
        push();

        this.sketch = new SKETCHES[this.name](this.sketchOptions);

        this.sketch.setup();
    }
    
    windowResized() {
        loop();
    
        let { width, height } = this.container.getBoundingClientRect();
    
        h = height
        w = width
    
        resizeCanvas(width, height);
    }

    draw() {
        this.sketch.draw();

        if(this.fpsDisplay) {
            push();

            noStroke();
            textAlign(LEFT);
            textSize(16);

            let fpsWidth = textWidth(this.fps)
            fill(theme.bg);
            rect(5, 0, fpsWidth, 16);

            fill(theme.body);
            text(this.fps, 5, 16);

            pop();
        }
    }

    updateTheme() {
        this.sketch.updateTheme();
    }

    mouseClicked(e) {
        this.sketch.mouseClicked(e);
    }

    mouseWheel(e) {
        this.sketch.mouseWheel(e);
    }

}