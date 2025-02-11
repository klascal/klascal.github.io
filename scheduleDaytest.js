window.onblur = function () {
  window.blurTime = performance.now();
};
window.onfocus = function () {
  const focusTime = performance.now();
  if (
    document.getElementById("dateInput").value !== "" &&
    localStorage.getItem("access_token") &&
    localStorage.getItem("schoolName") &&
    focusTime - window.blurTime >= 60000
  ) {
    fetchAppointments(document.getElementById("dateInput").value, "focus");
  }
};
const $ = (e) => document.querySelectorAll(e);
const _switches = $("body")[0];
const _colors = $("input[name='color']");

// Load saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  _switches.setAttribute("data-theme", savedTheme);
  _colors.forEach((radio) => {
    radio.checked = radio.value === savedTheme;
  });
} else {
  // Set default theme from checked radio
  const defaultTheme = document.querySelector(
    'input[name="color"]:checked'
  ).value;
  _switches.setAttribute("data-theme", defaultTheme);
}
// Get computed style from the body
const bodyStyles = getComputedStyle(document.body);

// Get the CSS variable value
const primaryLight = bodyStyles.getPropertyValue("--primary-light").trim();

// Select the meta tag
let themeMetaTag = document.querySelector('meta[name="theme-color"]');

// If the meta tag exists, update it; otherwise, create a new one
if (themeMetaTag) {
  themeMetaTag.setAttribute("content", primaryLight);
} else {
  themeMetaTag = document.createElement("meta");
  themeMetaTag.setAttribute("name", "theme-color");
  themeMetaTag.setAttribute("content", primaryLight);
  document.head.appendChild(themeMetaTag);
}

// Save theme when changed
_colors.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.checked) {
      _switches.setAttribute("data-theme", e.target.value);
      localStorage.setItem("theme", e.target.value);
      // Get computed style from the body
      const bodyStyles = getComputedStyle(document.body);

      // Get the CSS variable value
      const primaryLight = bodyStyles
        .getPropertyValue("--primary-light")
        .trim();

      // Select the meta tag
      let themeMetaTag = document.querySelector('meta[name="theme-color"]');

      // If the meta tag exists, update it; otherwise, create a new one
      if (themeMetaTag) {
        themeMetaTag.setAttribute("content", primaryLight);
      } else {
        themeMetaTag = document.createElement("meta");
        themeMetaTag.setAttribute("name", "theme-color");
        themeMetaTag.setAttribute("content", primaryLight);
        document.head.appendChild(themeMetaTag);
      }
    }
  });
});
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

const checkbox1 = document.getElementById("vakafkorting");
// Function to save checkbox state to localStorage
function saveCheckboxState1() {
  localStorage.setItem("afkorting", checkbox1.checked);
}

// Function to restore checkbox state from localStorage
function restoreCheckboxState1() {
  const savedState1 = localStorage.getItem("afkorting");
  if (savedState1 !== null) {
    checkbox1.checked = JSON.parse(savedState1);
  }
}
checkbox1.addEventListener("change", saveCheckboxState1);
// Save state when checkbox is clicked
checkbox.addEventListener("change", saveCheckboxState);
function convertH2M(timeInHour) {
  var timeParts = timeInHour.split(":");
  return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}
