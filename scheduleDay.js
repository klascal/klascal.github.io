const dialogs = document.querySelectorAll("dialog");
function check_webp_feature(feature, callback) {
  var img = new Image();
  (img.onload = function () {
    var result = img.width > 0 && img.height > 0;
    callback(feature, result);
  }),
    (img.onerror = function () {
      callback(feature, !1);
    }),
    (img.src =
      "data:image/webp;base64," +
      { lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA" }[
        feature
      ]);
}
dialogs.forEach((dialog) => {
  "function" != typeof dialog.showModal &&
    dialogPolyfill.registerDialog(dialog);
}),
  setInterval(function () {
    "" !== document.getElementById("dateInput").value &&
      localStorage.getItem("access_token") &&
      localStorage.getItem("schoolName") &&
      localStorage.getItem("userType") &&
      fetchAppointments(document.getElementById("dateInput").value, "focus");
  }, 3e5);
const $ = (e) => document.querySelectorAll(e),
  _switches = $("body")[0],
  _colors = $("input[name='color']"),
  savedTheme = localStorage.getItem("theme");
if (savedTheme)
  _switches.setAttribute("data-theme", savedTheme),
    _colors.forEach((radio) => {
      radio.checked = radio.value === savedTheme;
    });
else {
  const defaultTheme = document.querySelector(
    'input[name="color"]:checked'
  ).value;
  _switches.setAttribute("data-theme", defaultTheme);
}
const bodyStyles = getComputedStyle(document.body);
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  let bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, 255 & bigint];
}
function blendWithBlack(rgb, alpha) {
  return rgb.map((channel) => Math.round(channel * (1 - alpha)));
}
function rgbToHex(rgb) {
  return `#${rgb.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
const primaryLight = bodyStyles.getPropertyValue("--primary-light").trim(),
  rgb = hexToRgb(primaryLight);
var darkerRgb = blendWithBlack(rgb, 0.3);
"#4dd0e1" == primaryLight && (darkerRgb = blendWithBlack(rgb, 0.34)),
  "#ffcc02" == primaryLight && (darkerRgb = blendWithBlack(rgb, 0.4));
const darkerHex = rgbToHex(darkerRgb);
let themeMetaTag = document.querySelector('meta[name="theme-color"]');
themeMetaTag
  ? themeMetaTag.setAttribute("content", darkerHex)
  : ((themeMetaTag = document.createElement("meta")),
    themeMetaTag.setAttribute("name", "theme-color"),
    themeMetaTag.setAttribute("content", darkerHex),
    document.head.appendChild(themeMetaTag)),
  _colors.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        _switches.setAttribute("data-theme", e.target.value),
          localStorage.setItem("theme", e.target.value);
        const primaryLight = bodyStyles
            .getPropertyValue("--primary-light")
            .trim(),
          rgb = hexToRgb(primaryLight);
        var darkerRgb = blendWithBlack(rgb, 0.3);
        "#4dd0e1" == primaryLight && (darkerRgb = blendWithBlack(rgb, 0.34)),
          "#ffcc02" == primaryLight && (darkerRgb = blendWithBlack(rgb, 0.4));
        const darkerHex = rgbToHex(darkerRgb);
        let themeMetaTag = document.querySelector('meta[name="theme-color"]');
        themeMetaTag
          ? themeMetaTag.setAttribute("content", darkerHex)
          : ((themeMetaTag = document.createElement("meta")),
            themeMetaTag.setAttribute("name", "theme-color"),
            themeMetaTag.setAttribute("content", darkerHex),
            document.head.appendChild(themeMetaTag));
      }
    });
  });
const authorizationCode = document.getElementById("authorizationCode").value;
var authorizationCodeLS = localStorage.getItem("authorizationCode");
let accessToken = localStorage.getItem("access_token");
/^\d{12}$/.test(authorizationCodeLS)
  ? (null != accessToken && "[object Promise]" != accessToken) || hideDialog()
  : /^[a-z0-9]{26}$/.test(authorizationCodeLS) &&
    localStorage.setItem("access_token", authorizationCodeLS);
const dutchMonthNames = [
    "jan",
    "feb",
    "mrt",
    "apr",
    "mei",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ],
  checkbox = document.getElementById("meldingen");
function saveCheckboxState() {
  localStorage.setItem("checkboxState", checkbox.checked);
}
function restoreCheckboxState() {
  const savedState = localStorage.getItem("checkboxState");
  null !== savedState && (checkbox.checked = JSON.parse(savedState));
}
const checkbox1 = document.getElementById("vakafkorting");
function saveCheckboxState1() {
  localStorage.setItem("afkorting", checkbox1.checked);
}
function restoreCheckboxState1() {
  const savedState1 = localStorage.getItem("afkorting");
  null !== savedState1 && (checkbox1.checked = JSON.parse(savedState1));
}
checkbox1.addEventListener("change", saveCheckboxState1);
const checkbox2 = document.getElementById("afkortingHl");
function saveCheckboxState2() {
  localStorage.setItem("hoofdletter", checkbox2.checked);
}
function restoreCheckboxState2() {
  const savedState2 = localStorage.getItem("hoofdletter");
  null !== savedState2 && (checkbox2.checked = JSON.parse(savedState2));
}
function convertH2M(timeInHour) {
  var timeParts = timeInHour.split(":");
  return 60 * Number(timeParts[0]) + Number(timeParts[1]);
}
async function fetchAnnouncements() {
  (document.getElementById("schedule").innerHTML = ""),
    (document.getElementById("schedule").style = "");
  const response = await fetch(
      "https://" +
        localStorage.getItem("schoolName") +
        ".zportal.nl/api/v3/announcements?user=~me&current=true&access_token=" +
        localStorage.getItem("access_token")
    ),
    appointments = (await response.json()).response.data;
  var announcementsContainer = document.getElementById("schedule"),
    announcementsDiv = document.createElement("div");
  if (((announcementsContainer.innerHTML = ""), 0 === appointments.length))
    if (
      ((announcementsContainer.innerHTML =
        '<strong id="error-message" style="text-align: center; display: block"><img src="es_geenresultaten.webp" alt="" style="text-align: center" width="200px" height="104px"/><br />Geen mededelingen gevonden.</strong>'),
      localStorage.getItem("webp"))
    ) {
      if ("false" == localStorage.getItem("webp")) {
        new webpHero.WebpMachine().polyfillDocument();
      }
    } else
      check_webp_feature("lossy", function (feature, isSupported) {
        (localStorage.setItem("webp", "true"), isSupported) ||
          (localStorage.setItem("webp", "false"),
          new webpHero.WebpMachine().polyfillDocument());
      });
  appointments.forEach((announcement) => {
    var start = 1e3 * announcement.start,
      date = (start = new Date(start))
        .toLocaleTimeString("nl-NL", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(/^0+/, "");
    (announcementsDiv.innerHTML =
      "<strong>" +
      announcement.title +
      "</strong><span> " +
      date +
      "<p>" +
      announcement.text +
      "</p>"),
      announcementsContainer.appendChild(announcementsDiv);
  });
}
async function userInfo(date) {
  const authorizationCode = localStorage.getItem("access_token"),
    response = await fetch(
      "https://csvincentvangogh.zportal.nl/api/v3/users/~me?fields=code,isEmployee&access_token=" +
        authorizationCode
    ),
    data = await response.json();
  var userType = "student";
  if (data.response.data[0]) {
    1 == data.response.data[0].isEmployee && (userType = "teacher");
  }
  localStorage.setItem("userType", userType),
    localStorage.getItem("subjects") || retrieveSubjectFullNames(),
    fetchAppointments(date);
}
function cleanupOldStorage() {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const yearTwoWeeksAgo = twoWeeksAgo.getFullYear(),
    weekTwoWeeksAgo = twoWeeksAgo.getWeek();
  Object.keys(localStorage).forEach((key) => {
    if (/^\d{4}\d+$/.test(key)) {
      const year = parseInt(key.substring(0, 4), 10),
        week = parseInt(key.substring(4), 10);
      (year < yearTwoWeeksAgo ||
        (year === yearTwoWeeksAgo && week < weekTwoWeeksAgo)) &&
        localStorage.removeItem(key);
    }
  });
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
      let teacherTranslations = {};
      result.response.data.forEach((subject) => {
        let lastName = subject.name;
        if (!lastName) return;
        let commaIndex = lastName.indexOf(",");
        -1 != commaIndex && (lastName = lastName.substring(0, commaIndex));
        let fullName = lastName;
        teacherTranslations[subject.code] = fullName;
      }),
        localStorage.setItem("subjects", JSON.stringify(teacherTranslations));
    });
}
function fetchAppointments(date, focus) {
  const datum = document.getElementById("dateInput").value;
  if (/^[a-zA-Z]{2}\s/.test(datum))
    var [zomadiwodovrza, day, monthName] = datum.split(" ");
  else var [day, monthName] = datum.split(" ");
  const today1 = new Date(),
    day1 = today1.getDate(),
    zomadiwodovrza1 = ["zo", "ma", "di", "wo", "do", "vr", "za"][
      today1.getDay()
    ],
    monthName1 = dutchMonthNames[today1.getMonth()],
    formattedDate3 = `${day1} ${monthName1}`,
    formattedDate2 = `${zomadiwodovrza1} ${day1} ${monthName1}`;
  datum !== formattedDate3 &&
    datum !== formattedDate2 &&
    document.getElementById("add").setAttribute("style", "display: block;"),
    (datum !== formattedDate3 && datum !== formattedDate2) ||
      document.getElementById("add").setAttribute("style", "display: none;");
  const monthShort = monthName.substring(0, 3),
    monthIndex = dutchMonthNames.findIndex(
      (month) => month.toLowerCase() === monthShort
    );
  if (-1 === monthIndex || isNaN(parseInt(day)))
    return void console.error(
      "Incorrecte datumformaat. Voer de datum in in het formaat '12 aug' of 'di 12 aug'."
    );
  const currentYear = new Date().getFullYear(),
    startDate = new Date(currentYear, monthIndex, parseInt(day, 10)),
    endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  const user = document.getElementById("user").value || "~me",
    userType = localStorage.getItem("userType"),
    year = startDate.getFullYear();
  let week = startDate.getWeek();
  week < 10 && (week = `0${week}`);
  const schoolName = document.getElementById("schoolName").value,
    authorizationCode = document.getElementById("authorizationCode").value;
  let accessToken = localStorage.getItem("access_token"),
    accessToken1 = localStorage.getItem("access_token");
  /^\d{12}$/.test(authorizationCodeLS)
    ? (null != accessToken1 && "undefined" != accessToken) ||
      ((accessToken1 = fetchToken(authorizationCode, schoolName)),
      localStorage.setItem("access_token", accessToken1))
    : /^[a-z0-9]{26}$/.test(authorizationCodeLS) &&
      localStorage.setItem("access_token", authorizationCodeLS);
  Math.floor(startDate.getTime() / 1e3), Math.floor(endDate.getTime() / 1e3);
  fetch(
    `https://${schoolName}.zportal.nl/api/v3/liveschedule?access_token=${accessToken}&${userType}=~me&week=${year}${week}`
  )
    .then((response) => response.json())
    .then((data) => {
      const appointments = data.response.data[0].appointments;
      appointments.sort((a, b) => a.start - b.start);
      const scheduleDiv = document.getElementById("schedule");
      (scheduleDiv.innerHTML = ""),
        0 === appointments.length
          ? (("okt" != monthName && "nov" != monthName) ||
              scheduleDiv.setAttribute("class", "herfstVak"),
            ("dec" != monthName && "jan" != monthName) ||
              scheduleDiv.setAttribute("class", "kerstVak"),
            ("feb" != monthName && "mrt" != monthName) ||
              scheduleDiv.setAttribute("class", "voorjaarsVak"),
            ("apr" != monthName && "mei" != monthName) ||
              scheduleDiv.setAttribute("class", "meiVak"),
            ("juli" != monthName && "aug" != monthName && "sep" != monthName) ||
              scheduleDiv.setAttribute("class", "zomerVak"))
          : scheduleDiv.getAttribute("class") &&
            scheduleDiv.classList.remove(scheduleDiv.getAttribute("class"));
      const filteredAppointments = filterCancelledLessons(appointments);
      let i = 0;
      filteredAppointments.forEach((appointment) => {
        const startTime = new Date(1e3 * appointment.start),
          endTime = new Date(1e3 * appointment.end);
        var startTimeString = startTime
          .toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })
          .replace(/^0+/, "");
        const endTimeString = endTime
          .toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })
          .replace(/^0+/, "");
        if (localStorage.getItem("subjects"))
          var subjectsMapping = JSON.parse(localStorage.getItem("subjects"));
        let subjectsFullNames = appointment.subjects.map(
          (subject) => subjectsMapping[subject] || subject
        );
        "men" == appointment.subjects.toString() &&
          "csvincentvangogh" == localStorage.getItem("schoolName") &&
          (appointment.groups.toString().includes("1") ||
            appointment.groups.toString().includes("2")) &&
          (subjectsFullNames = ["Mentorles"]),
          subjectsFullNames.toString() ===
            subjectsFullNames.toString().toUpperCase() &&
            (subjectsFullNames = [
              subjectsFullNames.toString().charAt(0) +
                subjectsFullNames.toString().slice(1).toLowerCase(),
            ]),
          null == appointment.appointmentInstance &&
            ((subjectsFullNames =
              appointment.actions[0].appointment.subjects.map(
                (subject) => subjectsMapping[subject] || subject
              )),
            subjectsFullNames.toString() ===
              subjectsFullNames.toString().toUpperCase() &&
              (subjectsFullNames = [
                subjectsFullNames.toString().charAt(0) +
                  subjectsFullNames.toString().slice(1).toLowerCase(),
              ])),
          "true" === localStorage.getItem("afkorting") &&
            ((subjectsFullNames = appointment.subjects),
            appointment.subjects.toString() ===
              appointment.subjects.toString().toUpperCase() &&
              (subjectsFullNames = [
                appointment.subjects.toString().charAt(0) +
                  appointment.subjects.toString().slice(1).toLowerCase(),
              ]),
            "true" === localStorage.getItem("hoofdletter") &&
              (subjectsFullNames = [
                appointment.subjects.toString().toUpperCase(),
              ]),
            null == appointment.appointmentInstance &&
              ((subjectsFullNames =
                appointment.actions[0].appointment.subjects),
              appointment.actions[0].appointment.subjects.toString() ===
                appointment.actions[0].appointment.subjects
                  .toString()
                  .toUpperCase() &&
                (subjectsFullNames = [
                  appointment.actions[0].appointment.subjects
                    .toString()
                    .charAt(0) +
                    appointment.actions[0].appointment.subjects
                      .toString()
                      .slice(1)
                      .toLowerCase(),
                ]),
              "true" === localStorage.getItem("hoofdletter") &&
                (subjectsFullNames = [
                  appointment.actions[0].appointment.subjects
                    .toString()
                    .toUpperCase(),
                ])));
        const appointmentDiv = document.createElement("div");
        var timeSlot = "";
        timeSlot = appointment.startTimeSlot ? appointment.startTimeSlot : "";
        var info = "";
        "exam" === appointment.appointmentType &&
          (info = '<span id="exam">Toets</span>'),
          "activity" === appointment.appointmentType &&
            (info = '<span id="activity">Activiteit</span>'),
          "interlude" === appointment.appointmentType &&
            (info = '<span id="interlude">Pauze</span>');
        let warning = "",
          warningsymbol = "";
        "" !== appointment.changeDescription &&
          ((warning = appointment.changeDescription),
          (warningsymbol = warning
            ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff9800" style="vertical-align: sub; margin-right: 2.5px;"><path d="M120-103q-18 0-32.09-8.8Q73.83-120.6 66-135q-8-14-8.5-30.6Q57-182.19 66-198l359-622q9-16 24.1-23.5 15.11-7.5 31-7.5 15.9 0 30.9 7.5 15 7.5 24 23.5l359 622q9 15.81 8.5 32.4Q902-149 894-135t-22 23q-14 9-32 9H120Zm360-140q18 0 31.5-13.5T525-288q0-18-13.5-31T480-332q-18 0-31.5 13T435-288q0 18 13.5 31.5T480-243Zm0-117q17 0 28.5-11.5T520-400v-109q0-17-11.5-28.5T480-549q-17 0-28.5 11.5T440-509v109q0 17 11.5 28.5T480-360Z"/></svg>'
            : "")),
          null == appointment.appointmentInstance
            ? ((warning = "Afgemeld"),
              (warningsymbol = warning
                ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" style="margin-right: 2.5px"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z"/></svg>'
                : ""))
            : "" !== appointment.schedulerRemark &&
              ((warning = appointment.schedulerRemark),
              (warningsymbol = warning
                ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" id="icon" style="margin-right: 2.5px"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>'
                : ""));
        var teachers =
          "(" + appointment.teachers.filter((e) => e != user).join(", ") + ")";
        if (
          ("true" === localStorage.getItem("hoofdletter") &&
            (teachers =
              "(" +
              appointment.teachers
                .filter((e) => e != user)
                .join(", ")
                .toUpperCase() +
              ")"),
          (appointmentDiv.innerHTML = `<p><strong id="vaknaam">${subjectsFullNames.join(
            ", "
          )}</strong><strong style="float: right; margin-right: 9px" id="timeSlot">${info}${timeSlot}</strong></p> <p>${startTimeString} - ${endTimeString} <span style="margin-left: 10px;">${appointment.locations.join(
            ", "
          )} ${
            "()" == teachers ? "" : teachers
          } <span class="warning">${warningsymbol}<span class="warningMessage">${warning}</span></span></span></p><p class="className">${appointment.groups.join(
            ", "
          )}</p>`),
          appointmentDiv.classList.add(
            appointment.cancelled ? "cancelled" : appointment.appointmentType
          ),
          null == appointment.appointmentInstance &&
            (appointmentDiv.classList.remove("cancelled"),
            appointmentDiv.classList.add("notEnrolled")),
          i >= -1 && window.endTime)
        )
          var pauzeTijd =
            convertH2M(startTimeString) - convertH2M(window.endTime);
        i >= 1 &&
          startTimeString != window.endTime &&
          ((appointmentDiv.style = "margin-top: 20px"),
          pauzeTijd >= 280
            ? (appointmentDiv.style = "margin-top: 525px")
            : pauzeTijd >= 240
            ? (appointmentDiv.style = "margin-top: 450px")
            : pauzeTijd >= 200
            ? (appointmentDiv.style = "margin-top: 375px")
            : pauzeTijd >= 160
            ? (appointmentDiv.style = "margin-top: 300px")
            : pauzeTijd >= 120
            ? (appointmentDiv.style = "margin-top: 225px")
            : pauzeTijd >= 80
            ? (appointmentDiv.style = "margin-top: 150px")
            : pauzeTijd >= 40 && (appointmentDiv.style = "margin-top: 75px")),
          (0 == i || pauzeTijd <= -1) &&
            ((startTimeString = Number(startTimeString.replace(":", ""))),
            1 == timeSlot
              ? (appointmentDiv.style = "margin-top: 0")
              : 2 == timeSlot
              ? (appointmentDiv.style = "margin-top: 75px")
              : 3 == timeSlot
              ? (appointmentDiv.style = "margin-top: 150px")
              : 4 == timeSlot
              ? (appointmentDiv.style = "margin-top: 225px")
              : 5 == timeSlot
              ? (appointmentDiv.style = "margin-top: 300px")
              : 6 == timeSlot
              ? (appointmentDiv.style = "margin-top: 375px")
              : 7 == timeSlot
              ? (appointmentDiv.style = "margin-top: 450px")
              : 8 == timeSlot
              ? (appointmentDiv.style = "margin-top: 525px")
              : 9 == timeSlot
              ? (appointmentDiv.style = "margin-top: 600px")
              : 10 == timeSlot && (appointmentDiv.style = "margin-top: 675px")),
          (window.endTime = endTimeString),
          i++,
          focus &&
            (null != appointmentDiv.getAttribute("style")
              ? (appointmentDiv.style =
                  appointmentDiv.getAttribute("style") +
                  "; animation-name: none")
              : (appointmentDiv.style = "animation-name: none"));
        const dago = Date.now();
        if (
          (dago >= 1e3 * appointment.end &&
            appointmentDiv.classList.add("test"),
          localStorage.setItem("LaatsteSync", dago),
          "true" === localStorage.getItem("checkboxState") &&
            null != localStorage.getItem("checkboxState"))
        )
          if ("Notification" in window) {
            if (
              "granted" === Notification.permission &&
              !1 === appointment.cancelled &&
              (datum === formattedDate3 || datum === formattedDate2) &&
              localStorage.getItem("LastNotificationDate") !== datum
            ) {
              const startTime = new Date(1e3 * appointment.start);
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
          } else
            "true" === localStorage.getItem("checkboxState") &&
              null != localStorage.getItem("checkboxState") &&
              "denied" !== Notification.permission &&
              Notification.requestPermission().then(function (permission) {
                if (
                  "granted" === permission &&
                  !1 === appointment.cancelled &&
                  (datum === formattedDate3 || datum === formattedDate2) &&
                  localStorage.getItem("LastNotificationDate") !== datum
                ) {
                  const startTime = new Date(1e3 * appointment.start);
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
              });
        appointmentDiv.classList.add(startTime.getDay()),
          scheduleDiv.appendChild(appointmentDiv);
      });
    })
    .catch((error) =>
      console.error("Probleem met het laden van het rooster: ", error)
    )
    .then((data) => {
      var week1 = startDate.getWeek(),
        yearWeek = year + "" + week1,
        div1 = document.createElement("span"),
        scheduleDiv = document.getElementById("schedule");
      div1.classList.add("1", "container"),
        scheduleDiv.appendChild(div1),
        [...document.getElementsByClassName("1")].forEach((element) => {
          element !== div1 && div1.appendChild(element);
        });
      var div2 = document.createElement("span");
      div2.classList.add("2", "container"),
        scheduleDiv.appendChild(div2),
        [...document.getElementsByClassName("2")].forEach((element) => {
          element !== div2 && div2.appendChild(element);
        });
      var div3 = document.createElement("span");
      div3.classList.add("3", "container"),
        scheduleDiv.appendChild(div3),
        [...document.getElementsByClassName("3")].forEach((element) => {
          element !== div3 && div3.appendChild(element);
        });
      var div4 = document.createElement("span");
      div4.classList.add("4", "container"),
        scheduleDiv.appendChild(div4),
        [...document.getElementsByClassName("4")].forEach((element) => {
          element !== div4 && div4.appendChild(element);
        });
      var div5 = document.createElement("span");
      div5.classList.add("5", "container"),
        scheduleDiv.appendChild(div5),
        [...document.getElementsByClassName("5")].forEach((element) => {
          element !== div5 && div5.appendChild(element);
        });
      var div6 = document.createElement("span");
      div6.classList.add("6", "container"),
        scheduleDiv.appendChild(div6),
        [...document.getElementsByClassName("6")].forEach((element) => {
          element !== div6 && div6.appendChild(element);
        });
      var div0 = document.createElement("span");
      div0.classList.add("0", "container"),
        scheduleDiv.appendChild(div0),
        [...document.getElementsByClassName("0")].forEach((element) => {
          element !== div0 && div0.appendChild(element);
        }),
        [1, 2, 3, 4, 5, 6, 0].forEach((num) => {
          let element = document.querySelector(`.${CSS.escape(num)}`);
          if (element && "" === element.innerHTML.trim()) {
            function loadScript(src) {
              return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                (script.src = src),
                  (script.onload = resolve),
                  (script.onerror = reject),
                  document.head.appendChild(script);
              });
            }
            (element.innerHTML =
              '<strong id="error-message" style="text-align: center; display: block"><img src="es_geenresultaten.webp" alt="" style="text-align: center" width="200px" height="104px"/><br />Geen rooster gevonden voor deze dag.</strong>'),
              document.querySelector(".herfstVak") &&
                (element.innerHTML =
                  "<div>Herfstvakantie</div>" + element.innerHTML),
              document.querySelector(".kerstVak") &&
                (element.innerHTML =
                  "<div>Kerstvakantie</div>" + element.innerHTML),
              document.querySelector(".voorjaarsVak") &&
                (element.innerHTML =
                  "<div>Voorjaarsvakantie</div>" + element.innerHTML),
              document.querySelector(".meiVak") &&
                (element.innerHTML =
                  "<div>Meivakantie</div>" + element.innerHTML),
              document.querySelector(".zomerVak") &&
                (element.innerHTML =
                  "<div>Zomervakantie</div>" + element.innerHTML),
              localStorage.getItem("webp")
                ? "false" == localStorage.getItem("webp") &&
                  Promise.all([
                    loadScript("polyfills.js"),
                    loadScript("webp-hero.bundle.js"),
                  ])
                    .then(() => {
                      new webpHero.WebpMachine().polyfillDocument();
                    })
                    .catch((error) => {
                      console.error(
                        "Een of meer scripts konden niet worden geladen:",
                        error
                      );
                    })
                : check_webp_feature("lossy", function (feature, isSupported) {
                    localStorage.setItem("webp", "true"),
                      isSupported ||
                        (localStorage.setItem("webp", "false"),
                        Promise.all([
                          loadScript("polyfills.js"),
                          loadScript("webp-hero.bundle.js"),
                        ])
                          .then(() => {
                            new webpHero.WebpMachine().polyfillDocument();
                          })
                          .catch((error) => {
                            console.error(
                              "Een of meer scripts konden niet worden geladen:",
                              error
                            );
                          }));
                  });
          }
        }),
        localStorage.setItem(yearWeek, scheduleDiv.innerHTML);
    });
  const retryInterval = setInterval(function () {
    if (
      document.getElementById("vaknaam") &&
      (datum === formattedDate3 || datum === formattedDate2)
    ) {
      const dateInputValue = document.getElementById("dateInput").value;
      localStorage.setItem("LastNotificationDate", dateInputValue),
        clearInterval(retryInterval);
    }
  }, 50);
}
function filterCancelledLessons(appointments) {
  const filteredAppointments = [];
  return (
    appointments.forEach((appointment) => {
      const existingAppointment = filteredAppointments.find(
        (appt) =>
          appt.startTimeSlot === appointment.startTimeSlot &&
          appt.start <= appointment.start &&
          appt.end >= appointment.end
      );
      if (existingAppointment) {
        if (!existingAppointment.cancelled && appointment.cancelled) return;
        existingAppointment.cancelled &&
          !appointment.cancelled &&
          filteredAppointments.splice(
            filteredAppointments.indexOf(existingAppointment),
            1,
            appointment
          );
      } else filteredAppointments.push(appointment);
    }),
    filteredAppointments
  );
}
checkbox2.addEventListener("change", saveCheckboxState2),
  checkbox.addEventListener("change", saveCheckboxState),
  (Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0),
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    var week1 = new Date(date.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 864e5 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }),
  document.getElementById("dateInput").addEventListener("change", function () {
    const dateInput = document.getElementById("dateInput").value;
    if (/^[a-zA-Z]{2}\s/.test(dateInput))
      var [zomadiwodovrza1, day1, month] = dateInput.split(" ");
    else var [day1, month] = dateInput.split(" ");
    const monthShort = month.substring(0, 3),
      monthIndex = dutchMonthNames.findIndex(
        (monthName) => monthName.toLowerCase() === monthShort
      ),
      currentDate = new Date(),
      ActualCurrentDate = new Date();
    currentDate.setFullYear(
      currentDate.getFullYear(),
      monthIndex,
      parseInt(day1)
    );
    var currentWeek = currentDate.getWeek(),
      currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDay(),
      nowWeek = new Date().getWeek();
    1 == currentDay
      ? (document.getElementById("schedule").style = "right: 0;")
      : 2 == currentDay
      ? (document.getElementById("schedule").style = "right: 100vw;")
      : 3 == currentDay
      ? (document.getElementById("schedule").style = "right: 200vw;")
      : 4 == currentDay
      ? (document.getElementById("schedule").style = "right: 300vw;")
      : 5 == currentDay
      ? (document.getElementById("schedule").style = "right: 400vw;")
      : 6 == currentDay
      ? (document.getElementById("schedule").style = "right: 500vw;")
      : 0 == currentDay &&
        (document.getElementById("schedule").style = "right: 600vw;");
    const ActualCurrentDateInfo =
        ActualCurrentDate.getDate() + "" + ActualCurrentDate.getMonth(),
      currentDateInfo = currentDate.getDate() + "" + currentDate.getMonth();
    ActualCurrentDateInfo != currentDateInfo &&
      document.getElementById("add").setAttribute("style", "display: block;"),
      ActualCurrentDateInfo == currentDateInfo &&
        document.getElementById("add").setAttribute("style", "display: none;"),
      currentWeek - nowWeek != 0 &&
        (localStorage.getItem(currentYear + "" + currentWeek)
          ? (document.getElementById("schedule").innerHTML =
              localStorage.getItem(currentYear + "" + currentWeek))
          : (document.getElementById("schedule").innerHTML = ""),
        fetchAppointments(dateInput));
  }),
  document.getElementById("add").addEventListener("click", function () {
    const dateInput = document.getElementById("dateInput").value;
    if (/^[a-zA-Z]{2}\s/.test(dateInput))
      var [zomadiwodovrza1, day1, month] = dateInput.split(" ");
    else var [day1, month] = dateInput.split(" ");
    const monthShort = month.substring(0, 3),
      monthIndex = dutchMonthNames.findIndex(
        (monthName) => monthName.toLowerCase() === monthShort
      ),
      previousDate = new Date();
    previousDate.setFullYear(
      previousDate.getFullYear(),
      monthIndex,
      parseInt(day1)
    );
    const previousWeek = previousDate.getWeek(),
      today = new Date(),
      day = today.getDate(),
      currentWeek = today.getWeek();
    var currentYear = today.getFullYear();
    const currentDay = today.getDay(),
      zomadiwodovrza = ["zo", "ma", "di", "wo", "do", "vr", "za"][
        today.getDay()
      ],
      monthName = dutchMonthNames[today.getMonth()],
      formattedDate = `${day} ${monthName}`,
      formattedDate1 = `${zomadiwodovrza} ${day} ${monthName}`;
    (document.getElementById("dateInput").value = formattedDate1),
      1 == currentDay
        ? (document.getElementById("schedule").style = "right: 0;")
        : 2 == currentDay
        ? (document.getElementById("schedule").style = "right: 100vw;")
        : 3 == currentDay
        ? (document.getElementById("schedule").style = "right: 200vw;")
        : 4 == currentDay
        ? (document.getElementById("schedule").style = "right: 300vw;")
        : 5 == currentDay
        ? (document.getElementById("schedule").style = "right: 400vw;")
        : 6 == currentDay
        ? (document.getElementById("schedule").style = "right: 500vw;")
        : 0 == currentDay &&
          (document.getElementById("schedule").style = "right: 600vw;"),
      currentWeek - previousWeek != 0 &&
        (localStorage.getItem(currentYear + "" + currentWeek)
          ? (document.getElementById("schedule").innerHTML =
              localStorage.getItem(currentYear + "" + currentWeek))
          : (document.getElementById("schedule").innerHTML = ""),
        fetchAppointments(formattedDate)),
      document.getElementById("add").setAttribute("style", "display: none;");
  }),
  document.getElementById("previousDay").addEventListener("click", function () {
    const dateInput = document.getElementById("dateInput").value;
    if (/^[a-zA-Z]{2}\s/.test(dateInput))
      var [zomadiwodovrza, day, month] = dateInput.split(" ");
    else var [day, month] = dateInput.split(" ");
    const monthShort = month.substring(0, 3),
      monthIndex = dutchMonthNames.findIndex(
        (monthName) => monthName.toLowerCase() === monthShort
      ),
      previousDate = new Date();
    previousDate.setFullYear(
      previousDate.getFullYear(),
      monthIndex,
      parseInt(day)
    );
    var previousWeek = previousDate.getWeek();
    const ActualCurrentDate = new Date(),
      currentDate = new Date();
    currentDate.setFullYear(
      currentDate.getFullYear(),
      monthIndex,
      parseInt(day) - 1
    ),
      0 == currentDate.getDay() &&
        currentDate.setFullYear(
          currentDate.getFullYear(),
          monthIndex,
          parseInt(day) - 3
        ),
      6 == currentDate.getDay() &&
        currentDate.setFullYear(
          currentDate.getFullYear(),
          monthIndex,
          parseInt(day) - 2
        );
    var currentWeek = currentDate.getWeek(),
      currentYear = currentDate.getFullYear(),
      currentDay = currentDate.getDay();
    const nextDay =
      ["zo", "ma", "di", "wo", "do", "vr", "za"][currentDate.getDay()] +
      " " +
      currentDate.getDate() +
      " " +
      dutchMonthNames[currentDate.getMonth()];
    (document.getElementById("dateInput").value = nextDay),
      1 == currentDay
        ? (document.getElementById("schedule").style =
            "animation: day1left 0.1s ease-in-out forwards; right: 0;")
        : 2 == currentDay
        ? (document.getElementById("schedule").style =
            "animation: day2left 0.1s ease-in-out forwards; right: 100vw;")
        : 3 == currentDay
        ? (document.getElementById("schedule").style =
            "animation: day3left 0.1s ease-in-out forwards; right: 200vw;")
        : 4 == currentDay
        ? (document.getElementById("schedule").style =
            "animation: day4left 0.1s ease-in-out forwards; right: 300vw;")
        : 5 == currentDay
        ? (document.getElementById("schedule").style = "right: 400vw;")
        : 6 == currentDay
        ? (document.getElementById("schedule").style = "right: 500vw;")
        : 0 == currentDay &&
          (document.getElementById("schedule").style = "right: 600vw;");
    const ActualCurrentDateInfo =
        ActualCurrentDate.getDate() + "" + ActualCurrentDate.getMonth(),
      currentDateInfo = currentDate.getDate() + "" + currentDate.getMonth();
    ActualCurrentDateInfo != currentDateInfo &&
      document.getElementById("add").setAttribute("style", "display: block;"),
      ActualCurrentDateInfo == currentDateInfo &&
        document.getElementById("add").setAttribute("style", "display: none;"),
      currentWeek - previousWeek != 0 &&
        (localStorage.getItem(currentYear + "" + currentWeek)
          ? (document.getElementById("schedule").innerHTML =
              localStorage.getItem(currentYear + "" + currentWeek))
          : (document.getElementById("schedule").innerHTML = ""),
        fetchAppointments(nextDay));
  }),
  document.getElementById("nextDay").addEventListener("click", function () {
    const dateInput = document.getElementById("dateInput").value;
    if (/^[a-zA-Z]{2}\s/.test(dateInput))
      var [zomadiwodovrza, day, month] = dateInput.split(" ");
    else var [day, month] = dateInput.split(" ");
    const monthShort = month.substring(0, 3),
      monthIndex = dutchMonthNames.findIndex(
        (monthName) => monthName.toLowerCase() === monthShort
      ),
      previousDate = new Date();
    previousDate.setFullYear(
      previousDate.getFullYear(),
      monthIndex,
      parseInt(day)
    );
    var previousWeek = previousDate.getWeek();
    const currentDate = new Date(),
      ActualCurrentDate = new Date();
    currentDate.setFullYear(
      currentDate.getFullYear(),
      monthIndex,
      parseInt(day) + 1
    ),
      0 == currentDate.getDay() &&
        currentDate.setFullYear(
          currentDate.getFullYear(),
          monthIndex,
          parseInt(day) + 2
        ),
      6 == currentDate.getDay() &&
        currentDate.setFullYear(
          currentDate.getFullYear(),
          monthIndex,
          parseInt(day) + 3
        );
    var currentWeek = currentDate.getWeek(),
      currentYear = currentDate.getFullYear(),
      currentDay = currentDate.getDay();
    const nextDay =
      ["zo", "ma", "di", "wo", "do", "vr", "za"][currentDate.getDay()] +
      " " +
      currentDate.getDate() +
      " " +
      dutchMonthNames[currentDate.getMonth()];
    (document.getElementById("dateInput").value = nextDay),
      1 == currentDay
        ? (document.getElementById("schedule").style = "right: 0;")
        : 2 == currentDay
        ? (document.getElementById("schedule").style =
            "animation: day2 0.1s ease-in-out forwards; right: 100vw;")
        : 3 == currentDay
        ? (document.getElementById("schedule").style =
            "animation: day3 0.1s ease-in-out forwards; right: 200vw;")
        : 4 == currentDay
        ? (document.getElementById("schedule").style =
            "animation: day4 0.1s ease-in-out forwards; right: 300vw;")
        : 5 == currentDay
        ? (document.getElementById("schedule").style =
            "animation: day5 0.1s ease-in-out forwards; right: 400vw;")
        : 6 == currentDay
        ? (document.getElementById("schedule").style = "right: 500vw;")
        : 0 == currentDay &&
          (document.getElementById("schedule").style = "right: 600vw;");
    const ActualCurrentDateInfo =
        ActualCurrentDate.getDate() + "" + ActualCurrentDate.getMonth(),
      currentDateInfo = currentDate.getDate() + "" + currentDate.getMonth();
    ActualCurrentDateInfo != currentDateInfo &&
      document.getElementById("add").setAttribute("style", "display: block;"),
      ActualCurrentDateInfo == currentDateInfo &&
        document.getElementById("add").setAttribute("style", "display: none;"),
      currentWeek - previousWeek != 0 &&
        (localStorage.getItem(currentYear + "" + currentWeek)
          ? (document.getElementById("schedule").innerHTML =
              localStorage.getItem(currentYear + "" + currentWeek))
          : (document.getElementById("schedule").innerHTML = ""),
        fetchAppointments(nextDay));
  }),
  document.addEventListener("DOMContentLoaded", function () {
    cleanupOldStorage(),
      restoreCheckboxState(),
      restoreCheckboxState1(),
      restoreCheckboxState2();
    const today = new Date(),
      day = today.getDate(),
      currentDay = today.getDay(),
      zomadiwodovrza = ["zo", "ma", "di", "wo", "do", "vr", "za"][
        today.getDay()
      ],
      monthName = dutchMonthNames[today.getMonth()],
      formattedDate = `${day} ${monthName}`,
      formattedDate1 = `${zomadiwodovrza} ${day} ${monthName}`;
    (document.getElementById("dateInput").value = formattedDate1),
      1 == currentDay
        ? (document.getElementById("schedule").style = "right: 0;")
        : 2 == currentDay
        ? (document.getElementById("schedule").style = "right: 100vw;")
        : 3 == currentDay
        ? (document.getElementById("schedule").style = "right: 200vw;")
        : 4 == currentDay
        ? (document.getElementById("schedule").style = "right: 300vw;")
        : 5 == currentDay
        ? (document.getElementById("schedule").style = "right: 400vw;")
        : 6 == currentDay
        ? (document.getElementById("schedule").style = "right: 500vw;")
        : 0 == currentDay &&
          (document.getElementById("schedule").style = "right: 600vw;"),
      localStorage.getItem("access_token") &&
      localStorage.getItem("schoolName") &&
      localStorage.getItem("userType") &&
      localStorage.getItem("subjects")
        ? fetchAppointments(formattedDate)
        : (localStorage.getItem("userType") &&
            localStorage.getItem("subjects")) ||
          (localStorage.getItem("access_token") && userInfo(formattedDate));
  }),
  (schoolName.value = localStorage.getItem("schoolName")),
  (schoolName.oninput = () => {
    localStorage.setItem("schoolName", schoolName.value);
  });
