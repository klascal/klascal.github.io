const dialogs = document.querySelectorAll("dialog");
for (const dialog of dialogs) {
  if (typeof dialog.showModal !== "function") {
    dialogPolyfill.registerDialog(dialog);
  }
}
let d = new Date();
d = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
// Update de tijdlijn elke 100 ms
multiples = 1.285;
if (localStorage.getItem("ltr") === "true") {
  multiples = 2.325;
} else if (localStorage.getItem("klas") === "true") {
  multiples = 1.75;
} else if (window.innerWidth < 1000 && localStorage.getItem("dag") !== "true") {
  multiples = 1.425;
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
  multiples = 1.285;
  if (localStorage.getItem("ltr") === "true") {
    multiples = 2.325;
  } else if (localStorage.getItem("klas") === "true") {
    multiples = 1.75;
  } else if (
    window.innerWidth < 1000 &&
    localStorage.getItem("dag") !== "true"
  ) {
    multiples = 1.425;
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
  if (localStorage.getItem("huiswerk") !== "true") {
    handleFormSubmit();
  }
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
  // Titel sanitizen
  if (!/^[A-Za-z\s]+$/.test(title)) {
    title = "Instellingen";
  }
  const content = document.querySelector(".container");
  const children = content.querySelectorAll("div");
  viewTrans(() => {
    children.forEach((div) => {
      if (div.id === id) {
        div.style.display = "block";
      } else {
        div.removeAttribute("style");
      }
    });
    if (id !== "submenus" && hide !== "hide") {
      document.querySelector("#dialog h2").innerHTML =
        '<button style="all: unset" onclick="show(`submenus`, `Instellingen`)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></button>' +
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
function viewTrans(func) {
  if (!document.startViewTransition) {
    func();
    return;
  }
  document.startViewTransition(() => {
    func();
  });
}
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
async function retrieveSubjectFullNames() {
  let url = `https://${localStorage.getItem(
    "schoolName"
  )}.zportal.nl/api/v3/subjectselectionsubjects?access_token=${localStorage.getItem(
    "access_token"
  )}&fields=code,name`;
  return fetch(url)
    .then((r) => r.json())
    .then((result) => {
      let subjectTranslations = {};
      let subjects = result.response.data;
      subjects.forEach((subject) => {
        let subjectName = subject.name;
        if (!subjectName) {
          return;
        }
        let commaIndex = subjectName.indexOf(",");
        if (commaIndex != -1) {
          subjectName = subjectName.substring(0, commaIndex);
        }
        let fullName = subjectName;
        subjectTranslations[subject.code] = fullName;
      });
      localStorage.setItem("subjects", JSON.stringify(subjectTranslations));
    });
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
  schoolName,
  first
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
    document.querySelector(".gif-container").style = "";
    if (!document.startViewTransition || first) {
      displaySchedule(scheduleData);
      return;
    }
    document.startViewTransition(() => {
      displaySchedule(scheduleData);
    });
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
    document.getElementById("ltr").setAttribute("disabled", "-1");
    document.getElementById("dayBtn").innerText = "✓ Dag";
    document.getElementById("weekBtn").innerText = "Week";
    document.getElementById("dayBtn").classList.add("selected");
    document.getElementById("weekBtn").classList.remove("selected");
  } else {
    document.getElementById("week").style = "";
    document.getElementById("ltr").style = `vertical-align: middle;
          background-color: transparent;
          margin-left: 5px;`;
    document.getElementById("ltr").setAttribute("tabindex", "0");
    document.getElementById("weekBtn").innerText = "✓ Week";
    document.getElementById("dayBtn").innerText = "Dag";
    document.getElementById("weekBtn").classList.add("selected");
    document.getElementById("dayBtn").classList.remove("selected");
  }
  if (window.innerHeight < 555 || window.innerWidth < 675) {
    document.getElementById("ltr").setAttribute("tabindex", "-1");
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
    let transform = -400;
    if (vandaag !== 0 && vandaag !== 6) {
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
      if (localStorage.getItem("huiswerk") !== "true") {
        document.getElementById(
          "schedule"
        ).style = `width:500vw;transform:translateX(${transform}vw);transition:none;`;
      }
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (localStorage.getItem("huiswerk") !== "true") {
          document.getElementById(
            "schedule"
          ).style = `width:500vw;transform:translateX(${transform}vw);`;
        }
      }, 200);
    });
  }
  const datum = new Date();
  const vandaag = datum.getDay();
  if (vandaag === 0 || vandaag === 6) {
    if (
      !sessionStorage.getItem("transform") &&
      !sessionStorage.getItem("week")
    ) {
      switchDay("next");
    }
  }
  const breakpoints = [
    "min-width: 1000px",
    "max-width: 1000px",
    "max-width: 675px",
    "max-width: 600px",
    "max-width: 500px",
    "max-width: 475px",
    "max-width: 435px",
    "max-width: 391px",
  ];
  breakpoints.forEach((query) => {
    const mql = window.matchMedia(`(${query})`);
    mql.addEventListener("change", function (e) {
      if (e.matches) {
        console.log(`Breakpoint hit: ${e.media}`);
      }
    });
  });

  // Groepeer afspraken per dag
  const appointmentsByDay = appointments.reduce((acc, appointment) => {
    const week = document.getElementById("week");
    const currentDate = new Date(appointment.start * 1000);
    let currentDayName = daysOfWeek[currentDate.getDay()];
    const currentMonthName = monthNames[currentDate.getMonth()];

    if (localStorage.getItem("dag") === "true") {
      currentDayName += ` ${currentDate.getDate()} ${currentMonthName}`;
      currentDayName = `${week.innerText}, ${currentDayName}`;
      if (currentDate.getDay() === new Date().getDay()) {
        localStorage.setItem("vandaag", currentDayName);
      }
      week.style = "display: none";
    } else {
      localStorage.setItem("vandaag", daysOfWeek[new Date().getDay()]);
    }
    localStorage.setItem(
      "notThisWeek",
      new Date(appointment.start * 1000).getWeek() != new Date().getWeek()
    );
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
          let ltr = "";
          let left =
            (Number.parseInt(startTime.split(":")[1]) +
              (Number.parseInt(startTime.split(":")[0]) -
                localStorage.getItem("decimalStartTime")) *
                60) *
            1.45;
          let width =
            (Number.parseInt(endTime.split(":")[1]) +
              (Number.parseInt(endTime.split(":")[0]) -
                localStorage.getItem("decimalStartTime")) *
                60) *
              1.45 -
            left -
            20;
          if (window.innerWidth > 1000) {
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
          } else if (localStorage.getItem("dag") !== "true") {
            ltr = " ltr";
          }
          positie = `margin-top:${left}px;height:${width}px`;
          if (width < 55) {
            positie += ";line-height:1.1";
          }
          let styling = "";
          let bottom = "";
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
            styling = "display: block";
            if (
              appointment.appointmentInstance === null &&
              appointment.actions[0] &&
              appointment.actions[0].appointment.studentEnrolled === false &&
              appointment.appointmentType !== "conflict"
            ) {
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
              1.75;
            width =
              (Number.parseInt(endTime.split(":")[1]) +
                (Number.parseInt(endTime.split(":")[0]) -
                  localStorage.getItem("decimalStartTime")) *
                  60) *
                1.75 -
              left -
              20;
            positie = `margin-top:${left}px;height:${width}px`;
            if (width < 75) {
              positie += ";line-height:1.1";
            }
          }
          if (
            localStorage.getItem("klas") === "true" &&
            appointment.cancelled !== true &&
            localStorage.getItem("dag") !== "true"
          ) {
            bottom = "top: 12.5px; bottom: 0";
          }
          // Uppercase subjects if enabled
          let subjects = appointment.subjects;
          if (localStorage.getItem("hoofdletter") === "true") {
            subjects = appointment.subjects.map((subject) =>
              subject.toUpperCase()
            );
          }
          if (
            appointment.appointmentInstance === null &&
            appointment.actions[0] &&
            appointment.actions[0].appointment.studentEnrolled === false &&
            appointment.appointmentType !== "conflict"
          ) {
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
          if (appointment.appointmentType === "conflict") {
            subjects = [
              ...appointment.actions[0].appointment.subjects,
              ...appointment.actions[1].appointment.subjects,
            ];
            appointment.locations = [
              appointment.actions[0].appointment.locations.join(", ") +
                ", " +
                appointment.actions[1].appointment.locations.join(", "),
            ];
            if (appointment.actions[0].appointment.teachers.join(", ") !== "") {
              teachers = [
                appointment.actions[0].appointment.teachers.join(", ") +
                  ", " +
                  appointment.actions[1].appointment.teachers.join(", "),
              ];
              teachers = `(${teachers.join(", ")})`;
            }
            if (localStorage.getItem("hoofdletter") === "true") {
              subjects = subjects.map((subject) => subject.toUpperCase());
              teachers = teachers.toUpperCase();
            }
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
            ? '<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="warningIcon"><path d="M10.909 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.242A2.25 2.25 0 0 1 2.2 17.812l.072-.143L10.03 3.66a2.25 2.25 0 0 1 .879-.878ZM12 16.002a.999.999 0 1 0 0 1.997.999.999 0 0 0 0-1.997Zm-.002-8.004a1 1 0 0 0-.993.884L11 8.998 11 14l.007.117a1 1 0 0 0 1.987 0l.006-.117L13 8.998l-.007-.117a1 1 0 0 0-.994-.883Z"></path></svg>'
            : "";
          if (
            appointment.appointmentInstance === null &&
            appointment.actions[0] &&
            appointment.actions[0].appointment.studentEnrolled === false &&
            appointment.appointmentType !== "conflict"
          ) {
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
        if (
          localStorage.getItem("vandaag") === dayName &&
          localStorage.getItem("notThisWeek") !== "true"
        ) {
          return `<div class="dag ${dayName}"><p class="dayTitle" style="background-color: var(--primary-accent);"><span style="color: var(--primary-light)">●</span> ${dayName}</p>${appointmentsHTML}</div>`;
        }
        return `<div class="dag ${dayName}"><p class="dayTitle">${dayName}</p>${appointmentsHTML}</div>`;
      } else if (
        localStorage.getItem("vandaag") === dayName &&
        localStorage.getItem("notThisWeek") !== "true"
      ) {
        return `<div class="dag ${dayName}"><h3 style="color: var(--primary-light)">${dayName}</h3>${appointmentsHTML}</div>`;
      } else {
        return `<div class="dag ${dayName}"><h3>${dayName}</h3>${appointmentsHTML}</div>`;
      }
    })
    .join("");

  scheduleElement.innerHTML = scheduleHTML;
  const scrollBarWidth =
    document.querySelector("body").offsetWidth -
    document.querySelector("body").clientWidth +
    16;
  document.getElementById(
    "field"
  ).style.width = `calc(100vw - ${scrollBarWidth}px)`;
  const lessen = document.querySelectorAll(".les");
  let maxMarginTop = 0;
  for (const el of lessen) {
    let scrollBarWidth =
      (document.querySelector("body").offsetWidth -
        document.querySelector("body").clientWidth) *
        0.75 +
      27;
    if (localStorage.getItem("somUserID")) {
      if (window.innerWidth > 500) {
        scrollBarWidth =
          (document.querySelector("body").offsetWidth -
            document.querySelector("body").clientWidth) *
            0.75 +
          105;
        scheduleElement.classList.add("sidebarPresent");
      }
    }
    if (localStorage.getItem("dag") === "true") {
      el.style.width = `calc(100vw - ${scrollBarWidth}px)`;
    }
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
      maxMarginTop = marginTop + 235; // 0 min na einde rooster
      if (localStorage.getItem("ltr") === "true") {
        maxMarginTop = marginTop + 272;
      } else if (
        localStorage.getItem("dag") !== "true" &&
        window.innerWidth < 1000
      ) {
        maxMarginTop = marginTop + 255;
      }
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
  scheduleElement.innerText = message;
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
  localStorage.setItem("huiswerk", "false");
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
  setTimeout(() => {
    if (document.getElementById("schedule").innerHTML === "") {
      document.querySelector(".gif-container").style = "display: block;";
    }
  }, 250);
  if (!decimalStartTime.includes("NaN")) {
    localStorage.setItem("decimalStartTime", decimalStartTime);
  }
  if (localStorage.getItem("somUserID")) {
    document.getElementById("side").style = "display: flex";
    const pills = document.querySelectorAll(".pill");
    pills.forEach((pill) => {
      pill.classList.remove("navSelected");
    });
    document.getElementById("scheduleBtn").classList.add("navSelected");
  }
  if (
    localStorage.getItem("afkorting") === "false" &&
    !localStorage.getItem("subjects")
  ) {
    retrieveSubjectFullNames();
  }
  if (
    localStorage.getItem("dag") !== "true" &&
    localStorage.getItem("ltr") !== "true"
  ) {
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
    fetchSchedule(accessToken, userType, year, week, schoolName);
  }
}
function switchDay(richting) {
  const schedule = document.getElementById("schedule");
  let transform = schedule.style.transform.substring(11, 15);
  if (localStorage.getItem("dag") === "true") {
    if (richting === "next") {
      if (transform === "0vw)") {
        transform = 0;
      } else if (transform < -399) {
        transform = 100;
      }
      transform = transform - 100;
    } else if (richting === "previous") {
      if (transform === "0vw)") {
        transform = -500;
      }
      transform = Number(transform) + 100;
    }
    sessionStorage.setItem("transform", transform);
    schedule.style.transform = `translateX(${transform}vw)`;
  }
  if (
    (richting === "next" && transform === 0) ||
    (richting === "previous" && transform === -400) ||
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
          document.getElementById("schedule").innerText = "";
        }
        fetchSchedule(accessToken, userType, year, week, schoolName);
        return;
      }
      document.startViewTransition(() =>
        fetchSchedule(accessToken, userType, year, week, schoolName, "hi")
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

if (window.location.hash) {
  localStorage.setItem("som_refresh_token", window.location.hash.substring(1));
  somAuth();
  history.replaceState(
    null,
    null,
    window.location.pathname + window.location.search
  );
}

async function somAuth(year, week) {
  try {
    const response = await fetch("https://som-server-bljr.onrender.com/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("som_refresh_token"),
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    localStorage.setItem("som_access_token", result.access_token);
    if (year && week) {
      fetchHomework(year, week);
    }
    if (!localStorage.getItem("somUserID")) {
      somUserInfo();
    }
  } catch (error) {
    console.error("Error posting to server:", error);
    throw error;
  }
}

async function somUserInfo() {
  try {
    const response = await fetch("https://api.somtoday.nl/rest/v1/account/me", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("som_access_token"),
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("somUserID", data.persoon.links[0].id);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

let isLoading = false;

async function fetchHomework(year, week) {
  window.week = week;
  window.year = year;
  setTimeout(() => {
    if (document.getElementById("schedule").innerHTML === "") {
      document.querySelector(".gif-container").style = "display: block;";
    }
  }, 250);
  const baseUrl = "https://api.somtoday.nl/rest/v1";
  const endpoints = [
    "studiewijzeritemafspraaktoekenningen",
    "studiewijzeritemdagtoekenningen",
    "studiewijzeritemweektoekenningen",
  ];
  const params = new URLSearchParams({
    geenDifferentiatieOfGedifferentieerdVoorLeerling:
      localStorage.getItem("somUserID"),
    jaarWeek: `${year}~${week}`,
  });
  const additionals = [
    "leerlingen",
    "swigemaaktVinkjes",
    "lesgroep",
    "leerlingenMetInleveringStatus",
    "leerlingProjectgroep",
    "studiewijzerId",
  ];

  additionals.forEach((add) => params.append("additional", add));

  // Flatten params
  const flatParams = [...params.entries()].flatMap(([key, value]) =>
    Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]
  );
  const queryString = new URLSearchParams(flatParams).toString();

  try {
    isLoading = true;

    const responses = await Promise.all(
      endpoints.map((endpoint) =>
        fetch(`${baseUrl}/${endpoint}?${queryString}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("som_access_token"),
          },
        })
      )
    );

    const data = await Promise.all(
      responses.map((res) => {
        if (!res.ok) {
          somAuth(year, week);
          throw new Error(`Authenticatie mislukt. Opnieuw proberen...`);
        }
        return res.json();
      })
    );

    const allHomeworkItems = data.flatMap((d) => d.items || []);
    renderHomework(allHomeworkItems);
  } catch (error) {
    console.error("Fout bij het ophalen van huiswerk:", error);
  } finally {
    isLoading = false;
  }
}

async function onScroll() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const fullHeight = document.body.offsetHeight;

  if (scrollY + viewportHeight >= fullHeight - 10 && !isLoading) {
    week++;
    await fetchHomework(window.year, window.week);
  }
}

window.addEventListener("scroll", onScroll);

function renderHomework(homeworkItems) {
  document.querySelector(".gif-container").style = "";
  localStorage.setItem("huiswerk", "true");
  const container = document.getElementById("schedule");
  const pills = document.querySelectorAll(".pill");
  pills.forEach((pill) => {
    pill.classList.remove("navSelected");
  });
  document.getElementById("homeworkBtn").classList.add("navSelected");
  container.style = "display: block; height: initial;";
  if (document.querySelector(".les") && !document.querySelector(".hwDiv")) {
    container.innerHTML = "";
  }

  const days = {};

  homeworkItems.forEach((item) => {
    const dateStr = item.datumTijd || item.datum; // afhankelijk van het endpoint
    const date = dateStr ? new Date(dateStr) : null;
    const dayName = date
      ? date.toLocaleDateString("nl-NL", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      : "onbekend";
    year = date.getFullYear();
    const vak = item.additionalObjects.lesgroep.vak.naam;
    let onderwerp = item.studiewijzerItem.onderwerp;
    let huiswerkType = item.studiewijzerItem.huiswerkType;
    let gemaakt = "";
    const omschrijving = item.studiewijzerItem.omschrijving.replace(
      /style="[^"]*"/g,
      ""
    );
    if (
      item.additionalObjects.swigemaaktVinkjes &&
      item.additionalObjects.swigemaaktVinkjes.items[0].gemaakt
    ) {
      gemaakt = "checked";
    }
    if (huiswerkType.includes("TOETS")) {
      let fill = "var(--toets)";
      if (huiswerkType === "GROTE_TOETS") {
        fill = "var(--grote-toets)";
      }
      huiswerkType = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="${fill}"><path fill-rule="evenodd" d="M3.429 0A3.43 3.43 0 0 0 0 3.429V20.57A3.43 3.43 0 0 0 3.429 24H20.57A3.43 3.43 0 0 0 24 20.571V3.43A3.43 3.43 0 0 0 20.571 0zM17 8.966h-3.465v9.038h-2.912V8.966H7V6h10z"></path></svg>`;
    } else if (huiswerkType === "HUISWERK") {
      huiswerkType = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" id="icon"><path fill-rule="evenodd" d="m7 2.804 3.623-2.39a2.5 2.5 0 0 1 2.754 0l9.5 6.269A2.5 2.5 0 0 1 24 8.769v12.735a2.5 2.5 0 0 1-2.5 2.5h-19a2.5 2.5 0 0 1-2.5-2.5V8.77a2.5 2.5 0 0 1 1.123-2.086L3 5.444V1.047a.8.8 0 0 1 .8-.8h2.4a.8.8 0 0 1 .8.8zm0 16.362h3v-4.364h4v4.364h3v-12h-3v4.364h-4V7.166H7z"></path></svg>`;
    } else if (huiswerkType === "LESSTOF") {
      huiswerkType = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="var(--lesstof)"><path fill-rule="evenodd" d="M3.429 0A3.43 3.43 0 0 0 0 3.429V20.57A3.43 3.43 0 0 0 3.429 24H20.57A3.43 3.43 0 0 0 24 20.571V3.43A3.43 3.43 0 0 0 20.571 0zm1.714 6.857a1.714 1.714 0 1 1 3.428 0 1.714 1.714 0 0 1-3.428 0m5.571 0c0-.712.573-1.286 1.286-1.286h5.143c.712 0 1.286.574 1.286 1.286s-.574 1.286-1.286 1.286H12a1.283 1.283 0 0 1-1.286-1.286M12 10.714c-.713 0-1.286.573-1.286 1.286s.573 1.286 1.286 1.286h5.143c.712 0 1.286-.573 1.286-1.286s-.574-1.286-1.286-1.286zm-1.286 6.429c0-.713.573-1.286 1.286-1.286h5.143c.712 0 1.286.573 1.286 1.286 0 .712-.574 1.285-1.286 1.285H12a1.283 1.283 0 0 1-1.286-1.285m-5.069-3.93a1.714 1.714 0 1 0 2.425-2.425 1.714 1.714 0 0 0-2.425 2.424Zm-.502 3.93a1.714 1.714 0 1 1 3.429 0 1.714 1.714 0 0 1-3.43 0Z"></path></svg>`;
    }
    if (omschrijving !== "") {
      if (onderwerp === "") {
        onderwerp = `<details><summary>${omschrijving.replace(
          /<\/?[^>]+(>|$)/g,
          ""
        )}</summary>${omschrijving}</details>`;
      } else {
        onderwerp = `<details><summary>${onderwerp}</summary>${omschrijving}</details>`;
      }
    } else {
      onderwerp = `<details><summary>${onderwerp}</summary>${onderwerp}</details>`;
    }
    const tijd = date.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemHTML = `<div class="les hwDiv"><input type="checkbox" id="${item.links[0].id}" ${gemaakt}></input>${huiswerkType}<strong>${vak}</strong><br>${onderwerp}</div>`;

    if (!days[dayName]) days[dayName] = [];
    days[dayName].push(itemHTML);
  });
  // Convert the object to an array of [key, value] pairs
  const sortedDaysArray = Object.entries(days);

  // Sort the array based on the date in the key
  sortedDaysArray.sort((a, b) => {
    const dateA = new Date(a[0].split(" ").slice(1).join(" ") + `, ${year}`); // Assuming year 2025
    const dateB = new Date(b[0].split(" ").slice(1).join(" ") + `, ${year}`); // Assuming year 2025
    return dateA - dateB;
  });

  // Convert the sorted array back to an object
  const sortedDays = Object.fromEntries(sortedDaysArray);
  for (const [day, items] of Object.entries(sortedDays)) {
    if (items.length === 0) continue;
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day-group");
    dayDiv.innerHTML = `<h3>${
      day.charAt(0).toUpperCase() + day.slice(1)
    }</h3>${items.join("")}`;
    container.appendChild(dayDiv);
  }
  const lessen = document.querySelectorAll(".hwDiv");
  for (const el of lessen) {
    let scrollBarWidth =
      (document.querySelector("body").offsetWidth -
        document.querySelector("body").clientWidth) *
        0.75 +
      27;
    if (window.innerWidth > 500) {
      scrollBarWidth =
        (document.querySelector("body").offsetWidth -
          document.querySelector("body").clientWidth) *
          0.75 +
        105;
    }
    el.style.width = `calc(100vw - ${scrollBarWidth}px)`;
  }
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updateHomeworkMade(this.id, this.checked);
    });
  });
}
async function updateHomeworkMade(id, checked) {
  try {
    const response = await fetch(
      "https://api.somtoday.nl/rest/v1/swigemaakt/cou",
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/vnd.topicus.platinum+json; charset=utf-8",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("som_access_token"),
        },
        body: JSON.stringify({
          leerling: {
            links: [
              {
                id: Number(localStorage.getItem("somUserID")),
                rel: "self",
                type: "leerling.RLeerlingPrimer",
              },
            ],
          },
          swiToekenningId: Number(id),
          gemaakt: checked,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error posting to server:", error);
    throw error;
  }
}
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
  function onClick(event) {
    if (event.target === dialog) {
      hideDialog();
    }
  }
  dialog.addEventListener("click", onClick);
}

function handleArrowKeyPress(event) {
  if (localStorage.getItem("huiswerk") !== "true") {
    const key = event.key;
    if (key === "ArrowLeft") {
      document.getElementById("previousDay").click();
    } else if (key === "ArrowRight") {
      document.getElementById("nextDay").click();
    } else if (key === "?") {
      showDialog("shortcuts");
    } else if (event.ctrlKey && event.key === ",") {
      showDialog();
    } else if (
      event.ctrlKey &&
      event.altKey &&
      event.key.toLowerCase() === "d"
    ) {
      document.getElementById("dayBtn").click();
    } else if (
      event.ctrlKey &&
      event.altKey &&
      event.key.toLowerCase() === "w"
    ) {
      document.getElementById("weekBtn").click();
    } else if (
      event.ctrlKey &&
      event.altKey &&
      event.key.toLowerCase() === "o"
    ) {
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
  document.getElementById("styling").innerText = css.value;
};
if (localStorage.getItem("css")) {
  document.getElementById("styling").innerText = localStorage.getItem("css");
}
document.getElementById("weekBtn").addEventListener("click", () => {
  localStorage.setItem("dag", "false");
  if (!document.startViewTransition) {
    document.getElementById("schedule").innerText = "";
  }
  handleFormSubmit();
});
document.getElementById("dayBtn").addEventListener("click", () => {
  localStorage.setItem("dag", "true");
  handleFormSubmit();
});
document.getElementById("scheduleBtn").addEventListener("click", () => {
  handleFormSubmit();
});
document.getElementById("homeworkBtn").addEventListener("click", () => {
  const date = new Date();
  fetchHomework(date.getFullYear(), date.getWeek());
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
    if (localStorage.getItem("huiswerk") !== "true") {
      if (deltaX > 0) {
        // Swipe left
        switchDay("previous");
      } else {
        // Swipe right
        switchDay("next");
      }
    }
  }
}
