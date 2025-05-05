const menuStructure = {
  GENERATOR: {
    DEVICE: ["Audio Unit instrument", "Instrument rack", "AN Kick"],
    OSCILLATOR: [
      "Oscillator (mini)", "Wavetable oscillator", "Wave scanner", "Oscillator",
      "Formant oscillator", "Oscillator: Supersaw", "FM operator"
    ],
    SAMPLER: ["Recorder", "Flexi sampler", "Shot sampler", "Sampler"],
    NOISE: ["Noise"],
    OTHER: ["Impulse"]
  },
  PROCESSOR: {
    DEVICE: ["Audio Unit processor", "Processor rack"],
    FILTER: [
      "Analog filter", "Comb filter", "Filter", "Formant filter", "Modal resonator",
      "Peaking EQ", "Spectral filter", "Waveguide"
    ],
    AMP: ["Amp", "Amp env AD", "Amp env AHD", "Amp env ADSR", "Amp env AD mod"],
    "SHAPER / DISTORTION": ["Bit redux", "Decimator", "Fur generator", "Graphic shaper", "Shaper"],
    EFFECT: [
      "BBD resonator", "Buffer osc", "Buffer repeat", "Buffer rescan", "Buffer stop",
      "Channel EQ", "Chorus", "Compressor", "Convolver", "Delay", "Delay FX",
      "Delay rack", "FDN", "Flanger", "Frequency shifter", "Noise gate", "Phaser",
      "Pitch shifter", "Punch-in FX", "Punch-in looper", "Reverb (FDN)",
      "Reverb (Plate)", "Vocoder (FFT)"
    ],
    WAVETABLE: ["Wave effect", "Wave filter", "Wave motion", "Wave spline", "Wave vocoder"]
  },
  MODULATOR: {
    META: ["Morph", "Meta randomizer"],
    LFO: ["Graphic modulator", "LFO", "Mini LFO", "Mini LFO (stereo)", "Wavetable LFO"],
    ENVELOPES: ["Env AD", "Env AD mod", "Env ADSR", "Env Flex", "Graphic env"],
    OTHER: [
      "Gate counter", "Gyroscope", "CC modulator", "MIDI key pressure modulator",
      "Pitch", "Poly knobs", "Ramp", "Random"
    ]
  },
  MIXER: {
    STRUCTURE: [
      "Adder", "Mixer", "Layers", "Layers adder", "Layers switch", "Layers mixer",
      "Layers crossover", "Switch N-1", "Switch 1-N", "X-Fader", "Pan"
    ],
    SIGNAL: [
      "Mono to stereo", "Stereo to mono", "Stereo to L/R", "L/R to stereo",
      "Stereo width", "Poly to mono", "Mono to poly", "Many to poly"
    ]
  },
  MIDI: {
    DEVICE: ["Audio Unit MIDI processor", "MIDI rack"],
    "I/O": ["CC controller", "CC modulator", "MIDI input", "Monitor", "MIDI output", "MIDI to CV"],
    GENERATOR: ["CC generator", "CC generator (multi)", "PC generator", "Sysex generator", "Note generator"],
    PROCESSOR: [
      "Arp", "Channel filter", "Chord", "Euclidean sequencer", "Latch", "Chance", "Delay",
      "Gate", "Humanizer", "MIDI mixer", "MIDI mixer (mutes)", "Note filter", "Quantize",
      "MIDI switch 1-N", "MIDI switch N-1", "MIDI to Poly", "Pitch bend", "Retrig",
      "Sequencer", "Strum", "Strum generator", "Transpose"
    ]
  },
  "MISC / UTILITY": {
    DEVICE: ["Rack"],
    UTILS: [
      "Audio input", "Audio output", "Bernoulli gate", "CV Glide", "CV Quantizer",
      "Envelope follower", "External CV instrument", "Feedback receive", "Feedback send",
      "Gate declicker", "Gate inverter", "Linear freq modulator", "Pitch (oct,semi,fine)",
      "Pitch (ratio)", "Pitch (overtone)", "Pitch detector", "Pulse divider", "S&H",
      "Shift register", "Slew limiter", "Transient detector", "Unison", "Voice number",
      "Voice selector", "Voice selector (cv,gate,vel)"
    ],
    SEQUENCER: [
      "CV sequencer", "Clock generator", "Gate+velocity sequencer", "Retrigger",
      "Stochastic gate generator"
    ],
    TIME: [
      "Counter", "Reset time", "Reverse time", "Scale time", "Shift time",
      "Swing time", "Transport", "Transport time"
    ],
    CONVERSION: ["CV to freq", "Freq to CV"],
    UI: [
      "Buttons", "Gyroscope", "Knob", "Knobs", "Oscilloscope", "Section (foldable)",
      "Slider", "Switch button", "Text box", "Trigger button", "XY pad"
    ],
    LEGACY: ["Integrator (legacy)"]
  },
  MATH: {
    "2 OPS": ["Add", "Divide", "Function", "Maximum", "Minimum", "Multiply", "Subtract"],
    "1 OP": [
      "1/x", "Clip", "Cosinus", "Differentiator", "Exp", "Full rectify", "Half rectify",
      "Integrator", "Invert", "Log", "Number", "Offset", "Quantizer", "Scale",
      "Scale + offset", "Sinus", "Square", "Sqrt", "Square root", "Step", "Tan"
    ],
    "UTILITY": ["Clamp", "DC", "Gaussian", "Remap", "Sine lookup", "Smooth", "Steps"]
  }
};

