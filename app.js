// Initialize variables with initial values
let θ1 = 180 /* initial angle */;
let θ2 = 45 /* initial angle */;
let ω1 = 0 /* initial angular velocity */;
let ω2 = 0 /* initial angular velocity */;
let g = 9.861 /* gravity constant */;
let m1 = 20/* mass 1 */;
let m2 = 50/* mass 2 */;
let L1 = 100/* rod length 1 */;
let L2 = 150/* rod length 2 */;
const pathPoints = [];

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetSimulation);

// Get the slider elements
const mass1Slider = document.getElementById("mass1");
const mass2Slider = document.getElementById("mass2");
const length1Slider = document.getElementById("length1");
const length2Slider = document.getElementById("length2");
const angle1Slider = document.getElementById("angle1");
const angle2Slider = document.getElementById("angle2");
const angularVelocity1Slider = document.getElementById("angularVelocity1");
const angularVelocity2Slider = document.getElementById("angularVelocity2");
const gravityConstantSlider = document.getElementById("gravityConstant");

// Add event listeners to the sliders
mass1Slider.addEventListener("input", updateSimulationParameters);
mass2Slider.addEventListener("input", updateSimulationParameters);
length1Slider.addEventListener("input", updateSimulationParameters);
length2Slider.addEventListener("input", updateSimulationParameters);
angle1Slider.addEventListener("input", updateSimulationParameters);
angle2Slider.addEventListener("input", updateSimulationParameters);
angularVelocity1Slider.addEventListener("input", updateSimulationParameters);
angularVelocity2Slider.addEventListener("input", updateSimulationParameters);
gravityConstantSlider.addEventListener("input", updateSimulationParameters);

// Function to update simulation parameters
function updateSimulationParameters() {
    m1 = parseFloat(mass1Slider.value);
    m2 = parseFloat(mass2Slider.value);
    L1 = parseFloat(length1Slider.value);
    L2 = parseFloat(length2Slider.value);
    θ1 = parseFloat(angle1Slider.value);
    θ2 = parseFloat(angle2Slider.value);
    ω1 = parseFloat(angularVelocity1Slider.value);
    ω2 = parseFloat(angularVelocity2Slider.value);
    g = parseFloat(gravityConstantSlider.value);

    // Reset the simulation to apply the updated parameters
    resetSimulation();
}

