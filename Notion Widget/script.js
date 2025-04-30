// Data storage
let productivityData = {
    weekly: [],
    monthly: [],
    yearly: []
};

// Initialize charts
let weeklyChart, monthlyChart, yearlyChart;

// DOM Elements
const studyHoursInput = document.getElementById('studyHours');
const productiveHoursInput = document.getElementById('productiveHours');
const entertainmentHoursInput = document.getElementById('entertainmentHours');
const saveButton = document.getElementById('saveData');
const productivityStatus = document.getElementById('productivityStatus');

// Chart configurations
const chartConfig = {
    weekly: {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Study Hours',
                    data: [],
                    backgroundColor: '#007AFF'
                },
                {
                    label: 'Productive Hours',
                    data: [],
                    backgroundColor: '#34C759'
                },
                {
                    label: 'Entertainment Hours',
                    data: [],
                    backgroundColor: '#FF9500'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 24
                }
            }
        }
    },
    monthly: {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => i + 1),
            datasets: [{
                label: 'Productive Hours',
                data: [],
                borderColor: '#34C759',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    },
    yearly: {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Average Productive Hours',
                data: [],
                backgroundColor: '#34C759'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
};

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadData();
});

function initializeCharts() {
    weeklyChart = new Chart(
        document.getElementById('weeklyChart'),
        chartConfig.weekly
    );
    
    monthlyChart = new Chart(
        document.getElementById('monthlyChart'),
        chartConfig.monthly
    );
    
    yearlyChart = new Chart(
        document.getElementById('yearlyChart'),
        chartConfig.yearly
    );
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('productivityData', JSON.stringify(productivityData));
}

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('productivityData');
    if (saved) {
        productivityData = JSON.parse(saved);
        updateCharts();
    }
}

// Update productivity status
function updateProductivityStatus(productiveHours) {
    productivityStatus.textContent = '';
    productivityStatus.className = '';
    
    if (productiveHours >= 9) {
        productivityStatus.textContent = 'High Productivity! 🎉';
        productivityStatus.classList.add('high');
    } else if (productiveHours < 5) {
        productivityStatus.textContent = 'Low Productivity';
        productivityStatus.classList.add('low');
    } else {
        productivityStatus.textContent = 'Moderate Productivity';
    }
}

// Save button click handler
saveButton.addEventListener('click', () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const date = today.getDate();
    const month = today.getMonth();
    
    const data = {
        study: parseFloat(studyHoursInput.value) || 0,
        productive: parseFloat(productiveHoursInput.value) || 0,
        entertainment: parseFloat(entertainmentHoursInput.value) || 0,
        date: today
    };
    
    // Update weekly data
    productivityData.weekly[dayOfWeek] = data;
    
    // Update monthly data
    if (!productivityData.monthly[month]) {
        productivityData.monthly[month] = [];
    }
    productivityData.monthly[month][date - 1] = data;
    
    // Update yearly data
    if (!productivityData.yearly[month]) {
        productivityData.yearly[month] = [];
    }
    productivityData.yearly[month].push(data);
    
    // Update UI
    updateCharts();
    updateProductivityStatus(data.productive);
    saveData();
    
    // Clear inputs
    studyHoursInput.value = '';
    productiveHoursInput.value = '';
    entertainmentHoursInput.value = '';
});

function updateCharts() {
    // Update weekly chart
    weeklyChart.data.datasets[0].data = productivityData.weekly.map(d => d?.study || 0);
    weeklyChart.data.datasets[1].data = productivityData.weekly.map(d => d?.productive || 0);
    weeklyChart.data.datasets[2].data = productivityData.weekly.map(d => d?.entertainment || 0);
    weeklyChart.update();
    
    // Update monthly chart
    const currentMonth = new Date().getMonth();
    monthlyChart.data.datasets[0].data = productivityData.monthly[currentMonth]?.map(d => d?.productive || 0) || [];
    monthlyChart.update();
    
    // Update yearly chart
    yearlyChart.data.datasets[0].data = productivityData.yearly.map(month => {
        if (!month || month.length === 0) return 0;
        const sum = month.reduce((acc, day) => acc + (day?.productive || 0), 0);
        return sum / month.length;
    });
    yearlyChart.update();
} 