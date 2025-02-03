async function userInfo() {
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
  console.log(userType);
  localStorage.setItem("selectedUserType", userType);
  localStorage.setItem("userType", userType);
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode1 = document
    .getElementById("authorizationCode")
    .value.replace(/\s/g, "");
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let week = currentDate.getWeek(); // Bereken weeknummer
  document.getElementById("week").innerText = "Week " + week;
  if (week < 10) week = `0${week}`; // Voeg een voorloopnul toe aan enkelcijferige weken

  // Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
  let accessToken = localStorage.getItem("access_token");
  if (accessToken == null || accessToken == "undefined") {
    accessToken = await fetchToken(authorizationCode1, schoolName);
    localStorage.setItem("access_token", accessToken);
  }
  fetchSchedule(accessToken, userType, year, week, schoolName);
}
if (!localStorage.getItem("userType") && localStorage.getItem("access_token")) {
  userInfo();
}
// Functie om rooster op te halen met behulp van fetch
async function fetchSchedule(
  authorizationCode,
  userType,
  year,
  week,
  schoolName
) {
  try {
    const url = `https://${schoolName}.zportal.nl/api/v3/liveschedule?access_token=${authorizationCode}&${userType}=~me&week=${year}${week}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
  const scheduleElement = document.getElementById("schedule");
  if (scheduleData && scheduleData.response && scheduleData.response.data) {
    const appointments = scheduleData.response.data[0].appointments;
    const user = scheduleData.response.data[0].user;

    const daysOfWeek = [
      "Zondag:",
      "Maandag:",
      "Dinsdag:",
      "Woensdag:",
      "Donderdag:",
      "Vrijdag:",
      "Zaterdag:",
    ];

    // Group appointments by day
    const appointmentsByDay = appointments.reduce((acc, appointment) => {
      const currentDay = new Date(appointment.start * 1000).getDay();
      const currentDayName = daysOfWeek[currentDay];

      if (!acc[currentDayName]) {
        acc[currentDayName] = [];
      }
      acc[currentDayName].push(appointment);
      return acc;
    }, {});

    // Generate HTML for each day
    const scheduleHTML = Object.entries(appointmentsByDay)
      .map(([dayName, appointments]) => {
        const appointmentsHTML = appointments
          .map((appointment) => {
            const uur = appointment.startTimeSlotName;

            // Format start and end time
            const startTime = new Date(appointment.start * 1000)
              .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(/^0+/, "");
            const endTime = new Date(appointment.end * 1000)
              .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(/^0+/, "");

            const left =
              (parseInt(startTime.split(":")[1]) +
                (parseInt(startTime.split(":")[0]) - 8) * 60) *
              3;
            const width =
              (parseInt(endTime.split(":")[1]) +
                (parseInt(endTime.split(":")[0]) - 8) * 60) *
                3 -
              left -
              30;

            // Map subject abbreviations to full names
            const subjects = appointment.subjects.map((subject) =>
              subject.toUpperCase()
            );
            const teachers =
              "(" +
              appointment.teachers.filter((e) => e != user).join(", ") +
              ")";
            const warning =
              appointment.changeDescription + appointment.schedulerRemark;
            const warningsymbol = warning
              ? '<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="vertical-align: sub;"><path d="M10.909 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.242A2.25 2.25 0 0 1 2.2 17.812l.072-.143L10.03 3.66a2.25 2.25 0 0 1 .879-.878ZM12 16.002a.999.999 0 1 0 0 1.997.999.999 0 0 0 0-1.997Zm-.002-8.004a1 1 0 0 0-.993.884L11 8.998 11 14l.007.117a1 1 0 0 0 1.987 0l.006-.117L13 8.998l-.007-.117a1 1 0 0 0-.994-.883Z" fill="yellow" stroke="black" stroke-width="0.5px"></path></svg>'
              : "";

            const top =
              localStorage.getItem("userType") == "teacher"
                ? appointment.groups.join(", ")
                : subjects.join(", ");

            // Generate HTML for each
            if (appointment.appointmentInstance !== null) {
              return `<div style="left:${left}px;width:${width}px;"
                      class="les ${
                        appointment.cancelled
                          ? "cancelled"
                          : appointment.appointmentType
                      }">
              <p>
                <strong>${
                  appointment.appointmentType == "exam"
                    ? appointment.schedulerRemark.split(":")[1]
                    : top
                }</strong>
                <strong class="lesuur">${appointment.startTimeSlotName}</strong>
              </p>
              <p class="lestijden">${startTime}-${endTime}</p>
              <span>
                ${appointment.locations.join(", ")} ${
                teachers == "()" ? "" : teachers
              }
                <div class="warning">
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
            }
          })
          .join("");

        // Generate HTML for the day with its appointments
        return `<span class="day"><h3>${dayName}</h3>${appointmentsHTML}</span>`;
      })
      .join("");

    scheduleElement.innerHTML = scheduleHTML;
  } else {
    scheduleElement.innerHTML = "<p>Geen roostergegevens gevonden.</p>";
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
    const accessToken = parsedresp["access_token"];
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    displayError("Error fetching access token. Please try again.");
  }
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

