 // Connects all modules and manages the simulation

console.log("CPU Scheduler Project is Running!");

// Variables used to control the simulation
let simulationSteps = [];
let currentStepIndex = 0;
let simulationResult = {};
let autoPlayTimer;

// Run the selected scheduling algorithm
function runSimulation() {

    // Get process data and algorithm from the input module
    let processes = getProcesses();
    let selectedAlgorithm = getSelectedAlgorithm();

    // Run the selected algorithm
    if (selectedAlgorithm === "FCFS") {
        simulationResult = runFCFS(processes);
    }
    else if (selectedAlgorithm === "Priority") {
        simulationResult = runPriority(processes);
    }

    // Save the simulation steps
    simulationSteps = simulationResult.simulationSteps;
    currentStepIndex = 0;

    // Display the Gantt Chart
    displayGanttChart(simulationResult.timeline);

    // Display the results
    displayResults(
        simulationResult.results,
        simulationResult.averages
    );

    // Display the first simulation step
    displayCurrentStep(simulationSteps[currentStepIndex]);
}

// Move to the next simulation step
function nextStep() {

    if (currentStepIndex < simulationSteps.length - 1) {
        currentStepIndex++;

        displayCurrentStep(simulationSteps[currentStepIndex]);
    }
}

// Move to the previous simulation step
function previousStep() {

    if (currentStepIndex > 0) {
        currentStepIndex--;

        displayCurrentStep(simulationSteps[currentStepIndex]);
    }
}

// Start automatic simulation
function startAutoPlay() {

    // Stop any previous auto-play
    stopAutoPlay();

    autoPlayTimer = setInterval(function () {

        if (currentStepIndex < simulationSteps.length - 1) {
            nextStep();
        }
        else {
            stopAutoPlay();
        }

    }, 1000);
}

// Stop automatic simulation
function stopAutoPlay() {

    clearInterval(autoPlayTimer);
}

// Reset the simulation
function resetSimulation() {

    // Stop auto-play
    stopAutoPlay();

    // Return to the first step
    currentStepIndex = 0;

    if (simulationSteps.length > 0) {
        displayCurrentStep(simulationSteps[currentStepIndex]);
    }
}

// Connect the buttons to the simulation functions
document.getElementById("next-btn").addEventListener("click", nextStep);

document.getElementById("back-btn").addEventListener("click", previousStep);

document.getElementById("auto-btn").addEventListener("click", startAutoPlay);

document.getElementById("reset-btn").addEventListener("click", resetSimulation);

document.getElementById("run-btn").addEventListener("click", runSimulation);
