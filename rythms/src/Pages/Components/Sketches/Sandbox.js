import { InkLine } from "../Functions/InkLine";
import { Poly } from "../Functions/Watercolor";
import { dataURLtoFile, shareFile } from "../Functions/filesharing";
import * as magic from "@indistinguishable-from-magic/nexus-js"



const myP5Sketch = (p) => {
  p.preload = async () => {
    p.font = p.loadFont("RobotoMono-Regular.ttf")
    p.emoji = p.loadFont("NotoEmoji-Regular.ttf")
  }

  let lightSlider, humiditySlider, pressureSlider, iaqSlider, temperatureSlider, co2Slider;
  let lightSliderVal, humiditySliderVal, pressureSliderVal, iaqSliderVal, temperatureSliderVal, co2SliderVal;

  let lightMulti, humidityMulti, pressureMulti, iaqMulti, temperatureMulti, co2Multi;

  let initialization = new Date().getTime()

  let currentObject = {
    light: 0,
    humidity: 0,
    pressure: 0,
    iaq: 0,
    temperature: 0,
    co2: 0,
  }

  let dayObject = {
    light: 0,
    humidity: 0,
    pressure: 0,
    iaq: 0,
    temperature: 0,
    co2: 0,
  }

  let allTimeObject = {
    light: 0,
    humidity: 0,
    pressure: 0,
    iaq: 0,
    temperature: 0,
    co2: 0,
  }


  p.setup = async () => {
    p.textFont(p.font);
    p.pixelDensity(1);
    p.frameRate(10);
    p.createCanvas(window.innerWidth, window.innerHeight);
    lineHeight = 30 * p.height / 1900;
    fontSize = lineHeight * 0.6
    emojiSize = fontSize * 0.8;
    kMax = p.random(0.6, 1.0);
    step = 0.01;
    lightSlider = p.createSlider(0, 4095, 2000);
    humiditySlider = p.createSlider(0, 90, 45);
    pressureSlider = p.createSlider(980, 1050, 1015);
    iaqSlider = p.createSlider(0, 500, 250);
    temperatureSlider = p.createSlider(-10, 40, 15);
    co2Slider = p.createSlider(200, 1500, 550);

    lightSlider.position(10, lineHeight);
    humiditySlider.position(10, 2 * lineHeight);
    pressureSlider.position(10, 3 * lineHeight);
    iaqSlider.position(10, 4 * lineHeight);
    temperatureSlider.position(10, 5 * lineHeight);
    co2Slider.position(10, 6 * lineHeight);

    lightSliderVal = lightSlider.value(); // Range is 0-4095
    humiditySliderVal = humiditySlider.value(); // Range is 0-90
    pressureSliderVal = pressureSlider.value(); // Range is 300 hPa to 1100 hPa
    iaqSliderVal = iaqSlider.value(); // Range is 0-500
    temperatureSliderVal = temperatureSlider.value(); // Range is -40 to 85 degrees C
    co2SliderVal = co2Slider.value(); // Ask Lance
    typingWidth = p.width / 10;

    dayObject.light = p.random(0, 4095);
    dayObject.humidity = p.random(0, 90);
    dayObject.pressure = p.random(980, 1050);
    dayObject.iaq = p.random(0, 500);
    dayObject.temperature = p.random(-10, 38);
    dayObject.co2 = p.random(200, 1500);

    allTimeObject.light = p.random(0, 4095);
    allTimeObject.humidity = p.random(0, 90);
    allTimeObject.pressure = p.random(980, 1050);
    allTimeObject.iaq = p.random(0, 500);
    allTimeObject.temperature = p.random(-10, 38);
    allTimeObject.co2 = p.random(200, 1500)


  }





  let lineHeight = 30;
  let fontSize = lineHeight * 0.8
  let emojiSize = fontSize * 0.8;
  let maxLines = 6;
  let currentLine = "";
  let lines = [];
  let frameCounter = 0;
  let typingSpeed = 1;
  let typingWidth = 0;
  let targetLine = ""; // The line that is being typed
  let targetIndex = 0;
  let wait = 25 // Index to track which character to type next
  let waitTime = wait; // Time to wait after a line is completed
  let waiting = false; // Indicates if we are currently waiting
  let valueIndex = 0;
  let padding = 300;

  let showAboutInfo = false;

  p.showAbout = () => {
    showAboutInfo = true;
  }



  p.draw = () => {
    // live version -- will need to remove sliders and everything 


    lightSlider.show();
    humiditySlider.show();
    pressureSlider.show();
    iaqSlider.show();
    temperatureSlider.show();
    co2Slider.show();

    let light = lightSlider.value(); // Range is 0-4095
    let humidity = humiditySlider.value(); // Range is 0-90
    let pressure = pressureSlider.value(); // Range is 300 hPa to 1100 hPa
    let iaq = iaqSlider.value(); // Range is 0-500
    let temperature = temperatureSlider.value(); // Range is -40 to 85 degrees C
    let co2 = co2Slider.value(); // Ask Lance

    p.blendMode(p.BLEND)
    p.fill(255);
    p.stroke(255);

    currentObject.light = light;
    currentObject.humidity = humidity;
    currentObject.pressure = pressure;
    currentObject.iaq = iaq;
    currentObject.temperature = temperature;
    currentObject.co2 = co2;


    let timeSinceInitialization = new Date().getTime() / 1000 - initialization / 1000;
    // let multi = Math.max(1 / (timeSinceInitialization * 10), 1 / (86400 * 10));
    let multi = 1 / (86400 * 10) * 5000;
    dayObject.light = light * multi + dayObject.light * (1 - multi);
    dayObject.humidity = humidity * multi + dayObject.humidity * (1 - multi);
    dayObject.pressure = pressure * multi + dayObject.pressure * (1 - multi);
    dayObject.iaq = iaq * multi + dayObject.iaq * (1 - multi);
    dayObject.temperature = temperature * multi + dayObject.temperature * (1 - multi);
    dayObject.co2 = co2 * multi + dayObject.co2 * (1 - multi);

    // multi = 1 / (timeSinceInitialization * 10)
    multi = 1 / (86400 * 10 * 365) * 5000
    allTimeObject.light = light * multi + allTimeObject.light * (1 - multi);
    allTimeObject.humidity = humidity * multi + allTimeObject.humidity * (1 - multi);
    allTimeObject.pressure = pressure * multi + allTimeObject.pressure * (1 - multi);
    allTimeObject.iaq = iaq * multi + allTimeObject.iaq * (1 - multi);
    allTimeObject.temperature = temperature * multi + allTimeObject.temperature * (1 - multi);
    allTimeObject.co2 = co2 * multi + allTimeObject.co2 * (1 - multi);


    p.angleMode(p.DEGREES);
    p.noFill();
    p.noStroke();
    p.blendMode(p.BLEND);
    p.background(0);

    if (!isMagic) {
      p.textAlign(p.LEFT, p.CENTER);
      p.fill(255);
      p.textSize(fontSize);
      p.text("Light", lightSlider.x * 2 + lightSlider.width, 1.25 * lineHeight);
      p.text("Humidity", humiditySlider.x * 2 + humiditySlider.width, 2.25 * lineHeight);
      p.text("Pressure", pressureSlider.x * 2 + pressureSlider.width, 3.25 * lineHeight);
      p.text("IAQ", iaqSlider.x * 2 + iaqSlider.width, 4.25 * lineHeight);
      p.text("Temperature", temperatureSlider.x * 2 + temperatureSlider.width, 5.25 * lineHeight);
      p.text("CO2", co2Slider.x * 2 + co2Slider.width, 6.25 * lineHeight);
      p.textSize(20);
      p.text("Demo Version", 10, 7.25 * lineHeight);
      p.textSize(fontSize * 0.8);
      p.text("Use sliders to change Current output", 10, 8.25 * lineHeight);
      p.text("'24 Hours' and 'Since Initialization' stats are randomized on load", 10, 9.25 * lineHeight);
      p.text("Current conditions impact on long-term nebulae are accelerated 5000x compared to real-time data stream", 10, 10.25 * lineHeight);
    }
    p.textSize(fontSize);
    p.fill(255);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.handleTypeFeed();
    p.blendMode(p.LIGHTEST);

    p.textAlign(p.LEFT);
    let center = 2 * p.height / 8;
    p.textSize(fontSize);
    p.fill(255);
    let t = p.frameCount / 150
    p.drawNebula(currentObject.light, currentObject.temperature, currentObject.humidity, currentObject.pressure, currentObject.iaq, currentObject.co2, t, center)
    p.fill(255);
    center = 4 * p.height / 8;
    p.drawNebula(dayObject.light, dayObject.temperature, dayObject.humidity, dayObject.pressure, dayObject.iaq, dayObject.co2, t, center)

    p.fill(255);
    center = 6 * p.height / 8;


    p.drawNebula(allTimeObject.light, allTimeObject.temperature, allTimeObject.humidity, allTimeObject.pressure, allTimeObject.iaq, allTimeObject.co2, t, center)
    p.graphNebula();

    p.textAlign(p.RIGHT, p.BOTTOM);
    p.textSize(fontSize);
    p.fill(255);
    let initializationDate = new Date(initialization);
    p.text("Initialized: " + initializationDate.toLocaleString(), p.width - 25, p.height - lineHeight);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(fontSize * 1.5);
    p.textFont(p.emoji)
    p.fill(255);
    p.text("ℹ", p.width - 50, 50);
    p.textFont(p.font)

    if (showAboutInfo) {
      p.clear();
      p.background(0)
      lightSlider.hide()
      humiditySlider.hide()
      pressureSlider.hide()
      co2Slider.hide()
      iaqSlider.hide()
      temperatureSlider.hide()

      p.textFont(p.font);
      p.textSize(fontSize*2);
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Nebulae", p.width / 2, p.height / 8);
      p.textSize(fontSize*1);
      p.text("A generative and data art piece by Pete Cybriwsky", p.width / 2, p.height / 8 + lineHeight*2);
      p.textSize(fontSize);
      p.textAlign(p.CENTER, p.CENTER);
      let textPadding = 60;
      p.text("This is a demo version of a real-time generative and data art piece to be placed in Charlottesville, VA. The purpose of the piece is to highlight 'nebulous' changes in the environment over the course of its existence through a series of moving rings that resemble nebulae.", textPadding, 2 * p.height / 8, p.width - 2 * textPadding);
      p.text("The piece will be connected to a sensor that measures the environment around it, including light, humidity, pressure, IAQ, temperature, and CO2 levels. It will simultaneously display the current conditions, as well as the conditions over the last 24 hours and since initialization.", textPadding, 2 * p.height / 8 + lineHeight*4,  p.width - 2 * textPadding);
      p.text("The piece will be made of a series of rings that will change color and size based on the current conditions. The rings will be made of a series of points that will be connected by a curve.", textPadding, 2 * p.height / 8 + lineHeight*8,  p.width - 2 * textPadding);
      p.text("Certain conditions (temperature + pressure) are mapped to a range that is specific to Charlottesvilles 2023 highs and lows to create a relevant range in outputs for this project. More information on how each impact the piece can be found below.", textPadding, 2 * p.height / 8 + lineHeight*12,  p.width - 2 * textPadding);


      p.textFont(p.emoji);
      p.textSize(emojiSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("🔅", p.width / 2, 4 * p.height / 8);
      p.textFont(p.font);
      p.textSize(fontSize);
      p.text("Light", p.width / 2, 4 * p.height / 8 + lineHeight);
      p.text("The thickness of the rings and the brightness of the piece is determined by the light sensor. The light sensor measures the amount of light in lux, values ranging from 0 - 4095.", textPadding, 4 * p.height / 8 + lineHeight*2,  p.width - 2 * textPadding);

      p.textFont(p.emoji);
      p.textSize(emojiSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("💧", p.width / 2, 4.5 * p.height / 8);
      p.textFont(p.font);
      p.textSize(fontSize);
      p.text("Humidity", p.width / 2, 4.5 * p.height / 8 + lineHeight);
      p.text("The humidity impacts the smoothness of the rings, rounding them out as it get's more humid. Values ranging from 0 - 90 %.", textPadding, 4.5 * p.height / 8 + lineHeight*2,  p.width - 2 * textPadding);
      p.textFont(p.emoji);
      p.textSize(emojiSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("🔳", p.width / 2, 5 * p.height / 8);
      p.textFont(p.font);
      p.textSize(fontSize);
      p.text("Pressure", p.width / 2, 5 * p.height / 8 + lineHeight);
      p.text("The pressure determines how confined the rings are, with higher pressure condesing the piece. Values ranging from 980 - 1050 hPa.", textPadding, 5 * p.height / 8 + lineHeight*2,  p.width - 2 * textPadding);

      p.textFont(p.emoji);
      p.textSize(emojiSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("💨", p.width / 2, 5.5 * p.height / 8);
      p.textFont(p.font);
      p.textSize(fontSize);
      p.text("IAQ", p.width / 2, 5.5 * p.height / 8 + lineHeight);
      p.text("The IAQ impacts the texture of the rings, with higher IAQ adding more noise and texture. Values ranging from 0 - 500 ppm.", textPadding, 5.5 * p.height / 8 + lineHeight*2,  p.width - 2 * textPadding);

      p.textFont(p.emoji);
      p.textSize(emojiSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("🌡️", p.width / 2, 6 * p.height / 8);
      p.textFont(p.font);
      p.textSize(fontSize);
      p.text("Temperature", p.width / 2, 6 * p.height / 8 + lineHeight);
      p.text("The temperature impacts the color of the rings, with warmer temperatures creating more red colors and colder temperatures creating more blue. Values ranging from 14 - 104 °F.", textPadding, 6 * p.height / 8 + lineHeight*2,  p.width - 2 * textPadding);

      p.textFont(p.emoji);
      p.textSize(emojiSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("🌱", p.width / 2, 6.5 * p.height / 8);
      p.textFont(p.font);
      p.textSize(fontSize);
      p.text("CO2", p.width / 2, 6.5 * p.height / 8 + lineHeight);
      p.text("The CO2 impacts the hole of the rings, with higher CO2 values creating a larger hole. Values ranging from 200 - 1500 ppm.", textPadding, 6.5 * p.height / 8 + lineHeight*2,  p.width - 2 * textPadding);
    }

  }



  p.drawNebula = (light, temp, humidity, pressure, iaq, co2, t, center) => {
    let tempMulti = p.map(temp, -10, 38, 0, 1);
    let pressureMulti = p.map(pressure, 980, 1050, 0, 1, true); // p
    let lightMulti = p.map(light, 0, 4095, 0, 1, true);
    let co2Multi = p.map(co2, 200, 1500, 0, 1, true);
    let iaqMulti = p.map(iaq, 0, 500, 0.1, 1, true);
    let humidityMulti = p.map(humidity, 0, 80, 0, 1, true);

    let angleStep = Math.floor(60 * (2.1 - 2 * (humidityMulti)))
    let min = 0 + (n / 2) * (co2Multi);

    for (let i = n; i >= min; i -= 1) {
      let alpha = p.pow(1 - ((i) / n), 3 - 2 * (lightMulti));
      let size = (radius + i * inter) * ((1 - co2Multi) + 0.1);
      let k = kMax * p.sqrt((i * (iaqMulti + 0.1)) / n)
      let noisiness = maxNoise * (i / n) * (1.6 - 1.5*pressureMulti);
      p.strokeWeight(1 + tempMulti + 2 * lightMulti + (i / n) * 5);
      p.stroke(255, 0, 0, alpha * 255);
      p.lightRing((size * tempMulti), p.width / 2, center, k, t - i * step, noisiness, angleStep);

      p.stroke(0, 255, 0, alpha * 255);
      p.lightRing(size / 8, p.width / 2, center, k, t - i * step + 0.2, noisiness, angleStep);

      p.strokeWeight(1 + (1 - tempMulti) + 2 * lightMulti + (i / n) * 5);
      p.stroke(0, 0, 255, alpha * 255);
      p.lightRing(size * (1 - tempMulti), p.width / 2, center, k, t - i * step + 0.4, noisiness, angleStep);
    }
    p.noStroke()
  }

  p.graphNebula = () => {
    let center = 2 * p.height / 8 - 60
    p.textSize(fontSize);
    p.fill(255);

    p.textAlign(p.LEFT, p.CENTER);
    p.textFont(p.font);
    p.text("Current", 25, center);
    p.textAlign(p.LEFT, p.TOP);

    let currentLightConversion = p.map(((currentObject.light * (3.3 / 4095)) / 10000) * 1000000, 0, ((4095 * (3.3 / 4095)) / 10000) * 1000000, 0, 950);

    let lightLength = p.map(currentLightConversion, 0, 950, 0, p.width / 10, true);
    let humidityLength = p.map(currentObject.humidity, 0, 90, 0, p.width / 10, true);
    let pressureLength = p.map(currentObject.pressure, 980, 1050, 0, p.width / 10, true);
    let iaqLength = p.map(currentObject.iaq, 0, 500, 0, p.width / 10, true);
    let temperatureLength = p.map(currentObject.temperature, -10, 38, 0, p.width / 10, true);
    let co2Length = p.map(currentObject.co2, 200, 1500, 0, p.width / 10, true);

    p.textFont(p.emoji)
    p.textSize(emojiSize);
    p.text("🔅", 25, center + 20);
    p.text("💧", 25, center + 40);
    p.text("🔳", 25, center + 60);
    p.text("💨", 25, center + 80);
    p.text("🌡️", 25, center + 100);
    p.text("🌱", 25, center + 120);

    p.rect(50, center + 20, lightLength, 10);
    p.rect(50, center + 40, humidityLength, 10);
    p.rect(50, center + 60, pressureLength, 10);
    p.rect(50, center + 80, iaqLength, 10);
    p.rect(50, center + 100, temperatureLength, 10);
    p.rect(50, center + 120, co2Length, 10);

    let dayCenter = 4 * p.height / 8 - 60;
    p.textFont(p.font);
    p.textSize(fontSize);

    p.textAlign(p.LEFT, p.CENTER);

    p.text("Last 24 Hours", 25, dayCenter);
    let dayLightConversion = p.map(((dayObject.light * (3.3 / 4095)) / 10000) * 1000000, 0, ((4095 * (3.3 / 4095)) / 10000) * 1000000, 0, 950);

    let dayLightLength = p.map(dayLightConversion, 0, 950, 0, p.width / 10, true);
    let dayHumidityLength = p.map(dayObject.humidity, 0, 90, 0, p.width / 10, true);
    let dayPressureLength = p.map(dayObject.pressure, 980, 1050, 0, p.width / 10, true);
    let dayIaqLength = p.map(dayObject.iaq, 0, 500, 0, p.width / 10, true);
    let dayTemperatureLength = p.map(dayObject.temperature, -10, 38, 0, p.width / 10, true);
    let dayCo2Length = p.map(dayObject.co2, 200, 1500, 0, p.width / 10, true);

    p.textAlign(p.LEFT, p.TOP);

    p.textFont(p.emoji)
    p.textSize(emojiSize);
    p.text("🔅", 25, dayCenter + 20);
    p.text("💧", 25, dayCenter + 40);
    p.text("🔳", 25, dayCenter + 60);
    p.text("💨", 25, dayCenter + 80);
    p.text("🌡️", 25, dayCenter + 100);
    p.text("🌱", 25, dayCenter + 120);

    p.rect(50, dayCenter + 20, dayLightLength, 10);
    p.rect(50, dayCenter + 40, dayHumidityLength, 10);
    p.rect(50, dayCenter + 60, dayPressureLength, 10);
    p.rect(50, dayCenter + 80, dayIaqLength, 10);
    p.rect(50, dayCenter + 100, dayTemperatureLength, 10);
    p.rect(50, dayCenter + 120, dayCo2Length, 10);

    let allTimeCenter = 6 * p.height / 8 - 60;
    p.textAlign(p.LEFT, p.CENTER);
    p.textFont(p.font);
    p.textSize(fontSize);
    p.text("Since Initialized", 25, allTimeCenter);
    let allTimeLightConversion = p.map(((allTimeObject.light * (3.3 / 4095)) / 10000) * 1000000, 0, ((4095 * (3.3 / 4095)) / 10000) * 1000000, 0, 950);

    let allTimeLightLength = p.map(allTimeLightConversion, 0, 950, 0, p.width / 10, true);
    let allTimeHumidityLength = p.map(allTimeObject.humidity, 0, 90, 0, p.width / 10, true);
    let allTimePressureLength = p.map(allTimeObject.pressure, 980, 1050, 0, p.width / 10, true);
    let allTimeIaqLength = p.map(allTimeObject.iaq, 0, 500, 0, p.width / 10, true);
    let allTimeTemperatureLength = p.map(allTimeObject.temperature, -10, 38, 0, p.width / 10, true);
    let allTimeCo2Length = p.map(allTimeObject.co2, 200, 1500, 0, p.width / 10);

    p.textAlign(p.LEFT, p.TOP);

    p.textFont(p.emoji)
    p.textSize(emojiSize);
    p.text("🔅", 25, allTimeCenter + 20);
    p.text("💧", 25, allTimeCenter + 40);
    p.text("🔳", 25, allTimeCenter + 60);
    p.text("💨", 25, allTimeCenter + 80);
    p.text("🌡️", 25, allTimeCenter + 100);
    p.text("🌱", 25, allTimeCenter + 120);

    p.rect(50, allTimeCenter + 20, allTimeLightLength, 10);
    p.rect(50, allTimeCenter + 40, allTimeHumidityLength, 10);
    p.rect(50, allTimeCenter + 60, allTimePressureLength, 10);
    p.rect(50, allTimeCenter + 80, allTimeIaqLength, 10);
    p.rect(50, allTimeCenter + 100, allTimeTemperatureLength, 10);
    p.rect(50, allTimeCenter + 120, allTimeCo2Length, 10);


    p.textAlign(p.LEFT, p.CENTER);
    p.textFont(p.font);

  }


  let lineEmoji = [];
  p.handleTypeFeed = () => {
    p.typeUpdates();
    if (!waiting && lines.length < maxLines) {
      if (valueIndex === 0) { // can add more stuff here
        lineEmoji.push("🔅");
        p.newLine("Brightness: " + currentObject.light.toFixed(2) + " lux");
      }
      else if (valueIndex === 1) {
        lineEmoji.push("💧");
        p.newLine("Humidity: " + currentObject.humidity.toFixed(2) + " %");
      }
      else if (valueIndex === 2) {
        lineEmoji.push("🔳");
        p.newLine("Pressure: " + currentObject.pressure.toFixed(2) + " hPa");
      }
      else if (valueIndex === 3) {
        lineEmoji.push("💨");
        p.newLine("IAQ: " + currentObject.iaq.toFixed(2) + " ppm");
      }
      else if (valueIndex === 4) {
        lineEmoji.push("🌡️");
        p.newLine("Temperature: " + (currentObject.temperature * 1.8 + 32).toFixed(2) + " °F");
      }
      else if (valueIndex === 5) {
        lineEmoji.push("🌱");
        p.newLine("CO2: " + currentObject.co2.toFixed(2) + " ppm");
      }
      valueIndex++;
      if (valueIndex > 5) {
        valueIndex = 0;
        if (lineEmoji.length > 6) {
          lineEmoji.shift()
        }
      }
      waiting = true;
    }
  }
  let kMax;
  let step;
  let n = 40; // number of blobs
  let radius = 1; // diameter of the circle
  let inter = 1; // difference between the sizes of two blobs
  let maxNoise = 250;


  // Rename and restructure blob
  p.lightRing = (size, xCenter, yCenter, k, t, noisiness, multi) => {
    p.noFill()
    p.beginShape();
    let inc = 360 / multi;
    for (let ang = 0; ang < 360 + 2 * inc; ang += inc) {
      let r1, r2;
      r1 = p.cos(ang) + 1;
      r2 = p.sin(ang) + 1;
      let r = size + p.noise(k * r2, k * r1, t) * noisiness;
      let x = xCenter + r * p.cos(ang);
      let y = yCenter + r * p.sin(ang);
      p.curveVertex(x, y);
    }
    p.endShape(p.CLOSE);
  }

  p.typeUpdates = () => {
    p.textSize(fontSize);
    p.fill(255)
    let totalUpdates = 7;
    for (let i = lines.length; i >= 0; i--) {
      p.textFont(p.emoji)
      p.textSize(emojiSize);
      p.text(lineEmoji[lineEmoji.length - i - 1], 25, p.height - (((totalUpdates - 1) - i) * lineHeight));

      p.textFont(p.font)
      p.textSize(fontSize);
      p.text(lines[i], 50, p.height - (((totalUpdates - 1) - i - 1) * lineHeight));
    }

    if (frameCounter === typingSpeed) {
      p.addCharacter();
      frameCounter = 0; // Reset frame counter
    } else {
      frameCounter++;
    }

    p.textFont(p.emoji)
    p.textSize(emojiSize);
    p.text(lineEmoji[lineEmoji.length - 1], 25, p.height - lineHeight * (totalUpdates - 1));


    p.textFont(p.font)
    p.textSize(fontSize);
    p.text(currentLine, 50, p.height - lineHeight * (totalUpdates - 1));
    p.text("Status Updates", 25, p.height - lineHeight * (totalUpdates));
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
        lines.unshift(currentLine); // Add current line to lines array
        if (lines.length >= maxLines) {
          lines.pop(); // Remove the oldest line
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

  p.newLine = (newLine) => {
    if (!waiting && currentLine === "") {
      targetLine = newLine;
      targetIndex = 0;
    }
  }

  let isMagic = false

  p.mousePressed = async () => {
    if (p.mouseX > p.width - 100 && p.mouseY < 100 && !showAboutInfo) {
      console.log('info')
      p.showAbout();
      // if (!isMagic) {
      //   magic.connect();
      //   console.log(magic.modules);
      //   isMagic = true;
      // }
      // else {
      //   magic.disconnect();
      //   isMagic = false;
      // }
    }
    else if (showAboutInfo) {
      showAboutInfo = false;
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
};

export default myP5Sketch;
