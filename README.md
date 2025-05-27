# Memory Allocation Visualizer

This project is an interactive **web-based visualizer** for simulating dynamic memory allocation strategies including First Fit, Next Fit, Best Fit, and Worst Fit.

## 🚀 Overview

The system enables users to:

* Define memory blocks and holes
* Submit process requests
* See visual step-by-step allocation
* Compare fragmentation across strategies

Built using **HTML**, **CSS**, and **JavaScript** with utility support from Tailwind CSS, Bootstrap, and Animate.css.

---

## 📁 Files

* `memory allocation.html` – Main HTML file for UI
* `style.css` – Styling for visualization and responsiveness
* `script.js` – JavaScript logic for dynamic form handling and memory allocation animations

---

## 🔧 How to Run

1. Make sure all files (`memory allocation.html`, `style.css`, `script.js`) are in the same folder.
2. Open `memory allocation.html` in any modern browser (Chrome, Firefox, etc).

---

## 💡 Features

### 🧱 Input Configuration

* Add memory blocks with sizes
* Choose block type: memory or hole

### 🧠 Allocation Simulation

* Submit process sizes
* Allocate using First Fit, Next Fit, Best Fit, and Worst Fit
* Visualize block splitting and allocation with color-coded animation

### 📊 Output

* Memory layout before and after allocation
* Summary of external and internal fragmentation
* Tooltip descriptions for each block

---

## 🎨 Technologies Used

* **HTML5/CSS3** for structure and styling
* **JavaScript** for simulation logic and DOM manipulation
* **Tailwind CSS** for utility-first responsive design
* **Bootstrap** for styled components
* **Animate.css** for animation effects

---

## 📘 Legend

| Color     | Meaning |
| --------- | ------- |
| 🔵 Blue   | Memory  |
| 🔴 Red    | Hole    |
| 🟡 Yellow | Process |

