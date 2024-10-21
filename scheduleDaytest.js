const authorizationCode = document.getElementById("authorizationCode").value;
var authorizationCodeLS = localStorage.getItem("authorizationCode");
// Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
let accessToken = localStorage.getItem("access_token");
if (/^\d{12}$/.test(authorizationCodeLS)) {
  if (accessToken == null || accessToken == "[object Promise]") {
    hideDialog();
  }
} else if (/^[a-z0-9]{26}$/.test(authorizationCodeLS)) {
  localStorage.setItem("access_token", authorizationCodeLS);
}

// Dutch month names
const dutchMonthNames = [
  "jan",
  "feb",
  "mar",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
];
setTimeout(function() {console.log("test")}, 5000);
const checkbox = document.getElementById("meldingen");
// Function to save checkbox state to localStorage
function saveCheckboxState() {
  localStorage.setItem("checkboxState", checkbox.checked);
}

// Function to restore checkbox state from localStorage
function restoreCheckboxState() {
  const savedState = localStorage.getItem("checkboxState");
  if (savedState !== null) {
    checkbox.checked = JSON.parse(savedState);
  }
}
window.onload = restoreCheckboxState;

// Save state when checkbox is clicked
checkbox.addEventListener("change", saveCheckboxState);

// Function to fetch appointments for the specified date
function fetchAppointments(date) {
  // Parse the input date string to get the date and month
  const datum = document.getElementById("dateInput").value;
  if (/^[a-zA-Z]{2}\s/.test(datum)) {
    var [zomadiwodovrza, day, monthName] = datum.split(" ");
  } else {
    var [day, monthName] = datum.split(" ");
  }
  const today1 = new Date();
  const day1 = today1.getDate();
  const daysOfWeek1 = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza1 = daysOfWeek1[today1.getDay()];
  const monthName1 = dutchMonthNames[today1.getMonth()];
  const formattedDate3 = `${day1} ${monthName1}`;
  const formattedDate2 = `${zomadiwodovrza1} ${day1} ${monthName1}`;
  if (datum !== formattedDate3 && datum !== formattedDate2) {
    document.getElementById("add").setAttribute("style", "display: block;");
  }
  if (datum === formattedDate3 || datum === formattedDate2) {
    document.getElementById("add").setAttribute("style", "display: none;");
  }
  const monthShort = monthName.substring(0, 3);
  const monthIndex = dutchMonthNames.findIndex(
    (month) => month.toLowerCase() === monthShort
  );

  if (monthIndex === -1 || isNaN(parseInt(day))) {
    console.error(
      "Invalid date format. Please enter date in the format 'DD Month', e.g., '12 aug'."
    );
    return;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Construct a Date object with the specified date and current year
  const startDate = new Date(currentYear, monthIndex, parseInt(day, 10));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  const user = document.getElementById("user").value || "~me";
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode = document.getElementById("authorizationCode").value;
  let accessToken = localStorage.getItem("access_token");
  // Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
  let accessToken1 = localStorage.getItem("access_token");
  if (/^\d{12}$/.test(authorizationCodeLS)) {
    if (accessToken1 == null || accessToken == "undefined") {
      accessToken1 = fetchToken(authorizationCode, schoolName);
      localStorage.setItem("access_token", accessToken1);
    }
  } else if (/^[a-z0-9]{26}$/.test(authorizationCodeLS)) {
    localStorage.setItem("access_token", authorizationCodeLS);
  }
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  const apiUrl = `https://${schoolName}.zportal.nl/api/v3/appointments?user=${user}&start=${startTimestamp}&end=${endTimestamp}&valid=true&fields=subjects,type,cancelled,locations,startTimeSlot,endTimeSlot,start,end,groups,teachers,changeDescription&access_token=${accessToken}`;

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
        const startTimeString = startTime
          .toLocaleTimeString("nl-NL", {
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/^0+/, "");
        const endTimeString = endTime
          .toLocaleTimeString("nl-NL", {
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/^0+/, "");

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
          wis: "Wiskunde",
          fr: "Frans",
          nl: "Nederlands",
          du: "Duits",
          bi: "Biologie",
          na: "Natuurkunde",
          nat: "Natuurkunde",
          sk: "Scheikunde",
          nask: "NaSk",
          ec: "Economie",
          econ: "Economie",
          ma: "Maatschappijleer",
          maat: "Maatschappijleer",
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
          bo: "Bewegingsonderwijs",
          glstnl: "Global Studies NL",
          nlt: "Natuur leven technologie",
          wisd: "Wiskunde D",
          wisc: "Wiskunde C",
          wisb: "Wiskunde B",
          wisa: "Wiskunde A",
          Act: "Activiteit",
          SPORTDAG: "Sportdag",
        };

        // Map subjects abbreviations to full names
        let subjectsFullNames = appointment.subjects.map(
          (subject) => subjectsMapping[subject] || subject
        );

        if (localStorage.getItem("afkorting") === "true") {
          subjectsFullNames = appointment.subjects;
        }

        let changeDescription = "";

        // Create appointment HTML
        const appointmentDiv = document.createElement("div");
        if (!appointment.startTimeSlot) {
          var timeSlot = "";
          if (appointment.type === "exam") {
            var timeSlot = "Toets";
          }
          if (appointment.type === "activity") {
            var timeSlot = "Activiteit";
          }
        } else {
          var timeSlot = appointment.startTimeSlot;
        }
        let warning = "";
        let warningsymbol = "";
        if (appointment.changeDescription !== "") {
          warning = appointment.changeDescription;
          warningsymbol = warning
            ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff9800" style="vertical-align: sub; margin-right: 2.5px;"><path d="M120-103q-18 0-32.09-8.8Q73.83-120.6 66-135q-8-14-8.5-30.6Q57-182.19 66-198l359-622q9-16 24.1-23.5 15.11-7.5 31-7.5 15.9 0 30.9 7.5 15 7.5 24 23.5l359 622q9 15.81 8.5 32.4Q902-149 894-135t-22 23q-14 9-32 9H120Zm360-140q18 0 31.5-13.5T525-288q0-18-13.5-31T480-332q-18 0-31.5 13T435-288q0 18 13.5 31.5T480-243Zm0-117q17 0 28.5-11.5T520-400v-109q0-17-11.5-28.5T480-549q-17 0-28.5 11.5T440-509v109q0 17 11.5 28.5T480-360Z"/></svg>'
            : "";
        }
        const teachers =
          "(" + appointment.teachers.filter((e) => e != user).join(", ") + ")";
        appointmentDiv.innerHTML = `
          <p><strong id="vaknaam">${subjectsFullNames.join(
            ", "
          )}</strong><strong style="position:absolute;right:7.5px;" id="timeSlot">${timeSlot}</strong></p>
          <p>${startTimeString} - ${endTimeString} <span style="margin-left: 10px;">${appointment.locations.join(
          ", "
        )} ${teachers == "()" ? "" : teachers} <span class="warning">
                  ${warningsymbol}
                  <span class="warningMessage">${warning}</span>
                </span></span></p>
        <p class="className">${appointment.groups.join(", ")}</p>
        `;
        appointmentDiv.classList.add(
          appointment.cancelled ? "cancelled" : appointment.type
        );
  const dago = Date.now(); if (dago <= appointment.end * 1000) {appointmentDiv.classList.add("test");} localStorage.setItem("LaatsteSync", dago);
        // Check if the browser supports notifications
        if ("Notification" in window) {
          // Check if permission has already been granted
          if (
            Notification.permission === "granted" &&
            appointment.cancelled === false
          ) {
            if (datum === formattedDate3 || datum === formattedDate2) {
              if (localStorage.getItem("LastNotificationDate") !== datum) {
                const startTime = new Date(appointment.start * 1000);
                // If it's okay, create a notification
                new Notification(subjectsFullNames, {
                  body:
                    startTimeString +
                    "-" +
                    endTimeString +
                    " • " +
                    appointment.locations +
                    " (" +
                    appointment.teachers +
                    ")",
                  icon: "logo.svg",
                  timestamp: startTime,
                });
              }
            }
          }
          // If the permission is not granted yet, request for it
          else if (Notification.permission !== "denied") {
            if (localStorage.getItem("checkboxState") === "true") {
              Notification.requestPermission().then(function (permission) {
                // If the user accepts, send the notification
                if (
                  permission === "granted" &&
                  appointment.cancelled === false
                ) {
                  if (datum === formattedDate3 || datum === formattedDate2) {
                    if (
                      localStorage.getItem("LastNotificationDate") !== datum
                    ) {
                      const startTime = new Date(appointment.start * 1000);
                      // If it's okay, create a notification
                      new Notification(subjectsFullNames, {
                        body:
                          startTimeString +
                          "-" +
                          endTimeString +
                          " • " +
                          appointment.locations +
                          " (" +
                          appointment.teachers +
                          ")",
                        icon: "logo.svg",
                        timestamp: startTime,
                      });
                    }
                  }
                }
              });
            }
          }
        } else {
          console.log("This browser does not support notifications.");
        }

        scheduleDiv.appendChild(appointmentDiv);
      });
    })
    .catch((error) => console.error("Error fetching data: ", error));
  // Retry every 500ms until the element with id 'vaknaam' exists
  const retryInterval = setInterval(function () {
    const vaknaamElement = document.getElementById("vaknaam");

    if (vaknaamElement) {
      if (datum === formattedDate3 || datum === formattedDate2) {
        // Element exists, save the date from dateInput to localStorage
        const dateInputValue = document.getElementById("dateInput").value;
        localStorage.setItem("LastNotificationDate", dateInputValue);

        // Stop retrying
        clearInterval(retryInterval);
      }
    }
  }, 50); // Check every 50ms
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
document.getElementById("dateInput").addEventListener("change", function () {
  const dateInput = document.getElementById("dateInput").value;
  fetchAppointments(dateInput);
});
setInterval(function() {if (document.querySelector("td")) {
document.querySelector("td").addEventListener("click", function () {
  const dateInput = document.getElementById("dateInput").value;
  fetchAppointments(dateInput);
});}}, 500);
document.getElementById("add").addEventListener("click", function () {
  const today = new Date();
  const day = today.getDate();
  const daysOfWeek = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza = daysOfWeek[today.getDay()];
  const monthName = dutchMonthNames[today.getMonth()];
  const formattedDate = `${day} ${monthName}`;
  const formattedDate1 = `${zomadiwodovrza} ${day} ${monthName}`;
  document.getElementById("dateInput").value = formattedDate1;
  fetchAppointments(formattedDate);
});
// Function to handle previous day button click
document.getElementById("previousDay").addEventListener("click", function () {
  const dateInput = document.getElementById("dateInput").value;
  if (/^[a-zA-Z]{2}\s/.test(dateInput)) {
    var [zomadiwodovrza, day, month] = dateInput.split(" ");
  } else {
    var [day, month] = dateInput.split(" ");
  }
  const monthShort = month.substring(0, 3);
  const monthIndex = dutchMonthNames.findIndex(
    (monthName) => monthName.toLowerCase() === monthShort
  );
  const currentDate = new Date();
  currentDate.setFullYear(
    currentDate.getFullYear(),
    monthIndex,
    parseInt(day) - 1
  );
  if (currentDate.getDay() == 0) {
    currentDate.setFullYear(
      currentDate.getFullYear(),
      monthIndex,
      parseInt(day) - 3
    );
  }
  if (currentDate.getDay() == 6) {
    currentDate.setFullYear(
      currentDate.getFullYear(),
      monthIndex,
      parseInt(day) - 2
    );
  }
  const daysOfWeek = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza1 = daysOfWeek[currentDate.getDay()];
  const nextDay =
    zomadiwodovrza1 +
    " " +
    currentDate.getDate() +
    " " +
    dutchMonthNames[currentDate.getMonth()];
  document.getElementById("dateInput").value = nextDay;
  fetchAppointments(nextDay);
});