async function fetchAnnouncements() {
  const response = await fetch(
    "https://" +
      localStorage.getItem("schoolName") +
      ".zportal.nl/api/v3/announcements?user=~me&current=true&access_token=" +
      localStorage.getItem("access_token")
  );
  const data = await response.json();
  const appointments = data.response.data;
  var announcementsContainer = document.getElementById("schedule");
  var announcementsDiv = document.createElement("div");
  announcementsContainer.innerHTML = "";
  if (appointments.length === 0) {
    announcementsContainer.innerHTML = `<strong id="error-message" style="text-align: center; display: block"
  ><img
    src="es_geenresultaten.webp"
    alt=""
    style="text-align: center"
    width="200px"
    height="104px"
  /><br />
  Geen mededelingen gevonden.</strong
>`;
  }
  appointments.forEach((announcement) => {
    var start = announcement.start * 1000;
    start = new Date(start);
    var date = start
      .toLocaleTimeString("nl-NL", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/^0+/, "");
    announcementsDiv.innerHTML =
      "<strong>" +
      announcement.title +
      "</strong><span> " +
      date +
      "<p>" +
      announcement.text +
      "</p>";
    announcementsContainer.appendChild(announcementsDiv);
  });
}
async function userInfo(date) {
  const authorizationCode = localStorage.getItem("access_token");
  const response = await fetch(
    "https://csvincentvangogh.zportal.nl/api/v3/users/~me?fields=code,isEmployee&access_token=" +
      authorizationCode
  );
  const data = await response.json();
  const isEmployee = data.response.data[0].isEmployee;
  var userType = "student";
  if (isEmployee == true) {
    userType = "teacher";
  }
  localStorage.setItem("selectedUserType", userType);
  localStorage.setItem("userType", userType);
  fetchAppointments(date);
}
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  var week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};
function cleanupOldStorage() {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const yearTwoWeeksAgo = twoWeeksAgo.getFullYear();
  const weekTwoWeeksAgo = twoWeeksAgo.getWeek();

  Object.keys(localStorage).forEach((key) => {
    if (/^\d{4}\d+$/.test(key)) {
      // Match format YYYYW
      const year = parseInt(key.substring(0, 4), 10);
      const week = parseInt(key.substring(4), 10);

      if (
        year < yearTwoWeeksAgo ||
        (year === yearTwoWeeksAgo && week < weekTwoWeeksAgo)
      ) {
        localStorage.removeItem(key);
      }
    }
  });
}