const mainMenu = document.getElementById("mainMenu");
const subMenu = document.getElementById("subMenu");
const imagePreview = document.getElementById("imagePreview");
const textPreview = document.getElementById("textPreview");

let currentMain = null;
let currentSubItem = null;

function toFolderName(str) {
  return str.toLowerCase().replace(/\s+/g, "_");
}

function buildMainMenu() {
  Object.keys(menuStructure).forEach(mainKey => {
    const btn = document.createElement("button");
    btn.textContent = mainKey.toUpperCase();
    btn.onclick = () => toggleMainMenu(mainKey, btn);
    mainMenu.appendChild(btn);
  });
}

function toggleMainMenu(key, btn) {
  const alreadyOpen = currentMain === key;
  currentMain = alreadyOpen ? null : key;

  Array.from(mainMenu.children).forEach(b => b.classList.remove("active"));
  btn.classList.toggle("active", !alreadyOpen);

  subMenu.innerHTML = "";
  imagePreview.innerHTML = "";
  textPreview.innerHTML = "";
  currentSubItem = null;

  if (!alreadyOpen) {
    const sub = menuStructure[key];
    for (const section in sub) {
      const sectionHeader = document.createElement("div");
      sectionHeader.textContent = section;
      sectionHeader.className = "section-header";
      subMenu.appendChild(sectionHeader);

      sub[section].forEach(item => {
        const itemBtn = document.createElement("button");
        itemBtn.textContent = item;
        itemBtn.onclick = () => {
          currentSubItem = item;
          Array.from(subMenu.querySelectorAll("button")).forEach(b => b.classList.remove("active"));
          itemBtn.classList.add("active");
          showImage(item, key, section);
          loadText(item, key, section);
        };
        subMenu.appendChild(itemBtn);
      });
    }
  }
}

function showImage(itemName, mainKey, sectionKey) {
  const folder = `data/${toFolderName(mainKey)}/${toFolderName(sectionKey)}/`;
  const file = `${toFolderName(itemName)}.webp`;
  const path = folder + file;
  imagePreview.innerHTML = `<img src="${path}" alt="${itemName}" />`;
}

function loadText(itemName, mainKey, sectionKey) {
  const folder = `data/${toFolderName(mainKey)}/${toFolderName(sectionKey)}/`;
  const file = `${toFolderName(itemName)}.html`;
  const path = folder + file;

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error("Not found");
      return response.text();
    })
    .then(html => {
      textPreview.innerHTML = html;
    })
    .catch(() => {
      textPreview.textContent = "Failed to load the text for this module.";
    });
}

window.onload = buildMainMenu;