// Function to handle next day button click
document.getElementById("nextDay").addEventListener("click", function () {
  const dateInput = document.getElementById("dateInput").value;
  if (/^[a-zA-Z]{2}\s/.test(dateInput)) {
    var [zomadiwodovrza, day, month] = dateInput.split(" ");
  } else {
    var [day, month] = dateInput.split(" ");
  }
  const monthShort = month.substring(0, 3);
  const monthIndex = dutchMonthNames.findIndex(
    (monthName) => monthName.toLowerCase() === monthShort
  );
  const currentDate = new Date();
  currentDate.setFullYear(
    currentDate.getFullYear(),
    monthIndex,
    parseInt(day) + 1
  );
  if (currentDate.getDay() == 0) {
    currentDate.setFullYear(
      currentDate.getFullYear(),
      monthIndex,
      parseInt(day) + 2
    );
  }
  if (currentDate.getDay() == 6) {
    currentDate.setFullYear(
      currentDate.getFullYear(),
      monthIndex,
      parseInt(day) + 3
    );
  }
  const daysOfWeek = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza1 = daysOfWeek[currentDate.getDay()];
  const nextDay =
    zomadiwodovrza1 +
    " " +
    currentDate.getDate() +
    " " +
    dutchMonthNames[currentDate.getMonth()];
  document.getElementById("dateInput").value = nextDay;
  fetchAppointments(nextDay);
});