// Function to reset the simulation
function resetSimulation() {
    θ1 = 50;
    θ2 = 90;
    ω1 = 0;
    ω2 = 0;
    pathPoints.length = 0; // Clear the pathPoints array

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Call the animation loop to restart the simulation
    requestAnimationFrame(animate);
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas width and height
canvas.width = 1200;
canvas.height = 500;

// Runge-Kutta step function
function rungeKuttaStep(h) {
    // Calculate derivatives using the given equations
    const dθ1 = ω1;
    const dθ2 = ω2;
    const dω1 = (
        -g * (2 * m1 + m2) * Math.sin(θ1) -
        m2 * g * Math.sin(θ1 - 2 * θ2) -
        2 * Math.sin(θ1 - θ2) * m2 * (ω2 * ω2 * L2 + ω1 * ω1 * L1 * Math.cos(θ1 - θ2))
    ) / (L1 * (2 * m1 + m2 - m2 * Math.cos(2 * θ1 - 2 * θ2)));
    const dω2 = (
        2 * Math.sin(θ1 - θ2) * (
            ω1 * ω1 * L1 * (m1 + m2) +
            g * (m1 + m2) * Math.cos(θ1) +
            ω2 * ω2 * L2 * m2 * Math.cos(θ1 - θ2)
        )
    ) / (L2 * (2 * m1 + m2 - m2 * Math.cos(2 * θ1 - 2 * θ2)));

    // Update angles and angular velocities using Runge-Kutta method
    const k1_θ1 = h * dθ1;
    const k1_θ2 = h * dθ2;
    const k1_ω1 = h * dω1;
    const k1_ω2 = h * dω2;

    const k2_θ1 = h * (dθ1 + 0.5 * k1_ω1);
    const k2_θ2 = h * (dθ2 + 0.5 * k1_ω2);
    const k2_ω1 = h * (
        -g * (2 * m1 + m2) * Math.sin(θ1 + 0.5 * k1_θ1) -
        m2 * g * Math.sin(θ1 + 0.5 * k1_θ1 - 2 * (θ2 + 0.5 * k1_θ2)) -
        2 * Math.sin(θ1 + 0.5 * k1_θ1 - (θ2 + 0.5 * k1_θ2)) * m2 * ((ω2 + 0.5 * k1_ω2) * (ω2 + 0.5 * k1_ω2) * L2 + (ω1 + 0.5 * k1_ω1) * (ω1 + 0.5 * k1_ω1) * L1 * Math.cos(θ1 + 0.5 * k1_θ1 - (θ2 + 0.5 * k1_θ2)))
    ) / (L1 * (2 * m1 + m2 - m2 * Math.cos(2 * (θ1 + 0.5 * k1_θ1) - 2 * (θ2 + 0.5 * k1_θ2))));
    const k2_ω2 = h * (
        2 * Math.sin(θ1 + 0.5 * k1_θ1 - (θ2 + 0.5 * k1_θ2)) * (
            (ω1 + 0.5 * k1_ω1) * (ω1 + 0.5 * k1_ω1) * L1 * (m1 + m2) +
            g * (m1 + m2) * Math.cos(θ1 + 0.5 * k1_θ1) +
            (ω2 + 0.5 * k1_ω2) * (ω2 + 0.5 * k1_ω2) * L2 * m2 * Math.cos(θ1 + 0.5 * k1_θ1 - (θ2 + 0.5 * k1_θ2))
        )
    ) / (L2 * (2 * m1 + m2 - m2 * Math.cos(2 * (θ1 + 0.5 * k1_θ1) - 2 * (θ2 + 0.5 * k1_θ2))));

    const k3_θ1 = h * (dθ1 + 0.5 * k2_ω1);
    const k3_θ2 = h * (dθ2 + 0.5 * k2_ω2);
    const k3_ω1 = h * (
        -g * (2 * m1 + m2) * Math.sin(θ1 + 0.5 * k2_θ1) -
        m2 * g * Math.sin(θ1 + 0.5 * k2_θ1 - 2 * (θ2 + 0.5 * k2_θ2)) -
        2 * Math.sin(θ1 + 0.5 * k2_θ1 - (θ2 + 0.5 * k2_θ2)) * m2 * ((ω2 + 0.5 * k2_ω2) * (ω2 + 0.5 * k2_ω2) * L2 + (ω1 + 0.5 * k2_ω1) * (ω1 + 0.5 * k2_ω1) * L1 * Math.cos(θ1 + 0.5 * k2_θ1 - (θ2 + 0.5 * k2_θ2)))
    ) / (L1 * (2 * m1 + m2 - m2 * Math.cos(2 * (θ1 + 0.5 * k2_θ1) - 2 * (θ2 + 0.5 * k2_θ2))));
    const k3_ω2 = h * (
        2 * Math.sin(θ1 + 0.5 * k2_θ1 - (θ2 + 0.5 * k2_θ2)) * (
            (ω1 + 0.5 * k2_ω1) * (ω1 + 0.5 * k2_ω1) * L1 * (m1 + m2) +
            g * (m1 + m2) * Math.cos(θ1 + 0.5 * k2_θ1) +
            (ω2 + 0.5 * k2_ω2) * (ω2 + 0.5 * k2_ω2) * L2 * m2 * Math.cos(θ1 + 0.5 * k2_θ1 - (θ2 + 0.5 * k2_θ2))
        )
    ) / (L2 * (2 * m1 + m2 - m2 * Math.cos(2 * (θ1 + 0.5 * k2_θ1) - 2 * (θ2 + 0.5 * k2_θ2))));

    const k4_θ1 = h * (dθ1 + k3_ω1);
    const k4_θ2 = h * (dθ2 + k3_ω2);
    const k4_ω1 = h * (
        -g * (2 * m1 + m2) * Math.sin(θ1 + k3_θ1) -
        m2 * g * Math.sin(θ1 + k3_θ1 - 2 * (θ2 + k3_θ2)) -
        2 * Math.sin(θ1 + k3_θ1 - (θ2 + k3_θ2)) * m2 * ((ω2 + k3_ω2) * (ω2 + k3_ω2) * L2 + (ω1 + k3_ω1) * (ω1 + k3_ω1) * L1 * Math.cos(θ1 + k3_θ1 - (θ2 + k3_θ2)))
    ) / (L1 * (2 * m1 + m2 - m2 * Math.cos(2 * (θ1 + k3_θ1) - 2 * (θ2 + k3_θ2))));
    const k4_ω2 = h * (
        2 * Math.sin(θ1 + k3_θ1 - (θ2 + k3_θ2)) * (
            (ω1 + k3_ω1) * (ω1 + k3_ω1) * L1 * (m1 + m2) +
            g * (m1 + m2) * Math.cos(θ1 + k3_θ1) +
            (ω2 + k3_ω2) * (ω2 + k3_ω2) * L2 * m2 * Math.cos(θ1 + k3_θ1 - (θ2 + k3_θ2))
        )
    ) / (L2 * (2 * m1 + m2 - m2 * Math.cos(2 * (θ1 + k3_θ1) - 2 * (θ2 + k3_θ2))));

    // Update angles and angular velocities using weighted average of k values
    θ1 += (k1_θ1 + 2 * k2_θ1 + 2 * k3_θ1 + k4_θ1) / 6;
    θ2 += (k1_θ2 + 2 * k2_θ2 + 2 * k3_θ2 + k4_θ2) / 6;
    ω1 += (k1_ω1 + 2 * k2_ω1 + 2 * k3_ω1 + k4_ω1) / 6;
    ω2 += (k1_ω2 + 2 * k2_ω2 + 2 * k3_ω2 + k4_ω2) / 6;

    // Calculate x2 and y2 based on the new θ1 and θ2 values
    const x1 = L1 * Math.sin(θ1) + canvas.width / 2;
    const y1 = L1 * Math.cos(θ1) + 100; // Adjust as needed
    const x2 = x1 + L2 * Math.sin(θ2);
    const y2 = y1 + L2 * Math.cos(θ2);

    // Store the position of the loose end of the pendulum
    pathPoints.push({ x: x2, y: y2 });

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the path of the loose end of the pendulum
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    for (const point of pathPoints) {
        ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.stroke();


    // Draw the pendulum rods
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 100); // Start point
    ctx.lineTo(x1, y1); // First pendulum rod
    ctx.lineTo(x2, y2); // Second pendulum rod
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the pendulum masses
    ctx.fillStyle = "blue"; // Color for the masses
    ctx.beginPath();
    ctx.arc(x1, y1, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x2, y2, 10, 0, Math.PI * 2);
    ctx.fill();

    // Update the pathPoints array to keep a fixed number of points
    if (pathPoints.length > 1000000) {
        pathPoints.shift();
    }
}

// Animation loop
let previousTimestamp = null;
const fixedTimeStep = 0.016; // 16ms (60 fps)

function animate(timestamp) {
    if (previousTimestamp === null) {
        previousTimestamp = timestamp;
    }

    // Update pendulum using Runge-Kutta with the fixed time step
    rungeKuttaStep(fixedTimeStep);

    // Call the animation loop recursively
    requestAnimationFrame(animate);

    // Update the previous timestamp for the next frame
    previousTimestamp = timestamp;
}

// Start the animation loop
requestAnimationFrame(animate);


// Start the animation loop
animate();