// Function to fetch appointments for the specified date
function fetchAppointments(date, focus) {
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
      "Incorrecte datumformaat. Voer de datum in in het formaat '12 aug' of 'di 12 aug'."
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
  const userType = localStorage.getItem("userType");
  const year = startDate.getFullYear();
  let week = startDate.getWeek(); // Bereken weeknummer
  if (week < 10) week = `0${week}`; // Voeg een voorloopnul toe aan enkelcijferige weken
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

  const apiUrl = `https://${schoolName}.zportal.nl/api/v3/liveschedule?access_token=${accessToken}&${userType}=~me&week=${year}${week}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const appointments = data.response.data[0].appointments;
      // Sort appointments by start time
      appointments.sort((a, b) => a.start - b.start);
      const scheduleDiv = document.getElementById("schedule");
      scheduleDiv.innerHTML = ""; // Clear existing schedule
      // Checkt bij lege weken of het in een maand met vakanties zit en bepaalt op basis daarvan de vakantie
      if (appointments.length === 0) {
        if (monthName == "okt" || monthName == "nov") {
          scheduleDiv.setAttribute("class", "herfstVak");
        }
        if (monthName == "dec" || monthName == "jan") {
          scheduleDiv.setAttribute("class", "kerstVak");
        }
        if (monthName == "feb" || monthName == "mar") {
          scheduleDiv.setAttribute("class", "voorjaarsVak");
        }
        if (monthName == "apr" || monthName == "mei") {
          scheduleDiv.setAttribute("class", "meiVak");
        }
        if (monthName == "juli" || monthName == "aug" || monthName == "sep") {
          scheduleDiv.setAttribute("class", "zomerVak");
        }
      }
      // Filter out cancelled lessons if there are multiple lessons for the same hour
      const filteredAppointments = filterCancelledLessons(appointments);
      let i = 0;
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
          te: "Tekenen",
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
          rkn: "Rekentoets",
          pe: "Physical Education",
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
          bsa: "Bindend studieadvies",
          bo: "Bewegingsonderwijs",
          nlt: "Natuur leven technologie",
          wisd: "Wiskunde D",
          wisc: "Wiskunde C",
          wisb: "Wiskunde B",
          wisa: "Wiskunde A",
          Act: "Activiteit",
        };

        // Map subjects abbreviations to full names
        let subjectsFullNames = appointment.subjects.map(
          (subject) => subjectsMapping[subject] || subject
        );
        if (
          subjectsFullNames.toString() ===
          subjectsFullNames.toString().toUpperCase()
        ) {
          subjectsFullNames = [
            subjectsFullNames.toString().charAt(0) +
              subjectsFullNames.toString().slice(1).toLowerCase(),
          ];
        }

        if (appointment.appointmentInstance == null) {
          subjectsFullNames = appointment.actions[0].appointment.subjects.map(
            (subject) => subjectsMapping[subject] || subject
          );
          if (
            subjectsFullNames.toString() ===
            subjectsFullNames.toString().toUpperCase()
          ) {
            subjectsFullNames = [
              subjectsFullNames.toString().charAt(0) +
                subjectsFullNames.toString().slice(1).toLowerCase(),
            ];
          }
        }

        if (localStorage.getItem("afkorting") === "true") {
          subjectsFullNames = appointment.subjects;
          if (
            appointment.subjects.toString() ===
            appointment.subjects.toString().toUpperCase()
          ) {
            subjectsFullNames = [
              appointment.subjects.toString().charAt(0) +
                appointment.subjects.toString().slice(1).toLowerCase(),
            ];
          }
          if (appointment.appointmentInstance == null) {
            subjectsFullNames = appointment.actions[0].appointment.subjects;
            if (
              appointment.actions[0].appointment.subjects.toString() ===
              appointment.actions[0].appointment.subjects
                .toString()
                .toUpperCase()
            ) {
              subjectsFullNames = [
                appointment.actions[0].appointment.subjects
                  .toString()
                  .charAt(0) +
                  appointment.actions[0].appointment.subjects
                    .toString()
                    .slice(1)
                    .toLowerCase(),
              ];
            }
          }
        }

        let changeDescription = "";

        // Create appointment HTML
        const appointmentDiv = document.createElement("div");
        var timeSlot = "";
        if (!appointment.startTimeSlot) {
          timeSlot = "";
        } else {
          timeSlot = appointment.startTimeSlot;
        }
        var info = "";
        if (appointment.appointmentType === "exam") {
          info = '<span id="exam"> Toets</span>';
        }
        if (appointment.appointmentType === "activity") {
          info = '<span id="activity"> Activiteit</span>';
        }
        let warning = "";
        let warningsymbol = "";
        if (appointment.changeDescription !== "") {
          warning = appointment.changeDescription;
          warningsymbol = warning
            ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff9800" style="vertical-align: sub; margin-right: 2.5px;"><path d="M120-103q-18 0-32.09-8.8Q73.83-120.6 66-135q-8-14-8.5-30.6Q57-182.19 66-198l359-622q9-16 24.1-23.5 15.11-7.5 31-7.5 15.9 0 30.9 7.5 15 7.5 24 23.5l359 622q9 15.81 8.5 32.4Q902-149 894-135t-22 23q-14 9-32 9H120Zm360-140q18 0 31.5-13.5T525-288q0-18-13.5-31T480-332q-18 0-31.5 13T435-288q0 18 13.5 31.5T480-243Zm0-117q17 0 28.5-11.5T520-400v-109q0-17-11.5-28.5T480-549q-17 0-28.5 11.5T440-509v109q0 17 11.5 28.5T480-360Z"/></svg>'
            : "";
        }
        if (appointment.appointmentInstance == null) {
          warning = "Afgemeld";
          warningsymbol = warning
            ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" style="margin-right: 2.5px"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z"/></svg>`
            : "";
        }
        if (appointment.schedulerRemark !== "") {
          warning = appointment.schedulerRemark;
          warningsymbol = warning
            ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" style="margin-right: 2.5px"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`
            : "";
        }
        if (
          appointment.schedulerRemark !== "" &&
          appointment.changeDescription !== ""
        ) {
          warning =
            appointment.schedulerRemark +
            "<br>" +
            appointment.changeDescription;
          warningsymbol = warning
            ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" style="margin-right: 1px"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff9800" style="vertical-align: sub; margin-right: 2.5px;"><path d="M120-103q-18 0-32.09-8.8Q73.83-120.6 66-135q-8-14-8.5-30.6Q57-182.19 66-198l359-622q9-16 24.1-23.5 15.11-7.5 31-7.5 15.9 0 30.9 7.5 15 7.5 24 23.5l359 622q9 15.81 8.5 32.4Q902-149 894-135t-22 23q-14 9-32 9H120Zm360-140q18 0 31.5-13.5T525-288q0-18-13.5-31T480-332q-18 0-31.5 13T435-288q0 18 13.5 31.5T480-243Zm0-117q17 0 28.5-11.5T520-400v-109q0-17-11.5-28.5T480-549q-17 0-28.5 11.5T440-509v109q0 17 11.5 28.5T480-360Z"/></svg>`
            : "";
        }
        const teachers =
          "(" + appointment.teachers.filter((e) => e != user).join(", ") + ")";
        appointmentDiv.innerHTML = `
          <p><strong id="vaknaam">${subjectsFullNames.join(
            ", "
          )}</strong><strong style="float: right; margin-right: 9px" id="timeSlot">${info}${timeSlot}</strong></p>
          <p>${startTimeString} - ${endTimeString} <span style="margin-left: 10px;">${appointment.locations.join(
          ", "
        )} ${teachers == "()" ? "" : teachers} <span class="warning">
                  ${warningsymbol}
                  <span class="warningMessage">${warning}</span>
                </span></span></p>
        <p class="className">${appointment.groups.join(", ")}</p>
        `;
        appointmentDiv.classList.add(
          appointment.cancelled ? "cancelled" : appointment.appointmentType
        );
        if (appointment.appointmentInstance == null) {
          appointmentDiv.classList.remove("cancelled");
          appointmentDiv.classList.add("notEnrolled");
        }
        if (i >= -1 && window.endTime) {
          var startDecimal = convertH2M(startTimeString);
          var endDecimal = convertH2M(window.endTime);
          var pauzeTijd = startDecimal - endDecimal;
        }
        if (i >= 1 && startTimeString != window.endTime) {
          appointmentDiv.style = "margin-top: 20px";
          if (pauzeTijd >= 280) {
            appointmentDiv.style = "margin-top: 525px";
          } else if (pauzeTijd >= 240) {
            appointmentDiv.style = "margin-top: 450px";
          } else if (pauzeTijd >= 200) {
            appointmentDiv.style = "margin-top: 375px";
          } else if (pauzeTijd >= 160) {
            appointmentDiv.style = "margin-top: 300px";
          } else if (pauzeTijd >= 120) {
            appointmentDiv.style = "margin-top: 225px";
          } else if (pauzeTijd >= 80) {
            appointmentDiv.style = "margin-top: 150px";
          } else if (pauzeTijd >= 40) {
            appointmentDiv.style = "margin-top: 75px";
          }
        }
        if (i == 0 || pauzeTijd <= -1) {
          if (startTimeString == "8:15") {
            appointmentDiv.style = "margin-top: 0";
          } else if (startTimeString == "8:55") {
            appointmentDiv.style = "margin-top: 75px";
          } else if (startTimeString == "9:05") {
            appointmentDiv.style = "margin-top: 75px";
          } else if (startTimeString == "9:35") {
            appointmentDiv.style = "margin-top: 150px";
          } else if (startTimeString == "10:10") {
            appointmentDiv.style = "margin-top: 150px";
          } else if (startTimeString == "10:30") {
            appointmentDiv.style = "margin-top: 225px";
          } else if (startTimeString == "11:00") {
            appointmentDiv.style = "margin-top: 225px";
          } else if (startTimeString == "11:10") {
            appointmentDiv.style = "margin-top: 300px";
          } else if (startTimeString == "12:15") {
            appointmentDiv.style = "margin-top: 300px";
          } else if (startTimeString == "13:05") {
            appointmentDiv.style = "margin-top: 375px";
          } else if (startTimeString == "14:10") {
            appointmentDiv.style = "margin-top: 375px";
          } else if (startTimeString == "15:00") {
            appointmentDiv.style = "margin-top: 450px";
          }
        }
        window.endTime = endTimeString;
        i++;
        if (focus) {
          if (appointmentDiv.getAttribute("style") != null) {
            appointmentDiv.style =
              appointmentDiv.getAttribute("style") + "; animation-name: none";
          } else {
            appointmentDiv.style = "animation-name: none";
          }
        }
        const dago = Date.now();
        if (dago >= appointment.end * 1000) {
          appointmentDiv.classList.add("test");
        }
        localStorage.setItem("LaatsteSync", dago);
        // Check if the browser supports notifications
        if (
          localStorage.getItem("checkboxState") === "true" &&
          localStorage.getItem("checkboxState") != null
        ) {
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
          }
          // If the permission is not granted yet, request for it
          else if (
            localStorage.getItem("checkboxState") === "true" &&
            localStorage.getItem("checkboxState") != null
          ) {
            if (Notification.permission !== "denied") {
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
        }
        appointmentDiv.classList.add(startTime.getDay());
        scheduleDiv.appendChild(appointmentDiv);
      });
    })
    .catch((error) =>
      console.error("Probleem met het laden van het rooster: ", error)
    )
    .then((data) => {
      // Filter rooster van de week op basis van dag
      var week1 = startDate.getWeek();
      var yearWeek = year + "" + week1;
      var div1 = document.createElement("span");
      var scheduleDiv = document.getElementById("schedule");
      div1.classList.add("1", "container");
      scheduleDiv.appendChild(div1);

      [...document.getElementsByClassName("1")].forEach((element) => {
        if (element !== div1) {
          div1.appendChild(element);
        }
      });
      var div2 = document.createElement("span");
      div2.classList.add("2", "container");
      scheduleDiv.appendChild(div2);

      [...document.getElementsByClassName("2")].forEach((element) => {
        if (element !== div2) {
          div2.appendChild(element);
        }
      });
      var div3 = document.createElement("span");
      div3.classList.add("3", "container");
      scheduleDiv.appendChild(div3);

      [...document.getElementsByClassName("3")].forEach((element) => {
        if (element !== div3) {
          div3.appendChild(element);
        }
      });
      var div4 = document.createElement("span");
      div4.classList.add("4", "container");
      scheduleDiv.appendChild(div4);

      [...document.getElementsByClassName("4")].forEach((element) => {
        if (element !== div4) {
          div4.appendChild(element);
        }
      });
      var div5 = document.createElement("span");
      div5.classList.add("5", "container");
      scheduleDiv.appendChild(div5);

      [...document.getElementsByClassName("5")].forEach((element) => {
        if (element !== div5) {
          div5.appendChild(element);
        }
      });
      var div6 = document.createElement("span");
      div6.classList.add("6", "container");
      scheduleDiv.appendChild(div6);

      [...document.getElementsByClassName("6")].forEach((element) => {
        if (element !== div6) {
          div6.appendChild(element);
        }
      });
      var div0 = document.createElement("span");
      div0.classList.add("0", "container");
      scheduleDiv.appendChild(div0);

      [...document.getElementsByClassName("0")].forEach((element) => {
        if (element !== div0) {
          div0.appendChild(element);
        }
      });
      // Laat bij lege dagen een bericht zien en laat vakanties zien
      [1, 2, 3, 4, 5, 6, 0].forEach((num) => {
        let element = document.querySelector(`.${CSS.escape(num)}`);
        if (element && element.innerHTML.trim() === "") {
          element.innerHTML = `<strong id="error-message" style="text-align: center; display: block"
        ><img
          src="es_geenresultaten.webp"
          alt=""
          style="text-align: center"
          width="200px"
          height="104px"
        /><br />
        Geen rooster gevonden voor deze dag.</strong
      >`;
          if (document.querySelector(".herfstVak")) {
            element.innerHTML = "<div>Herfstvakantie</div>" + element.innerHTML;
          }
          if (document.querySelector(".kerstVak")) {
            element.innerHTML = "<div>Kerstvakantie</div>" + element.innerHTML;
          }
          if (document.querySelector(".voorjaarsVak")) {
            element.innerHTML =
              "<div>Voorjaarsvakantie</div>" + element.innerHTML;
          }
          if (document.querySelector(".meiVak")) {
            element.innerHTML = "<div>Meivakantie</div>" + element.innerHTML;
          }
          if (document.querySelector(".zomerVak")) {
            element.innerHTML = "<div>Zomervakantie</div>" + element.innerHTML;
          }
        }
      });
      localStorage.setItem(yearWeek, scheduleDiv.innerHTML);
    });

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
  if (/^[a-zA-Z]{2}\s/.test(dateInput)) {
    var [zomadiwodovrza1, day1, month] = dateInput.split(" ");
  } else {
    var [day1, month] = dateInput.split(" ");
  }
  const monthShort = month.substring(0, 3);
  const monthIndex = dutchMonthNames.findIndex(
    (monthName) => monthName.toLowerCase() === monthShort
  );
  const currentDate = new Date();
  const ActualCurrentDate = new Date();
  currentDate.setFullYear(
    currentDate.getFullYear(),
    monthIndex,
    parseInt(day1)
  );
  var currentWeek = currentDate.getWeek();
  var currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDay();
  const today = new Date();
  const nowWeek = today.getWeek();
  if (currentDay == 1) {
    document.getElementById("schedule").style = "right: 0;";
  } else if (currentDay == 2) {
    document.getElementById("schedule").style = "right: 100vw;";
  } else if (currentDay == 3) {
    document.getElementById("schedule").style = "right: 200vw;";
  } else if (currentDay == 4) {
    document.getElementById("schedule").style = "right: 300vw;";
  } else if (currentDay == 5) {
    document.getElementById("schedule").style = "right: 400vw;";
  } else if (currentDay == 6) {
    document.getElementById("schedule").style = "right: 500vw;";
  } else if (currentDay == 0) {
    document.getElementById("schedule").style = "right: 600vw;";
  }
  const ActualCurrentDateInfo =
    ActualCurrentDate.getDate() + "" + ActualCurrentDate.getMonth();
  const currentDateInfo = currentDate.getDate() + "" + currentDate.getMonth();
  if (ActualCurrentDateInfo != currentDateInfo) {
    document.getElementById("add").setAttribute("style", "display: block;");
  }
  if (ActualCurrentDateInfo == currentDateInfo) {
    document.getElementById("add").setAttribute("style", "display: none;");
  }
  if (currentWeek - nowWeek != 0) {
    if (localStorage.getItem(currentYear + "" + currentWeek)) {
      document.getElementById("schedule").innerHTML = localStorage.getItem(
        currentYear + "" + currentWeek
      );
    } else {
      document.getElementById("schedule").innerHTML = "";
    }
    fetchAppointments(dateInput);
  }
});
document.getElementById("add").addEventListener("click", function () {
  const dateInput = document.getElementById("dateInput").value;
  if (/^[a-zA-Z]{2}\s/.test(dateInput)) {
    var [zomadiwodovrza1, day1, month] = dateInput.split(" ");
  } else {
    var [day1, month] = dateInput.split(" ");
  }
  const monthShort = month.substring(0, 3);
  const monthIndex = dutchMonthNames.findIndex(
    (monthName) => monthName.toLowerCase() === monthShort
  );
  const previousDate = new Date();
  previousDate.setFullYear(
    previousDate.getFullYear(),
    monthIndex,
    parseInt(day1)
  );
  const previousWeek = previousDate.getWeek();
  const today = new Date();
  const day = today.getDate();
  const currentWeek = today.getWeek();
  var currentYear = today.getFullYear();
  const currentDay = today.getDay();
  const daysOfWeek = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza = daysOfWeek[today.getDay()];
  const monthName = dutchMonthNames[today.getMonth()];
  const formattedDate = `${day} ${monthName}`;
  const formattedDate1 = `${zomadiwodovrza} ${day} ${monthName}`;
  document.getElementById("dateInput").value = formattedDate1;
  if (currentDay == 1) {
    document.getElementById("schedule").style = "right: 0;";
  } else if (currentDay == 2) {
    document.getElementById("schedule").style = "right: 100vw;";
  } else if (currentDay == 3) {
    document.getElementById("schedule").style = "right: 200vw;";
  } else if (currentDay == 4) {
    document.getElementById("schedule").style = "right: 300vw;";
  } else if (currentDay == 5) {
    document.getElementById("schedule").style = "right: 400vw;";
  } else if (currentDay == 6) {
    document.getElementById("schedule").style = "right: 500vw;";
  } else if (currentDay == 0) {
    document.getElementById("schedule").style = "right: 600vw;";
  }
  if (currentWeek - previousWeek != 0) {
    if (localStorage.getItem(currentYear + "" + currentWeek)) {
      document.getElementById("schedule").innerHTML = localStorage.getItem(
        currentYear + "" + currentWeek
      );
    } else {
      document.getElementById("schedule").innerHTML = "";
    }
    fetchAppointments(formattedDate);
  }
  document.getElementById("add").setAttribute("style", "display: none;");
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
  const previousDate = new Date();
  previousDate.setFullYear(
    previousDate.getFullYear(),
    monthIndex,
    parseInt(day)
  );
  var previousWeek = previousDate.getWeek();
  const ActualCurrentDate = new Date();
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
  var currentWeek = currentDate.getWeek();
  var currentYear = currentDate.getFullYear();
  var currentDay = currentDate.getDay();
  const daysOfWeek = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza1 = daysOfWeek[currentDate.getDay()];
  const nextDay =
    zomadiwodovrza1 +
    " " +
    currentDate.getDate() +
    " " +
    dutchMonthNames[currentDate.getMonth()];
  document.getElementById("dateInput").value = nextDay;
  if (currentDay == 1) {
    document.getElementById("schedule").style =
      "animation: day1left 0.1s ease-in-out forwards; right: 0;";
  } else if (currentDay == 2) {
    document.getElementById("schedule").style =
      "animation: day2left 0.1s ease-in-out forwards; right: 100vw;";
  } else if (currentDay == 3) {
    document.getElementById("schedule").style =
      "animation: day3left 0.1s ease-in-out forwards; right: 200vw;";
  } else if (currentDay == 4) {
    document.getElementById("schedule").style =
      "animation: day4left 0.1s ease-in-out forwards; right: 300vw;";
  } else if (currentDay == 5) {
    document.getElementById("schedule").style = "right: 400vw;";
  } else if (currentDay == 6) {
    document.getElementById("schedule").style = "right: 500vw;";
  } else if (currentDay == 0) {
    document.getElementById("schedule").style = "right: 600vw;";
  }
  const ActualCurrentDateInfo =
    ActualCurrentDate.getDate() + "" + ActualCurrentDate.getMonth();
  const currentDateInfo = currentDate.getDate() + "" + currentDate.getMonth();
  if (ActualCurrentDateInfo != currentDateInfo) {
    document.getElementById("add").setAttribute("style", "display: block;");
  }
  if (ActualCurrentDateInfo == currentDateInfo) {
    document.getElementById("add").setAttribute("style", "display: none;");
  }
  if (currentWeek - previousWeek != 0) {
    if (localStorage.getItem(currentYear + "" + currentWeek)) {
      document.getElementById("schedule").innerHTML = localStorage.getItem(
        currentYear + "" + currentWeek
      );
    } else {
      document.getElementById("schedule").innerHTML = "";
    }
    fetchAppointments(nextDay);
  }
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
  const previousDate = new Date();
  previousDate.setFullYear(
    previousDate.getFullYear(),
    monthIndex,
    parseInt(day)
  );
  var previousWeek = previousDate.getWeek();
  const currentDate = new Date();
  const ActualCurrentDate = new Date();
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
  var currentWeek = currentDate.getWeek();
  var currentYear = currentDate.getFullYear();
  var currentDay = currentDate.getDay();
  const daysOfWeek = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza1 = daysOfWeek[currentDate.getDay()];
  const nextDay =
    zomadiwodovrza1 +
    " " +
    currentDate.getDate() +
    " " +
    dutchMonthNames[currentDate.getMonth()];
  document.getElementById("dateInput").value = nextDay;
  if (currentDay == 1) {
    document.getElementById("schedule").style = "right: 0;";
  } else if (currentDay == 2) {
    document.getElementById("schedule").style =
      "animation: day2 0.1s ease-in-out forwards; right: 100vw;";
  } else if (currentDay == 3) {
    document.getElementById("schedule").style =
      "animation: day3 0.1s ease-in-out forwards; right: 200vw;";
  } else if (currentDay == 4) {
    document.getElementById("schedule").style =
      "animation: day4 0.1s ease-in-out forwards; right: 300vw;";
  } else if (currentDay == 5) {
    document.getElementById("schedule").style =
      "animation: day5 0.1s ease-in-out forwards; right: 400vw;";
  } else if (currentDay == 6) {
    document.getElementById("schedule").style = "right: 500vw;";
  } else if (currentDay == 0) {
    document.getElementById("schedule").style = "right: 600vw;";
  }
  const ActualCurrentDateInfo =
    ActualCurrentDate.getDate() + "" + ActualCurrentDate.getMonth();
  const currentDateInfo = currentDate.getDate() + "" + currentDate.getMonth();
  if (ActualCurrentDateInfo != currentDateInfo) {
    document.getElementById("add").setAttribute("style", "display: block;");
  }
  if (ActualCurrentDateInfo == currentDateInfo) {
    document.getElementById("add").setAttribute("style", "display: none;");
  }
  if (currentWeek - previousWeek != 0) {
    if (localStorage.getItem(currentYear + "" + currentWeek)) {
      document.getElementById("schedule").innerHTML = localStorage.getItem(
        currentYear + "" + currentWeek
      );
    } else {
      document.getElementById("schedule").innerHTML = "";
    }
    fetchAppointments(nextDay);
  }
});

// Fetch appointments for today when the page loads
document.addEventListener("DOMContentLoaded", function () {
  cleanupOldStorage();
  restoreCheckboxState();
  restoreCheckboxState1();
  // Default to today's date
  const today = new Date();
  const day = today.getDate();
  const currentDay = today.getDay();
  const daysOfWeek = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const zomadiwodovrza = daysOfWeek[today.getDay()];
  const monthName = dutchMonthNames[today.getMonth()];
  const formattedDate = `${day} ${monthName}`;
  const formattedDate1 = `${zomadiwodovrza} ${day} ${monthName}`;
  document.getElementById("dateInput").value = formattedDate1;
  if (currentDay == 1) {
    document.getElementById("schedule").style = "right: 0;";
  } else if (currentDay == 2) {
    document.getElementById("schedule").style = "right: 100vw;";
  } else if (currentDay == 3) {
    document.getElementById("schedule").style = "right: 200vw;";
  } else if (currentDay == 4) {
    document.getElementById("schedule").style = "right: 300vw;";
  } else if (currentDay == 5) {
    document.getElementById("schedule").style = "right: 400vw;";
  } else if (currentDay == 6) {
    document.getElementById("schedule").style = "right: 500vw;";
  } else if (currentDay == 0) {
    document.getElementById("schedule").style = "right: 600vw;";
  }
  if (
    localStorage.getItem("access_token") &&
    localStorage.getItem("schoolName") &&
    localStorage.getItem("userType")
  ) {
    fetchAppointments(formattedDate);
  } else if (
    !localStorage.getItem("userType") &&
    localStorage.getItem("access_token")
  ) {
    userInfo(formattedDate);
  }
});

// Sla schoolnaam en token op
schoolName.value = localStorage.getItem("schoolName");
schoolName.oninput = () => {
  localStorage.setItem("schoolName", schoolName.value);
};
const authorizationCode1 = document.getElementById("authorizationCode");
authorizationCode1.value = localStorage.getItem("authorizationCode");
authorizationCode1.oninput = () => {
  localStorage.setItem("authorizationCode", authorizationCode1.value);
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
    console.error(
      "Probleem met het ophalen van de access_token:",
      error.message
    );
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
  dialog.close();
  const dateInput = document.getElementById("dateInput").value;
  if (
    localStorage.getItem("access_token") &&
    localStorage.getItem("schoolName") &&
    localStorage.getItem("userType")
  ) {
    fetchAppointments(dateInput);
  } else if (
    !localStorage.getItem("userType") &&
    localStorage.getItem("access_token")
  ) {
    userInfo(dateInput);
  }
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
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchend", handleTouchEnd, false);

function handleTouchStart(e) {
  const touch = e.touches[0];
  startX = touch.pageX;
  startY = touch.pageY;
}

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
