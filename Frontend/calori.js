
// Function to log meal and calculate calories
function logMeal(mealType) {
    let inputId = `${mealType}-food`;
    let spanId = `${mealType}-calories`;

    let foodInput = document.getElementById(inputId).value.toLowerCase();
    let mealCalories = calorieDatabase[foodInput] || 0; // Default to 0 if food not found

    // Get current meal calories
    let currentCalories = parseInt(document.getElementById(spanId).innerText);
    
    // Update meal calories
    let newCalories = currentCalories + mealCalories;
    document.getElementById(spanId).innerText = newCalories;

    // Update total calories and store in local storage
    updateTotalCalories();

    // Clear input field after logging
    document.getElementById(inputId).value = "";
}

// Function to update total calorie count and store it
function updateTotalCalories() {
    let breakfast = parseInt(document.getElementById("breakfast-calories").innerText);
    let lunch = parseInt(document.getElementById("lunch-calories").innerText);
    let dinner = parseInt(document.getElementById("dinner-calories").innerText);

    let total = breakfast + lunch + dinner;
    document.getElementById("total-calories").innerText = total;

    // Store values in localStorage for the Burn Calories page
    localStorage.setItem("totalCalories", total);
    localStorage.setItem("breakfastCalories", breakfast);
    localStorage.setItem("lunchCalories", lunch);
    localStorage.setItem("dinnerCalories", dinner);

    // Update graph
    updateCalorieGraph();
}

// Function to update Burn Calories page
function updateBurnPage() {
    let totalIntake = parseInt(localStorage.getItem("totalCalories") || 0);

    // Ensure elements exist before updating
    let intakeElement = document.getElementById("todays-intake");
    let burnAdviceElement = document.getElementById("burn-advice");
    let stepsElement = document.getElementById("suggested-steps");

    if (!intakeElement || !burnAdviceElement || !stepsElement) {
        console.error("Burn Calories page elements not found!");
        return;
    }

    // Update intake
    intakeElement.innerText = totalIntake > 0 ? totalIntake : "0";

    // Generate burn advice
    let burnMessage = "⚡ Maintain balance!";
    let steps = 5000;

    if (totalIntake > 2500) {
        burnMessage = "🔥 High intake! Walk 10,000 steps or do 30 min cardio.";
        steps = 10000;
    } else if (totalIntake > 2000) {
        burnMessage = "🏃 You should walk at least 7000 steps today!";
        steps = 7000;
    } else if (totalIntake < 1500) {
        burnMessage = "🍽️ You need more food! Eat a healthy snack.";
        steps = 3000;
    }

    // Update Burn Page with calculated advice
    burnAdviceElement.innerText = burnMessage;
    stepsElement.innerText = `Suggested Steps: ${steps}`;
}

// Function to update calorie intake graph
function updateCalorieGraph() {
    let breakfast = parseInt(localStorage.getItem("breakfastCalories") || 0);
    let lunch = parseInt(localStorage.getItem("lunchCalories") || 0);
    let dinner = parseInt(localStorage.getItem("dinnerCalories") || 0);

    // Get canvas element
    let ctx = document.getElementById("calorieChart").getContext("2d");

    // Destroy previous chart instance if exists
    if (window.calorieChartInstance) {
        window.calorieChartInstance.destroy();
    }

    // Create new chart
    window.calorieChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Breakfast", "Lunch", "Dinner"],
            datasets: [{
                label: "Calories Consumed",
                data: [breakfast, lunch, dinner],
                backgroundColor: ["#ff9999", "#66b3ff", "#99ff99"],
                borderColor: ["#ff3333", "#3399ff", "#33cc33"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Run when Meal Log page loads
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("calorieChart")) {
        updateCalorieGraph();
    }
    if (document.getElementById("burn-page")) {
        updateBurnPage();
    }
});

function fetchCalories() {
    const mealQuery = document.getElementById('mealInput').value;

    if (!mealQuery) {
        alert('Please enter a meal.');
        return;
    }

    fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(mealQuery)}`, {
        method: 'GET',
        headers: { 'X-Api-Key': 'W1aQFyaXYpgFtthigihwXw==pUmuCwcsnoY7zSpu' }
    })
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data);

        if (data.items && data.items.length > 0) {
            let totalCalories = 0;
            data.items.forEach(item => {
                totalCalories += item.calories;
            });

            document.getElementById('calorieResult').innerHTML = `<p><strong>Total Calories:</strong> ${totalCalories} kcal</p>`;
        } else {
            document.getElementById('calorieResult').innerHTML = `<p>No nutrition data found. Try a different food name.</p>`;
        }
    })
    .catch(error => {
        console.error('API Fetch Error:', error);
        document.getElementById('calorieResult').innerHTML = `<p>Error fetching data. Check console for details.</p>`;
    });
}