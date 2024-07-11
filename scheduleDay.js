let docTitle = document.title;
window.addEventListener("blur", () => {
  document.title = "Rooster Klascal";
});
window.addEventListener("focus", () => {
  document.title = docTitle;
});

// Dutch month names
const dutchMonthNames = [
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
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const parsedresp = await response.json();
    console.log(parsedresp);
    const accessToken = parsedresp["access_token"];
    return accessToken;
  } catch (error) {
    console.error("Error fetching acces token:", error.message);
    displayError("Error fetching acces token. Please try again.");
  }
}

// Function to fetch appointments for the specified date
async function fetchAppointments(date) {
  const [day, monthName] = date.split(" ");
  const monthIndex = dutchMonthNames.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase()
  );

  if (monthIndex === -1 || isNaN(parseInt(day))) {
    console.error(
      "Invalid date format. Please enter date in the format 'DD Month', e.g., '12 augustus'."
    );
    return;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const startDate = new Date(currentYear, monthIndex, parseInt(day, 10));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  const user = document.getElementById("user").value;
  const schoolName = document.getElementById("schoolName").value;
  const authorizationCode = document
    .getElementById("authorizationCode")
    .value.replace(/\s/g, "");
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  let accessToken = localStorage.getItem("access_token");
  if (accessToken == null || accessToken === "undefined") {
    accessToken = await fetchToken(authorizationCode, schoolName);
    localStorage.setItem("access_token", accessToken);
  }

  const apiUrl = `https://${schoolName}.zportal.nl/api/v3/appointments?user=${user}&start=${startTimestamp}&end=${endTimestamp}&valid=true&fields=subjects,cancelled,locations,startTimeSlot,start,end,groups,teachers,changeDescription&access_token=${accessToken}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const appointments = data.response.data;
      appointments.sort((a, b) => a.start - b.start);
      const scheduleDiv = document.getElementById("schedule");
      scheduleDiv.innerHTML = "";
      const errorMessageDiv = document.getElementById("error-message");

      if (appointments.length === 0) {
        scheduleDiv.style.display = "none";
        errorMessageDiv.style.display = "block";
      } else {
        scheduleDiv.style.display = "block";
        errorMessageDiv.style.display = "none";
      }

      const filteredAppointments = filterCancelledLessons(appointments);

      filteredAppointments.forEach((appointment) => {
        const startTime = new Date(appointment.start * 1000);
        const endTime = new Date(appointment.end * 1000);

        const startTimeString = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTimeString = endTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

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
          nask: "Natuurkunde/Scheikunde",
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
          wisb: "Wiskunde B",
        };

        const subjectsFullNames = appointment.subjects.map(
          (subject) => subjectsMapping[subject] || subject
        );

        let changeDescription = "";
        if (appointment.changeDescription) {
          changeDescription = `<p>${appointment.changeDescription}</p>`;
        }

        const appointmentDiv = document.createElement("div");
        appointmentDiv.innerHTML = `
          <p><strong id="vaknaam">${subjectsFullNames.join(
            ", "
          )}</strong><strong style="position:absolute;right:25px;">${
          appointment.startTimeSlot
        }</strong></p>
          <p>${startTimeString} - ${endTimeString} <span style="margin-left: 10px;">${appointment.locations.join(
          ", "
        )} (${appointment.teachers.join(", ")})</span></p>
        <p class="className">${appointment.groups.join(", ")}</p>
        <p>
          ${
            appointment.changeDescription
              ? '<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="vertical-align: sub;"><path d="M10.909 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.242A2.25 2.25 0 0 1 2.2 17.812l.072-.143L10.03 3.66a2.25 2.25 0 0 1 .879-.878ZM12 16.002a.999.999 0 1 0 0 1.997.999.999 0 0 0 0-1.997Zm-.002-8.004a1 1 0 0 0-.993.884L11 8.998 11 14l.007.117a1 1 0 0 0 1.987 0l.006-.117L13 8.998l-.007-.117a1 1 0 0 0-.994-.883Z" fill="#ff9800"/></svg>'
              : ""
          }
          ${appointment.changeDescription}
        </p>
        `;

        if (appointment.cancelled === true) {
          appointmentDiv.classList.add("cancelled");
        }

        scheduleDiv.appendChild(appointmentDiv);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Function to filter out cancelled lessons if there are multiple lessons for the same hour
function filterCancelledLessons(appointments) {
  const filteredAppointments = [];

  appointments.forEach((appointment) => {
    const existingAppointment = filteredAppointments.find(
      (appt) =>
        appt.start === appointment.start &&
        appt.startTimeSlot === appointment.startTimeSlot
    );

    if (existingAppointment) {
      if (!appointment.cancelled) {
        const index = filteredAppointments.indexOf(existingAppointment);
        filteredAppointments[index] = appointment;
      }
    } else {
      filteredAppointments.push(appointment);
    }
  });

  return filteredAppointments;
}

// Event listener for form submission
document
  .getElementById("schedule-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const date = document.getElementById("date").value;
    fetchAppointments(date);
  });
