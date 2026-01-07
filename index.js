const weatherApi = "https://api.weather.gov/alerts/active?area=";

const button = document.getElementById("fetch-alerts");
const input = document.getElementById("state-input");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

button.addEventListener("click", () => {
  const state = input.value.trim().toUpperCase();
  fetchWeatherAlerts(state);
});

function fetchWeatherAlerts(state) {
  // Clear previous alerts and errors
  alertsDisplay.innerHTML = "";
  hideError();

  // Validate input
  if (!/^[A-Z]{2}$/.test(state)) {
    showError("Please enter a valid 2-letter state abbreviation.");
    return;
  }

  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch weather alerts.");
      }
      return response.json();
    })
    .then(data => {
      displayAlerts(data);
      input.value = ""; // clear input after successful fetch
    })
    .catch(errorObject => {
      showError(errorObject.message);
      console.log(errorObject.message);
    });
}

function displayAlerts(data) {
  const count = data.features.length;

  const summary = document.createElement("h2");
  summary.textContent = `${data.title}: ${count}`;
  alertsDisplay.appendChild(summary);

  if (count === 0) {
    const p = document.createElement("p");
    p.textContent = "No active weather alerts for this state.";
    alertsDisplay.appendChild(p);
    return;
  }

  const ul = document.createElement("ul");
  data.features.forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });

  alertsDisplay.appendChild(ul);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function hideError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}
