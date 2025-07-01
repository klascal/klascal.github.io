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
  const schoolName = localStorage.getItem("schoolName");
  const response = await fetch(
    `https://${schoolName}.zportal.nl/api/v3/users/~me?fields=code,isEmployee`,
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
  )}.zportal.nl/api/v3/subjectselectionsubjects?fields=code,name`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
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
          let bottom = "";
          if (width < 32) {
            positie += ";line-height:1.1";
            bottom = "bottom: 5px";
          }
          if (width < 24) {
            positie += ";line-height:0.9";
          }
          let styling = "";
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
            styling = "display: inline;margin-right: 5.55px";
            positie = `width: calc(100vw - 27px);margin-top:${left}px;height:${width}px`;
            if (width < 32) {
              positie += ";line-height:1.1";
              bottom = "bottom: 5px";
            }
            if (width < 24) {
              positie += ";line-height:0.9";
            }
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
          let teachers = `${appointment.teachers
            .filter((e) => e !== user)
            .join(", ")}`;
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
            }
            if (localStorage.getItem("hoofdletter") === "true") {
              subjects = subjects.map((subject) => subject.toUpperCase());
              teachers = teachers.toUpperCase();
            }
          }
          let teachers1 = teachers.split(", ");
          window.teachers = teachers1;
          if (teachers1.length > 2) {
            teachers = `${teachers1.slice(
              0,
              1
            )}<div class="plusTeachers" style="${bottom}">
            <b class="plus"> +${
              teachers1.length - 1
            }</b><span class="warningMessage">${teachers1.join(
              ", "
            )}</span></div>`;
          }
          teachers = `(${teachers})`;
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

async function somAuth(year, week, grades) {
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
      if (!grades) {
        fetchHomework(year, week);
      } else {
        fetchGrades();
      }
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

async function fetchGrades() {
  try {
    const response = await fetch(
      `https://api.somtoday.nl/rest/v1/geldendvoortgangsdossierresultaten/leerling/${localStorage.getItem(
        "somUserID"
      )}?type=Toetskolom&type=DeeltoetsKolom&type=Werkstukcijferkolom&type=Advieskolom&additional=vaknaam&additional=resultaatkolom&additional=naamalternatiefniveau&additional=vakuuid&additional=lichtinguuid&sort=desc-geldendResultaatCijferInvoer`,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("som_access_token"),
        },
      }
    );

    if (!response.ok) {
      somAuth("a", "b", "c");
      throw new Error("Authenticatie mislukt. Opnieuw proberen...");
    }

    const data = await response.json();
    const allHomeworkItems = data.items;
    console.log(data, data.items[0].datumInvoerEerstePoging);
    renderGrades(allHomeworkItems);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
function renderGrades(homeworkItems) {
  document.querySelector(".gif-container").style = "";
  localStorage.setItem("huiswerk", "true");
  const container = document.getElementById("schedule");
  const pills = document.querySelectorAll(".pill");
  pills.forEach((pill) => {
    pill.classList.remove("navSelected");
  });
  document.getElementById("gradesBtn").classList.add("navSelected");
  container.style = "display: block; height: initial;";
  if (window.innerWidth < 500) {
    container.style = "display: block; height: initial; margin-bottom: 56px;";
  }
  window.scrollTo(0, 0);
  container.innerHTML = "";

  homeworkItems.forEach((item) => {
    const date = new Date(item.datumInvoerEerstePoging);
    const d = new Date(),
      t = new Date(d.setHours(0, 0, 0, 0)),
      i = new Date(date.setHours(0, 0, 0, 0));
    const diff = (t - i) / 86400000; // 86400000ms in dag, verschil in dagen berekenen
    const dayName =
      diff === 0
        ? "Vandaag"
        : diff === 1
        ? "Gisteren"
        : diff === 2
        ? "Eergisteren"
        : date.toLocaleDateString("nl-NL", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });
    const vak = item.additionalObjects.vaknaam;
    let grade = item.formattedResultaat;
    let weighting = item.weging + "x";
    let omschrijving = dayName + " • " + item.omschrijving;
    omschrijving = `<details><summary class="omschrijving">${omschrijving}</summary>${omschrijving}</details>`;
    let huiswerkType = "";
    // Vakicoontjes bij cijfers
    if (vak.includes("aardrijkskunde")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#88C9F9" d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10"/><path fill="#5C913B" d="M14.287.976c-.568.315-1.04.848-1.683.656-1.041-.313-2.43-1.007-3.333-.14-.903.869-1.111 1.667 0 1.633s1.875-1.354 2.43-.799c.556.556.417 1.007-.902 1.18s-2.743.383-3.507.383-.938.451-.417.938-.313.52-1.18 1.006c-.868.486.208.695.937 1.111s1.285-.104 1.597-.798 1.657-1.528 2.217-1.424c.561.105.561.382.457.868s.416.347.45-.208c.035-.556.66-.973 1.146-1.007s.903.66.348 1.007c-.556.346-1.111.625-.417.799.694.173 1.18 1.076.382 1.458s-2.187.625-2.812.312-2.049-.764-2.43-.521-.59.494-1.042.664c-.451.17-2.292 1.003-2.327 2.08-.035 1.076-.069 2.292.66 2.326s2.5-.451 3.056-.903c.555-.451 1.32-.347 1.562.174.243.52.07.833-.173 1.666-.243.834.158 1.25.548 1.98.39.728.702 1.145.702 1.666s.555 1.042 1.389.173c.833-.868 1.597-2.57 1.944-3.194s.625-2.014 1.042-2.292c.416-.278 1.076-.938.59-.833s-1.459-.035-1.702-.73c-.242-.694-1.284-2.013-.798-2.152.485-.139 1.041.772 1.25 1.202.208.43.486.95.902 1.09.417.139 1.32-.93 1.598-1.09.277-.16.069-.82-.486-.75-.556.07-1.285 0-1.285-.347s.694-.799 1.25-.694c.556.104.972.277 1.32.694.347.417 1.041 1.18 1.319 1.667.278.486.486.555.625-.313.092-.576.215-.893.328-1.234A10 10 0 0 0 14.287.976"/></svg>';
    } else if (
      vak.includes("biologie") ||
      vak.includes("mens en natuur") ||
      vak.includes("natuur, leven en technologie")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#662113" d="M12.222 18.333C12.222 19.561 11.227 20 10 20s-2.222-.44-2.222-1.667l.555-5c0-1.227.44-1.11 1.667-1.11s1.667-.117 1.667 1.11z"/><path fill="#5C913B" d="M18.889 9.444c0 4.91-3.98 6.667-8.889 6.667s-8.889-1.757-8.889-6.667C1.111 4.536 6.111 0 10 0s8.889 4.536 8.889 9.444"/><path fill="#3E721D" d="M3.333 12.222c.614 0 1.111-.248 1.111-.555s-.497-.556-1.11-.556-1.112.249-1.112.556c0 .306.498.555 1.111.555M16.667 12.222c.613 0 1.11-.248 1.11-.555s-.497-.556-1.11-.556-1.112.249-1.112.556c0 .306.498.555 1.112.555M5.556 14.444c.613 0 1.11-.248 1.11-.555s-.497-.556-1.11-.556-1.112.249-1.112.556.498.555 1.112.555M7.778 12.778c.613 0 1.11-.249 1.11-.556 0-.306-.497-.555-1.11-.555s-1.111.248-1.111.555.497.556 1.11.556M5.556 9.444c.613 0 1.11-.248 1.11-.555s-.497-.556-1.11-.556-1.112.249-1.112.556.498.555 1.112.555M3.889 7.222C4.503 7.222 5 6.973 5 6.667s-.497-.556-1.111-.556-1.111.249-1.111.556c0 .306.497.555 1.11.555M16.111 7.222c.614 0 1.111-.249 1.111-.555s-.497-.556-1.11-.556S15 6.36 15 6.667c0 .306.498.555 1.111.555M7.778 6.111c.613 0 1.11-.249 1.11-.555S8.392 5 7.779 5s-1.111.249-1.111.556c0 .306.497.555 1.11.555M12.222 6.111c.614 0 1.111-.249 1.111-.555S12.836 5 12.223 5c-.615 0-1.112.249-1.112.556 0 .306.497.555 1.111.555M14.445 9.444c.613 0 1.11-.248 1.11-.555s-.497-.556-1.11-.556-1.112.249-1.112.556.498.555 1.111.555M10 10c.614 0 1.111-.249 1.111-.556 0-.306-.497-.555-1.111-.555s-1.111.249-1.111.555S9.386 10 10 10M12.222 12.778c.614 0 1.111-.249 1.111-.556 0-.306-.497-.555-1.11-.555-.615 0-1.112.248-1.112.555s.497.556 1.111.556M10 15c.614 0 1.111-.249 1.111-.556 0-.306-.497-.555-1.111-.555s-1.111.249-1.111.556c0 .306.497.555 1.111.555M14.445 14.444c.613 0 1.11-.248 1.11-.555s-.497-.556-1.11-.556-1.112.249-1.112.556.498.555 1.111.555"/></svg>';
    } else if (vak.includes("bedrijfseconomie")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" fill="#EAEDF0" rx="16"/><path fill="#66757F" d="M7.667 14.889h16.666v10H7.667z"/><path fill="#CCD6DD" d="M7.111 24.889H24.89c.613 0 1.111.498 1.111 1.111H6c0-.613.498-1.111 1.111-1.111"/><path fill="#292F33" d="M16 18.778c-.92 0-1.667.746-1.667 1.667v3.333h3.334v-3.333c0-.921-.746-1.667-1.667-1.667"/><path fill="#CCD6DD" d="M7.667 17.667h2.222v6.11H7.667zm3.333 0h2.222v6.11H11zm11.111 0h2.222v6.11h-2.222zm-3.333 0H21v6.11h-2.222z"/><path fill="#AAB8C2" d="M7.111 23.778H24.89v1.11H7.11z"/><path fill="#66757F" d="M26 12.111 16 6 6 12.111z"/><path fill="#CCD6DD" d="m16 7.333-8.889 5.334v2.222H24.89v-2.222z"/><path fill="#8899A6" d="M7.667 16.556h2.222v1.11H7.667zm3.333 0h2.222v1.11H11zm7.778 0H21v1.11h-2.222zm3.333 0h2.222v1.11h-2.222z"/><path fill="#CCD6DD" d="M6.556 12.667h18.888v2.778H6.556z"/><path fill="#AAB8C2" d="M26 12.667a.555.555 0 0 1-.556.555H6.556A.556.556 0 0 1 6 12.667v-.556c0-.306.249-.555.556-.555h18.888c.308 0 .556.249.556.555zM26 16a.555.555 0 0 1-.556.556H6.556A.556.556 0 0 1 6 16v-.555c0-.307.249-.556.556-.556h18.888c.308 0 .556.249.556.556z"/><path fill="#E1E8ED" d="M13.222 23.778h5.556v1.11h-5.556z"/><path fill="#F5F8FA" d="M12.111 24.889h7.778V26H12.11z"/></svg>';
    } else if (
      vak.includes("culturele en kunstzinnige vorming") ||
      vak.includes("cultureel kunstzinnige vorming") ||
      vak.includes("klassieke culturele vorming") ||
      vak.includes("beeldende vorming") ||
      vak.includes("handvaardigheid") ||
      vak.includes("kunstgeschiedenis")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#D99E82" d="M10 1.5c-5.523 0-10 3.838-10 8.571q.002.89.204 1.729c.988 1.7 1.672.627 4.796-.935 3.182-1.591 0 2.222-1.111 4.444-.342.684-.157 1.262.311 1.736 1.637 1.002 3.636 1.598 5.8 1.598 5.523 0 10-3.837 10-8.572C20 5.338 15.523 1.5 10 1.5m1.583 13.582c-.22.747-1.367 1.069-2.563.717-1.196-.351-1.988-1.241-1.768-1.99.22-.747 1.366-1.068 2.562-.716 1.197.35 1.988 1.24 1.769 1.989"/><path fill="#5C913B" d="M5.556 7.532a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334"/><path fill="#269" d="M11.111 6.42a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"/><path fill="#DD2E44" d="M16.111 9.754a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"/><path fill="#FFCC4D" d="M15.556 14.754a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"/></svg>';
    } else if (vak.includes("Chinees")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#DE2910" d="M20 15a2.22 2.22 0 0 1-2.222 2.222H2.222A2.22 2.22 0 0 1 0 15V5c0-1.227.995-2.222 2.222-2.222h15.556C19.005 2.778 20 3.773 20 5z"/><path fill="#FFDE02" d="m6.187 4.987.409.198.327-.314-.062.45.4.214-.447.08-.08.447-.214-.4-.45.061.314-.327zm2.591 1.634-.197.408.314.328-.45-.062-.214.4-.08-.447-.447-.08.4-.214-.062-.45.328.315zm-.531 2.1.149.428.453.01-.361.274.131.435-.372-.26-.373.26.131-.435-.362-.274.454-.01zm-2.06 1.822.409.198.327-.315-.062.45.4.215-.447.08-.08.446-.214-.4-.45.062.314-.327zm-2.298-4.46.516 1.485 1.57.032-1.252.949.455 1.503-1.29-.897-1.289.897.455-1.503L1.803 7.6l1.57-.032z"/></svg>';
    } else if (vak.includes("Duits")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#FFCD05" d="M0 15.222c0 1.227.995 2.222 2.222 2.222h15.556A2.22 2.22 0 0 0 20 15.222V13H0z"/><path fill="#ED1F24" d="M0 8h20v5H0z"/><path fill="#141414" d="M17.778 3H2.222A2.22 2.22 0 0 0 0 5.222V8h20V5.222A2.22 2.22 0 0 0 17.778 3"/></svg>';
    } else if (vak.includes("drama") || vak.includes("theater")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#A6D388" d="M12.222 2.548c0 3.375-2.037 10.185-6.11 10.185C2.036 12.733 0 5.923 0 2.548 0-1.44 4.583.511 6.111.511c1.507 0 6.111-1.973 6.111 2.037"/><path fill="#5C913B" d="M3.056 6.622c2.546 1.528 4.073 1.528 6.11 0 1.528-1.018-1.018 3.565-3.055 3.565S1.528 5.604 3.056 6.622m-1.02-2.036a.508.508 0 0 1-.454-.738c.353-.706 1.074-1.194 1.835-1.241.466-.026 1.365.086 2.1 1.187a.51.51 0 0 1-.848.565c-.339-.508-.753-.763-1.189-.736-.406.025-.793.293-.987.682a.51.51 0 0 1-.456.28m8.15 0a.51.51 0 0 1-.456-.282c-.194-.388-.582-.656-.987-.681-.431-.023-.85.227-1.19.735a.509.509 0 1 1-.846-.565c.733-1.101 1.628-1.214 2.1-1.187.76.047 1.48.535 1.834 1.242a.51.51 0 0 1-.456.738"/><path fill="#CBB7EA" d="M20 9.815C20 13.189 17.963 20 13.89 20S7.778 13.19 7.778 9.815c0-3.99 4.583-2.037 6.11-2.037C15.397 7.778 20 5.804 20 9.815"/><path fill="#9266CC" d="M16.389 16.75c-1.945-1.194-3.056-1.194-5 0-1.528 1.019.463-2.453 2.5-2.453s4.028 3.472 2.5 2.453m-6.945-4.574a.51.51 0 0 1-.456-.737c.39-.777 1.336-1.383 2.251-1.44.828-.055 1.564.325 2.055 1.061a.51.51 0 0 1-.847.566c-.29-.434-.675-.638-1.144-.61-.623.038-1.203.477-1.404.879a.51.51 0 0 1-.455.281m8.89 0a.51.51 0 0 1-.456-.282c-.2-.402-.78-.84-1.402-.879-.468-.026-.855.175-1.145.61a.51.51 0 1 1-.847-.565c.491-.737 1.215-1.116 2.055-1.062.915.058 1.862.664 2.25 1.44a.51.51 0 0 1-.455.738"/></svg>';
    } else if (vak.includes("economie")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#2A6797" d="M1.111 4.278C0 4.278 0 5.388 0 5.388v11.668s0 1.11 1.111 1.11H18.89c1.111 0 1.111-1.11 1.111-1.11V5.389s0-1.111-1.111-1.111z"/><path fill="#5DADEC" d="M1.111 1.5C0 1.5 0 2.611 0 2.611v11.111s0 1.111 1.111 1.111H18.89c1.111 0 1.111-1.11 1.111-1.11V2.61S20 1.5 18.889 1.5z"/><path fill="#4289C1" d="M13.889 11.778a3.611 3.611 0 1 0 0-7.222 3.611 3.611 0 0 0 0 7.222"/><path fill="#2A6797" d="M18.333 14H1.667a.834.834 0 0 1-.834-.833v-10c0-.46.374-.834.834-.834h16.666c.46 0 .834.374.834.834v10c0 .459-.374.833-.834.833M1.667 2.889a.28.28 0 0 0-.278.278v10c0 .152.125.277.278.277h16.666a.28.28 0 0 0 .278-.277v-10a.28.28 0 0 0-.278-.278z"/><path fill="#FFE8B6" d="M7.778 1.5h4.444v13.368H7.778z"/><path fill="#FFAC33" d="M7.778 14.833h4.444v3.334H7.778z"/><path fill="#2A6797" d="M7.091 10.3c0 .366-.819.804-1.834.804-1.344 0-2.154-.934-2.423-2.079h-.718a.317.317 0 1 1 0-.633h.627c-.005-.075-.016-.15-.016-.225q.002-.25.035-.495h-.646a.317.317 0 1 1 0-.633h.786c.33-1.02 1.128-1.81 2.396-1.81 1.023 0 1.671.552 1.671.844 0 .187-.113.34-.292.34-.324 0-.486-.567-1.379-.567-.839 0-1.349.523-1.606 1.192h1.849a.316.316 0 1 1 0 .634H3.528a3.5 3.5 0 0 0-.04.495c0 .074.01.15.014.225H5.54a.317.317 0 1 1 0 .632H3.603c.216.795.748 1.462 1.654 1.462.869 0 1.25-.519 1.55-.519.17 0 .284.13.284.333"/></svg>';
    } else if (vak.includes("Engels") || vak.includes("Anglia")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#00247D" d="M0 5.255v2.19h3.127zm2.591 12.19h4.631v-3.243zm10.187-3.243v3.242h4.63zM0 13v2.19L3.128 13zM17.41 3h-4.632v3.243zM20 15.19V13h-3.128zm0-7.746V5.255l-3.127 2.19zM7.222 3h-4.63l4.63 3.243z"/><path fill="#CF1B2B" d="m13.967 13 5.395 3.778a2.2 2.2 0 0 0 .55-.971L15.904 13zm-6.745 0h-1.19L.639 16.778c.29.294.66.505 1.076.603l5.508-3.857zm5.556-5.555h1.19l5.394-3.778a2.2 2.2 0 0 0-1.076-.603l-5.508 3.857zm-6.745 0L.638 3.667a2.2 2.2 0 0 0-.55.971l4.008 2.807z"/><path fill="#EEE" d="M20 11.889h-8.333v5.555h1.11v-3.242l4.631 3.242h.37c.62 0 1.18-.256 1.584-.666L13.967 13h1.937l4.008 2.807c.052-.188.088-.381.088-.585v-.032L16.872 13H20zm-20 0V13h3.128L0 15.19v.032c0 .606.244 1.155.638 1.556L6.033 13h1.19v.524L1.713 17.38c.164.039.333.064.508.064h.37l4.63-3.242v3.242h1.111V11.89zm20-6.667c0-.606-.244-1.154-.638-1.555l-5.395 3.777h-1.19v-.523l5.51-3.857a2.2 2.2 0 0 0-.51-.064h-.368l-4.631 3.243V3h-1.111v5.556H20V7.444h-3.127L20 5.255zM7.222 3v3.243L2.592 3h-.37c-.62 0-1.18.256-1.584.667l5.395 3.777H4.096L.087 4.638c-.05.188-.087.38-.087.584v.033l3.127 2.19H0v1.11h8.333V3z"/><path fill="#CF1B2B" d="M11.667 8.556V3H8.333v5.556H0v3.333h8.333v5.555h3.334V11.89H20V8.556z"/></svg>';
    } else if (vak.includes("Frans")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#ED2939" d="M20 15a2.22 2.22 0 0 1-2.222 2.222h-4.445V2.778h4.445C19.005 2.778 20 3.773 20 5z"/><path fill="#002495" d="M2.222 2.778A2.22 2.22 0 0 0 0 5v10c0 1.227.995 2.222 2.222 2.222h4.445V2.778z"/><path fill="#EEE" d="M6.667 2.778h6.666v14.444H6.667z"/></svg>';
    } else if (vak.includes("geschiedenis")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#292F33" d="M3.889 6.111H16.11v10H3.89z"/><path fill="#CCD6DD" d="M4.444 16.111c0 .613-.331 1.111-.74 1.111h-.741c-.41 0-.74-.498-.74-1.11v-10c0-.614.33-1.112.74-1.112h.74c.41 0 .741.498.741 1.111zm13.334 0c0 .613-.332 1.111-.74 1.111h-.742c-.409 0-.74-.498-.74-1.11v-10c0-.614.331-1.112.74-1.112h.741c.41 0 .74.498.74 1.111zm-8.89 0c0 .613-.33 1.111-.74 1.111h-.74c-.41 0-.741-.498-.741-1.11v-10c0-.614.331-1.112.74-1.112h.74c.41 0 .742.498.742 1.111zm4.445 0c0 .613-.332 1.111-.74 1.111h-.74c-.41 0-.742-.498-.742-1.11v-10c0-.614.332-1.112.741-1.112h.74c.41 0 .741.498.741 1.111z"/><path fill="#9AAAB4" d="M18.333 16.667c0 .613-.497 1.11-1.11 1.11H2.777a1.112 1.112 0 0 1 0-2.221h14.444c.613 0 1.111.497 1.111 1.11"/><path fill="#CCD6DD" d="M19.444 17.778c0 .613-.497 1.111-1.11 1.111H1.666a1.112 1.112 0 0 1 0-2.222h16.666c.614 0 1.111.497 1.111 1.11"/><path fill="#E1E8ED" d="M20 18.611c0 .46-.373.834-.833.834H.833a.833.833 0 1 1 0-1.667h18.334c.46 0 .833.373.833.833"/><path fill="#9AAAB4" d="M18.333 5.555c0-.613-.53-1.11-1.185-1.11H2.778c-.655 0-1.111.497-1.111 1.11 0 .418.214.777.555.967v.7h2.222v-.555h2.223v.555h2.222v-.555h2.222v.555h2.222v-.555h2.223v.555h2.222v-.729c.332-.196.555-.541.555-.938"/><path fill="#CCD6DD" d="M1.111 4.691c0-.573.562-.802.562-.802L9.953 0l8.36 3.889s.576.128.576.805V5H1.11z"/><path fill="#9AAAB4" d="M10 1.412S4.267 4.115 3.694 4.358c-.572.242-.38.642.001.642h12.581c.59 0 .451-.451-.017-.695S10 1.412 10 1.412"/><path fill="#CCD6DD" d="M18.889 5a.555.555 0 0 1-.556.555H1.667a.556.556 0 0 1 0-1.11l16.666.003c.308 0 .556.245.556.552"/></svg>';
    } else if (vak.includes("godsdienst")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#269" d="M17.778 3.889H2.222A2.22 2.22 0 0 0 0 6.11v8.333c0 1.228.995 2.223 2.222 2.223h6.342c.29.33.821.555 1.436.555s1.147-.224 1.436-.555h6.342A2.22 2.22 0 0 0 20 14.444V6.111a2.22 2.22 0 0 0-2.222-2.222"/><path fill="#292F33" d="M11.111 15a1.111 1.111 0 0 1-2.222 0V5a1.111 1.111 0 0 1 2.222 0z"/><path fill="#99AAB5" d="M10 14.444c0 .614-.498 1.111-1.111 1.111H2.222a1.11 1.11 0 0 1-1.11-1.11v-10c0-.614.497-1.112 1.11-1.112H8.89c.613 0 1.111.498 1.111 1.111z"/><path fill="#E1E8ED" d="M10 14.444c-.555-1.11-2.032-1.11-2.222-1.11-1.111 0-2.778 1.11-4.445 1.11-.555 0-1.11-.497-1.11-1.11v-8.89c0-.613.555-1.11 1.11-1.11 1.809 0 3.334-1.112 4.445-1.112C9.444 2.222 10 3.276 10 3.89z"/><path fill="#99AAB5" d="M18.889 14.444c0 .614-.498 1.111-1.111 1.111H11.11A1.11 1.11 0 0 1 10 14.446v-10c0-.614.498-1.112 1.111-1.112h6.667c.613 0 1.11.498 1.11 1.111z"/><path fill="#CCD6DD" d="M10 14.444c.555-1.11 2.032-1.11 2.222-1.11 1.111 0 2.778 1.11 4.445 1.11.555 0 1.11-.497 1.11-1.11v-8.89c0-.613-.555-1.11-1.11-1.11-1.81 0-3.334-1.112-4.445-1.112C10.556 2.222 10 3.276 10 3.89z"/></svg>';
    } else if (vak.includes("Grieks")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#0D5EB0" d="M2.222 17.222h15.556c.39 0 .756-.101 1.075-.278H1.147a2.2 2.2 0 0 0 1.075.278"/><path fill="#EEE" d="M4.722 10.833H0v1.39h20v-1.39H4.722M0 15q.001.141.02.278H19.98Q20 15.14 20 15v-1.111H0zm7.778-7.222H20v1.389H7.778zm0-3.056v1.39H20V5q-.001-.142-.02-.278z"/><path fill="#0D5EB0" d="M7.778 6.111H20v1.667H7.778zM0 12.222h20v1.667H0zm1.147 4.723h17.706a2.22 2.22 0 0 0 1.128-1.667H.02c.09.718.522 1.33 1.128 1.667M0 7.778h3.056v3.055H0zm7.778 1.389v-1.39H4.722v3.056H20V9.167zm11.075-6.111a2.2 2.2 0 0 0-1.075-.278H2.222A2.223 2.223 0 0 0 0 5v1.111h3.056V3.056h1.666V6.11h3.056V4.722H19.98a2.22 2.22 0 0 0-1.128-1.666"/><path fill="#EEE" d="M4.722 6.111V2.778H3.056V6.11H0v1.667h3.056v3.055h1.666V7.778h3.056V6.11z"/></svg>';
    } else if (vak.includes("tekenen")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#EF9645" d="M3.446 12.023c-.043.512.178.665.526.909.343.24 2.435-1.593 3.119-1.872.683-.279 7.103-1.638 6.825-2.88-.278-1.24-2.218-1.424-3.713-1.17-1.494.253-4.354 1.567-5.19 2.277-.835.708-1.567 2.736-1.567 2.736m4.79.831s-1.976.642-1.976 2.309c0 1.666.481 2.606.709 3.062s.938.898 1.92.473c1.14-.494-.273-3.335 3.333-2.03 1.652.596 3.366 1.404 5.032.848 1.581-.527 2.19-2.516 2.19-3.627 0-2.275-1.666-1.667-2.222-1.111-.555.555-5 1.666-5.555 1.666-.556 0-3.43-1.59-3.43-1.59"/><path fill="#F9CA55" d="M10.729 15.66s-.067-.731-.764-.816c-.573-.07-1.476.122-1.944 1.059-.47.938-1.303.781-1.268 1.562s.278 1.389.782 1.545c.503.157 1.215-.121 1.302-.954.086-.834.19-1.598.729-1.928s1.163-.468 1.163-.468"/><path fill="#EF9645" d="M10 14.445s-.556-.556-1.667-.556-3.702 1.185-2.916 3.542c.555 1.666 2.135.885 2.36-.764C8.005 15.015 10 14.444 10 14.444"/><path fill="#F9CA55" d="M9.444 14.445s-.555-.556-1.666-.556-2.714.85-2.778 3.333c-.052 2.031 2.24 1.111 2.222-.555-.017-1.667 2.222-2.223 2.222-2.223"/><path fill="#EF9645" d="M2.778 15c0 1.832.254 2.937 1.349 2.748 1.816-.312 1.126-2.563 2.716-3.196 1.154-.46 2.834-.35 4.455.612 1.069.635.369-1.83-.742-2.386s-4.445 0-5 0C5 12.778 2.778 15 2.778 15"/><path fill="#F9CA55" d="M2.69 15.097c-.884 1.48-.346 3.01 1.199 2.68 1.495-.318.746-2.26 2.222-3.333.827-.6 2.61-.802 3.721-.247 1.111.556 1.28-.864.168-1.42-1.111-.555-4.744-.013-5.299.021-1.06.066-2.011 2.299-2.011 2.299"/><path fill="#3B88C3" d="M5.232 16.174a1.04 1.04 0 0 1-1.466.1l-.109-.095a1.04 1.04 0 0 1-.1-1.465L16.07.37a1.04 1.04 0 0 1 1.466-.1l.108.095c.433.377.478 1.033.101 1.466z"/><path fill="#3B88C3" d="M5.828 15.492c-1.311 1.503-4.619 4.45-5.037 4.085s2.051-4.042 3.362-5.545.923-.302 1.385.102c.463.404 1.6-.144.29 1.358"/><path fill="#EF9645" d="M3.707 13.903c0 .556 1.345 1.064 1.9.509.556-.556 1.856-1.238 3.566-.523 4.003 1.672 2.494-.556.827-1.111-1.667-.556-4.444 0-5 0s-1.293 1.125-1.293 1.125"/><path fill="#FFDC5D" d="M3.442 12.246c-.2-.618 1.215-4.044 1.856-4.574.806-.668 3.927-1.702 5.038-1.702s9.109 4.03 9.109 6.808-1.112 3.125-2.709 3.559c-1.277.347-3.953.134-5.122-.955-1.024-.955-1.736-1.615-2.725-2.049-1.835-.804-3.057.236-3.613.791-1.111 1.111-3.204-.088-1.458-1.989 1.25-1.36 2.35-1.784 3.404-2.135 3.334-1.111 5.556-1.111 4.445-2.222-.393-.393-.607.192-1.154.291-1.1.2-1.975.335-3.425.818-.5.167-2.873 1.68-3.646 3.36"/><path fill="#EF9645" d="M7.331 9.042c.591-.216 3.168-.685 4.508-1.15 1.083-.375 2.033.354-.022 1.127-1.983.747-4.044.685-5.546 1.282-.569.226-1.062-.486 1.06-1.26"/><path fill="#3B88C3" d="M12.493 4.457S9.199 8.232 7.8 9.825c1.252-.515 2.372-.417 3.443-1.047 1.07-.63 1.559-1.301 3.183-3.164.604-.691-1.934-1.157-1.934-1.157"/></svg>';
    } else if (vak.includes("informatica")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#CCD6DD" d="M18.889 14.331c-.232-.535-.498-1.115-1.111-1.115h-.556c.614 0 1.111-.5 1.111-1.116V2.616c0-.617-.497-1.116-1.11-1.116H2.777c-.614 0-1.111.5-1.111 1.116V12.1c0 .616.497 1.116 1.11 1.116h-.555c-.613 0-.926.557-1.11 1.115L0 17.051c0 .616.498 1.116 1.111 1.116H18.89c.613 0 1.111-.5 1.111-1.116z"/><path fill="#9AAAB4" d="m.004 17.097.004.032.094.384c.176.385.56.654 1.01.654h17.777c.598 0 1.082-.475 1.107-1.07z"/><path fill="#5DADEC" d="M17.222 11.542a.556.556 0 0 1-.555.558H3.333a.557.557 0 0 1-.555-.558V3.174c0-.308.249-.558.555-.558h13.334c.307 0 .555.25.555.558z"/><path fill="#AEBBC1" d="m18.281 15.412-.422-1.208c-.133-.256-.353-.465-.66-.465H2.839c-.307 0-.503.227-.642.576l-.383 1.098c-.121.331.25.558.556.558h4.21s.52-.026.613-.338c.107-.36.23-.902.257-.998.041-.146.216-.295.476-.295h4.765c.278 0 .415.14.45.315.024.113.174.634.244.99.062.317.678.325.678.325h3.664c.306 0 .676-.261.554-.558"/><path fill="#9AAAB4" d="M12.43 16.563H8.108c-.209 0-.3-.19-.27-.375.03-.184.2-.996.214-1.09.012-.096.152-.21.29-.21h3.898c.165 0 .272.091.306.273.032.181.167.911.178 1.078s-.094.324-.293.324"/></svg>';
    } else if (
      vak.includes("lichamelijke opvoeding") ||
      vak.includes("sport") ||
      vak.includes("bewegingsonderwijs")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#8899A6" d="m13.423 5.648-.376-1.13a.313.313 0 0 0-.434-.153c-.51.27-1.635.732-2.046.875.788.28 1.944.835 2.506.776.213-.023.437-.171.35-.368M19.095 19.3c-.222.125-3.616.94-10.345-4.948C6.713 12.57.667 7.155.745 6.971c0 0-.183.2-.334.409-.11.15-.178.31-.153.47.173 1.093 1.73 2.122 3.868 3.768l.305.234.202.155c.326.251 1.286 1.009 2.405 1.89 1.53 1.207 4.602 3.606 4.692 3.673 1.177.875 2.575 1.565 4.259 2.04 2.132.6 3.106-.31 3.106-.31"/><path fill="#BE1931" d="M19.095 19.3s.265-.122.539-.51.439-1.069.025-1.804-1.92-2.845-2.414-3.706c-.24-.42-.165-.804-.625-1.575 0 0-1.758-3.069-2.147-3.736-.831-1.426-.466-2.167-1.02-2.593-.37-.284-4.06.092-5.182-.772-.776-.596-.788-2.46-1.113-3.07-.259-.486-1.122-.263-1.715.062-.592.325-2.207 2.105-2.597 2.612s-.89 1.06-.933 1.626L1.87 6.4s8.812 8.417 11.32 10.115c4.276 2.895 5.906 2.785 5.906 2.785"/><path fill="#A0041E" d="M13.744 5.813a.85.85 0 0 0-.291-.438c-.37-.283-4.06.093-5.182-.771-.776-.597-.788-2.46-1.113-3.07-.1-.19-.295-.27-.529-.28.384.779.345 3.098 1.285 3.82 1.132.871 4.453.63 5.83.74"/><path fill="#DD2E44" d="M7.37 9.93c.28-.818.58-2.731.04-3.868-.505-1.065-2.467-3.309-2.84-3.734-.688.614-1.609 1.688-1.887 2.05-.366.476-.808 1.011-.83 1.555-.008.196.049.284.049.284s5.456 3.745 5.467 3.712"/><path fill="#CCD6DD" d="M12.837 7.92a.465.465 0 0 1-.17-.9l1.013-.397a.467.467 0 0 1 .34.868l-1.012.397a.5.5 0 0 1-.17.032m.749 1.702a.465.465 0 0 1-.233-.87l.996-.573a.466.466 0 1 1 .464.808l-.996.573a.46.46 0 0 1-.232.062m1.011 1.529a.465.465 0 0 1-.279-.84l.841-.627a.465.465 0 1 1 .557.747l-.841.627a.46.46 0 0 1-.278.093m1.08 1.428a.467.467 0 0 1-.296-.827l.643-.526a.467.467 0 0 1 .591.72l-.641.527a.47.47 0 0 1-.296.106m-13.9-6.601s.376.34.792.403c.417.064 1.155.528 1.663.919.508.39 2.444 1.828 3.63 3.024s3.053 3.656 3.778 4.368 1.897 1.774 2.897 2.415 1.92 1.184 2.51 1.493c.76.397 1.461.635 2.048.7-.204.12-1.285.526-3.161-.114-1.793-.611-2.962-1.274-3.928-1.992-.967-.718-6.227-4.893-7.089-5.556-.861-.663-3.438-2.627-3.844-3.215-.578-.836-.55-1.201-.438-1.347.273-.356.85-1.323 1.143-1.098"/><path fill="#DD2E44" d="M19.659 16.986c-.414-.736-1.92-2.846-2.414-3.707a2 2 0 0 1-.193-.517c-.05.02-.105.03-.15.06-.64.44-.637 1.77.318 3.16.766 1.115 1.995 1.974 2.685 1.987a1.8 1.8 0 0 0-.246-.984"/></svg>';
    } else if (vak.includes("latijn")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#AAB8C2" d="M19.444 14.444a2.22 2.22 0 0 1-2.222 2.223H2.778a2.22 2.22 0 0 1-2.222-2.223V3.507C.556 2.28 3.773 0 5 0h11.458c1.72 0 2.986 1.284 2.986 2.986z"/><path fill="#F5F8FA" d="M18.333 16.667a2.22 2.22 0 0 1-2.222 2.222H3.89a2.22 2.22 0 0 1-2.222-2.222V3.333c0-2.288-.012-2.222 2.777-2.222h11.667c1.227 0 2.222.995 2.222 2.222z"/><path fill="#fff" d="M17.222 17.222c0 .92-.746 1.667-1.667 1.667H2.223c-.92 0-1.666-.746-1.666-1.667V3.89c0-.92.746-1.667 1.666-1.667h13.334c.92 0 1.666.746 1.666 1.667z"/><path fill="#AAB8C2" d="M17.222 17.778A2.22 2.22 0 0 1 15 20H3.333a2.22 2.22 0 0 1-2.222-2.222V5.555c0-1.227.995-2.222 2.222-2.222H15c1.227 0 2.222.995 2.222 2.222z"/><path fill="#E1E8ED" d="M16.111 17.778A2.22 2.22 0 0 1 13.89 20H3.333a2.22 2.22 0 0 1-2.222-2.222V6.667c0-1.228.995-2.223 2.222-2.223h10.742c1.227 0 2.036.81 2.036 2.036z"/><path fill="#AAB8C2" d="M3.333 3.333c-.937 0-.961-1.067-.555-1.527.462-.523 1.18-.695 2.465-.695h.868V0h-1.51C2.396 0 .556 1.389.556 2.986v14.792C.556 19.005 1.55 20 2.778 20h1.11V3.333z"/><path fill="#DD2E44" d="M9.444 2.222V15l2.223-3.333L13.889 15V2.222z"/><path fill="#DD2E44" d="M13.889 15.556a.56.56 0 0 1-.462-.248l-1.76-2.64-1.76 2.64A.555.555 0 0 1 8.889 15V2.222c0-.306.249-.555.555-.555h4.445c.307 0 .556.249.556.555V15a.556.556 0 0 1-.556.556m-2.222-4.445c.185 0 .359.093.462.247l1.204 1.807V2.778H10v10.387l1.204-1.807a.56.56 0 0 1 .463-.247"/><path fill="#F5F8FA" d="M8.333 1.111H15v1.111H8.333z"/></svg>';
    } else if (
      vak.includes("filosofie") ||
      vak.includes("levensbeschouwelijke vorming")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#83BCE6" d="M20 6.772c0-2.23-1.79-4.037-4-4.037-.667 0-1.294.167-1.847.458C12.963 1.563 11.053.5 8.893.5 5.961.5 3.48 2.45 2.651 5.135A3.45 3.45 0 0 0 0 8.502a3.45 3.45 0 0 0 2.87 3.41C2.992 14.19 4.855 16 7.142 16c1.243 0 2.36-.538 3.143-1.392A4.25 4.25 0 0 0 13.429 16c2.367 0 4.285-1.936 4.285-4.326 0-.41-.06-.804-.165-1.179A4.04 4.04 0 0 0 20 6.772M2.25 19.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5"/></svg>';
    } else if (vak.includes("management & organisatie")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#9A4E1C" d="M17.778 4.444h-3.334V2.222A2.22 2.22 0 0 0 12.222 0H7.778a2.22 2.22 0 0 0-2.222 2.222v2.222H2.222A2.22 2.22 0 0 0 0 6.667v11.11C0 19.006.995 20 2.222 20h15.556A2.22 2.22 0 0 0 20 17.778V6.667a2.22 2.22 0 0 0-2.222-2.223M6.667 3.334c0-.614.497-1.112 1.11-1.112h4.445c.614 0 1.111.498 1.111 1.111v1.111H6.667z"/><path fill="#662113" d="M20 11.111a2.22 2.22 0 0 1-2.222 2.222H2.222A2.22 2.22 0 0 1 0 11.111V6.667c0-1.228.995-2.223 2.222-2.223h15.556c1.227 0 2.222.995 2.222 2.223z"/><path fill="#9A4E1C" d="M20 10a2.22 2.22 0 0 1-2.222 2.222H2.222A2.22 2.22 0 0 1 0 10V6.667c0-1.228.995-2.223 2.222-2.223h15.556c1.227 0 2.222.995 2.222 2.223z"/><path fill="#CCD6DD" d="M12.222 10c0 .613-.497 1.111-1.11 1.111H8.888a1.111 1.111 0 0 1 0-2.222h2.222c.614 0 1.111.498 1.111 1.111"/></svg>';
    } else if (vak.includes("muziek")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#5DADEC" d="M19.005.114 6.551 1.552a1.155 1.155 0 0 0-.995 1.116v10.435a4.4 4.4 0 0 0-1.667-.325C1.742 12.778 0 14.269 0 16.11c0 1.841 1.742 3.333 3.889 3.333s3.889-1.492 3.889-3.333V5.855l10-1.154v7.291a4.4 4.4 0 0 0-1.667-.325c-2.147 0-3.889 1.491-3.889 3.333 0 1.841 1.742 3.333 3.89 3.333C18.257 18.333 20 16.841 20 15V1.002a.875.875 0 0 0-.995-.888"/></svg>';
    } else if (
      vak.includes("maatschappijleer") ||
      vak.includes("burgerschap")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#88C9F9" d="M17.778 0H2.222A2.22 2.22 0 0 0 0 2.222v12.222h20V2.222A2.22 2.22 0 0 0 17.778 0"/><path fill="#66757F" d="M5.556 20V3.89l2.222-2.222h1.11l2.223 2.222V20zM18.333 6.111c0-.555-.555-.555-.555-.555h-3.89s-.555 0-.555.555v13.89h5z"/><path fill="#292F33" d="M15.556 9.444c0-.555-.556-.555-.556-.555h-4.444c-.556 0-.556.555-.556.555V20h5.556zM6.11 10.555H3.333V7.779s0-.556-.555-.556H0v10.556C0 19.005.995 20 2.222 20h4.445V11.11s0-.556-.556-.556m11.667 3.334c-.556 0-.556.555-.556.555V20h.556A2.22 2.22 0 0 0 20 17.778v-3.89z"/><path fill="#FFCC4D" d="M4.444 16.111h1.112v1.111H4.444zm0-4.444h1.112v1.11H4.444zm-1.11 2.222h1.11V15h-1.11zM8.888 5H10v1.111H8.889zm0 2.222H10v1.111H8.889zM7.778 9.444h1.11v1.112h-1.11zm5.555.556h1.111v1.111h-1.11zm-1.11 2.222h1.11v1.111h-1.11zm-1.112 3.334h1.111v1.11h-1.11zm5-8.89h1.111v1.112h-1.11zm0 2.223h1.111V10h-1.11z"/></svg>';
    } else if (vak.includes("Nederlands")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#EEE" d="M0 8h20v4.444H0z"/><path fill="#AE1F28" d="M17.778 3H2.222A2.22 2.22 0 0 0 0 5.222V8h20V5.222A2.22 2.22 0 0 0 17.778 3"/><path fill="#20478B" d="M2.222 17.444h15.556A2.22 2.22 0 0 0 20 15.222v-2.778H0v2.778c0 1.227.995 2.222 2.222 2.222"/></svg>';
    } else if (
      (vak.includes("natuurkunde") && vak.includes("scheikunde")) ||
      vak.includes("algemene natuurwetenschappen") ||
      vak.includes("natuur- en scheikunde")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#9266CC" d="M20 17.778A2.22 2.22 0 0 1 17.778 20H2.222A2.22 2.22 0 0 1 0 17.778V2.222C0 .995.995 0 2.222 0h15.556C19.005 0 20 .995 20 2.222z"/><path fill="#fff" d="M14.702 10c1.605-1.405 2.55-2.843 1.997-3.815-.278-.487-.849-.734-1.696-.734-.72 0-1.645.192-2.664.53-.424-2.123-1.21-3.69-2.339-3.69s-1.915 1.567-2.34 3.69c-1.018-.338-1.942-.53-2.663-.53-.847 0-1.418.247-1.696.735-.553.97.392 2.41 1.997 3.814-1.605 1.405-2.55 2.843-1.997 3.815.278.487.848.735 1.696.735.72 0 1.645-.193 2.664-.53.424 2.122 1.21 3.688 2.339 3.688s1.915-1.566 2.34-3.688c1.018.337 1.942.53 2.663.53.847 0 1.418-.248 1.696-.735.553-.972-.393-2.41-1.997-3.815m.301-3.577c.446 0 .764.091.85.243.193.339-.402 1.404-1.915 2.708a21 21 0 0 0-1.282-.918 21 21 0 0 0-.155-1.51c.97-.335 1.838-.523 2.502-.523m-4.144 5.085q-.43.246-.859.466a23 23 0 0 1-1.713-.978A24 24 0 0 1 8.264 10q.002-.517.023-.995A23 23 0 0 1 10 8.026a23 23 0 0 1 1.713.979q.021.478.023.995c0 .346-.01.675-.023.996-.272.17-.553.341-.854.512m.772.674c-.018.18-.039.351-.061.521-.16-.065-.322-.139-.485-.212q.128-.068.255-.138.146-.084.291-.171m-2.717.31c-.162.071-.325.145-.484.211a21 21 0 0 1-.061-.52q.145.086.291.171c.084.048.17.09.254.137m-1.617-2.154q-.239-.17-.46-.338.221-.168.46-.338-.004.169-.005.338.001.169.005.338m1.072-2.52q.028-.268.061-.52c.16.065.322.139.484.212q-.127.067-.254.137-.146.084-.291.171m2.717-.309c.162-.072.325-.146.484-.212q.034.253.061.521-.145-.087-.291-.171c-.085-.049-.17-.091-.255-.138m1.617 2.153q.239.17.46.338-.221.168-.46.338.004-.169.005-.338-.001-.169-.005-.338M10 3.264c.392 0 1.03 1.06 1.414 3.052-.46.184-.935.396-1.414.63-.48-.234-.953-.447-1.414-.63C8.969 4.324 9.608 3.264 10 3.264M4.147 6.667c.086-.153.405-.244.85-.244.663 0 1.532.188 2.502.522-.068.488-.121.995-.155 1.511q-.676.447-1.282.918C4.55 8.07 3.954 7.004 4.147 6.667m.85 6.91c-.446 0-.764-.09-.85-.243-.193-.338.402-1.403 1.915-2.708q.607.472 1.282.918.052.777.155 1.511c-.97.335-1.838.522-2.502.522M10 16.737c-.392 0-1.03-1.06-1.414-3.053.46-.183.935-.396 1.414-.629.48.233.953.446 1.414.629-.383 1.992-1.022 3.052-1.414 3.052m5.853-3.404c-.086.153-.405.244-.85.244-.663 0-1.532-.188-2.502-.522q.103-.734.155-1.511a21 21 0 0 0 1.282-.918c1.513 1.305 2.108 2.37 1.915 2.707"/><path fill="#fff" d="M10 9.214a.785.785 0 1 0 0 1.571.785.785 0 0 0 0-1.57"/></svg>';
    } else if (vak.includes("scheikunde")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#CCD6DD" d="m8.09 8.008 6.06-6.06 3.867 3.867-6.06 6.06z"/><path fill="#68E090" d="M4.502 19.11C1.389 18.89.833 16.702.908 15.518c.18-2.817 8.668-9.195 8.668-9.195l6.953 1.072c.001 0-9.66 11.884-12.027 11.715"/><path fill="#8899A6" d="M17.959 2.06C16.336.437 14.502-.36 13.863.28q-.01.012-.018.024-.007.005-.012.008L1.275 12.87a4.13 4.13 0 0 0-1.217 2.938c0 1.11.433 2.153 1.217 2.937a4.13 4.13 0 0 0 2.938 1.217c1.11 0 2.153-.432 2.937-1.216L19.708 6.187q.005-.007.008-.013.012-.009.024-.018c.64-.64-.158-2.473-1.781-4.096M5.972 17.566a2.47 2.47 0 0 1-1.759.729c-.664 0-1.29-.26-1.76-.73a2.47 2.47 0 0 1-.728-1.759c0-.664.259-1.289.728-1.759L14.118 2.383c.345.636.867 1.33 1.527 1.992.66.66 1.356 1.181 1.991 1.527z"/><path fill="#17BF63" d="M16.22 7.302c-.032.21-1.46.417-3.162.19s-3.045-.679-3.001-1.01c.044-.332 1.46-.418 3.161-.19 1.703.226 3.053.68 3.002 1.01M6.022 12.915a.441.441 0 1 1-.624-.624.441.441 0 0 1 .624.624m1.843 1.453a.721.721 0 1 1-1.02-1.02.721.721 0 0 1 1.02 1.02m.932-2.958a.679.679 0 1 1-.96-.96.679.679 0 0 1 .96.96M4.98 16.331a.827.827 0 1 1-1.17-1.17.827.827 0 0 1 1.17 1.17m6.331-5.088a.588.588 0 1 1-.83-.83.588.588 0 0 1 .83.83m-.67-2.382a.385.385 0 1 1-.544-.545.385.385 0 0 1 .544.545"/><path fill="#CCD6DD" d="M19.025 4.806c.257-.257-.388-1.318-1.44-2.37-1.05-1.051-2.112-1.695-2.369-1.438-.256.256.388 1.317 1.44 2.369 1.051 1.051 2.112 1.696 2.369 1.439"/></svg>';
    } else if (vak.includes("Spaans")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#C60A1D" d="M20 15a2.22 2.22 0 0 1-2.222 2.222H2.222A2.22 2.22 0 0 1 0 15V5c0-1.227.995-2.222 2.222-2.222h15.556C19.005 2.778 20 3.773 20 5z"/><path fill="#FFC400" d="M0 6.667h20v6.666H0z"/><path fill="#EA596E" d="M5 9.444v1.667a1.667 1.667 0 1 0 3.333 0V9.444z"/><path fill="#F4A2B2" d="M6.667 8.889h1.666v1.667H6.667z"/><path fill="#DD2E44" d="M5 8.889h1.667v1.667H5z"/><path fill="#EA596E" d="M6.667 8.889c.92 0 1.666-.373 1.666-.833s-.746-.834-1.666-.834S5 7.595 5 8.055s.746.834 1.667.834"/><path fill="#FFAC33" d="M6.667 8.056c.92 0 1.666-.187 1.666-.417s-.746-.417-1.666-.417S5 7.41 5 7.64s.746.417 1.667.417"/><path fill="#99AAB5" d="M3.889 8.889h.555v3.889H3.89zm5 0h.555v3.889H8.89z"/><path fill="#66757F" d="M3.333 12.222H5v.556H3.333zm5 0H10v.556H8.333zM3.89 8.333h.555v.556H3.89zm5 0h.555v.556H8.89z"/></svg>';
    } else if (vak.includes("techniek")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#292F33" d="M14.444.278H5.556A1.947 1.947 0 0 0 3.61 2.222v2.222h1.667V2.222c0-.15.127-.278.278-.278h8.888c.151 0 .278.128.278.278v2.222h1.667V2.222A1.947 1.947 0 0 0 14.444.278"/><path fill="#DD2E44" d="M20 17.647S20 20 17.647 20H2.353C0 20 0 17.647 0 17.647V6.471c0-2.353 2.353-2.353 2.353-2.353h15.294s2.352 0 2.352 2.353z"/><path fill="#CCD6DD" d="M2.222 12.222h15.556v1.111H2.222z"/><path fill="#BE1931" d="M0 8.333h20v1.111H0zm2.222 5h15.556v1.111H2.222zm0 3.334h15.556v1.11H2.222z"/><path fill="#CCD6DD" d="M2.222 15.556h15.556v1.11H2.222z"/><path fill="#AAB8C2" d="M5.556 10.556H4.444A.556.556 0 0 1 3.89 10V7.778c0-.307.249-.556.555-.556h1.112c.306 0 .555.25.555.556V10a.556.556 0 0 1-.555.556m10 0h-1.111a.556.556 0 0 1-.556-.556V7.778c0-.307.249-.556.556-.556h1.11c.307 0 .556.25.556.556V10a.556.556 0 0 1-.555.556"/><path fill="#292F33" d="M13.889 9.444V10c0 .307.249.556.556.556h1.11a.556.556 0 0 0 .556-.556v-.556zm-10 0V10c0 .307.249.556.555.556h1.112A.556.556 0 0 0 6.11 10v-.556z"/><path fill="#292F33" d="M14.445 8.333h1.11V10h-1.11zm-10 0h1.11V10h-1.11z"/></svg>';
    } else if (vak.includes("verzorging")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#D99E82" d="M1.622 11.885 11.885 1.622a4.591 4.591 0 0 1 6.493 6.493L8.115 18.378a4.591 4.591 0 0 1-6.493-6.493"/><path fill="#C1694F" d="M2.438 14.861a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M4.059 16.481a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M5.679 18.102a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M4.059 13.24a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M5.679 14.861a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M7.3 16.481a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M12.164 3.994a.54.54 0 1 1 1.073.129.54.54 0 0 1-1.073-.13M14.321 6.219a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M15.941 7.84a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M14.321 2.978a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M15.941 4.599a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08M17.562 6.219a.54.54 0 1 0 0-1.08.54.54 0 0 0 0 1.08"/><path fill="#EABAA7" d="m3.789 9.73 5.94-5.942 6.482 6.482-5.94 5.941z"/><path fill="#F7DED5" d="M5.444 10.235a.54.54 0 0 1-.382-.922l4.286-4.286a.54.54 0 1 1 .764.764l-4.286 4.286a.54.54 0 0 1-.382.158"/></svg>';
    } else if (vak.includes("wiskunde") || vak.includes("reken")) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#3B88C3" d="M20 17.778A2.22 2.22 0 0 1 17.778 20H2.222A2.22 2.22 0 0 1 0 17.778V2.222C0 .995.995 0 2.222 0h15.556C19.005 0 20 .995 20 2.222z"/><path fill="#fff" d="M5.34 3.387h-.622c-.507 0-.718-.37-.718-.729 0-.37.264-.728.718-.728h1.499c.454 0 .707.327.707.75v6.005c0 .528-.338.823-.792.823s-.791-.296-.791-.823zm2.85 9.237c0 .664-.285 1.245-.866 1.614.76.349 1.288 1.056 1.288 1.89 0 1.266-1.16 2.331-2.66 2.331-1.562 0-2.533-1.15-2.533-1.983 0-.412.433-.707.813-.707.717 0 .55 1.235 1.741 1.235a.976.976 0 0 0 .993-.982c0-1.477-1.795-.39-1.795-1.635 0-1.109 1.499-.36 1.499-1.53 0-.402-.285-.708-.76-.708-1.003 0-.866 1.034-1.583 1.034-.433 0-.686-.39-.686-.78 0-.824 1.129-1.71 2.3-1.71 1.52 0 2.249 1.107 2.249 1.93m7.43-4.573c.464 0 .822.211.822.697 0 .485-.358.696-.76.696h-3.525c-.464 0-.823-.21-.823-.696 0-.222.137-.412.243-.539.876-1.045 1.826-1.994 2.627-3.155.191-.275.37-.602.37-.982 0-.433-.327-.813-.76-.813-1.213 0-.633 1.71-1.646 1.71-.507 0-.77-.358-.77-.77 0-1.33 1.181-2.396 2.48-2.396 1.297 0 2.343.855 2.343 2.195 0 1.468-1.636 2.924-2.533 4.053zm-3.853 8.626c-.517 0-.739-.349-.739-.623 0-.232.085-.359.149-.464l2.364-4.285c.232-.423.527-.613 1.076-.613.612 0 1.213.39 1.213 1.351v3.24h.18c.412 0 .739.275.739.697s-.327.697-.739.697h-.18v.896c0 .56-.22.824-.759.824-.538 0-.76-.264-.76-.824v-.896zm2.544-4.338h-.022l-1.424 2.944h1.446z"/></svg>';
    }
    // Vakicoontjes voor overige vakken
    else if (
      vak.toLowerCase().startsWith("a") ||
      vak.toLowerCase().startsWith("b") ||
      vak.toLowerCase().startsWith("c") ||
      vak.toLowerCase().startsWith("d")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#3E721D" d="M19.444 14.444a2.22 2.22 0 0 1-2.222 2.223H2.778a2.22 2.22 0 0 1-2.222-2.223V3.507C.556 2.28 3.773 0 5 0h11.458c1.72 0 2.986 1.284 2.986 2.986z"/><path fill="#CCD6DD" d="M18.333 16.667a2.22 2.22 0 0 1-2.222 2.222H3.89a2.22 2.22 0 0 1-2.222-2.222V3.333c0-2.288-.012-2.222 2.777-2.222h11.667c1.227 0 2.222.995 2.222 2.222z"/><path fill="#E1E8ED" d="M17.222 17.222c0 .92-.746 1.667-1.667 1.667H2.223c-.92 0-1.666-.746-1.666-1.667V3.89c0-.92.746-1.667 1.666-1.667h13.334c.92 0 1.666.746 1.666 1.667z"/><path fill="#5C913B" d="M17.222 17.778A2.22 2.22 0 0 1 15 20H3.333a2.22 2.22 0 0 1-2.222-2.222V5.556c0-1.228.995-2.223 2.222-2.223H15c1.227 0 2.222.995 2.222 2.223z"/><path fill="#77B255" d="M16.111 17.778A2.22 2.22 0 0 1 13.89 20H3.333a2.22 2.22 0 0 1-2.222-2.222V6.667c0-1.228.995-2.223 2.222-2.223h10.742c1.227 0 2.036.81 2.036 2.037z"/><path fill="#3E721D" d="M3.333 3.333c-.937 0-.961-1.067-.555-1.527.462-.523 1.18-.695 2.465-.695h.868V0h-1.51C2.396 0 .556 1.389.556 2.986v14.792C.556 19.005 1.55 20 2.778 20h1.11V3.333z"/></svg>';
    } else if (
      vak.toLowerCase().startsWith("e") ||
      vak.toLowerCase().startsWith("f") ||
      vak.toLowerCase().startsWith("g") ||
      vak.toLowerCase().startsWith("h")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#A0041E" d="M19.444 14.444a2.22 2.22 0 0 1-2.222 2.223H2.778a2.22 2.22 0 0 1-2.222-2.223V3.507C.556 2.28 3.773 0 5 0h11.458c1.72 0 2.986 1.284 2.986 2.986z"/><path fill="#CCD6DD" d="M18.333 16.667a2.22 2.22 0 0 1-2.222 2.222H3.89a2.22 2.22 0 0 1-2.222-2.222V3.333c0-2.288-.012-2.222 2.777-2.222h11.667c1.227 0 2.222.995 2.222 2.222z"/><path fill="#E1E8ED" d="M17.222 17.222c0 .92-.746 1.667-1.667 1.667H2.223c-.92 0-1.666-.746-1.666-1.667V3.89c0-.92.746-1.667 1.666-1.667h13.334c.92 0 1.666.746 1.666 1.667z"/><path fill="#BE1931" d="M17.222 17.778A2.22 2.22 0 0 1 15 20H3.333a2.22 2.22 0 0 1-2.222-2.222V5.556c0-1.228.995-2.223 2.222-2.223H15c1.227 0 2.222.995 2.222 2.223z"/><path fill="#DD2E44" d="M16.111 17.778A2.22 2.22 0 0 1 13.89 20H3.333a2.22 2.22 0 0 1-2.222-2.222V6.667c0-1.228.995-2.223 2.222-2.223h10.742c1.227 0 2.036.81 2.036 2.037z"/><path fill="#A0041E" d="M3.333 3.333c-.937 0-.961-1.067-.555-1.527.462-.523 1.18-.695 2.465-.695h.868V0h-1.51C2.396 0 .556 1.389.556 2.986v14.792C.556 19.005 1.55 20 2.778 20h1.11V3.333z"/></svg>';
    } else if (
      vak.toLowerCase().startsWith("i") ||
      vak.toLowerCase().startsWith("j") ||
      vak.toLowerCase().startsWith("k") ||
      vak.toLowerCase().startsWith("l")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#269" d="M19.444 14.444a2.22 2.22 0 0 1-2.222 2.223H2.778a2.22 2.22 0 0 1-2.222-2.223V3.507C.556 2.28 3.773 0 5 0h11.458c1.72 0 2.986 1.284 2.986 2.986z"/><path fill="#CCD6DD" d="M18.333 16.667a2.22 2.22 0 0 1-2.222 2.222H3.89a2.22 2.22 0 0 1-2.222-2.222V3.333c0-2.288-.012-2.222 2.777-2.222h11.667c1.227 0 2.222.995 2.222 2.222z"/><path fill="#E1E8ED" d="M17.222 17.222c0 .92-.746 1.667-1.667 1.667H2.223c-.92 0-1.666-.746-1.666-1.667V3.89c0-.92.746-1.667 1.666-1.667h13.334c.92 0 1.666.746 1.666 1.667z"/><path fill="#3B88C3" d="M17.222 17.778A2.22 2.22 0 0 1 15 20H3.333a2.22 2.22 0 0 1-2.222-2.222V5.556c0-1.228.995-2.223 2.222-2.223H15c1.227 0 2.222.995 2.222 2.223z"/><path fill="#55ACEE" d="M16.111 17.778A2.22 2.22 0 0 1 13.89 20H3.333a2.22 2.22 0 0 1-2.222-2.222V6.667c0-1.228.995-2.223 2.222-2.223h10.742c1.227 0 2.036.81 2.036 2.037z"/><path fill="#269" d="M3.333 3.333c-.937 0-.961-1.067-.555-1.527.462-.523 1.18-.695 2.465-.695h.868V0h-1.51C2.396 0 .556 1.389.556 2.986v14.792C.556 19.005 1.55 20 2.778 20h1.11V3.333z"/></svg>';
    } else if (
      vak.toLowerCase().startsWith("m") ||
      vak.toLowerCase().startsWith("n") ||
      vak.toLowerCase().startsWith("o") ||
      vak.toLowerCase().startsWith("p")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#C1694F" d="M19.444 14.444a2.22 2.22 0 0 1-2.222 2.223H2.778a2.22 2.22 0 0 1-2.222-2.223V3.507C.556 2.28 3.773 0 5 0h11.458c1.72 0 2.986 1.284 2.986 2.986z"/><path fill="#CCD6DD" d="M18.333 16.667a2.22 2.22 0 0 1-2.222 2.222H3.89a2.22 2.22 0 0 1-2.222-2.222V3.333c0-2.288-.012-2.222 2.777-2.222h11.667c1.227 0 2.222.995 2.222 2.222z"/><path fill="#E1E8ED" d="M17.222 17.222c0 .92-.746 1.667-1.667 1.667H2.223c-.92 0-1.666-.746-1.666-1.667V3.89c0-.92.746-1.667 1.666-1.667h13.334c.92 0 1.666.746 1.666 1.667z"/><path fill="#C1694F" d="M17.222 17.778A2.22 2.22 0 0 1 15 20H3.333a2.22 2.22 0 0 1-2.222-2.222V5.556c0-1.228.995-2.223 2.222-2.223H15c1.227 0 2.222.995 2.222 2.223z"/><path fill="#D99E82" d="M16.111 17.778A2.22 2.22 0 0 1 13.89 20H3.333a2.22 2.22 0 0 1-2.222-2.222V6.667c0-1.228.995-2.223 2.222-2.223h10.742c1.227 0 2.036.81 2.036 2.037z"/><path fill="#C1694F" d="M3.333 3.333c-.937 0-.961-1.067-.555-1.527.462-.523 1.18-.695 2.465-.695h.868V0h-1.51C2.396 0 .556 1.389.556 2.986v14.792C.556 19.005 1.55 20 2.778 20h1.11V3.333z"/><path fill="#E1E8ED" d="M13.889 10c0 .613-.498 1.111-1.111 1.111H7.222a1.11 1.11 0 0 1-1.11-1.11V8.888c0-.613.497-1.111 1.11-1.111h5.556c.613 0 1.11.498 1.11 1.11z"/></svg>';
    } else if (
      vak.toLowerCase().startsWith("q") ||
      vak.toLowerCase().startsWith("r") ||
      vak.toLowerCase().startsWith("s") ||
      vak.toLowerCase().startsWith("t") ||
      vak.toLowerCase().startsWith("u")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#F4900C" d="M19.444 14.444a2.22 2.22 0 0 1-2.222 2.223H2.778a2.22 2.22 0 0 1-2.222-2.223V3.507C.556 2.28 3.773 0 5 0h11.458c1.72 0 2.986 1.284 2.986 2.986z"/><path fill="#CCD6DD" d="M18.333 16.667a2.22 2.22 0 0 1-2.222 2.222H3.89a2.22 2.22 0 0 1-2.222-2.222V3.333c0-2.288-.012-2.222 2.777-2.222h11.667c1.227 0 2.222.995 2.222 2.222z"/><path fill="#E1E8ED" d="M17.222 17.222c0 .92-.746 1.667-1.667 1.667H2.223c-.92 0-1.666-.746-1.666-1.667V3.89c0-.92.746-1.667 1.666-1.667h13.334c.92 0 1.666.746 1.666 1.667z"/><path fill="#F4900C" d="M17.222 17.778A2.22 2.22 0 0 1 15 20H3.333a2.22 2.22 0 0 1-2.222-2.222V5.556c0-1.228.995-2.223 2.222-2.223H15c1.227 0 2.222.995 2.222 2.223z"/><path fill="#FFAC33" d="M16.111 17.778A2.22 2.22 0 0 1 13.89 20H3.333a2.22 2.22 0 0 1-2.222-2.222V6.667c0-1.228.995-2.223 2.222-2.223h10.742c1.227 0 2.036.81 2.036 2.037z"/><path fill="#F4900C" d="M3.333 3.333c-.937 0-.961-1.067-.555-1.527.462-.523 1.18-.695 2.465-.695h.868V0h-1.51C2.396 0 .556 1.389.556 2.986v14.792C.556 19.005 1.55 20 2.778 20h1.11V3.333z"/></svg>';
    } else if (
      vak.toLowerCase().startsWith("v") ||
      vak.toLowerCase().startsWith("w") ||
      vak.toLowerCase().startsWith("x") ||
      vak.toLowerCase().startsWith("y") ||
      vak.toLowerCase().startsWith("z")
    ) {
      huiswerkType =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#553788" d="M8.333 17.222c0 1.227-.44 2.222-1.666 2.222h-3.89c-2.221 0-2.221-7.777 0-7.777h3.89c1.227 0 1.666.995 1.666 2.222z"/><path fill="#9266CC" d="M18.889 18.333h-.556v-5.555h.556a.555.555 0 1 0 0-1.111H5.556c-2.223 0-2.223 7.777 0 7.777h13.333a.555.555 0 1 0 0-1.11"/><path fill="#CCD6DD" d="M18.985 18.333H6.11c-1.11 0-1.11-5.555 0-5.555h12.874c.613 0 .613 5.555 0 5.555"/><path fill="#99AAB5" d="M6.389 13.889H19.36c-.075-.653-.2-1.111-.377-1.111H6.111c-.917 0-1.077 3.782-.48 5.104-.217-1.644.035-3.993.758-3.993"/><path fill="#269" d="M6.667 4.444a2.22 2.22 0 0 1-2.223 2.223H2.222C0 6.667 0 .556 2.222.556h2.222c1.228 0 2.223.995 2.223 2.222z"/><path fill="#55ACEE" d="M17.222 5.556h-.555v-3.89h.555a.555.555 0 1 0 0-1.11H3.89c-2.222 0-2.222 6.11 0 6.11h13.333a.555.555 0 1 0 0-1.11"/><path fill="#CCD6DD" d="M17.318 5.556H4.444c-1.11 0-1.11-3.89 0-3.89h12.874c.613 0 .613 3.89 0 3.89"/><path fill="#99AAB5" d="M4.444 2.778h13.292c-.063-.625-.202-1.111-.418-1.111H4.444c-.662 0-.927 1.382-.798 2.5.086-.755.35-1.39.798-1.39"/><path fill="#F4900C" d="M11.111 9.444a2.22 2.22 0 0 1-2.222 2.223H3.333c-2.222 0-2.222-5 0-5H8.89c1.227 0 2.222.995 2.222 2.222z"/><path fill="#FFAC33" d="M19.444 10.556h-.555V7.778h.555a.555.555 0 1 0 0-1.111H8.334c-2.223 0-2.223 5 0 5h11.11a.555.555 0 1 0 0-1.111"/><path fill="#CCD6DD" d="M19.54 10.556H8.889c-1.111 0-1.111-2.778 0-2.778H19.54c.613 0 .613 2.778 0 2.778"/><path fill="#99AAB5" d="M8.889 8.889H19.99c-.036-.59-.185-1.111-.451-1.111H8.889c-.708 0-.963 1.126-.768 1.944.11-.466.365-.833.768-.833"/></svg>';
    }
    const gradeDiv = document.createElement("div");
    gradeDiv.classList.add("les");
    gradeDiv.classList.add("hwDiv");
    if (item.isVoldoende === false) {
      gradeDiv.classList.add("onvoldoende");
    }
    const itemHTML = `${huiswerkType}<strong>${vak}</strong><strong class="grade"><small>${weighting}</small> ${grade}</strong><br>${omschrijving}`;
    gradeDiv.innerHTML = itemHTML;
    container.appendChild(gradeDiv);
  });
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
}
let isLoading = false;

async function fetchHomework(year, week, scroll) {
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
          throw new Error("Authenticatie mislukt. Opnieuw proberen...");
        }
        return res.json();
      })
    );

    const allHomeworkItems = data.flatMap((d) => d.items || []);
    renderHomework(allHomeworkItems, scroll);
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

  if (
    scrollY + viewportHeight >= fullHeight - 300 &&
    !isLoading &&
    document.querySelector(".hwDiv details")
  ) {
    week++;
    await fetchHomework(window.year, window.week, "scroll");
  }
}

window.addEventListener("scroll", onScroll);

function renderHomework(homeworkItems, scroll) {
  document.querySelector(".gif-container").style = "";
  localStorage.setItem("huiswerk", "true");
  const container = document.getElementById("schedule");
  const pills = document.querySelectorAll(".pill");
  pills.forEach((pill) => {
    pill.classList.remove("navSelected");
  });
  document.getElementById("homeworkBtn").classList.add("navSelected");
  container.style = "display: block; height: initial;";
  if (window.innerWidth < 500) {
    container.style = "display: block; height: initial; margin-bottom: 56px;";
  }
  if (!scroll) {
    window.scrollTo(0, 0);
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
  if (!scroll) {
    const formattedDate = new Date().toLocaleDateString("nl-NL", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const h3Elements = document.querySelectorAll("h3");
    for (const h3 of h3Elements) {
      if (h3.textContent.trim().toLowerCase() === formattedDate.toLowerCase()) {
        const yOffset = -56; // 56 pixels boven de top
        const y = h3.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        break;
      }
    }
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
document.getElementById("gradesBtn").addEventListener("click", () => {
  fetchGrades();
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
