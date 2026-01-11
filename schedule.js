const dialogs = document.querySelectorAll("dialog");
for (const dialog of dialogs) {
  if (typeof dialog.showModal !== "function" && window.dialogPolyfill) {
    dialogPolyfill.registerDialog(dialog);
  }
}

function toUnix(date, time) {
  return Math.floor(new Date(`${date}T${time}`).getTime() / 1000);
}

async function loadLanguage() {
  try {
    const supported = ["nl", "en", "de", "fr", "es"];
    const urlParams = new URLSearchParams(window.location.search);
    const forcedLang = urlParams.get("lang");
    const injectedLang = window.KLASCAL_LANG || window.KLASCAL?.lang || null;
    const storedLang = localStorage.getItem("klascal-lang");
    const navigatorLangs = (navigator.languages || [])
      .map((l) => l.slice(0, 2))
      .filter(Boolean);
    const intlLang =
      typeof Intl === "object"
        ? Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2)
        : null;
    const navLang = (navigator.language || navigator.userLanguage || "").slice(
      0,
      2
    );
    const candidates = [
      forcedLang,
      injectedLang,
      storedLang,
      ...navigatorLangs,
      intlLang,
      navLang,
    ].filter(Boolean);
    const lang = candidates.find((c) => supported.includes(c)) || "nl";

    if (!forcedLang) localStorage.setItem("klascal-lang", lang);
    document.documentElement.lang = lang;

    const res = await fetch("lang.json");
    if (!res.ok) throw new Error("Kan lang.json niet laden");
    const translations = await res.json();

    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.getAttribute("data-translate");
      if (translations[lang]?.[key]) el.innerHTML = translations[lang][key];
    });
  } catch (err) {
    console.error("Fout bij laden van taal:", err);
  }
}

let schoolName = localStorage.getItem("schoolName");
let authorizationCode = localStorage.getItem("authorizationCode");
let accessToken = localStorage.getItem("access_token");
let userType = localStorage.getItem("userType");
let lastLessonEndMin;
let day = 0;
let topY = 125;
const timeline = document.createElement("div");
timeline.classList.add("timeline");
if (!schoolName && !accessToken) {
  show("welcomeScreen", "Zermelo koppelen", "hideBack");
  document
    .querySelector("#dialog #closeBtn")
    .setAttribute("onclick", "resetAfterWelcomeScreen()");
  document.querySelector("#dialog #closeBtn").removeAttribute("command");
  document.querySelector("#dialog #closeBtn").removeAttribute("commandfor");
  document.querySelector("#dialog #closeBtn span").innerHTML = "Volgende";
  document.getElementById("dialog").showModal();
}
setInterval(() => {
  fetchSchedule(window.year, window.week);
}, 90000); // 1.5 minuut
function resetAfterWelcomeScreen() {
  show("zermelo", "Zermelo koppelen");
  document
    .querySelector("#dialog #closeBtn")
    .setAttribute("onclick", "show('submenus', 'Instellingen')");
}
async function fetchToken() {
  try {
    const url = `https://${schoolName}.zportal.nl/api/oauth/token?grant_type=authorization_code&code=${authorizationCode}&fields`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    accessToken = localStorage.getItem("access_token");
  } catch (error) {
    console.error("Error fetching access token:", error.message);
  } finally {
    userInfo();
  }
}

async function announcements() {
  const url = `https://${schoolName}.zportal.nl/api/v3/announcements?current=true&user=~me&access_token=${accessToken}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  localStorage.setItem("announcements", JSON.stringify(data));

  renderAnnouncements();
}

announcements();

async function announcements() {
  const url = `https://${schoolName}.zportal.nl/api/v3/announcements?current=true&user=~me&access_token=${accessToken}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  localStorage.setItem("announcements", JSON.stringify(data));

  renderAnnouncements();
}

announcements();

async function userInfo() {
  const response = await fetch(
    `https://${schoolName}.zportal.nl/api/users/~me?fields=code,isEmployee`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  let userType1 = "student";
  if (data.response.data[0] && data.response.data[0].isEmployee === true) {
    userType1 = "teacher";
  } else if (!data.response.data[0]) {
    console.error(data);
  }
  localStorage.setItem("userType", userType1);
  userType = localStorage.getItem("userType");
  fetchSchedule();
}
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  if (localStorage.getItem(input.id)) {
    if (input.type == "checkbox") {
      if (localStorage.getItem(input.id) == "true")
        input.checked = localStorage.getItem(input.id);
    } else {
      input.value = localStorage.getItem(input.id);
    }
  }
});
let mono = "";
if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "blue");
}
if (localStorage.getItem("mono") == "true") {
  mono = " monochrome";
}
document
  .querySelector("body")
  .setAttribute("data-theme", localStorage.getItem("theme") + mono);
const u = () =>
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute(
      "content",
      getComputedStyle(document.body)
        .getPropertyValue("--primary-background")
        .trim()
    );
