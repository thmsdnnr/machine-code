/**
 * The 4917 Microprocessor
 *
 * 4 bits of memory per cell, 16 cells of memory
 * Two registers: R0, R1
 * (all initialized to 0 at startup)
 *
 * IP (instruction pointer) & IS (instruction store)
 *
 * OPCODES
 *
 * 1-byte Instructions
 *   0 = Halt
 *   1 = Add (R0 = R0 + R1)
 *   2 = Subtract (R0 = R0 – R1)
 *   3 = Increment R0 (R0 = R0 + 1)
 *   4 = Increment R1 (R1 = R1 + 1)
 *   5 = Decrement R0 (R0 = R0 – 1)
 *   6 = Decrement R1 (R1 = R1 – 1)
 *   7 = Ring Bell
 * 2-byte Instructions, value of the second byte is called <data>
 *   8 = Print <data> (The numerical value of <data> is printed)
 *   9 = Load value at address <data> into R0
 *   10 = Load value at address <data> into R1
 *   11 = Store R0 into address <data>
 *   12 = Store R1 into address <data>
 *   13 = Jump to address <data>
 *   14 = Jump to address <data> if R0 == 0
 *   15 = Jump to address <data> if R0 != 0
 *
 * Lecture 3: Machine Code - Richard Buckland UNSW
 *   https://www.youtube.com/watch?v=gTeDX4yAdyU
 *   https://www.cse.unsw.edu.au/~richardb/
 *   https://andrewharvey4.wordpress.com/2009/03/13/comp2121-wk01/
 *
 */

function beep() {
  // https://stackoverflow.com/a/23395136
  const snd = new Audio(
    "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=",
  );
  snd.play();
}

let OUTPUT_DIV,
  PROGRAM_DIV,
  TIMER_LOOP,
  MAX_MEM = 16,
  el_R0,
  el_R1,
  el_IP,
  el_IS,
  SELECTOR_LIST = [],
  cellSelectors = [];

const updateStateDisplay = ({ R0, R1, IP, IS }) => {
  // Clear existing cells
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("cell-active");
    cell.classList.remove("cell-active-arg");
  });

  el_R0.textContent = R0;
  el_R1.textContent = R1;
  el_IP.textContent = IP;
  el_IS.textContent = IS;

  cellSelectors[IP].classList.add("cell-active");
  if (IS > 7 && IP < MAX_MEM - 1) {
    // it's a two-cell instruction
    cellSelectors[IP + 1].classList.add("cell-active-arg");
  }
};

const fetchExecute = memory => {
  let R0 = 0,
    R1 = 0,
    IP = 0,
    IS = null;

  const executeInstruction = (opcode, arg) => {
    (arg %= 16), (opcode %= 16); // we only have 4 bits!
    switch (opcode) {
      case 1:
        R0 += R1;
        break;
      case 2:
        R0 -= R1;
        break;
      case 3:
        R0++;
        break;
      case 4:
        R1++;
        break;
      case 5:
        R0--;
        break;
      case 6:
        R1--;
        break;
      case 7:
        beep();
        break;
      case 8:
        logIt(arg);
        IP += 2;
        break;
      case 9:
        R0 = arg;
        IP += 2;
        break;
      case 10:
        R1 = arg;
        IP += 2;
        break;
      case 11:
        memory[arg] = R0;
        redrawMemoryAtIdx({idx: arg, newVal: R0});
        IP += 2;
        break;
      case 12:
        memory[arg] = R1;
        redrawMemoryAtIdx({idx: arg, newVal: R1});
        IP += 2;
        break;
      case 13:
        IP = arg;
        break;
      case 14:
        if (R0 == 0) {
          IP = arg;
        } else {
          IP += 2;
        }
        break;
      case 15:
        if (R0 !== 0) {
          IP = arg;
        } else {
          IP += 2;
        }
        break;
      default:
        break;
    }
    (R0 %= 16), (R1 %= 16), (IP %= 16); // we only have 4 bits!
  };

  const userSpecifiedDelay = document.getElementById("msDelay").value;

  function updateLoop() {
    if (IS === 0) {
      clearInterval(TIMER_LOOP);
      return false;
    }
    IS = memory[IP];
    if (IS >> 3) {
      // two byte instruction
      updateStateDisplay({ R0, R1, IP, IS });
      executeInstruction(IS, memory[IP + 1]);
    } else {
      updateStateDisplay({ R0, R1, IP, IS });
      ++IP;
      executeInstruction(IS);
    }
  }
  TIMER_LOOP = setInterval(updateLoop, userSpecifiedDelay || 500);
};

const redrawMemoryAtIdx = ({idx, newVal}) => cellSelectors[idx].innerHTML = newVal;

const drawMemory = memory => {
  memory.forEach((v, idx) => {
    let q = document.createElement("div");
    q.innerHTML = v;
    q.id = "cell_" + idx;
    q.classList.add("cell");
    if (idx === 0) {
      q.classList.add("cell-active");
    }
    PROGRAM_DIV.appendChild(q);
    cellSelectors.push(document.getElementById("cell_" + idx));
  });
};

const loadProgram = program => {
  let memory = new Uint8Array(16);
  memory = memory.map((_, idx) => program[idx] % 16 || 0); // we only have 4 bits!
  drawMemory(memory);
  fetchExecute(memory);
};

const clearIt = () => {
  clearInterval(TIMER_LOOP);
  cellSelectors = [];
  SELECTOR_LIST.forEach(s => (s.innerHTML = null));
};
const logIt = arg => (OUTPUT_DIV.innerHTML += " " + arg);

const initializeListeners = () => {
  el_R0 = document.getElementById("R0");
  el_R1 = document.getElementById("R1");
  el_IP = document.getElementById("IP");
  el_IS = document.getElementById("IS");
  PROGRAM_DIV = document.getElementById("programVisualizer");
  OUTPUT_DIV = document.getElementById("output");
  SELECTOR_LIST = [el_R0, el_R1, el_IP, el_IS, PROGRAM_DIV, OUTPUT_DIV];
};

function start() {
  initializeListeners();
  const runBtn = document.getElementById("run");

  runBtn.addEventListener("click", () => {
    clearIt();
    // fetch program from the input box
    const theProgram = document
      .getElementById("program")
      .value.split(" ")
      .map(i => Number(i)); // every instruction must be a number, not a string
    loadProgram(theProgram);
  });
}

document.addEventListener("DOMContentLoaded", start);
