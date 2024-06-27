let docTitle = document.title;
window.addEventListener("blur", () => {
  document.title = "Rooster Klascal";
});
window.addEventListener("focus", () => {
  document.title = docTitle;
});

// Dutch month names
const dutchMonthNames = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

// Function to fetch appointments for the specified date
function fetchAppointments(date) {
  // Parse the input date string to get the date and month
  const [day, monthName] = date.split(" ");
  const monthIndex = dutchMonthNames.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase()
  );

  if (monthIndex === -1 || isNaN(parseInt(day))) {
    console.error(
      "Invalid date format. Please enter date in the format 'DD Month', e.g., '12 augustus'."
    );
    return;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Construct a Date object with the specified date and current year
  const startDate = new Date(currentYear, monthIndex, parseInt(day, 10));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  const user = document.getElementById("user").value;
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode = document.getElementById("authorizationCode").value;
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  const apiUrl = `https://${schoolName}.zportal.nl/api/v3/appointments?user=${user}&start=${startTimestamp}&end=${endTimestamp}&valid=true&fields=subjects,cancelled,locations,startTimeSlot,start,end,groups,teachers,changeDescription&access_token=${authorizationCode}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const appointments = data.response.data;
      // Sort appointments by start time
      appointments.sort((a, b) => a.start - b.start);
      const scheduleDiv = document.getElementById("schedule");
      scheduleDiv.innerHTML = ""; // Clear existing schedule
      const errorMessageDiv = document.getElementById("error-message");

      if (appointments.length === 0) {
        scheduleDiv.style.display = "none";
        errorMessageDiv.style.display = "block";
      } else {
        scheduleDiv.style.display = "block";
        errorMessageDiv.style.display = "none";
      }

      // Filter out cancelled lessons if there are multiple lessons for the same hour
      const filteredAppointments = filterCancelledLessons(appointments);

      filteredAppointments.forEach((appointment) => {
        const startTime = new Date(appointment.start * 1000);
        const endTime = new Date(appointment.end * 1000);

        // Format start and end times
        const startTimeString = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTimeString = endTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Object met vak afkortingen en hun volledige namen
        const subjectsMapping = {
          ak: "Aardrijkskunde",
          en: "Engels",
          fa: "Frans",
          gd: "Godsdienst",
          gs: "Geschiedenis",
          ha: "Handvaardigheid",
          ict: "Informatiekunde",
          in: "Informatiekunde",
          kcv: "Klassieke Culturele Vorming",
          lo: "Lichamelijke opvoeding",
          men: "Mentorles",
          mn: "Mens en natuur",
          mu: "Muziek",
          ne: "Nederlands",
          te: "Tekenen/Techniek",
          wi: "Wiskunde",
          fr: "Frans",
          nl: "Nederlands",
          du: "Duits",
          bi: "Biologie",
          na: "Natuurkunde",
          sk: "Scheikunde",
          nask: "Natuurkunde/Scheikunde",
          ec: "Economie",
          econ: "Economie",
          ma: "Maatschappijleer",
          be: "Beeldende Vorming",
          kv: "Kunstvakken",
          fi: "Filosofie",
          la: "Latijn",
          gr: "Grieks",
          PROJECT: "Project",
          rkn: "Rekentoets",
          pe: "Physical education",
          ontw: "Ontwerpen",
          ltc: "Latijn",
          gtc: "Grieks",
          entl: "Engels",
          ges: "Geschiedenis",
          fatl: "Frans",
          biol: "Biologie",
          netl: "Nederlands",
          gds: "Godsdienst",
          wis: "Wiskunde",
          die: "Diëtetiek",
          kubv: "Kunst Beeldende Vakken",
          bg: "Begeleiding",
          sp: "Spaans",
          BSA: "Bindend studieadvies",
          bsa: "Bindend studieadvies",
          bo: "Beweg"
        };

        // Map subjects abbreviations to full names
        const subjectsFullNames = appointment.subjects.map(
          (subject) => subjectsMapping[subject] || subject
        );

        let changeDescription = "";
        if (appointment.changeDescription) {
          changeDescription = `<p>${appointment.changeDescription}</p>`;
        }

        // Create appointment HTML
        const appointmentDiv = document.createElement("div");
        appointmentDiv.innerHTML = `
          <p><strong id="vaknaam">${subjectsFullNames.join(
            ", "
          )}</strong><strong style="position:absolute;right:25px;">${
          appointment.startTimeSlot
        }</strong></p>
          <p>${startTimeString} - ${endTimeString} <span style="margin-left: 10px;">${appointment.locations.join(
          ", "
        )} (${appointment.teachers.join(", ")})</span></p>
        <p class="className">${appointment.groups.join(", ")}</p>
        <p>
          ${
            appointment.changeDescription
              ? '<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="vertical-align: sub;"><path d="M10.909 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.242A2.25 2.25 0 0 1 2.2 17.812l.072-.143L10.03 3.66a2.25 2.25 0 0 1 .879-.878ZM12 16.002a.999.999 0 1 0 0 1.997.999.999 0 0 0 0-1.997Zm-.002-8.004a1 1 0 0 0-.993.884L11 8.998 11 14l.007.117a1 1 0 0 0 1.987 0l.006-.117L13 8.998l-.007-.117a1 1 0 0 0-.994-.883Z" fill="#ff9800"/></svg>'
              : ""
          } 
          ${appointment.changeDescription}
        </p>
        `;

        // Add cancelled class if appointment is cancelled
        if (appointment.cancelled === true) {
          appointmentDiv.classList.add("cancelled");
        }

        scheduleDiv.appendChild(appointmentDiv);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Function to filter out cancelled lessons if there are multiple lessons for the same hour
function filterCancelledLessons(appointments) {
  const filteredAppointments = [];

  appointments.forEach((appointment) => {
    // Check if there is already an appointment for the same hour
    const existingAppointment = filteredAppointments.find(
      (appt) =>
        appt.startTimeSlot === appointment.startTimeSlot &&
        appt.start <= appointment.start &&
        appt.end >= appointment.end
    );

    if (existingAppointment) {
      // If there's already an appointment and it's not cancelled, keep it and discard the current one
      if (!existingAppointment.cancelled && appointment.cancelled) {
        return;
      }
      // If the existing appointment is cancelled, replace it with the current one
      if (existingAppointment.cancelled && !appointment.cancelled) {
        filteredAppointments.splice(
          filteredAppointments.indexOf(existingAppointment),
          1,
          appointment
        );
      }
    } else {
      filteredAppointments.push(appointment);
    }
  });

  return filteredAppointments;
}

// Function to handle loading schedule when button is clicked
document.getElementById("loadSchedule").addEventListener("click", function () {
  const dateInput = document.getElementById("dateInput").value;
  fetchAppointments(dateInput);
});

// Function to handle previous day button click
document.getElementById("previousDay").addEventListener("click", function () {
  const dateInput = document.getElementById("dateInput").value;
  const [day, month] = dateInput.split(" ");
  const monthIndex = dutchMonthNames.findIndex(
    (monthName) => monthName.toLowerCase() === month.toLowerCase()
  );
  const currentDate = new Date();
  currentDate.setFullYear(
    currentDate.getFullYear(),
    monthIndex,
    parseInt(day) - 1
  );
  const previousDay =
    currentDate.getDate() + " " + dutchMonthNames[currentDate.getMonth()];
  document.getElementById("dateInput").value = previousDay;
  fetchAppointments(previousDay);
});

// Function to handle next day button click
document.getElementById("nextDay").addEventListener("click", function () {
  const dateInput = document.getElementById("dateInput").value;
  const [day, month] = dateInput.split(" ");
  const monthIndex = dutchMonthNames.findIndex(
    (monthName) => monthName.toLowerCase() === month.toLowerCase()
  );
  const currentDate = new Date();
  currentDate.setFullYear(
    currentDate.getFullYear(),
    monthIndex,
    parseInt(day) + 1
  );
  const nextDay =
    currentDate.getDate() + " " + dutchMonthNames[currentDate.getMonth()];
  document.getElementById("dateInput").value = nextDay;
  fetchAppointments(nextDay);
});

// Fetch appointments for today when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Default to today's date
  const today = new Date();
  const day = today.getDate();
  const monthName = dutchMonthNames[today.getMonth()];
  const formattedDate = `${day} ${monthName}`;
  document.getElementById("dateInput").value = formattedDate;
  fetchAppointments(formattedDate);
});

// Sla schoolnaam en token op
schoolName.value = localStorage.getItem("schoolName");
schoolName.oninput = () => {
  localStorage.setItem("schoolName", schoolName.value);
};

authorizationCode.value = localStorage.getItem("authorizationCode");
authorizationCode.oninput = () => {
  localStorage.setItem("authorizationCode", authorizationCode.value);
};

user.value = localStorage.getItem("user");
user.oninput = () => {
  localStorage.setItem("user", user.value);
};

css.value = localStorage.getItem("css");
css.oninput = () => {
  localStorage.setItem("css", css.value);
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
  document.getElementById("loadSchedule").click();
  document.getElementById("css").click();
}
document.addEventListener("DOMContentLoaded", function () {
  const schoolName = localStorage.getItem("schoolName") || "";
  const authorizationCode = localStorage.getItem("authorizationCode") || "";
  if (schoolName.trim() === "" || authorizationCode.trim() === "") {
    // Als een van de opgeslagen waarden leeg is, toon dialoogvenster
    showDialog();
  } else {
  }
});

function update_section(with_what, what) {
  document.getElementById(what + "goeshere").innerHTML = with_what;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("css").click();
});
let startX;
let endX;
const SWIPE_THRESHOLD = 150; // Adjust as needed

// Function to handle touch start event
function handleTouchStart(event) {
  startX = event.touches[0].clientX;
}

// Function to handle touch move event
function handleTouchMove(event) {
  endX = event.touches[0].clientX;
  event.preventDefault(); // Prevent scrolling while swiping
}

// Function to handle touch end event
function handleTouchEnd(event) {
  handleSwipe();
}

// Function to handle swipe direction
function handleSwipe() {
  const deltaX = endX - startX;
  if (deltaX > SWIPE_THRESHOLD) {
    // Swipe right, load previous day schedule
    loadPreviousDaySchedule();
  } else if (deltaX < -SWIPE_THRESHOLD) {
    // Swipe left, load next day schedule
    loadNextDaySchedule();
  }
}

// Function to load previous day schedule
function loadPreviousDaySchedule() {
  document.getElementById("previousDay").click();
}

// Function to load next day schedule
function loadNextDaySchedule() {
  document.getElementById("nextDay").click();
}

// Add event listeners for touch events on the document
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);
// Function to handle arrow key presses
function handleArrowKeyPress(event) {
  const key = event.key;
  if (key === "ArrowLeft") {
    // Arrow left, load previous day schedule
    loadPreviousDaySchedule();
  } else if (key === "ArrowRight") {
    // Arrow right, load next day schedule
    loadNextDaySchedule();
  }
}

// Function to load previous day schedule
function loadPreviousDaySchedule() {
  document.getElementById("previousDay").click();
}

// Function to load next day schedule
function loadNextDaySchedule() {
  document.getElementById("nextDay").click();
}

// Add event listener for keydown event on the document
document.addEventListener("keydown", handleArrowKeyPress);

// Focus on the input field to capture arrow key events
document.getElementById("keyboard").focus();
if (typeof navigator.serviceWorker !== "undefined") {
  navigator.serviceWorker.register("sw.js");
}
// Function to apply color theme
function applyColorTheme(color) {
  // Save selected color to local storage
  localStorage.setItem("color", color);

  // Apply color theme stylesheet
  document
    .getElementById("color-theme")
    .setAttribute("href", `${storedColor}.css`);
}

// Apply stored color theme on page load
const storedColor = localStorage.getItem("color");
if (storedColor) {
  applyColorTheme(storedColor);
}

// Color theme selector event listener
document.getElementById("color-select").addEventListener("change", function () {
  applyColorTheme(this.value);
});
