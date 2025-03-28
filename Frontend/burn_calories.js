const API_KEY = 'W1aQFyaXYpgFtthigihwXw==fO5ztocG75oPCYVZ'; // Replace with your actual API key

// Function to fetch calorie data for a food item
async function fetchCalories(foodItem) {
    try {
        const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(foodItem)}`, {
            headers: { 'X-Api-Key': API_KEY }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Log the API response

        if (data.items && data.items.length > 0) {
            return data.items[0].calories; // Return calories for the first matching food item
        } else {
            throw new Error('No calorie data found for this food item.');
        }
    } catch (error) {
        console.error('Error fetching calorie data:', error);
        return 0; // Return 0 if there's an error
    }
}

// Function to log a meal and update calories
async function logMeal(mealType) {
    const inputId = `${mealType}-food`;
    const spanId = `${mealType}-calories`;

    const foodInput = document.getElementById(inputId).value.trim();
    console.log('Food Input:', foodInput); // Log the input value

    if (!foodInput) {
        alert('Please enter a food item.');
        return;
    }

    // Fetch calories for the entered food item
    const calories = await fetchCalories(foodInput);
    console.log('Calories Fetched:', calories); // Log the fetched calories

    if (calories === 0) {
        alert('No calorie data found for this food item. Please try again.');
        return;
    }

    // Update meal calories
    const currentCalories = parseInt(document.getElementById(spanId).innerText);
    const newCalories = currentCalories + calories;
    document.getElementById(spanId).innerText = newCalories;

    // Update total calories
    updateTotalCalories();

    // Clear input field
    document.getElementById(inputId).value = '';
}

// Function to update total calorie count
function updateTotalCalories() {
    const breakfast = parseInt(document.getElementById('breakfast-calories').innerText);
    const lunch = parseInt(document.getElementById('lunch-calories').innerText);
    const dinner = parseInt(document.getElementById('dinner-calories').innerText);

    const total = breakfast + lunch + dinner;
    document.getElementById('total-calories').innerText = total;

    // Update graph
    updateCalorieGraph();
}

// Function to update the calorie graph
function updateCalorieGraph() {
    const breakfast = parseInt(document.getElementById('breakfast-calories').innerText);
    const lunch = parseInt(document.getElementById('lunch-calories').innerText);
    const dinner = parseInt(document.getElementById('dinner-calories').innerText);

    const ctx = document.getElementById('calorieChart').getContext('2d');

    // Destroy previous chart instance if exists
    if (window.calorieChartInstance) {
        window.calorieChartInstance.destroy();
    }

    // Create new chart
    window.calorieChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Breakfast', 'Lunch', 'Dinner'],
            datasets: [{
                label: 'Calories Consumed',
                data: [breakfast, lunch, dinner],
                backgroundColor: ['#ff9999', '#66b3ff', '#99ff99'],
                borderColor: ['#ff3333', '#3399ff', '#33cc33'],
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

// Initialize the graph when the page loads
document.addEventListener('DOMContentLoaded', function () {
    updateCalorieGraph();
});