// Fetch appointments for today when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Default to today's date
  const today = new Date();
  const day = today.getDate();
  const daysOfWeek = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza = daysOfWeek[today.getDay()];
  const monthName = dutchMonthNames[today.getMonth()];
  const formattedDate = `${day} ${monthName}`;
  const formattedDate1 = `${zomadiwodovrza} ${day} ${monthName}`;
  document.getElementById("dateInput").value = formattedDate1;
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
// Functie om de access token te verkrijgen door middel van de koppelcode.
async function fetchToken(authorizationCode, schoolName) {
  try {
    const url = `https://${schoolName}.zportal.nl/api/v3/oauth/token?grant_type=authorization_code&code=${authorizationCode}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const parsedresp = await response.json();
    const accessToken = parsedresp["access_token"];
    localStorage.setItem("access_token", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
  }
}
// Functie om dialoogvenster te verbergen
async function hideDialog() {
  const dialog = document.getElementById("dialog");
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode = document.getElementById("authorizationCode").value;
  // Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
  let accessToken = localStorage.getItem("access_token");
  if (/^\d{12}$/.test(authorizationCode)) {
    if (accessToken == null || accessToken == "[object Promise]") {
      accessToken = await fetchToken(authorizationCode, schoolName);
      localStorage.setItem("access_token", accessToken);
    }
  } else if (/^[a-z0-9]{26}$/.test(authorizationCodeLS)) {
    localStorage.setItem("access_token", authorizationCodeLS);
  }
  // Apply stored color theme on page load
  const storedColor = localStorage.getItem("color");
  if (storedColor) {
    document
      .getElementById("color-theme")
      .setAttribute("href", `${storedColor}.css`);
  }
  dialog.close();
  const dateInput = document.getElementById("dateInput").value;
  fetchAppointments(dateInput);
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

function loadPreviousDaySchedule() {
  document.getElementById("previousDay").click();
}

function loadNextDaySchedule() {
  document.getElementById("nextDay").click();
}
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

let startX;
    let startY;
    const minSwipeDistance = 50;

    // Event listeners for touch events
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    function handleTouchStart(e) {
      const touch = e.touches[0];
      startX = touch.pageX;
      startY = touch.pageY;
    }

    function handleTouchMove(e) {e.preventDefault();}

    function handleTouchEnd(e) {
      const touch = e.changedTouches[0];
      const endX = touch.pageX;
      const endY = touch.pageY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
         if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe left
          loadPreviousDaySchedule();
        } else {
          // Swipe right
          loadNextDaySchedule();
        }
       }
      }
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