u();
new MutationObserver(u).observe(document.body, {
  attributes: 1,
  attributeFilter: ["data-theme"],
});
// Save theme when changed
for (const radio of document.querySelectorAll("input[name='color']")) {
  radio.checked = radio.value === localStorage.getItem("theme");
  radio.addEventListener("change", (e) => {
    if (e.target.checked) {
      if (localStorage.getItem("mono") != "true") {
        mono = "";
      } else {
        mono = " monochrome";
      }
      document
        .querySelector("body")
        .setAttribute("data-theme", e.target.value + mono);
      localStorage.setItem("theme", e.target.value);
    }
  });
}
function save() {
  inputs.forEach((input) => {
    if (input.id && input.value) {
      if (input.type == "radio") {
        if (input.checked) {
          localStorage.setItem("dayView", input.value);
        }
      } else if (input.value != "on") {
        localStorage.setItem(input.id, input.value);
        schoolName = localStorage.getItem("schoolName");
        authorizationCode = localStorage.getItem("authorizationCode");
      } else if (input.type == "checkbox") {
        localStorage.setItem(input.id, input.checked);
      }
    } else if (input.id) {
      localStorage.setItem(input.id, "");
    }
  });
}
function closeDialog() {
  save();
  show("submenus", "Instellingen");
  if (localStorage.getItem("mono") == "true") {
    if (
      !document
        .querySelector("body")
        .getAttribute("data-theme")
        .includes("monochrome")
    ) {
      document
        .querySelector("body")
        .setAttribute(
          "data-theme",
          document.querySelector("body").getAttribute("data-theme") +
            " monochrome"
        );
    }
  } else if (
    document
      .querySelector("body")
      .getAttribute("data-theme")
      .includes("monochrome")
  ) {
    document
      .querySelector("body")
      .setAttribute(
        "data-theme",
        document
          .querySelector("body")
          .getAttribute("data-theme")
          .replace(" monochrome", "")
      );
  }
  if (localStorage.getItem("volVaknaam") == "true") {
    fetchFullSubjectNames();
  }
  if (
    localStorage.getItem("viewOption") &&
    localStorage.getItem("dag") != "false"
  ) {
    document.getElementById("dayBtn").click();
  }
  fetchSchedule(window.year, window.week);
}
// Nodig voor correct sluiten dialoog
dialogs.forEach((dialog) => {
  dialog.addEventListener("close", () => {
    closeDialog();
  });
});
function viewTrans(func) {
  if (!document.startViewTransition) {
    func();
    return;
  }
  document.startViewTransition(() => {
    func();
  });
}
function show(id, title, hideBack) {
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
    if (id !== "submenus" && !hideBack) {
      document.querySelector("#dialog h2").removeAttribute("data-translate");
      document.querySelector("#dialog h2").innerHTML =
        '<button style="all: unset" onclick="show(`submenus`, `Instellingen`)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" class="back"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg></button>' +
        title;
    } else {
      document.querySelector("#dialog h2").innerHTML = title;
      if (!hideBack) {
        document.querySelector("#dialog #closeBtn span").innerHTML = "Sluiten";
        document
          .querySelector("#dialog #closeBtn")
          .setAttribute("command", "close");
        document
          .querySelector("#dialog #closeBtn")
          .setAttribute("commandfor", "dialog");
      }
    }
  });
}

function renderAnnouncements() {
  const content = document.getElementById("allAnnouncements");
  content.innerHTML = "";

  const stored = localStorage.getItem("announcements");
  if (!stored) {
    content.textContent = "Geen mededelingen gevonden.";
    return;
  }

  const data = JSON.parse(stored);

  const announcements = data.response?.data;

  if (!Array.isArray(announcements) || announcements.length === 0) {
    content.textContent = "Geen actuele mededelingen.";
    return;
  }

  announcements.forEach((item) => {
    const article = document.createElement("article");
    article.classList.add("announcement");

    article.innerHTML = `
      <h3>${item.title || "Mededeling"}</h3>
      <p>${item.text || ""}</p>
      <small>${
        item.start ? new Date(item.start * 1000).toLocaleDateString() : ""
      }</small>
      `;

    content.appendChild(article);
  });
}

function showAnnouncements() {
  const button = document.getElementById("announcementsButton");
  const checkbox = document.getElementById("mededelingenAan");

  if (!button || !checkbox) return;

  const update = () => {
    const enabled = localStorage.getItem("mededelingenAan") === "true";
    button.style.display = enabled ? "inline" : "none";
  };

  checkbox.checked = localStorage.getItem("mededelingenAan") === "true";
  update();

  checkbox.addEventListener("change", () => {
    localStorage.setItem("mededelingenAan", checkbox.checked);
    update();
  });
}

showAnnouncements();

function showAddAppointment() {
  const button = document.getElementById("addCustomAppointment");
  const checkbox = document.getElementById("addAppointmentOn");

  if (!button || !checkbox) return;

  const update = () => {
    const enabled = localStorage.getItem("addAppointmentOn") === "true";
    button.style.display = enabled ? "inline" : "none";
  };

  checkbox.checked = localStorage.getItem("addAppointmentOn") === "true";
  update();

  checkbox.addEventListener("change", () => {
    localStorage.setItem("addAppointmentOn", checkbox.checked);
    update();
  });
}

