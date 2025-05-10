const dialogs = document.querySelectorAll("dialog");
for (const dialog of dialogs) {
  if (typeof dialog.showModal !== "function") {
    dialogPolyfill.registerDialog(dialog);
  }
}
let d = new Date();
d = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
// Update de tijdlijn elke 10 seconden
let multiples = 1.75;
if (localStorage.getItem("dag") === "true") {
  multiples = 1.3;
} else if (localStorage.getItem("klas") === "true") {
  multiples = 2;
}
let topY =
  (Number.parseInt(d.split(":")[1]) +
    (Number.parseInt(d.split(":")[0]) -
      localStorage.getItem("decimalStartTime")) *
      60) *
    multiples +
  80;
setInterval(() => {
  let d = new Date();
  d = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  multiples = 1.4;
  if (localStorage.getItem("dag") === "true") {
    multiples = 1.3;
  } else if (localStorage.getItem("ltr") === "true") {
    multiples = 2.2;
  } else if (localStorage.getItem("klas") === "true") {
    multiples = 2;
  }
  topY =
    (Number.parseInt(d.split(":")[1]) +
      (Number.parseInt(d.split(":")[0]) -
        localStorage.getItem("decimalStartTime")) *
        60) *
      multiples +
    27;
  if (document.querySelector(".timeline")) {
    if (
      localStorage.getItem("ltr") !== "true" ||
      localStorage.getItem("dag") === "true"
    ) {
      document.querySelector(".timeline").style.top = `${topY}px`;
      document.querySelector(".timeline").style.left = "0";
      document.querySelector(".timeline").style.height = "2px";
      document.querySelector(".timeline").style.width = "500vw";
    } else {
      document.querySelector(".timeline").style.top = "0";
      document.querySelector(".timeline").style.left = `${topY}px`;
      document.querySelector(".timeline").style.height = "calc(100vh - 56px)";
      document.querySelector(".timeline").style.width = "2px";
    }
  }
}, 100);
const timeline = document.createElement("div");
timeline.classList.add("timeline");
timeline.style = `top: ${topY}px;`;
// Haal elke 1.5 minuut het rooster op
setInterval(() => {
  handleFormSubmit();
}, 90000);
sessionStorage.setItem("transform", "");
sessionStorage.setItem("week", "");
sessionStorage.setItem("year", "");
const startTime = document.getElementById("startTime");
startTime.value = localStorage.getItem("startTime") || "08:00";
const $ = (e) => document.querySelectorAll(e);
const _switches = $("body")[0];
const _colors = $("input[name='color']");
// Load saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  _switches.setAttribute("data-theme", savedTheme);
  for (const radio of _colors) {
    radio.checked = radio.value === savedTheme;
  }
} else {
  // Set default theme from checked radio
  const defaultTheme = document.querySelector(
    'input[name="color"]:checked'
  ).value;
  _switches.setAttribute("data-theme", defaultTheme);
}
// Save theme when changed
for (const radio of _colors) {
  radio.addEventListener("change", (e) => {
    if (e.target.checked) {
      _switches.setAttribute("data-theme", e.target.value);
      localStorage.setItem("theme", e.target.value);
    }
  });
}
if (!localStorage.getItem("dag")) {
  if (window.innerWidth < 500) {
    localStorage.setItem("dag", "true");
  }
}
if (!localStorage.getItem("afkorting")) {
  localStorage.setItem("afkorting", "true");
}
function setThemeColor() {
  const metaTag = document.querySelector('meta[name="theme-color"]');
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  metaTag.setAttribute("content", isDarkMode ? "#2a2a2f" : "#eee");
}
setThemeColor();
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", setThemeColor);
function show(id, title, hide) {
  const content = document.querySelector(".container");
  const children = content.querySelectorAll("div");
  if (!document.startViewTransition) {
    children.forEach((div) => {
      if (div.id === id) {
        div.style.display = "block";
      } else {
        div.removeAttribute("style");
      }
    });
    if (id !== "submenus" && hide !== "hide") {
      document.querySelector("#dialog h2").innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" onclick="show(`submenus`, `Instellingen`)"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>' +
        title;
    } else {
      if (
        document.querySelector("#dialog #closeBtn").innerText === "Volgende" &&
        id !== "koppelingen"
      ) {
        document.querySelector("#dialog #closeBtn").innerText = "Sluiten";
        document
          .querySelector("#dialog #closeBtn")
          .setAttribute("onclick", "hideDialog()");
      }
      document.querySelector("#dialog h2").innerHTML = title;
    }
    return;
  }
  document.startViewTransition(() => {
    const content = document.querySelector(".container");
    const children = content.querySelectorAll("div");
    children.forEach((div) => {
      if (div.id === id) {
        div.style.display = "block";
      } else {
        div.removeAttribute("style");
      }
    });
    if (id !== "submenus" && hide !== "hide") {
      document.querySelector("#dialog h2").innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" onclick="show(`submenus`, `Instellingen`)"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>' +
        title;
    } else {
      if (
        document.querySelector("#dialog #closeBtn").innerText === "Volgende" &&
        id !== "koppelingen"
      ) {
        document.querySelector("#dialog #closeBtn").innerText = "Sluiten";
        document
          .querySelector("#dialog #closeBtn")
          .setAttribute("onclick", "hideDialog()");
      }
      document.querySelector("#dialog h2").innerHTML = title;
    }
  });
}
const checkbox = document.getElementById("vakafkorting");
// Function to save checkbox state to localStorage
function saveCheckboxState() {
  localStorage.setItem("afkorting", checkbox.checked);
}
// Function to restore checkbox state from localStorage
function restoreCheckboxState() {
  const savedState = localStorage.getItem("afkorting");
  if (savedState !== null) {
    checkbox.checked = JSON.parse(savedState);
  }
}
checkbox.addEventListener("change", saveCheckboxState);
restoreCheckboxState();
const checkbox1 = document.getElementById("afkortingHl");
// Function to save checkbox state to localStorage
function saveCheckboxState1() {
  localStorage.setItem("hoofdletter", checkbox1.checked);
}
// Function to restore checkbox state from localStorage
function restoreCheckboxState1() {
  const savedState1 = localStorage.getItem("hoofdletter");
  if (savedState1 !== null) {
    checkbox1.checked = JSON.parse(savedState1);
  }
}
checkbox1.addEventListener("change", saveCheckboxState1);
restoreCheckboxState1();
const checkbox3 = document.getElementById("klas");
// Function to save checkbox state to localStorage
function saveCheckboxState3() {
  localStorage.setItem("klas", checkbox3.checked);
}
// Function to restore checkbox state from localStorage
function restoreCheckboxState3() {
  const savedState3 = localStorage.getItem("klas");
  if (savedState3 !== null) {
    checkbox3.checked = JSON.parse(savedState3);
  }
}
checkbox3.addEventListener("change", saveCheckboxState3);
restoreCheckboxState3();
async function userInfo() {
  const authorizationCode = localStorage.getItem("access_token");
  const response = await fetch(
    "https://csvincentvangogh.zportal.nl/api/v3/users/~me?fields=code,isEmployee",
    {
      headers: {
        Authorization: `Bearer ${authorizationCode}`,
      },
    }
  );
  const data = await response.json();
  let userType = "student";
  let userCode = "undefined";
  if (data.response.data[0]) {
    const isEmployee = data.response.data[0].isEmployee;
    userCode = data.response.data[0].code;
    if (isEmployee === true) userType = "teacher";
  }
  localStorage.setItem("userType", userType);
  localStorage.setItem("user", userCode);
  if (userCode === "baas") localStorage.setItem("ltr", "true");
  handleFormSubmit();
}
if (localStorage.getItem("access_token")) {
  if (!localStorage.getItem("userType") || !localStorage.getItem("user")) {
    userInfo();
  }
}
const checkbox2 = document.getElementById("checkbox1");
// Function to save checkbox state to localStorage
async function saveCheckboxState2() {
  localStorage.setItem("ltr", checkbox2.checked);
  handleFormSubmit();
}

