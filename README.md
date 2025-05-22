# Disk Scheduling Visualizer

A web-based interactive tool to visualize disk scheduling algorithms and their seek operations in both 2D and 3D. This project helps users understand how different disk scheduling algorithms work by animating the movement of the disk head and requests.

---

## Features

- Visualize popular disk scheduling algorithms:  
  - SSTF (Shortest Seek Time First)  
  - SCAN  
  - C-SCAN  
  - LOOK

- Input customizable initial head position and disk requests.

- Real-time 3D simulation of disk head movements using Three.js.

- Comparison modal to evaluate different algorithms side-by-side based on total seek time and request sequence length.

- Responsive UI built with Bootstrap 5.

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5  
- **3D Visualization:** Three.js  
- **Charting:** Chart.js for comparisons  
- **Modal & UI Components:** Bootstrap

---

## How to Use

1. Clone or download the repository.  
2. Open `index.html` in any modern browser.  
3. Enter the initial head position and disk requests (comma-separated).  
4. Select a scheduling algorithm from the dropdown.  
5. Click **Simulate** to see the disk head movement and queue processing.  
6. Use the **Show Comparison** button to compare results of different algorithms.

---

## Project Structure

- `index.html` — Main UI and layout  
- `style.css` — Custom styles and animations  
- `simulation3d.js` — Handles 3D rendering and animation with Three.js  
- `script.js` — Application logic for simulation and user interaction

---

## Screenshots

*(Add screenshots here if available)*

---

## License

This project is open source and available under the MIT License.

---

## Acknowledgements

- [Three.js](https://threejs.org/) for 3D rendering  
- [Bootstrap](https://getbootstrap.com/) for UI components  
- [Chart.js](https://www.chartjs.org/) for charts

---

## Contact

For any questions or suggestions, feel free to open an issue or contact me at [your email or GitHub link].