showAddAppointment();

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
window.week = new Date().getWeek();
window.year = new Date().getFullYear();
const currentDay = new Date().getDay();
if (currentDay == 6 || currentDay == 0) {
  window.week = window.week + 1;
}
if (window.week == 53) {
  window.week = 1;
}
if (week === 1 && new Date().getMonth() === 11) year++; // Week 1 can start in december
fetchSchedule(window.year, window.week, "firstLoad");
function getYearWeekFromDate(dateStr) {
  const d = new Date(dateStr);
  return {
    year: d.getFullYear(),
    week: d.getWeek(),
  };
}
async function fetchSchedule(year, week, isFirstLoad) {
  if (!year) year = new Date().getFullYear();
  if (!week) week = new Date().getWeek();
  window.week = week;
  window.year = year;
  document.getElementById("week").innerHTML =
    `<p style="color: var(--accent-text-faded)">Wk</p><p style="font-weight: 600;font-size: 1.125rem;">${week}</p>`;
  if (week < 10) week = `0${week}`; // Voeg een voorloopnul toe aan enkelcijferige weken
  if (!schoolName || !authorizationCode) return;
  if (!accessToken) {
    fetchToken();
    return;
  }
  const response = await fetch(
    `https://${schoolName}.zportal.nl/api/liveschedule?${userType}=~me&week=${year}${week}&fields`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  const appointments = data.response.data[0].appointments;
  const isHoliday = !appointments[0];
  const schedule = document.getElementById("schedule");
  schedule.innerHTML = "";
  const grouped = {};

  const customData = JSON.parse(
    localStorage.getItem("customAppointments") || "[]"
  );

  customData.forEach((item) => {
    const { year, week } = getYearWeekFromDate(item.date);

    if (year !== window.year || week !== window.week) return;

    appointments.push({
      appointmentInstance: item.id,
      start: toUnix(item.date, item.start),
      end: toUnix(item.date, item.end),
      subjects: [item.title],
      appointmentType: "custom",

      locations: item.locations || [],
      teachers: item.teachers || [],
      groups: item.groups || [],

      cancelled: item.cancelled === true,
      status: item.status || "",

      repeat: item.repeat || "none",
      actions: [],
      type: "appointment",
      content: item.content || "",
    });
  });

  appointments.sort((a, b) => a.start - b.start);

  appointments.forEach((a) => {
    let dateFull = new Date(a.start * 1000).toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const [weekday, day, month] = dateFull.split(" ");
    let date = `${weekday.slice(0, 2)}<span class="long">${weekday.slice(
      2
    )}</span> ${day}<span class="longExtraExtraExtra"> ${month.slice(
      0,
      3
    )}</span><span class="long">${month.slice(3)}</span>`;
    (grouped[dateFull] = grouped[dateFull] || { date, items: [] }).items.push(
      a
    );
  });

  const fmt = (ts, regex) =>
    new Date(ts * 1000)
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .replace(regex || /^0+/, "");

  const hoursToMinutes = (time) =>
    Number.parseInt(time.split(":")[0]) * 60 +
    Number.parseInt(time.split(":")[1]);

  for (const [dateFull, { date, items }] of Object.entries(grouped)) {
    const div = document.createElement("div");
    const div2 = document.createElement("div");
    const currentDate = new Date().toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    let svg = "";
    if (currentDate == dateFull) {
      svg = `<svg viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14" id="soft_burst">
      <path d="M175.147 33.1508C181.983 22.2831 198.017 22.2831 204.853 33.1508L221.238 59.2009C225.731 66.3458 234.797 69.2506 242.692 66.0751L271.475 54.4972C283.482 49.6671 296.455 58.9613 295.507 71.7154L293.235 102.288C292.612 110.673 298.215 118.278 306.494 120.284L336.681 127.601C349.275 130.653 354.23 145.692 345.861 155.461L325.8 178.877C320.298 185.3 320.298 194.7 325.8 201.123L345.861 224.539C354.23 234.308 349.275 249.347 336.681 252.399L306.494 259.716C298.215 261.722 292.612 269.327 293.235 277.712L295.507 308.285C296.455 321.039 283.482 330.333 271.475 325.503L242.692 313.925C234.797 310.749 225.731 313.654 221.238 320.799L204.853 346.849C198.017 357.717 181.983 357.717 175.147 346.849L158.762 320.799C154.269 313.654 145.203 310.749 137.308 313.925L108.525 325.503C96.5177 330.333 83.5454 321.039 84.4931 308.285L86.7649 277.712C87.388 269.327 81.785 261.722 73.5056 259.716L43.3186 252.399C30.7252 249.347 25.7702 234.308 34.1391 224.539L54.1997 201.123C59.7018 194.7 59.7018 185.3 54.1997 178.877L34.1391 155.461C25.7702 145.692 30.7252 130.653 43.3186 127.601L73.5056 120.284C81.785 118.278 87.388 110.673 86.7649 102.288L84.4931 71.7154C83.5454 58.9613 96.5177 49.6671 108.525 54.4972L137.308 66.0751C145.203 69.2506 154.269 66.3458 158.762 59.201L175.147 33.1508Z"></path>
    </svg> `;
    }
    div.innerHTML = `<strong class="date">${svg}<span>${date}</span></strong>`;

    items.sort((a, b) => a.start - b.start);
    let section = [],
      lastEnd = null;

    const flush = () => {
      if (!section.length) return;
      div2.innerHTML += `${section
        .map((a, i) => {
          const firstLesson = i == 0;
          const lastLesson = i == section.length - 1;
          let marginTop;
          let sectionBeginning = "";
          let height;
          if (a.startTimeSlot != a.endTimeSlot)
            a.startTimeSlot += `-${a.endTimeSlot}`;
          if (!a.startTimeSlot) a.startTimeSlot = "";
          const start = fmt(a.start),
            end = fmt(a.end);
          const startMin = hoursToMinutes(start);
          const endMin = hoursToMinutes(end);
          let startTime = hoursToMinutes(
            localStorage.getItem("startTime") || "08:15"
          );
          if (firstLesson) {
            if (!lastLessonEndMin || startMin - lastLessonEndMin < 0) {
              if (startMin < startTime) {
                localStorage.setItem("startTime", fmt(a.start, "noRegex"));
              }
              startTime = hoursToMinutes(
                localStorage.getItem("startTime") || "08:15"
              );
              lastLessonEndMin = startTime;
            }
            sectionBeginning = "<section>";
          }
          if (lastLesson) {
            lastLessonEndMin = endMin;
          }
          let cancelled = "";
          if (!a.content) {
            a.content = "";
          }
          let warning = a.changeDescription + a.schedulerRemark + a.content;
          let warningSymbol = warning
            ? `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="warningIcon" data-tooltip="${warning}"><path d="M10.909 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.242A2.25 2.25 0 0 1 2.2 17.812l.072-.143L10.03 3.66a2.25 2.25 0 0 1 .879-.878ZM12 16.002a.999.999 0 1 0 0 1.997.999.999 0 0 0 0-1.997Zm-.002-8.004a1 1 0 0 0-.993.884L11 8.998 11 14l.007.117a1 1 0 0 0 1.987 0l.006-.117L13 8.998l-.007-.117a1 1 0 0 0-.994-.883Z"></path></svg>`
            : "";
          if (!a.cancelled && (a.schedulerRemark || a.content)) {
            warningSymbol = warning
              ? `<svg width="24" height="24" fill="none" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" id="icon" data-tooltip="${warning}"><path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`
              : "";
          }
          if (
            !a.appointmentInstance &&
            a.actions[0] &&
            !a.actions[0].appointment.plannedAttendance &&
            a.actions[0].appointment.attendanceOverruled
          ) {
            // Check used by Zermelo to see if unenrolled from lesson
            // Lesson info in a.actions[0].appointment instead of a
            a = a.actions[0].appointment;
            cancelled = "notEnrolled";
            warning = "Afgemeld";
            warningSymbol = warning
              ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" data-tooltip="${warning}"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z"/></svg>`
              : "";
          } else if (a.cancelled == true) {
            cancelled = "cancelled";
          }
          if (a.appointmentType == "conflict") {
            a.subjects = a.actions.flatMap(
              (action) => action.appointment.subjects
            );
            a.locations = a.actions.flatMap(
              (action) => action.appointment.locations
            );
            a.teachers = a.actions.flatMap(
              (action) => action.appointment.teachers
            );
            a.groups = a.actions.flatMap((action) => action.appointment.groups);
          }
          const subjAbbrev = a.subjects;
          if (localStorage.getItem("volVaknaam") === "true") {
            const fullSubjectNames = JSON.parse(
              localStorage.getItem("subjects")
            );
            const matches = fullSubjectNames
              .filter((item) => a.subjects.includes(item.code))
              .map((item) => item.name);
            if (matches.length) a.subjects = matches;
          } else if (localStorage.getItem("afkortingHl") === "true") {
            a.subjects = a.subjects.map((subject) => subject.toUpperCase());
          }
          if (localStorage.getItem("afkortingHl") === "true") {
            a.teachers = a.teachers.map((teacher) => teacher.toUpperCase());
          }
          a.groups.forEach((group, index) => {
            if (group.startsWith(localStorage.getItem("prefix-group"))) {
              a.groups[index] = group.slice(
                localStorage.getItem("prefix-group").length
              ); //groups[index] instead of group is necessary to actually change the value of group
            }
          });
          a.locations.forEach((loc, index) => {
            if (loc.startsWith(localStorage.getItem("prefix-location"))) {
              a.locations[index] = loc.slice(
                localStorage.getItem("prefix-location").length
              );
            }
          });
          let styles = "";
          let warningStyles = "";
          marginTop = ((startMin - startTime) * 1.1) / 16;
          height = ((endMin - startMin) * 1.1) / 16;
          if (height < 3) {
            styles = "line-height: 1.1;";
            warningStyles = "bottom: 2px";
          }
          return `${sectionBeginning}<div id="${
            a.appointmentInstance + "div"
          }" class="les ${cancelled} ${
            a.appointmentType
          }" style="--height: ${height}rem; --margin: ${marginTop}rem;${styles}"><button id="${
            a.appointmentInstance
          }" class="innerSpan"
          commandfor="info" command="show-modal" onclick='showLessonInfo(this, ${JSON.stringify(
            a
          )})'><strong class="subject">${
            a.subjects
          }</strong><strong class="subjAbbrev">${subjAbbrev}</strong><strong class="lesuur">${
            a.startTimeSlot
          }</strong><hr style="height: 0;"><p class="lestijden" style="margin-right: 6px">${start}<span class="longExtraExtra" style="display: inline">-${end}</span></p><p>${
            a.locations
          }<span class="teachersAndGroups">${
            a.teachers.length != 0 ? ` (${a.teachers})` : ""
          }<span class="groups">${
            localStorage.getItem("klas") == "true" ? ` ${a.groups}` : ""
          }</span></span></p></button><span class="warning" style="${warningStyles}">${warningSymbol}</span></div>`;
        })
        .join("")}</section>`;
      div.appendChild(div2);
      section = [];
    };
    for (const a of items) {
      if (lastEnd !== null && a.start !== lastEnd) flush();
      section.push(a);
      lastEnd = a.end;
    }
    flush();
    div.classList.add("day");
    schedule.appendChild(div);
  }
  if (isHoliday) {
    const d = new Date(year, 0, 1 + (week - 1) * 7);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const holidayMonth = d.toLocaleString("default", { month: "numeric" });
    if (holidayMonth == 10) {
      schedule.innerHTML =
        '<h2 class="date"><svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem"><path d="M460-690q-8 0-14-6t-6-14v-80q0-42 29-71t71-29h80q8 0 14 6t6 14v80q0 42-29 71t-71 29h-80ZM220-450q-58 0-99-41t-41-99v-100q0-17 11.5-28.5T120-730h100q58 0 99 41t41 99v100q0 17-11.5 28.5T320-450H220ZM640-90q-39 0-74.5-12T501-135l-33 33q-11 11-28 11t-28-11q-11-11-11-28t11-28l33-33q-21-29-33-64.5T400-330q0-100 70-170.5T640-571h161q33 0 56.5 23.5T881-491v161q0 100-70.5 170T640-90Zm0-80q67 0 113-47t46-113v-160H640q-66 0-113 46.5T480-330q0 23 5.5 43.5T502-248l110-110q11-11 28-11t28 11q11 11 11 28t-11 28L558-192q18 11 38.5 16.5T640-170Zm1-161Z"/></svg><br>Herfstvakantie!</h2>';
    } else if (holidayMonth == 12) {
      schedule.innerHTML =
        '<h2 class="date"><svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem"><path d="M440-246 337-145q-11 11-27.5 11T282-146q-12-11-12-27.5t12-28.5l158-158v-80h-80L201-281q-11 11-27.5 11T145-282q-11-11-11-27.5t11-27.5l101-103H119q-17 0-28-11.5T80-480q0-17 11.5-28.5T120-520h126L145-622q-11-11-11-27.5t12-28.5q11-11 27.5-11t28.5 11l158 158h80v-80L281-758q-11-11-11-27.5t12-28.5q11-11 27.5-11t27.5 11l103 100v-126q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v126l102-100q11-11 27.5-11t28.5 11q11 12 11 28.5T678-758L520-600v80h80l158-158q11-11 27.5-11t28.5 12q11 11 11 27.5T814-622L714-520h126q17 0 28.5 11.5T880-480q0 17-11.5 28.5T840-440H714l100 103q11 11 11 27.5T814-282q-12 12-28.5 12T758-282L600-440h-80v80l158 159q11 11 11 27.5T677-145q-11 11-27.5 11T622-145L520-246v127q0 17-11.5 28T480-80q-17 0-28.5-11.5T440-120v-126Z"/></svg><br>Kerstvakantie!</h2>';
    } else if (holidayMonth == 2) {
      schedule.innerHTML =
        '<h2 class="date"><svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem"><path d="M380-80q-75 0-127.5-52.5T200-260q0-35 17-64.5t63-75.5q6-6 11.5-12.5T306-430q-51-78-78.5-163.5T200-760q0-58 21-89t59-31q57 0 102 55t68 101q9 20 16.5 40.5T480-641q6-22 13.5-42.5T511-724q22-46 67-101t102-55q38 0 59 31t21 89q0 81-27.5 166.5T654-430q9 11 14.5 17.5T680-400q46 46 63 75.5t17 64.5q0 75-52.5 127.5T580-80q-45 0-72.5-10L480-100l-27.5 10Q425-80 380-80Zm0-80q23 0 46-5.5t43-16.5q-11-5-20-17t-9-21q0-8 11.5-14t28.5-6q17 0 28.5 6t11.5 14q0 9-9 21t-20 17q20 11 43 16.5t46 5.5q42 0 71-29t29-71q0-18-10-35t-30-34q-14-12-23-21t-29-34q-29-35-48-45.5T480-440q-41 0-60.5 10.5T372-384q-20 25-29 34t-23 21q-20 17-30 34t-10 35q0 42 29 71t71 29Zm40-130q-8 0-14-9t-6-21q0-12 6-21t14-9q8 0 14 9t6 21q0 12-6 21t-14 9Zm120 0q-8 0-14-9t-6-21q0-12 6-21t14-9q8 0 14 9t6 21q0 12-6 21t-14 9ZM363-489q11-8 25-14t31-11q-2-48-14.5-95.5T373-696q-19-40-42-67.5T285-799q-2 6-3.5 15.5T280-760q0 68 21.5 138T363-489Zm234 0q40-63 61.5-133T680-760q0-14-1.5-23.5T675-799q-23 8-46 35.5T587-696q-18 39-30.5 86.5T541-514q15 4 29 10.5t27 14.5Z"/></svg><br>Voorjaarsvakantie!</h2>';
    } else if (holidayMonth == 4) {
      schedule.innerHTML =
        '<h2 class="date"><svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem"><path d="M426-160q-9-26-23-48t-33-41q-19-19-41-33.5T281-306q2 29 14 54t32 45q20 20 45 32.5t54 14.5Zm108 0q29-3 54-15t45-32q20-20 32-45t15-54q-26 9-48.5 23T590-250q-19 19-33 41.5T534-160Zm-54-360q66 0 113-47t47-113v-48l-70 59-90-109-90 109-70-59v48q0 66 47 113t113 47ZM440-80q-100 0-170-70t-70-170v-80q71-1 134 29t106 81v-153q-86-14-143-80.5T240-680v-136q0-26 23-36.5t43 6.5l74 64 69-84q12-14 31-14t31 14l69 84 74-64q20-17 43-6.5t23 36.5v136q0 90-57 156.5T520-443v153q43-51 106-81t134-29v80q0 100-70 170T520-80h-80Zm40-569Zm127 416Zm-253 0Z"/></svg><br>Meivakantie!</h2>';
    } else if (holidayMonth == 7 || holidayMonth == 8) {
      schedule.innerHTML =
        '<h2 class="date"><svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem"><path d="M756-148 558-346q-11-11-11-28t11-28q11-11 28-11t28 11l198 198q11 11 11 28t-11 28q-11 11-28 11t-28-11Zm-575-72q-31-50-46-104.5T120-436q0-78 29-152t89-134q60-60 134.5-89.5T525-841q57 0 111.5 15.5T740-779q31 20 33 57t-26 65L303-213q-28 28-65.5 26T181-220Zm65-50 54-54q-16-21-30.5-43T243-411q-12-22-21-44t-16-43q-11 59-1.5 118T246-270Zm112-110 222-224q-43-33-86.5-53.5t-81.5-28q-38-7.5-68.5-2.5T296-666q-17 18-22 48.5t2.5 69q7.5 38.5 28 81.5t53.5 87Zm334-334q-53-32-112-42t-118 2q22 7 44 16t44 20.5q22 11.5 43.5 26T636-660l56-54Z"/></svg><br>Zomervakantie!</h2>';
    }
  }
  loadLanguage();
  if (isFirstLoad == "firstLoad") {
    day = new Date().getDay() - 1;
    if (day == 5 || day == -1) {
      day = 0;
    }
    document.querySelector("body").scrollTo({
      left: window.innerWidth * day,
      behavior: "instant",
    });
  }
  const startMin = hoursToMinutes(new Date().toLocaleTimeString());
  const startTime = hoursToMinutes(
    localStorage.getItem("startTime") || "08:15"
  );
  let marginTop = ((startMin - startTime) * 1.1) / 16;
  timeline.style = `--top: ${marginTop}rem`;
  document.getElementById("schedule").appendChild(timeline);
  document.getElementById("schedule").style.opacity = "";
  const tip = document.getElementById("tooltip");

  function positionTip(btn) {
    tip.textContent = btn.getAttribute("data-tooltip");
    const rect = btn.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    let top = rect.bottom + 12;
    let left = rect.right - tipRect.width + 4; // rect.left + (rect.width - tipRect.width) / 2 for center
    if (top + tipRect.height > window.innerHeight)
      top = rect.top - tipRect.height - 8;
    if (left < 0) left = 8;
    if (left + tipRect.width > window.innerWidth)
      left = window.innerWidth - tipRect.width - 8;
    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;
  }

  document.querySelectorAll("[data-tooltip]").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      positionTip(btn);
      tip.setAttribute("data-show", "");
    });
    btn.addEventListener("mouseleave", () => tip.removeAttribute("data-show"));
  });
  let maxMinutes = -Infinity;
  document.querySelectorAll(".lestijden .longExtraExtra").forEach((lestijd) => {
    const endMin = hoursToMinutes(lestijd.innerHTML.slice(1));
    if (endMin > maxMinutes) {
      maxMinutes = endMin;
    }
  });
  if (startMin > maxMinutes) {
    timeline.style.display = "none";
  } else {
    timeline.style.display = "";
  }
  window.addEventListener("resize", () => {
    if (tip.hasAttribute("data-show")) {
      const active = document.querySelector("[data-tooltip]:hover");
      if (active) positionTip(active);
    }
  });
}
async function fetchFullSubjectNames() {
  let url = `https://${localStorage.getItem(
    "schoolName"
  )}.zportal.nl/api/subjectselectionsubjects?fields=code,name`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((r) => r.json())
    .then((result) => {
      let subjectTranslations = result.response.data;
      subjectTranslations = subjectTranslations.map((subject) => {
        let name = subject.name;
        const capitalCount = (name.match(/[A-Z]/g) || []).length;
        // Kijkt of het eindigt met "s". Bijv. Frans, Duits, Spaans. Of het eindigt met taal en literatuur (tl)
        if (
          !/[bdfghjklmnpqrtvwxyz]s$/i.test(name) &&
          !name.includes("taal en ") &&
          subject.code != "la" &&
          subject.code != "eng" &&
          !(capitalCount > 1)
        ) {
          name = name.toLowerCase();
        }
        switch (subject.code) {
          case "ontw":
            name = "ontwerpen";
            break;
          case "men":
            name = "mentorles";
            break;
          case "nask":
            name = "NaSk";
            break;
          case "inv":
            name = "invalles";
            break;
          case "cko":
            name = "Culturele en Kunstzinnige Oriëntatie";
            break;
          case "pko":
            name = "Profiel Keuze Oriëntatie";
            break;
          case "ch":
            name = "chemistry";
            break;
          case "kvdbw":
            name = "Voeding en Beweging";
            break;
          case "eio":
            name = "Europese en internationale oriëntatie";
            break;
          case "bp":
            name = "begeleidingsprogramma";
            break;
          case "cra":
            name = "creatieve activiteiten";
            break;
          case "ph":
            name = "physics";
            break;
        }
        return Object.assign({}, subject, { name: name });
      });
      localStorage.setItem("subjects", JSON.stringify(subjectTranslations));
    });
}
function clearUserData() {
  localStorage.clear();
  location.reload();
}
function switchDay(dir) {
  let behavior = "smooth";
  const days = document.querySelectorAll(".day");
  let dayLength = days.length;
  if (!document.getElementById("schedule").className.includes("dayEnabled")) {
    dayLength = 1;
  }
  let week = window.week;
  if (dir == "next") {
    day++;
    week++;
  } else {
    day--;
    week--;
  }
  if (week > 52) {
    week = 1;
    window.year++;
  } else if (week == 0) {
    week = 52;
    window.year--;
  }
  if (day == -1) {
    day = 4;
    behavior = "instant";
    if (document.getElementById("schedule").classList.contains("dayEnabled")) {
      document.getElementById("schedule").style.opacity = 0;
    }
    if (!document.startViewTransition) {
      fetchSchedule(window.year, week);
    } else {
      document.startViewTransition(() => fetchSchedule(window.year, week));
    }
  } else if (day > dayLength - 1) {
    day = 0;
    behavior = "instant";
    if (document.getElementById("schedule").classList.contains("dayEnabled")) {
      document.getElementById("schedule").style.opacity = 0;
    }
    if (!document.startViewTransition) {
      fetchSchedule(window.year, week);
    } else {
      document.startViewTransition(() => fetchSchedule(window.year, week));
    }
  }
  document.querySelector("body").scrollTo({
    left: window.innerWidth * day,
    behavior: behavior,
  });
}
window.addEventListener("resize", () => {
  document.querySelector("body").scrollTo({
    left: window.innerWidth * day,
    behavior: "instant",
  });
  if (window.innerWidth < 346) {
    document.getElementById("dayBtn").click();
  }
  if (
    window.innerHeight < 565 &&
    document.getElementById("schedule").classList == "ltrEnabled"
  ) {
    document.getElementById("ltr").click();
  }
});
document.getElementById("nextDay").addEventListener("click", () => {
  switchDay("next");
});
document.getElementById("previousDay").addEventListener("click", () => {
  switchDay("prev");
});
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      switchDay("prev");
      break;
    case "ArrowRight":
      switchDay("next");
      break;
  }
});
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

