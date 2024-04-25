// Functie om rooster op te halen met behulp van fetch
async function fetchSchedule(
  authorizationCode,
  userType,
  year,
  week,
  schoolName
) {
  try {
    const url = `https://${schoolName}.zportal.nl/api/v3/liveschedule?access_token=${authorizationCode}&${userType}=~me&week=${year}${week}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const scheduleData = await response.json();
    displaySchedule(scheduleData);
  } catch (error) {
    console.error("Error fetching schedule:", error.message);
    displayError("Error fetching schedule. Please try again.");
  }
}

// Functie om rooster weer te geven
function displaySchedule(scheduleData) {
  const scheduleElement = document.getElementById("schedule");
  if (
    scheduleData &&
    scheduleData.response &&
    scheduleData.response.data
  ) {
    const appointments = scheduleData.response.data[0].appointments;

    let previousDate = null; // Variable to store the previous date

    const daysOfWeek = [
      "Zondag:",
      "Maandag:",
      "Dinsdag:",
      "Woensdag:",
      "Donderdag:",
      "Vrijdag:",
      "Zaterdag:",
    ];

    // Group appointments by day
    const appointmentsByDay = appointments.reduce((acc, appointment) => {
      const currentDay = new Date(appointment.start * 1000).getDay();
      const currentDayName = daysOfWeek[currentDay];

      if (!acc[currentDayName]) {
        acc[currentDayName] = [];
      }
      acc[currentDayName].push(appointment);
      return acc;
    }, {});

    // Generate HTML for each day
    const scheduleHTML = Object.entries(appointmentsByDay)
      .map(([dayName, appointments]) => {
        const appointmentsHTML = appointments
          .map((appointment, idx, arr) => {
            const uur = appointment.startTimeSlotName;
            const voriguur = idx > 0 ? arr[idx - 1].startTimeSlotName : 0;
            const leftMarg = 130 * (uur - voriguur - 1); // 130 px per lesuur.

            // Format start and end time
            const startTime = new Date(
              appointment.start * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const endTime = new Date(
              appointment.end * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            // Map subject abbreviations to full names
            const subjects = appointment.subjects.map(
              (subject) => subject.toUpperCase()
            );
            const warning = appointment.changeDescription;
            const warningsymbol = warning ? "&#9888;" : "";

            // Generate HTML for each appointment
            return `<div style="margin-left:${leftMarg}px;"
                      class="les${appointment.cancelled ? " cancelled" : ""}"
                      id="${appointment.subjects.join(", ") ? "" : "error"}${subjects.join(", ")}"
            >
              <p>
                <strong>${subjects.join(", ")}</strong>
                <strong class="lesuur">${appointment.startTimeSlotName}</strong>
              </p>
              <p class="lestijden">${startTime} - ${endTime}</p>
              <span>
                ${appointment.locations.join(", ")} (${appointment.teachers.join(", ")})
                <div class="warning">
                  ${warningsymbol}
                  <span class="warningMessage">${warning}</span>
                </div>
              </span>
              <p class="className">
                ${appointment.groups.join(", ")}
              </p>
            </div>`;
          })
          .join("");

        // Generate HTML for the day with its appointments
        return `<span><h3>${dayName}</h3>${appointmentsHTML}</span>`;
      })
      .join("");

    scheduleElement.innerHTML = scheduleHTML;
  } else {
    scheduleElement.innerHTML = "<p>Geen roostergegevens gevonden.</p>";
  }
}

// Functie om foutmelding weer te geven
function displayError(message) {
  const scheduleElement = document.getElementById("schedule");
  scheduleElement.innerHTML = `<p>${message}</p>`;
}

// Functie om formulierinzending te verwerken
function handleFormSubmit(event) {
  event.preventDefault(); // Voorkom formulierinzending
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode =
    document.getElementById("authorizationCode").value;
  const userType = document.getElementById("userType").value;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let week =
    Math.floor((currentDate - new Date(year, 0, 1)) / 604800000) + 1; // Bereken weeknummer
  if (week < 10) week = `0${week}`; // Voeg een voorloopnul toe aan enkelcijferige weken

  // Haal het rooster op
  fetchSchedule(authorizationCode, userType, year, week, schoolName);
}

// Voeg een gebeurtenisluisteraar toe voor de formulierinzending
document
  .getElementById("inputForm")
  .addEventListener("submit", handleFormSubmit);
// Sla schoolnaam en token op
schoolName.value = localStorage.getItem("schoolName");
schoolName.oninput = () => {
  localStorage.setItem("schoolName", schoolName.value);
};

authorizationCode.value = localStorage.getItem("authorizationCode");
authorizationCode.oninput = () => {
  localStorage.setItem("authorizationCode", authorizationCode.value);
};

userType.value = localStorage.getItem("userType");
userType.oninput = () => {
  localStorage.setItem("userType", userType.value);
};

// Functie om dialoogvenster te tonen
function showDialog() {
  const dialog = document.getElementById("dialog");
  dialog.showModal();
}

// Functie om dialoogvenster te verbergen
function hideDialog() {
  const dialog = document.getElementById("dialog");
  dialog.close();
  document.getElementById("css").click();
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("save").click(), 0;
  const schoolName = localStorage.getItem("schoolName") || "";
  const authorizationCode =
    localStorage.getItem("authorizationCode") || "";
  const userType = localStorage.getItem("userType") || "";
  if (
    schoolName.trim() === "" ||
    authorizationCode.trim() === "" ||
    userType.trim() === ""
  ) {
    // Als een van de opgeslagen waarden leeg is, toon dialoogvenster
    showDialog();
  }
});

css.value = localStorage.getItem("css");
css.oninput = () => {
  localStorage.setItem("css", css.value);
};

function update_section(with_what, what) {
  document.getElementById(what + "goeshere").innerHTML = with_what;
}