// Functie om formulierinzending te verwerken
async function handleFormSubmit(event) {
  event.preventDefault(); // Voorkom formulierinzending
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode = document
    .getElementById("authorizationCode")
    .value.replace(/\s/g, "");
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const userType = localStorage.getItem("userType");
  let week = currentDate.getWeek(); // Bereken weeknummer
  document.getElementById("week").innerText = "Week " + week;
  if (week < 10) week = `0${week}`; // Voeg een voorloopnul toe aan enkelcijferige weken

  // Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
  let accessToken = localStorage.getItem("access_token");
  if (accessToken == null || accessToken == "undefined") {
    accessToken = await fetchToken(authorizationCode, schoolName);
    localStorage.setItem("access_token", accessToken);
  }
  if (
    !localStorage.getItem("userType") &&
    localStorage.getItem("access_token")
  ) {
    userInfo();
  } else {
    fetchSchedule(accessToken, userType, year, week, schoolName);
  }
}

document.getElementById("nextDay").addEventListener("click", function () {
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode = document
    .getElementById("authorizationCode")
    .value.replace(/\s/g, "");
  const userType = localStorage.getItem("userType");
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let week = document.getElementById("week").innerText.replace("Week ", "");
  week = parseInt(week, 10);
  week = week + 1;
  if (week === 53) {
    week = `1`;
    year = parseInt(year, 10);
    year = year + 1;
  }

  document.getElementById("week").innerText = "Week " + week;
  if (week < 10) {
    week = `0${week}`;
  }

  // Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
  let accessToken = localStorage.getItem("access_token");

  // Haal het rooster op
  fetchSchedule(accessToken, userType, year, week, schoolName);
});

document.getElementById("previousDay").addEventListener("click", function () {
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode = document
    .getElementById("authorizationCode")
    .value.replace(/\s/g, "");
  const userType = localStorage.getItem("userType");
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let week = document.getElementById("week").innerText.replace("Week ", "");
  week = parseInt(week, 10);
  week = week - 1;
  if (week === "00") {
    week = `52`;
    year = parseInt(year, 10);
    year = year - 1;
  }
  document.getElementById("week").innerText = "Week " + week;
  if (week < 10) {
    week = `0${week}`;
  }

  // Wissel de koppelcode in voor de access token (maar alleen als die nog niet in local storage staat)
  let accessToken = localStorage.getItem("access_token");

  // Haal het rooster op
  fetchSchedule(accessToken, userType, year, week, schoolName);
});

// Voeg een gebeurtenisluisteraar toe voor de formulierinzending
document
  .getElementById("inputForm")
  .addEventListener("submit", handleFormSubmit);

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
  localStorage.setItem("access_token", "undefined");
};

// Functie om dialoogvenster te tonen
function showDialog() {
  const dialog = document.getElementById("dialog");
  dialog.showModal();
}

function handleArrowKeyPress(event) {
  const key = event.key;
  if (key === "ArrowLeft") {
    document.getElementById("previousDay").click();
  } else if (key === "ArrowRight") {
    document.getElementById("nextDay").click();
  }
}

document.addEventListener("keydown", handleArrowKeyPress);

// Functie om dialoogvenster te verbergen
function hideDialog() {
  const dialog = document.getElementById("dialog");
  dialog.close();
  document.getElementById("css").click();
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("save").click(), 0;
  const schoolName = localStorage.getItem("schoolName") || "";
  const authorizationCode = localStorage.getItem("authorizationCode") || "";
  const userType = localStorage.getItem("userType") || "";
  if (
    schoolName.trim() === "" ||
    authorizationCode.trim() === "" ||
    userType.trim() === ""
  ) {
    // Als een van de opgeslagen waarden leeg is, toon dialoogvenster
    showDialog();
  }
});

const css = document.getElementById("css");
css.value = localStorage.getItem("css");
css.oninput = () => {
  localStorage.setItem("css", css.value);
};

function update_section(with_what, what) {
  document.getElementById(what + "goeshere").innerHTML = with_what;
}
