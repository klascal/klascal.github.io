let schoolName = localStorage.getItem("schoolName");
let authorizationCode = localStorage.getItem("authorizationCode");
let accessToken = localStorage.getItem("access_token");
let userType = localStorage.getItem("userType");
let lastLessonEndMin;
let day = 0;
let topY = 125;
const timeline = document.createElement("div");
timeline.classList.add("timeline");
timeline.style = `height: 2px;`;
const circle = document.createElement("div");
circle.classList.add("circle-marker");
if (!schoolName && !accessToken) {
  show("welcomeScreen", "Zermelo koppelen", "hideBack");
  document
    .querySelector("#dialog #closeBtn")
    .setAttribute("onclick", "resetAfterWelcomeScreen()");
  document.querySelector("#dialog #closeBtn").innerHTML = "Volgende";
  showDialog();
}
setInterval(() => {
  fetchSchedule(window.year, window.week);
}, 90000); // 1.5 minuut
function resetAfterWelcomeScreen() {
  show("zermelo", "Zermelo koppelen");
  document
    .querySelector("#dialog #closeBtn")
    .setAttribute("onclick", "closeDialog()");
  document.querySelector("#dialog #closeBtn").innerHTML = "Sluiten";
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
  if (data.response.data[0].isEmployee === true) {
    userType1 = "teacher";
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
function showDialog(el) {
  let dialog = document.getElementById(el) || document.getElementById("dialog");
  dialog.showModal();
}
function closeDialog(el) {
  let dialog = document.getElementById(el) || document.getElementById("dialog");
  save();
  dialog.close();
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
      document.querySelector("#dialog h2").innerHTML =
        '<button style="all: unset" onclick="show(`submenus`, `Instellingen`)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></button>' +
        title;
    } else {
      document.querySelector("#dialog h2").innerHTML = title;
    }
  });
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
if (localStorage.getItem("viewOption") == "list") {
  document.getElementById("list").click();
} else {
  document.getElementById("day").click();
}
window.week = new Date().getWeek();
const currentDay = new Date().getDay();
if (currentDay == 6 || currentDay == 0) {
  window.week = window.week + 1;
}
fetchSchedule(undefined, window.week, "firstLoad");
async function fetchSchedule(year, week, isFirstLoad) {
  if (!year) year = new Date().getFullYear();
  if (!week) week = new Date().getWeek();
  window.week = week;
  window.year = year;
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
  const schedule = document.getElementById("schedule");
  schedule.innerHTML = "";
  const grouped = {};

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
    (grouped[dateFull] ||= { date, items: [] }).items.push(a);
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
    div.innerHTML = `<strong class="date">${svg}<span><span class="weekText">W<span class="longExtra">ee</span>k ${week}, </span>${date}</span></strong>`;

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
          if (a.startTimeSlot != a.endTimeSlot)
            a.startTimeSlot += `-${a.endTimeSlot}`;
          if (!a.startTimeSlot) a.startTimeSlot = "";
          const start = fmt(a.start),
            end = fmt(a.end);
          const startMin = hoursToMinutes(start);
          const endMin = hoursToMinutes(end);
          let startTime = hoursToMinutes(
            localStorage.getItem("startTime") || "08:10"
          );
          const height = ((endMin - startMin) * 1.1) / 16;
          if (firstLesson) {
            if (!lastLessonEndMin || startMin - lastLessonEndMin < 0) {
              if (startMin < startTime) {
                localStorage.setItem("startTime", fmt(a.start, "noRegex"));
              }
              startTime = hoursToMinutes(
                localStorage.getItem("startTime") || "08:10"
              );
              lastLessonEndMin = startTime;
            }
            marginTop = ((startMin - lastLessonEndMin) * 1.1457) / 16;
            if (startTime < 490) {
              marginTop = ((startMin - lastLessonEndMin) * 1.135) / 16;
            } else if (startTime > 490) {
              marginTop = ((startMin - lastLessonEndMin) * 1.235) / 16;
            }
            let lessonPadding = 1;
            if (marginTop == 0) lessonPadding = 0;
            sectionBeginning = `<section style="--margin: calc(${marginTop}rem + ${lessonPadding}px)">`;
          }
          if (lastLesson) {
            lastLessonEndMin = endMin;
          }
          let cancelled = "";
          let warning = a.changeDescription + a.schedulerRemark;
          let warningSymbol = warning
            ? `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="warningIcon" data-tooltip="${warning}"><path d="M10.909 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.242A2.25 2.25 0 0 1 2.2 17.812l.072-.143L10.03 3.66a2.25 2.25 0 0 1 .879-.878ZM12 16.002a.999.999 0 1 0 0 1.997.999.999 0 0 0 0-1.997Zm-.002-8.004a1 1 0 0 0-.993.884L11 8.998 11 14l.007.117a1 1 0 0 0 1.987 0l.006-.117L13 8.998l-.007-.117a1 1 0 0 0-.994-.883Z"></path></svg>`
            : "";
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
          let topHeight = "";
          if (height < 3) {
            styles = "line-height: 1;";
            topHeight = "height: 0.25rem;";
          }
          return `${sectionBeginning}<div class="les ${cancelled} ${
            a.appointmentType
          }" style="--height: ${height}rem;${styles}"><hr style="${topHeight}"><strong>${
            a.subjects
          }</strong><strong class="lesuur">${
            a.startTimeSlot
          }</strong><br><p class="lestijden" style="margin-right: 8px">${start}<span class="longExtraExtra" style="display: inline">-${end}</span></p><br><p>${
            a.locations
          }<span class="teachersAndGroups">${
            a.teachers.length != 0 ? ` (${a.teachers})` : ""
          }${
            localStorage.getItem("klas") == "true" ? ` ${a.groups}` : ""
          }</span></p><span class="warning">${warningSymbol}</span></div>`;
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
    localStorage.getItem("startTime") || "08:10"
  );
  let marginTop = ((startMin - startTime) * 1.14) / 16 + 1.5;
  if (startTime > 490) {
    marginTop = ((startMin - startTime) * 1.235) / 16 + 1.5;
  }
  console.log(timeline.style, marginTop);
  timeline.style.top = `${marginTop}rem`;
  timeline.appendChild(circle);
  document.getElementById("schedule").appendChild(timeline);
  document.getElementById("schedule").style.opacity = "";
  const tip = document.getElementById("tooltip");

  function positionTip(btn) {
    tip.textContent = btn.getAttribute("data-tooltip");
    const rect = btn.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    let top = rect.bottom + 9;
    let left = rect.right - tipRect.width + 7; // rect.left + (rect.width - tipRect.width) / 2 for center
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
        return { ...subject, name };
      });
      localStorage.setItem("subjects", JSON.stringify(subjectTranslations));
    });
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
  if (window.innerWidth < 330) {
    document.getElementById("dayBtn").click();
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