// Function to restore checkbox state from localStorage
function restoreCheckboxState2() {
  const savedState2 = localStorage.getItem("ltr");
  if (savedState2 !== null) {
    checkbox2.checked = JSON.parse(savedState2);
  }
}
restoreCheckboxState2();
checkbox2.addEventListener("change", saveCheckboxState2);
// Functie om rooster op te halen met behulp van fetch
async function fetchSchedule(
  authorizationCode,
  userType,
  year,
  week,
  schoolName
) {
  try {
    const response = await fetch(
      `https://${schoolName}.zportal.nl/api/v3/liveschedule?${userType}=~me&week=${year}${week}`,
      {
        headers: {
          Authorization: `Bearer ${authorizationCode}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const scheduleData = await response.json();
    displaySchedule(scheduleData);
  } catch (error) {
    console.error("Error fetching schedule: ", error.message);
    displayError("Error fetching schedule. Please try again.");
  }
}

// Functie om rooster weer te geven
function displaySchedule(scheduleData) {
  if (localStorage.getItem("dag") === "true") {
    document.getElementById("week").style = "display: none";
    document.getElementById("ltr").style =
      "vertical-align: middle;background-color: transparent;margin-left: 5px;transform: translateY(-48px);opacity:0;";
    document.getElementById("dayBtn").innerText = "✓ Dag";
    document.getElementById("weekBtn").innerText = "Week";
    document.getElementById("dayBtn").classList.add("selected");
    document.getElementById("weekBtn").classList.remove("selected");
  } else {
    document.getElementById("week").style = "";
    document.getElementById("ltr").style = `vertical-align: middle;
          background-color: transparent;
          margin-left: 5px;`;
    document.getElementById("weekBtn").innerText = "✓ Week";
    document.getElementById("dayBtn").innerText = "Dag";
    document.getElementById("weekBtn").classList.add("selected");
    document.getElementById("dayBtn").classList.remove("selected");
  }
  const scheduleElement = document.getElementById("schedule");
  const appointments = scheduleData.response.data[0].appointments;
  const user = scheduleData.response.data[0].user;

  let daysOfWeek = [
    "Zondag",
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag",
  ];
  const monthNames = [
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
  if (localStorage.getItem("dag") === "true") {
    daysOfWeek = daysOfWeek.map((day) => day.toLowerCase());
  }
  if (window.innerWidth < 500 && localStorage.getItem("dag") !== "true") {
    daysOfWeek = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
  }
  if (localStorage.getItem("dag") === "true") {
    const datum = new Date();
    const vandaag = datum.getDay();
    let transform = -600;
    if (vandaag !== 0) {
      transform = (vandaag - 1) * -100;
    }
    if (sessionStorage.getItem("transform")) {
      transform = sessionStorage.getItem("transform");
    }
    document.getElementById(
      "schedule"
    ).style = `width:500vw;transform:translateX(${transform}vw);transition:none;`;
    setTimeout(() => {
      document.getElementById(
        "schedule"
      ).style = `width:500vw;transform:translateX(${transform}vw);`;
    }, 100);
    let resizeTimeout;
    window.addEventListener("resize", () => {
      const schedule = document.getElementById("schedule");
      const transform = schedule.style.transform.substring(11, 15);
      document.getElementById(
        "schedule"
      ).style = `width:500vw;transform:translateX(${transform}vw);transition:none;`;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        document.getElementById(
          "schedule"
        ).style = `width:500vw;transform:translateX(${transform}vw);`;
      }, 200);
    });
  }

  // Groepeer afspraken per dag
  const appointmentsByDay = appointments.reduce((acc, appointment) => {
    const week = document.getElementById("week");
    const currentDate = new Date(appointment.start * 1000);
    let currentDayName = daysOfWeek[currentDate.getDay()];
    const currentMonthName = monthNames[currentDate.getMonth()];

    if (localStorage.getItem("dag") === "true") {
      currentDayName += ` ${currentDate.getDate()} ${currentMonthName}`;
      currentDayName = `${week.innerText}, ${currentDayName}`;
      week.style = "display: none";
    }
    if (!acc[currentDayName]) {
      acc[currentDayName] = [];
    }
    acc[currentDayName].push(appointment);

    return acc;
  }, {});

  // Voeg ontbrekende dagen toe met lege arrays
  daysOfWeek.forEach((day, index) => {
    let displayDay = day;
    if (localStorage.getItem("dag") === "true") {
      // Vind een datum in de huidige week die overeenkomt met deze dag
      const week = document.getElementById("week");
      const today = new Date();
      const ufuf = (Number(week.innerText.substring(5)) - today.getWeek()) * 7;
      today.setDate(today.getDate() + ufuf);
      if (sessionStorage.getItem("year")) {
        today.setFullYear(Number(sessionStorage.getItem("year")));
      }
      const date = new Date(today.setDate(today.getDate() - today.getDay()));
      date.setDate(date.getDate() + index);
      const day = new Date();
      if (day.getDay() === 0) {
        date.setDate(date.getDate() - 7);
      }
      if (index === 0) {
        date.setDate(date.getDate() + 7);
      }
      const dayNum = date.getDate();
      const monthName = monthNames[date.getMonth()];
      displayDay += ` ${dayNum} ${monthName}`;
      displayDay = `Week ${date.getWeek()}, ${displayDay}`;
    }
    if (!appointmentsByDay[displayDay]) {
      appointmentsByDay[displayDay] = [];
    }
  });

  const scheduleHTML = Object.entries(appointmentsByDay)
    .sort(([a], [b]) => {
      const order = ["ma", "di", "wo", "do", "vr", "za", "zo"];
      const indexA = order.findIndex((day) => a.toLowerCase().includes(day));
      const indexB = order.findIndex((day) => b.toLowerCase().includes(day));
      return indexA - indexB;
    })
    .map(([dayName, appointments]) => {
      const appointmentsHTML = appointments
        .map((appointment) => {
          // Format start and end time
          let startTime = new Date(appointment.start * 1000)
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(/^0+/, "");
          let endTime = new Date(appointment.end * 1000)
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(/^0+/, "");
          if (
            window.innerWidth > 365 ||
            localStorage.getItem("dag") === "true"
          ) {
            startTime += "-";
          } else {
            endTime = "";
          }
          let left =
            (Number.parseInt(startTime.split(":")[1]) +
              (Number.parseInt(startTime.split(":")[0]) -
                localStorage.getItem("decimalStartTime")) *
                60) *
            1.4;
          let width =
            (Number.parseInt(endTime.split(":")[1]) +
              (Number.parseInt(endTime.split(":")[0]) -
                localStorage.getItem("decimalStartTime")) *
                60) *
              1.4 -
            left -
            20;
          positie = `margin-top:${left}px;height:${width}px`;
          if (width < 55) {
            positie += ";line-height:1.1";
          }
          let styling = "";
          let bottom = "";
          let ltr = "";
          if (localStorage.getItem("dag") === "true") {
            left =
              (Number.parseInt(startTime.split(":")[1]) +
                (Number.parseInt(startTime.split(":")[0]) -
                  localStorage.getItem("decimalStartTime")) *
                  60) *
              1.3;
            width =
              (Number.parseInt(endTime.split(":")[1]) +
                (Number.parseInt(endTime.split(":")[0]) -
                  localStorage.getItem("decimalStartTime")) *
                  60) *
                1.3 -
              left -
              24;
            if (width < 37) {
              positie += ";line-height:1.1";
              bottom = "bottom: 0px";
            }
            styling = "display: inline;margin-right: 5.55px";
            positie = `width: calc(100vw - 27px);margin-top:${left}px;height:${width}px`;
          } else if (
            localStorage.getItem("ltr") === "true" &&
            window.innerWidth > 676
          ) {
            left =
              (Number.parseInt(startTime.split(":")[1]) +
                (Number.parseInt(startTime.split(":")[0]) -
                  localStorage.getItem("decimalStartTime")) *
                  60) *
              2.4;
            width =
              (Number.parseInt(endTime.split(":")[1]) +
                (Number.parseInt(endTime.split(":")[0]) -
                  localStorage.getItem("decimalStartTime")) *
                  60) *
                2.4 -
              left -
              24;
            positie = `margin-left:${left}px;width:${width}px`;
            if (appointment.appointmentInstance == null) {
              positie += ";height:64px";
            }
            if (width < 87.5) {
              bottom = "right: 2.5px; bottom: 2.5px";
            }
            document.getElementById("schedule").style = "display: grid";
          } else {
            document.getElementById("schedule").style = "";
          }
          if (
            localStorage.getItem("klas") === "true" &&
            localStorage.getItem("ltr") !== "true" &&
            localStorage.getItem("dag") !== "true"
          ) {
            left =
              (Number.parseInt(startTime.split(":")[1]) +
                (Number.parseInt(startTime.split(":")[0]) -
                  localStorage.getItem("decimalStartTime")) *
                  60) *
              2;
            width =
              (Number.parseInt(endTime.split(":")[1]) +
                (Number.parseInt(endTime.split(":")[0]) -
                  localStorage.getItem("decimalStartTime")) *
                  60) *
                2 -
              left -
              20;
            positie = `margin-top:${left}px;height:${width}px`;
            if (width < 75) {
              positie += ";line-height:1.1";
            }
          }

          // Uppercase subjects if enabled
          let subjects = appointment.subjects;
          if (localStorage.getItem("hoofdletter") === "true") {
            subjects = appointment.subjects.map((subject) =>
              subject.toUpperCase()
            );
          }
          if (appointment.appointmentInstance == null) {
            subjects = appointment.actions[0].appointment.subjects;
            if (localStorage.getItem("hoofdletter") === "true") {
              subjects = appointment.actions[0].appointment.subjects.map(
                (subject) => subject.toUpperCase()
              );
            }
          }
          let teachers = `(${appointment.teachers
            .filter((e) => e !== user)
            .join(", ")})`;
          if (localStorage.getItem("hoofdletter") === "true") {
            teachers = teachers.toUpperCase();
          }
          if (
            window.innerWidth < 676 &&
            localStorage.getItem("dag") !== "true"
          ) {
            ltr = " ltr";
          }
          if (
            window.innerWidth < 475 &&
            localStorage.getItem("dag") !== "true"
          ) {
            teachers = "";
          }
          if (
            window.innerWidth < 391 &&
            localStorage.getItem("dag") !== "true"
          ) {
            document.getElementById("schedule").style =
              "margin-top: 83px;height: calc(100vh - 83px);";
          }
          if (localStorage.getItem("dag") === "true") {
            ltr += " dag";
          }
          let warning =
            appointment.changeDescription + appointment.schedulerRemark;
          let warningsymbol = warning
            ? '<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="vertical-align: sub;"><path d="M10.909 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.242A2.25 2.25 0 0 1 2.2 17.812l.072-.143L10.03 3.66a2.25 2.25 0 0 1 .879-.878ZM12 16.002a.999.999 0 1 0 0 1.997.999.999 0 0 0 0-1.997Zm-.002-8.004a1 1 0 0 0-.993.884L11 8.998 11 14l.007.117a1 1 0 0 0 1.987 0l.006-.117L13 8.998l-.007-.117a1 1 0 0 0-.994-.883Z" fill="yellow" stroke="black" stroke-width="0.5px"></path></svg>'
            : "";
          if (appointment.appointmentInstance == null) {
            warning = "Afgemeld";
            warningsymbol = warning
              ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z"/></svg>`
              : "";
            ltr += " notEnrolled";
          } else if (appointment.schedulerRemark !== "") {
            warning = appointment.schedulerRemark;
            warningsymbol = warning
              ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`
              : "";
          }
          const top =
            localStorage.getItem("userType") === "teacher"
              ? appointment.groups.join(", ")
              : subjects.join(", ");
          // Generate HTML for each
          // margin-left en width voor ltr
          return `<div style="${positie}"
                      class="les ${
                        appointment.cancelled
                          ? "cancelled"
                          : appointment.appointmentType
                      }${ltr}">
              <p>
                <strong>${
                  appointment.appointmentType === "exam"
                    ? appointment.schedulerRemark.split(":")[1]
                    : top
                }</strong>
                <strong class="lesuur">${appointment.startTimeSlotName}</strong>
              </p>
              <p class="lestijden" style="${styling}">${startTime}${endTime}</p>
              <span>
                ${appointment.locations.join(", ")} ${
            teachers === "()" ? "" : teachers
          }
                <div class="warning" style="${bottom}">
                  ${warningsymbol}
                  <span class="warningMessage">${warning}</span>
                </div>
              </span>
              <p class="className">
                ${appointment.groups.join(", ")}
              </p>
              <p class="subjectName">
                ${subjects.join(",")}
              </p>
            </div>`;
        })
        .join("");

      // Generate HTML for the day with its appointments
      if (localStorage.getItem("dag") === "true") {
        return `<div class="dag ${dayName}"><p class="dayTitle">${dayName}</p>${appointmentsHTML}</div>`;
        // biome-ignore lint/style/noUselessElse: <explanation>
      } else {
        return `<div class="dag ${dayName}"><h3>${dayName}</h3>${appointmentsHTML}</div>`;
      }
    })
    .join("");

  scheduleElement.innerHTML = scheduleHTML;
  const lesElements = document.querySelectorAll(".les");
  let maxMarginTop = 0;
  for (const el of lesElements) {
    const computedStyle = window.getComputedStyle(el);
    let marginTop = Number.parseFloat(computedStyle.marginTop);
    if (
      localStorage.getItem("ltr") === "true" &&
      localStorage.getItem("dag") !== "true"
    ) {
      timeline.innerHTML =
        '<div class="circle-marker" style="top: 6px;right: -5px"></div>';
      marginTop = Number.parseFloat(computedStyle.marginLeft);
    } else {
      timeline.innerHTML = `<div class="circle-marker" style="left: 0;"></div>
      <div class="circle-marker" style="left: 100vw;"></div>
      <div class="circle-marker" style="left: 200vw;"></div>
      <div class="circle-marker" style="left: 300vw;"></div>
      <div class="circle-marker" style="left: 400vw;"></div>`;
    }
    if (marginTop > maxMarginTop) {
      maxMarginTop = marginTop + 268.6; // 30 min na einde rooster
    }
  }
  if (topY < maxMarginTop) {
    scheduleElement.appendChild(timeline);
  }
  if (localStorage.getItem("klas") === "true") {
    if (localStorage.getItem("dag") === "true") {
      for (const el of document.querySelectorAll(".className")) {
        el.style.display = "inline";
      }
    } else {
      for (const el of document.querySelectorAll(".className")) {
        el.style.display = "block";
      }
    }
  }
}

// Functie om foutmelding weer te geven
function displayError(message) {
  const scheduleElement = document.getElementById("schedule");
  scheduleElement.innerHTML = `<p>${message}</p>`;
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
    const accessToken = parsedresp.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    displayError("Error fetching access token. Please try again.");
  }
}

Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
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

// Functie om formulierinzending te verwerken
async function handleFormSubmit() {
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode = document
    .getElementById("authorizationCode")
    .value.replace(/\s/g, "");
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  const userType = localStorage.getItem("userType");
  let week = currentDate.getWeek(); // Bereken weeknummer
  document.getElementById("week").innerText = `Week ${week}`;
  if (week < 10) week = `0${week}`; // Voeg een voorloopnul toe aan enkelcijferige weken
  const firstDigit = startTime.value.split(":")[0].replace(/^0+/, "");
  let decimalStartTime = `${firstDigit}.${startTime.value.split(":")[1] / 60}`;
  decimalStartTime = decimalStartTime.replace(".0.", ".");
  localStorage.setItem("startTime", startTime.value);
  if (!decimalStartTime.includes("NaN")) {
    localStorage.setItem("decimalStartTime", decimalStartTime);
  }
  if (localStorage.getItem("dag") !== "true") {
    document.getElementById("schedule").style = "";
  }
  // Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
  let accessToken = localStorage.getItem("access_token");
  if (!accessToken && authorizationCode) {
    accessToken = await fetchToken(authorizationCode, schoolName);
    localStorage.setItem("access_token", accessToken);
  }
  if (
    !localStorage.getItem("userType") &&
    localStorage.getItem("access_token")
  ) {
    userInfo();
  } else if (accessToken && userType && schoolName) {
    if (sessionStorage.getItem("week")) {
      week = sessionStorage.getItem("week");
      document.getElementById("week").innerText = `Week ${week.replace(
        /^0+/,
        ""
      )}`;
    }
    if (sessionStorage.getItem("year")) {
      year = sessionStorage.getItem("year");
    }
    if (!document.startViewTransition) {
      fetchSchedule(accessToken, userType, year, week, schoolName);
      return;
    }
    document.startViewTransition(() =>
      fetchSchedule(accessToken, userType, year, week, schoolName)
    );
  }
}
function switchDay(richting) {
  const schedule = document.getElementById("schedule");
  let transform = schedule.style.transform.substring(11, 15);
  if (localStorage.getItem("dag") === "true") {
    if (richting === "next") {
      if (transform === "0vw)") {
        transform = 0;
      } else if (transform < -599) {
        transform = 100;
      }
      transform = transform - 100;
    } else if (richting === "previous") {
      if (transform === "0vw)") {
        transform = -700;
      }
      transform = Number(transform) + 100;
    }
    sessionStorage.setItem("transform", transform);
    schedule.style.transform = `translateX(${transform}vw)`;
  }
  if (
    (richting === "next" && transform === 0) ||
    (richting === "previous" && transform === -600) ||
    localStorage.getItem("dag") !== "true"
  ) {
    const schoolName = document.getElementById("schoolName").value;
    const authorizationCode = document
      .getElementById("authorizationCode")
      .value.replace(/\s/g, "");
    const userType = localStorage.getItem("userType");
    const currentDate = new Date();
    let year = sessionStorage.getItem("year") || currentDate.getFullYear();
    let week = document.getElementById("week").innerText.replace("Week ", "");
    week = Number.parseInt(week);
    if (richting === "next") {
      week = week + 1;
      if (week === 53) {
        week = 1;
        year = Number.parseInt(year);
        year = year + 1;
        sessionStorage.setItem("year", year);
      }
    } else if (richting === "previous") {
      week = week - 1;
      if (week === 0) {
        week = 52;
        year = Number.parseInt(year);
        year = year - 1;
        sessionStorage.setItem("year", year);
      }
    }

    document.getElementById("week").innerText = `Week ${week}`;
    if (week < 10) {
      week = `0${week}`;
    }
    sessionStorage.setItem("week", week);
    // Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
    const accessToken = localStorage.getItem("access_token");
    // Haal het rooster op
    if (accessToken && userType && schoolName) {
      if (!document.startViewTransition) {
        if (localStorage.getItem("dag") === "true") {
          document.getElementById("schedule").innerHTML = "";
        }
        fetchSchedule(accessToken, userType, year, week, schoolName);
        return;
      }
      document.startViewTransition(() =>
        fetchSchedule(accessToken, userType, year, week, schoolName)
      );
    }
  }
}
document.getElementById("nextDay").addEventListener("click", () => {
  switchDay("next");
});

document.getElementById("previousDay").addEventListener("click", () => {
  switchDay("previous");
});

window.addEventListener("message", function (e) {
  var message = e.data;
  console.log(message);
});
// Sla schoolnaam en token op
const schoolName = document.getElementById("schoolName");
schoolName.value = localStorage.getItem("schoolName");
schoolName.oninput = () => {
  localStorage.setItem("schoolName", schoolName.value);
};

const authorizationCode = document.getElementById("authorizationCode");
authorizationCode.value = localStorage.getItem("authorizationCode");
authorizationCode.oninput = () => {
  localStorage.setItem("authorizationCode", authorizationCode.value);
  localStorage.removeItem("access_token");
};

// Functie om dialoogvenster te tonen
function showDialog(el) {
  let dialog = document.getElementById("dialog");
  if (el) {
    dialog = document.getElementById(el);
  }
  dialog.style = "";
  dialog.showModal();
}

function handleArrowKeyPress(event) {
  const key = event.key;
  if (key === "ArrowLeft") {
    document.getElementById("previousDay").click();
  } else if (key === "ArrowRight") {
    document.getElementById("nextDay").click();
  } else if (key === "?") {
    showDialog("shortcuts");
  } else if (event.ctrlKey && event.key === ",") {
    showDialog();
  } else if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "d") {
    document.getElementById("dayBtn").click();
  } else if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "w") {
    document.getElementById("weekBtn").click();
  } else if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "o") {
    document.getElementById("checkbox1").click();
  } else if (key === "W") {
    let week = prompt("Week");
    if (!isNaN(week) && !isNaN(parseFloat(week)) && week < 53 && week > 0) {
      if (week < 10) week = `0${week}`;
      if (week.length == 2) {
        sessionStorage.setItem("week", week);
        handleFormSubmit();
      }
    }
  } else if (key === "J") {
    let week = prompt("Jaar");
    if (!isNaN(week) && !isNaN(parseFloat(week))) {
      if (week.length == 4) {
        sessionStorage.setItem("year", week);
        handleFormSubmit();
      }
    }
  } else if (key === "D") {
    let week = prompt("Dag (1-7)");
    if (!isNaN(week) && !isNaN(parseFloat(week)) && week < 8 && week > 0) {
      if (week.length == 1) {
        const vandaag = week;
        let transform = -600;
        if (vandaag !== 7) {
          transform = (vandaag - 1) * -100;
        }
        sessionStorage.setItem("transform", transform);
        handleFormSubmit();
      }
    }
  }
}

document.addEventListener("keydown", handleArrowKeyPress);

// Functie om dialoogvenster te verbergen
function hideDialog(el) {
  let dialog = document.getElementById("dialog");
  if (el) {
    dialog = document.getElementById(el);
  }
  dialog.style = "animation: popOut 0.33s";
  dialog.addEventListener("animationend", (event) => {
    if (event.animationName === "popOut") {
      dialog.close();
      show("submenus", "Instellingen");
    }
  });
  document.getElementById("css").click();
  handleFormSubmit();
}

document.addEventListener("DOMContentLoaded", () => {
  handleFormSubmit();
  const schoolName = localStorage.getItem("schoolName") || "";
  const authorizationCode = localStorage.getItem("authorizationCode") || "";
  const userType = localStorage.getItem("userType") || "";
  if (
    schoolName.trim() === "" ||
    authorizationCode.trim() === "" ||
    userType.trim() === ""
  ) {
    // Als een van de opgeslagen waarden leeg is, toon dialoogvenster
    document.querySelector("#dialog #closeBtn").innerText = "Volgende";
    document
      .querySelector("#dialog #closeBtn")
      .setAttribute("onclick", "show('submenus', 'Instellingen')");
    show("koppelingen", "Koppelingen", "hide");
    showDialog();
  }
});

const css = document.getElementById("css");
css.value = localStorage.getItem("css");
css.oninput = () => {
  localStorage.setItem("css", css.value);
};

function update_section(with_what, what) {
  document.getElementById(`${what}goeshere`).innerText = with_what;
}
document.getElementById("weekBtn").addEventListener("click", () => {
  localStorage.setItem("dag", "false");
  handleFormSubmit();
});
document.getElementById("dayBtn").addEventListener("click", () => {
  localStorage.setItem("dag", "true");
  handleFormSubmit();
});
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
  if (
    Math.abs(deltaX) > Math.abs(deltaY) &&
    Math.abs(deltaX) > minSwipeDistance
  ) {
    if (deltaX > 0) {
      // Swipe left
      switchDay("previous");
    } else {
      // Swipe right
      switchDay("next");
    }
  }
}