document.addEventListener("touchstart", (event) => {
  touchstartX = event.touches[0].clientX;
  touchstartY = event.touches[0].clientY;
});

document.addEventListener("touchend", (event) => {
  touchendX = event.changedTouches[0].clientX;
  touchendY = event.changedTouches[0].clientY;
  handleGesture();
});

function handleGesture() {
  if (touchendX - touchstartX < -50) {
    switchDay("next");
  }
  if (touchendX - touchstartX > 50) {
    switchDay("prev");
  }
}
document.getElementById("dayBtn").addEventListener("click", () => {
  document.getElementById("schedule").classList = "dayEnabled";
  if (localStorage.getItem("viewOption") == "list") {
    document.getElementById("schedule").classList = "listEnabled";
  }
  document.getElementById("ltr").style.opacity = "0";
  document.getElementById("ltr").style.visibility = "hidden";
  document.getElementById("weekBtn").classList.remove("selected");
  document.getElementById("dayBtn").classList.add("selected");
  document.querySelector("body").scrollTo({
    left: window.innerWidth * day,
    behavior: "instant",
  });
});

document.getElementById("weekBtn").addEventListener("click", () => {
  document.getElementById("schedule").classList = "weekEnabled";
  if (localStorage.getItem("ltr") == "true") {
    document.getElementById("schedule").classList = "ltrEnabled";
    document.querySelector("#ltr svg").style.rotate = "45deg";
  }
  document.getElementById("ltr").style.opacity = "1";
  document.getElementById("ltr").style.visibility = "visible";
  document.getElementById("dayBtn").classList.remove("selected");
  document.getElementById("weekBtn").classList.add("selected");
});

