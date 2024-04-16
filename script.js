// script.js
document.addEventListener("DOMContentLoaded", function() {
    // Retrieve spending data from local storage on page load
    let spendingData = JSON.parse(localStorage.getItem("spendingData")) || [];

    // Display spending list on page load
    displaySpendingList(spendingData);

    // Display spending insight graph
    displaySpendingGraph(spendingData);
});

function addSpending() {
    // Get user input
    let title = document.getElementById("title").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let timestamp = new Date().toISOString(); // Current date and time

    // Validate input
    if (title.trim() === "" || isNaN(amount)) {
        alert("Please enter valid title and amount.");
        return;
    }

    // Create spending object
    let spending = {
        title: title,
        amount: amount,
        timestamp: timestamp
    };

    // Retrieve existing spending data from local storage
    let spendingData = JSON.parse(localStorage.getItem("spendingData")) || [];

    // Add new spending to the array
    spendingData.push(spending);

    // Update local storage
    localStorage.setItem("spendingData", JSON.stringify(spendingData));

    // Display updated spending list
    displaySpendingList(spendingData);

    // Display updated spending insight graph
    displaySpendingGraph(spendingData);

    // Clear input fields
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
}

function displaySpendingList(spendingData) {
    let listContainer = document.getElementById("spending-list");
    listContainer.innerHTML = ""; // Clear previous content

    spendingData.forEach(spending => {
        let listItem = document.createElement("li");
        listItem.textContent = `${spending.title} - $${spending.amount.toFixed(2)} (${new Date(spending.timestamp).toLocaleString()})`;
        listContainer.appendChild(listItem);
    });
}

function displaySpendingGraph(spendingData) {
    // Extract past 6 days spending data
    let past6DaysSpending = [];
    for (let i = 5; i >= 0; i--) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i);
        let totalSpending = spendingData.reduce((acc, curr) => {
            let spendingDate = new Date(curr.timestamp);
            if (spendingDate.toDateString() === currentDate.toDateString()) {
                acc += curr.amount;
            }
            return acc;
        }, 0);
        past6DaysSpending.push(totalSpending);
    }

    
        
}

function displaySpendingGraph(spendingData) {
    // Extract past 6 days spending data
    let past6DaysSpending = [];
    let past6DaysLabels = [];
    for (let i = 5; i >= 0; i--) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i);
        let totalSpending = spendingData.reduce((acc, curr) => {
            let spendingDate = new Date(curr.timestamp);
            if (spendingDate.toDateString() === currentDate.toDateString()) {
                acc += curr.amount;
            }
            return acc;
        }, 0);
        past6DaysSpending.push(totalSpending);
        past6DaysLabels.push(currentDate.toLocaleDateString());
    }

    // Draw line chart using Chart.js library
    let ctx = document.getElementById("spending-chart").getContext("2d");
    let myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: past6DaysLabels,
            datasets: [{
                label: "Total Spending",
                data: past6DaysSpending,
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


