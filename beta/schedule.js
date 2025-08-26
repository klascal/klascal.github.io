let schoolName = localStorage.getItem("schoolName");
let authorizationCode = localStorage.getItem("authorizationCode");
let accessToken = localStorage.getItem("access_token");
let userType = localStorage.getItem("userType");
let lastLessonEndMin;
document.querySelector("body").scrollTo(0, 0);
async function fetchToken() {
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
    `https://${schoolName}.zportal.nl/api/v3/users/~me?fields=code,isEmployee`,
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
document
  .querySelector("body")
  .setAttribute("data-theme", localStorage.getItem("theme") || "blue");
// Save theme when changed
for (const radio of document.querySelectorAll("input[name='color']")) {
  radio.checked = radio.value === localStorage.getItem("theme");
  radio.addEventListener("change", (e) => {
    if (e.target.checked) {
      document.querySelector("body").setAttribute("data-theme", e.target.value);
      localStorage.setItem("theme", e.target.value);
    }
  });
}
function save() {
  inputs.forEach((input) => {
    if (input.id && input.value) {
      if (input.value != "on") {
        localStorage.setItem(input.id, input.value);
        schoolName = localStorage.getItem("schoolName");
        authorizationCode = localStorage.getItem("authorizationCode");
      } else if (input.type == "checkbox") {
        console.log(input.id, input.checked);
        localStorage.setItem(input.id, input.checked);
      }
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
  fetchSchedule();
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
function show(id, title) {
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
    if (id !== "submenus") {
      document.querySelector("#dialog h2").innerHTML =
        '<button style="all: unset" onclick="show(`submenus`, `Instellingen`)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></button>' +
        title;
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
fetchSchedule();
async function fetchSchedule(year, week) {
  if (!year) year = new Date().getFullYear();
  if (!week) week = new Date().getWeek();
  window.week = week;
  if (!schoolName || !authorizationCode) return;
  if (!accessToken) {
    fetchToken();
    return;
  }
  const response = await fetch(
    `https://${schoolName}.zportal.nl/api/v3/liveschedule?${userType}=~me&week=${year}${week}`,
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
    const date = new Date(a.start * 1000).toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    (grouped[date] ||= []).push(a);
  });

  const fmt = (ts) =>
    new Date(ts * 1000)
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .replace(/^0+/, "");

  const hoursToMinutes = (time) =>
    Number.parseInt(time.split(":")[0]) * 60 +
    Number.parseInt(time.split(":")[1]);

  for (const [date, items] of Object.entries(grouped)) {
    const div = document.createElement("div");
    const currentDate = new Date().toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    let svg = "";
    if (currentDate == date) {
      svg = `<svg viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" id="soft_burst">
      <path d="M175.147 33.1508C181.983 22.2831 198.017 22.2831 204.853 33.1508L221.238 59.2009C225.731 66.3458 234.797 69.2506 242.692 66.0751L271.475 54.4972C283.482 49.6671 296.455 58.9613 295.507 71.7154L293.235 102.288C292.612 110.673 298.215 118.278 306.494 120.284L336.681 127.601C349.275 130.653 354.23 145.692 345.861 155.461L325.8 178.877C320.298 185.3 320.298 194.7 325.8 201.123L345.861 224.539C354.23 234.308 349.275 249.347 336.681 252.399L306.494 259.716C298.215 261.722 292.612 269.327 293.235 277.712L295.507 308.285C296.455 321.039 283.482 330.333 271.475 325.503L242.692 313.925C234.797 310.749 225.731 313.654 221.238 320.799L204.853 346.849C198.017 357.717 181.983 357.717 175.147 346.849L158.762 320.799C154.269 313.654 145.203 310.749 137.308 313.925L108.525 325.503C96.5177 330.333 83.5454 321.039 84.4931 308.285L86.7649 277.712C87.388 269.327 81.785 261.722 73.5056 259.716L43.3186 252.399C30.7252 249.347 25.7702 234.308 34.1391 224.539L54.1997 201.123C59.7018 194.7 59.7018 185.3 54.1997 178.877L34.1391 155.461C25.7702 145.692 30.7252 130.653 43.3186 127.601L73.5056 120.284C81.785 118.278 87.388 110.673 86.7649 102.288L84.4931 71.7154C83.5454 58.9613 96.5177 49.6671 108.525 54.4972L137.308 66.0751C145.203 69.2506 154.269 66.3458 158.762 59.201L175.147 33.1508Z"></path>
    </svg> `;
    }
    div.innerHTML = `<strong class="date">${svg}<span>Week ${week}, ${date}</span?</strong>`;

    items.sort((a, b) => a.start - b.start);
    let section = [],
      lastEnd = null;

    const flush = () => {
      if (!section.length) return;
      div.innerHTML += `${section
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
          const height = ((endMin - startMin) * 0.8) / 16;
          if (firstLesson) {
            if (!lastLessonEndMin || startMin - lastLessonEndMin < 0) {
              lastLessonEndMin = hoursToMinutes(
                localStorage.getItem("startTime") || "08:15"
              );
            }
            marginTop = ((startMin - lastLessonEndMin) * 1.3) / 16;
            let lessonPadding = 1;
            if (marginTop == 0) lessonPadding = 0;
            sectionBeginning = `<section style="margin-top: calc(${marginTop}rem + ${lessonPadding}px)">`;
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
          }
          let styles = "";
          if (height < 2) styles = "line-height: 1; padding: 6px 10px;";
          if (height < 1) styles = "line-height: 1; padding: 4px 10px;";
          return `${sectionBeginning}<div class="les ${cancelled} ${
            a.appointmentType
          }" style="min-height: ${height}rem;${styles}"><strong>${
            a.subjects
          }</strong><strong class="lesuur">${
            a.startTimeSlot
          }</strong><br><p class="lestijden" style="display: inline; margin-right: 8px">${start}-${end}</p><p>${
            a.locations
          }${
            a.teachers.length != 0 ? ` (${a.teachers})` : ""
          }</p><span class="warning">${warningSymbol}</span></div>`;
        })
        .join("")}</section>`;
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
  document.getElementById("schedule").style.opacity = "";
  const tip = document.getElementById("tooltip");

  function positionTip(btn) {
    tip.textContent = btn.getAttribute("data-tooltip");
    const rect = btn.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    let top = rect.bottom + 8; // bottom by default
    let left = rect.left + (rect.width - tipRect.width) / 2;
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

  window.addEventListener("resize", () => {
    if (tip.hasAttribute("data-show")) {
      const active = document.querySelector("[data-tooltip]:hover");
      if (active) positionTip(active);
    }
  });
}
let day = 0;
function switchDay(dir) {
  let behavior = "smooth";
  const days = document.querySelectorAll(".day");
  let dayLength = days.length;
  if (document.getElementById("schedule").className.includes("weekEnabled")) {
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
      fetchSchedule(undefined, week);
    } else {
      document.startViewTransition(() => fetchSchedule(undefined, week));
    }
  } else if (day > dayLength - 1) {
    day = 0;
    behavior = "instant";
    if (document.getElementById("schedule").classList.contains("dayEnabled")) {
      document.getElementById("schedule").style.opacity = 0;
    }
    if (!document.startViewTransition) {
      fetchSchedule(undefined, week);
    } else {
      document.startViewTransition(() => fetchSchedule(undefined, week));
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
  if (touchendX < touchstartX) {
    switchDay("next");
  }
  if (touchendX > touchstartX) {
    switchDay("prev");
  }
}
document.getElementById("dayBtn").addEventListener("click", () => {
  document.getElementById("schedule").classList.remove("weekEnabled");
  document.getElementById("schedule").classList.add("dayEnabled");
  document.getElementById("weekBtn").classList.remove("selected");
  document.getElementById("dayBtn").classList.add("selected");
});

document.getElementById("weekBtn").addEventListener("click", () => {
  document.getElementById("schedule").classList.remove("dayEnabled");
  document.getElementById("schedule").classList.add("weekEnabled");
  document.getElementById("dayBtn").classList.remove("selected");
  document.getElementById("weekBtn").classList.add("selected");
});