document.getElementById("ltr").addEventListener("click", () => {
  if (localStorage.getItem("ltr") == "true") {
    localStorage.setItem("ltr", "false");
    document.querySelector("#ltr svg").style.rotate = "";
  } else {
    localStorage.setItem("ltr", "true");
    document.querySelector("#ltr svg").style.rotate = "45deg";
  }
  document.getElementById("weekBtn").click();
});
if (
  localStorage.getItem("dag") == "false" ||
  (!localStorage.getItem("dag") && window.innerWidth > 1000)
) {
  document.getElementById("weekBtn").click();
} else {
  document.getElementById("dayBtn").click();
}
if (window.innerWidth < 330) {
  document.getElementById("dayBtn").click();
}
async function showLessonInfo(lessonHTML, lesson) {
  const original = document.getElementById(lesson.appointmentInstance);
  original.classList.add("clicked");
  document.querySelector("#info #content").innerHTML = "";

  const clone = document.getElementById(lessonHTML.id + "div").cloneNode(true);
  document.querySelector("#info #content").appendChild(clone);
  document.querySelector("#info .innerSpan").setAttribute("tabindex", "-1");
  if (!lesson.expectedStudentCount) {
    lesson.expectedStudentCount = "";
  } else {
    lesson.expectedStudentCount = `<span style="translate: 0 1.5px">${lesson.expectedStudentCount}</span>`;
  }
  const groupIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1.25rem" viewBox="0 -960 960 960" width="1.25rem" fill="var(--accent-text)"><path d="M40-272q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240v-32Zm698 112q11-18 16.5-38.5T760-240v-40q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v40q0 33-23.5 56.5T840-160H738ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113Z"/></svg>`;
  let onlinePill = "";
  if (lesson.online) {
    if (!lesson.expectedStudentCountOnline) {
      lesson.expectedStudentCountOnline = "";
    } else {
      lesson.expectedStudentCountOnline = `<span style="translate: 0 1.5px">${lesson.expectedStudentCountOnline}</span>`;
    }
    if (!lesson.onlineLocationUrl) {
      lesson.onlineLocationUrl = "";
    } else {
      lesson.onlineLocationUrl = `<span style="translate: 0 1.5px">${lesson.onlineLocationUrl}</span>`;
    }
    const onlineIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1.25rem" viewBox="0 -960 960 960" width="1.25rem" fill="var(--accent-text)"><path d="M720-183v49q0 17-11.5 28.5T680-94q-17 0-28.5-11.5T640-134v-126q0-25 17.5-42.5T700-320h126q17 0 28.5 11.5T866-280q0 17-11.5 28.5T826-240h-50l90 90q11 11 11 27.5T866-94q-12 12-28.5 12T809-94l-89-89ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 10-.5 22t-1.5 22q-2 17-14 26.5t-30 9.5q-16 0-27-14t-9-30q2-10 2-18v-18q0-20-2.5-40t-7.5-40H654q3 20 4.5 40t1.5 40v21.5q0 11.5-1 21.5-2 17-14 27t-29 10q-16 0-27.5-13t-9.5-29q1-10 1-19v-19q0-20-1.5-40t-4.5-40H386q-3 20-4.5 40t-1.5 40q0 20 1.5 40t4.5 40h94q17 0 28.5 11.5T520-360q0 17-11.5 28.5T480-320h-76q12 43 31 82.5t45 75.5q10 0 20 .5t20-.5q17-2 28 8.5t11 27.5q0 18-9 30t-26 14q-10 1-22 1.5t-22 .5ZM170-400h136q-3-20-4.5-40t-1.5-40q0-20 1.5-40t4.5-40H170q-5 20-7.5 40t-2.5 40q0 20 2.5 40t7.5 40Zm206 222q-18-34-31.5-69.5T322-320H204q29 51 73 87.5t99 54.5ZM204-640h118q9-37 22.5-72.5T376-782q-55 18-99 54.5T204-640Zm200 0h152q-12-43-31-82.5T480-798q-26 36-45 75.5T404-640Zm234 0h118q-29-51-73-87.5T584-782q18 34 31.5 69.5T638-640Z"/></svg>`;
    onlinePill = `<span class="pill">${onlineIcon}${lesson.expectedStudentCountOnline}${lesson.onlineLocationUrl}</span>`;
  }
  if (!lesson.content) {
    lesson.content = "";
  }
  let warning =
    lesson.changeDescription + lesson.schedulerRemark + lesson.content;
  if (lesson.cancelled == true) {
    lesson.appointmentType = "cancelled";
  }
  const personIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1.25rem" viewBox="0 -960 960 960" width="1.25rem" fill="var(--accent-text)" style="vertical-align: sub; translate: 0 1.5px;"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z"/></svg>`;
  if (lesson.creator) {
    lesson.creator = `<hr style="height: 0.75rem;"><p class="creator">Aangemaakt door: <b class="pill">${personIcon} ${lesson.creator}</b></p>`;
  } else {
    lesson.creator = "";
  }
  let warningSymbol = warning
    ? `<div><p class="change">${warning}</p></div>`
    : "";
  const calendarClockIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1.25rem" viewBox="0 -960 960 960" width="1.25rem" fill="var(--accent-text)" style="vertical-align: sub; translate: 0 -1px;"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-40q0-17 11.5-28.5T280-880q17 0 28.5 11.5T320-840v40h320v-40q0-17 11.5-28.5T680-880q17 0 28.5 11.5T720-840v40h40q33 0 56.5 23.5T840-720v187q0 17-11.5 28.5T800-493q-17 0-28.5-11.5T760-533v-27H200v400h232q17 0 28.5 11.5T472-120q0 17-11.5 28.5T432-80H200Zm520 40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm20-208v-92q0-8-6-14t-14-6q-8 0-14 6t-6 14v91q0 8 3 15.5t9 13.5l61 61q6 6 14 6t14-6q6-6 6-14t-6-14l-61-61Z"/></svg>`;
  const updateIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1.25rem" viewBox="0 -960 960 960" width="1.25rem" fill="var(--accent-text)" style="vertical-align: sub;"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-54q0-17 11.5-28.5T800-800q17 0 28.5 11.5T840-760v160q0 17-11.5 28.5T800-560H640q-17 0-28.5-11.5T600-600q0-17 11.5-28.5T640-640h70q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q95 0 170-57t99-147q5-16 18-24t29-6q17 2 27 14.5t6 27.5q-29 119-126 195.5T480-120Zm40-376 100 100q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Z"/></svg>`;
  document.querySelector("#info #content").innerHTML +=
    `${warningSymbol}<div class="moreInfo"><span class="pill">${groupIcon}${lesson.expectedStudentCount}<span style="translate: 0 1.5px">${lesson.groups}</span></span>${onlinePill}</div>`;
  const url = `https://${schoolName}.zportal.nl/api/appointments?appointmentInstance=${
    lesson.appointmentInstance
  }&user=~me&valid=true&start=${lesson.start}&end=${
    lesson.end
  }&fields=created,modified,lastModified${
    localStorage.getItem("userType") == "teacher" ? `,students` : ""
  }`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!data.response.data[0]) return;
  const a = data.response.data[0];
  const createdDate = new Date(a.created * 1000).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const modifiedDate = new Date(a.lastModified * 1000).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  if (a.students) {
    a.students = `<div class="les dates"><p>Leerlingen: ${a.students}</p></div>`;
  } else {
    a.students = "";
  }
  if (!document.startViewTransition || window.innerWidth > 500) {
    document.querySelector("#info #content").innerHTML +=
      `<div class="les dates"><p class="createdDate">Aangemaakt: <b class="pill">${calendarClockIcon} ${createdDate}</b></p><hr style="height: 0.75rem;"><p class="modifiedDate">Laatst aangepast: <b class="pill">${updateIcon} ${modifiedDate}</b></p>${lesson.creator}</div>${a.students}`;
  } else {
    document.startViewTransition(
      () =>
        (document.querySelector("#info #content").innerHTML +=
          `<div class="les dates"><p class="createdDate">Aangemaakt: <b class="pill">${calendarClockIcon} ${createdDate}</b></p><hr style="height: 0.75rem;"><p class="modifiedDate">Laatst aangepast: <b class="pill">${updateIcon} ${modifiedDate}</b></p>${lesson.creator}</div>${a.students}`)
    );
  }
}
document.querySelector(".addBtn").addEventListener("click", () => {
  const newApp = {
    id: "custom-" + Date.now(),
    title: document.getElementById("custTitle").value,
    date: document.getElementById("custDate").value,
    start: document.getElementById("custStart").value,
    end: document.getElementById("custEnd").value,

    locations: document
      .getElementById("custLocation")
      .value.split(",")
      .map((v) => v.trim())
      .filter(Boolean),

    teachers: document
      .getElementById("custTeacher")
      .value.split(",")
      .map((v) => v.trim())
      .filter(Boolean),

    groups: document
      .getElementById("custGroup")
      .value.split(",")
      .map((v) => v.trim())
      .filter(Boolean),

    cancelled: document.getElementById("custCancelled").checked,
    content: document.getElementById("custContent").value || "",
  };

  const existing = JSON.parse(
    localStorage.getItem("customAppointments") || "[]"
  );
  existing.push(newApp);
  localStorage.setItem("customAppointments", JSON.stringify(existing));

  fetchSchedule(window.year, window.week);
});