const authorizationCode1 = document.getElementById("authorizationCode");
function showDialog() {
  document.getElementById("dialog").showModal();
}
async function fetchToken(authorizationCode, schoolName) {
  try {
    const url = `https://${schoolName}.zportal.nl/api/v3/oauth/token?grant_type=authorization_code&code=${authorizationCode}`,
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    if (!response.ok)
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    const accessToken = (await response.json()).access_token;
    return localStorage.setItem("access_token", accessToken), accessToken;
  } catch (error) {
    console.error(
      "Probleem met het ophalen van de access_token:",
      error.message
    );
  }
}
async function hideDialog() {
  const dialog = document.getElementById("dialog"),
    schoolName = document.getElementById("schoolName").value,
    authorizationCode = document.getElementById("authorizationCode").value;
  let accessToken = localStorage.getItem("access_token");
  /^\d{12}$/.test(authorizationCode)
    ? (null != accessToken && "[object Promise]" != accessToken) ||
      ((accessToken = await fetchToken(authorizationCode, schoolName)),
      localStorage.setItem("access_token", accessToken))
    : /^[a-z0-9]{26}$/.test(authorizationCodeLS) &&
      localStorage.setItem("access_token", authorizationCodeLS),
    dialog.close();
  const dateInput = document.getElementById("dateInput").value;
  localStorage.getItem("access_token") &&
  localStorage.getItem("schoolName") &&
  localStorage.getItem("userType")
    ? fetchAppointments(dateInput)
    : !localStorage.getItem("userType") &&
      localStorage.getItem("access_token") &&
      userInfo(dateInput),
    document.getElementById("css").click();
}
function update_section(with_what, what) {
  document.getElementById(what + "goeshere").innerHTML = with_what;
}
function loadPreviousDaySchedule() {
  document.getElementById("previousDay").click();
}
function loadNextDaySchedule() {
  document.getElementById("nextDay").click();
}
function handleArrowKeyPress(event) {
  const key = event.key;
  "ArrowLeft" === key
    ? loadPreviousDaySchedule()
    : "ArrowRight" === key && loadNextDaySchedule();
}
let startX, startY;
(authorizationCode1.value = localStorage.getItem("authorizationCode")),
  (authorizationCode1.oninput = () => {
    localStorage.setItem("authorizationCode", authorizationCode1.value);
  }),
  (user.value = localStorage.getItem("user")),
  (user.oninput = () => {
    localStorage.setItem("user", user.value);
  }),
  (css.value = localStorage.getItem("css")),
  (css.oninput = () => {
    localStorage.setItem("css", css.value);
  }),
  document.addEventListener("DOMContentLoaded", function () {
    const schoolName = localStorage.getItem("schoolName") || "",
      authorizationCode = localStorage.getItem("authorizationCode") || "";
    ("" !== schoolName.trim() && "" !== authorizationCode.trim()) ||
      showDialog();
  }),
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("css").click();
  });
const minSwipeDistance = 50;
function handleTouchStart(e) {
  const touch = e.touches[0];
  (startX = touch.pageX), (startY = touch.pageY);
}
function handleTouchEnd(e) {
  const touch = e.changedTouches[0],
    endX = touch.pageX,
    endY = touch.pageY,
    deltaX = endX - startX,
    deltaY = endY - startY;
  Math.abs(deltaX) > Math.abs(deltaY) &&
    Math.abs(deltaX) > 50 &&
    (deltaX > 0 ? loadPreviousDaySchedule() : loadNextDaySchedule());
}
document.addEventListener("touchstart", handleTouchStart, !1),
  document.addEventListener("touchend", handleTouchEnd, !1),
  document.addEventListener("keydown", handleArrowKeyPress),
  document.getElementById("keyboard").focus(),
  void 0 !== navigator.serviceWorker &&
    navigator.serviceWorker.register("sw.js");
