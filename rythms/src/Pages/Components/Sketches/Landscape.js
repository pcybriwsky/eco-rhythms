import { InkLine } from "../Functions/InkLine";
import { Poly } from "../Functions/Watercolor";
import { dataURLtoFile, shareFile } from "../Functions/filesharing";
import * as magic from "@indistinguishable-from-magic/nexus-js"


// To access, call magic.connect() and then magic.disconnect() to open and close the device connection

let ellipseSizeStart = 40;
let sizeInc = ellipseSizeStart / 5;
let thickness = 5;

let gap;
let y_start;

let palettes = [
  ["#0A0A0A", "#00F0FF", "#FF00AB", "#0DFF00", "#9400ff"],
];

let paletteNum,
  color1,
  color2,
  color3,
  colorBG,
  density,
  ringSize,
  showFill,
  shift,
  shiftInc,
  buffer,
  leeway,
  inframe,
  height,
  width;

let multiply = 1;
let weatherData = null;



const myP5Sketch = (p) => {
  p.preload = async () => {
    p.font = p.loadFont("RobotoMono-Regular.ttf")
  }

  p.setup = async () => {
    p.textFont(p.font);
    p.pixelDensity(2);
    p.createCanvas(window.innerWidth, window.innerHeight);
  }

  let inc = 10;
  let drawing = null;
  let lineHeight = 30;
  let fontSize = lineHeight * 0.8;
  let maxLines = 5;
  let currentLine = "";
  let lines = [];
  let frameCounter = 0;
  let typingSpeed = 2;
  let typingWidth = 0;
  let targetLine = ""; // The line that is being typed
  let targetIndex = 0;
  let wait = 80 // Index to track which character to type next
  let waitTime = wait; // Time to wait after a line is completed
  let waiting = false; // Indicates if we are currently waiting
  let valueIndex = 0;

  p.draw = () => {
    typingWidth = p.width / 10;
    if (isMagic && magic.modules.light != null && magic.modules.light != undefined) {
      p.background(0);
      p.fill(255);
      p.handleTypeFeed();

      // Can maybe have a second one that is a little more abstract with status updates in the top right, 

      let light = magic.modules.light.raw.brightness; // Range is 0-4095
      let humidity = magic.modules.environment.raw.humidity; // Range is 0-90
      let pressure = magic.modules.environment.raw.pressure; // Range is 300 hPa to 1100 hPa
      let iaq = magic.modules.environment.raw.iaq; // Range is 0-500
      let temperature = magic.modules.environment.raw.temperature; // Range is -40 to 85 degrees C
      let co2 = magic.modules.environment.raw.co2; // Ask Lance 

      // Want particles in a rectangular shape

      // As the shapes expand, the particles should expand as well
      // Humidity should affect the size of the particles
      // Pressure should affect the speed of the particles
      // IAQ should affect the noise overlay of the particles 
      // Temperature should affect the color of the particles
      // CO2 should affect the XX of the particles
      // The end result is each day should have a unique

      // need a seperate color determinant function based on temp
      // Do we want to use light as the glow? More light, more glow around the edges? Light and shadow if really dark?
      // Background can be by day? Or could be in 3D space? Or not at all?
      // Pressure can determine...
      // IAQ can determine a smooth gradient over the top, would be the same as the background color.
      // Humidity determines bleed toward the center and toward the edges
      // Temperature determines the color of the particles on a spectrum
      // I believe this could be better with a dark background and darker colors

      // drawing.animateLine(width / 2, height / 2, width, height, (p.frameCount - 1) * inc, p.frameCount * inc, p);

    }
  }


  p.handleTypeFeed = () => {
    p.typeUpdates();
    if (!waiting && lines.length < maxLines) {
      if (valueIndex === 0) { // can add more stuff here
        p.newLine("Brightness: " + magic.modules.light.brightness);
      }
      else if (valueIndex === 1) {
        p.newLine("Humidity: " + magic.modules.environment.raw.humidity);
      }
      else if (valueIndex === 2) {
        p.newLine("Pressure: " + magic.modules.environment.raw.pressure);
      }
      else if (valueIndex === 3) {
        p.newLine("IAQ: " + magic.modules.environment.raw.iaq);
      }
      else if (valueIndex === 4) {
        p.newLine("Temperature: " + magic.modules.environment.raw.temperature + " °C");
      }
      else if (valueIndex === 5) {
        p.newLine("CO2: " + magic.modules.environment.raw.co2);
      }
      valueIndex++;
      if (valueIndex > 5) {
        valueIndex = 0;
      }
      waiting = true;

    }
  }

  p.typeUpdates = () => {
    for (let i = 0; i < lines.length; i++) {
      p.text(lines[i], 10, (i + 1) * lineHeight);
    }

    if (frameCounter === typingSpeed) {
      p.addCharacter();
      frameCounter = 0; // Reset frame counter
    } else {
      frameCounter++;
    }

    p.text(currentLine, 10, lines.length * lineHeight + lineHeight);
  }

  p.addCharacter = () => {
    if (targetIndex < targetLine.length) {
      currentLine += targetLine.charAt(targetIndex);
      targetIndex++;
    }

    // Check if the current line typing is complete
    if (currentLine.length === targetLine.length) {
      waiting = true;
      waitTime--;
      if (waitTime <= 0) {
        lines.push(currentLine); // Add current line to lines array
        if (lines.length >= maxLines) {
          lines.shift(); // Remove the oldest line
        }
        // Reset for the next line
        currentLine = "";
        targetLine = "";
        targetIndex = 0;
        waiting = false;
        waitTime = wait;
      }
    }
  }

  // Call this function to start typing a new line
  p.newLine = (newLine) => {
    if (!waiting && currentLine === "") {
      targetLine = newLine;
      targetIndex = 0;
    }
  }






  let isMagic = false
  p.mousePressed = async () => {
    if (!isMagic) {
      magic.connect();
      console.log(magic.modules);
      isMagic = true;
    }
    else {
      magic.disconnect();
      isMagic = false;
    }
    // need to add a disconnect button as well

  };

  p.windowResized = () => {
    if (window.innerWidth < 768) {
      p.resizeCanvas(960 / 2, 640 / 2);
      ellipseSizeStart = 20;
      sizeInc = ellipseSizeStart / 4;
      multiply = 0.5;
    }
    else {
      p.resizeCanvas(960 * 0.8, 640 * 0.8);
      ellipseSizeStart = 40 * 0.8;
      sizeInc = ellipseSizeStart / 4;
      multiply = 0.8;
    }
    height = p.height;
    width = p.width;
    buffer = width / 8;
    y_start = (10 * height) / 10 - buffer;
    inframe = buffer / 2;
    gap = p.random(12, 40);
    p.loop();

  };
};

export default myP5Sketch;
