const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
let lastHole;
let timeUp = false;
let score = 0;
let farmPoints = 0;
let totalFarmPoints = 0;
let farmInterval;

const userId = "user123"; // This should be dynamically generated or retrieved
let userData = {
    userId: userId,
    totalPoints: 0,
    completedTasks: [],
    invitedFriends: [],
};

// Load user data from localStorage or initialize it
function loadUserData() {
    const storedData = localStorage.getItem(userId);
    if (storedData) {
        userData = JSON.parse(storedData);
    }
    updateTotalPointsDisplay();
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem(userId, JSON.stringify(userData));
}

// Generate a random time between min and max
function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// Select a random hole, ensuring it's not the same as the last hole
function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

// Show a mole peeking from a hole
function peep() {
    const time = randomTime(700, 1000);
    const hole = randomHole(holes);
    hole.classList.add("up");
    setTimeout(() => {
        hole.classList.remove("up");
        if (!timeUp) peep();
    }, time);
}

// Start the game, reset score, and set a timeout to stop the game
function startGame() {
    document.querySelector('.start-button').disabled = true;
    score = 0; // Reset the temporary score for the current game session
    scoreBoard.textContent = score;
    timeUp = false;
    peep();
    setTimeout(() => {
        timeUp = true;
        userData.totalPoints += score; // Accumulate points
        saveUserData();
        updateTotalPointsDisplay();
        document.querySelector('.start-button').disabled = false;
    }, 10000);
}

// Increment score when a mole is bonked
function bonk(e) {
    if (!e.isTrusted) return; // cheater
    score++;
    this.classList.remove("up");
    scoreBoard.textContent = score;
}

// Add event listeners to moles for the bonk action
moles.forEach(mole => mole.addEventListener("click", bonk));

// Open a specified tab and close others
function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Start farming points over 4 hours, updating every second
function startFarm() {
    document.querySelector('.farm-button').disabled = true;
    const fourHoursInSeconds = 5;
    totalFarmPoints = randomTime(100, 200);
    const pointsPerSecond = totalFarmPoints / fourHoursInSeconds;

    clearInterval(farmInterval);  // Clear any existing intervals
    farmPoints = 0;
    document.querySelector('.farm-points').textContent = farmPoints.toFixed(2);

    farmInterval = setInterval(() => {
        farmPoints += pointsPerSecond;
        document.querySelector('.farm-points').textContent = farmPoints.toFixed(2);
        if (farmPoints >= totalFarmPoints) {
            clearInterval(farmInterval);
            userData.totalPoints += Math.floor(farmPoints);
            saveUserData();
            updateTotalPointsDisplay();
            document.querySelector('.farm-button').disabled = false;
        }
    }, 1000);  // Update every second
}

// Mark a task as completed and add points
function completeTask(taskName) {
    if (!userData.completedTasks.includes(taskName)) {
        userData.completedTasks.push(taskName);
        userData.totalPoints += 10; // Example points for completing a task
        saveUserData();
        updateTotalPointsDisplay();
    }
}

// Add a friend to the invite list and add points
function inviteFriend(friendId) {
    if (!userData.invitedFriends.includes(friendId)) {
        userData.invitedFriends.push(friendId);
        userData.totalPoints += 20; // Example points for inviting a friend
        saveUserData();
        updateTotalPointsDisplay();
    }
}

// Generate a unique invite link for the user
function generateInviteLink() {
    return `${window.location.origin}?ref=${userId}`;
}

// Update the displayed total points
function updateTotalPointsDisplay() {
    document.querySelectorAll('.total-points-value').forEach(el => {
        el.textContent = userData.totalPoints;
    });
}

// Initialize the game tab as active and load user data
document.getElementById('game').classList.add('active');
loadUserData();

// Example usage for the invite link
document.querySelector('.invite-link').textContent = generateInviteLink();