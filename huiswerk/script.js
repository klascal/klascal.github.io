document.addEventListener("DOMContentLoaded", function () {
  loadTasks();

  // Set default value for deadline input
  document.getElementById("deadlineInput").valueAsDate = new Date();

  document.getElementById("addButton").addEventListener("click", addTask);

  // Luister naar het 'keypress'-evenement op de invoervelden
  document
    .getElementById("homeworkInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        addTask();
      }
    });
  document
    .getElementById("deadlineInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        document.getElementById("subjectInput").focus();
      }
    });
  document
    .getElementById("subjectInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        document.getElementById("homeworkInput").focus();
      }
    });
});

function addTask() {
  var homework = document.getElementById("homeworkInput").value;
  var deadline = document.getElementById("deadlineInput").value;
  var subject = document.getElementById("subjectInput").value;

  if (
    homework.trim() !== "" &&
    deadline.trim() !== "" &&
    subject.trim() !== ""
  ) {
    var task = { homework: homework, deadline: deadline, subject: subject };
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    clearInputs();
    loadTasks();

    // Check if the deadline is within 24 hours
    var deadlineDate = new Date(deadline);
    var currentDate = new Date();
    var timeDifference = deadlineDate.getTime() - currentDate.getTime();
    var hoursDifference = timeDifference / (1000 * 3600);

    if (hoursDifference <= 24) {
      // If the deadline is within 24 hours, show a notification
      showNotification(
        "Er is huiswerk voor morgen!",
        "Je hebt huiswerk voor " + deadline + ", voor het vak " + subject + "."
      );
    }
  }
}

function loadTasks() {
  var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  var taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach(function (task, index) {
    var li = document.createElement("div");
    li.innerHTML =
      "<h3>" +
      task.subject +
      "</h3><p>" +
      task.homework +
      "</p><p><svg width='24' height='24' id='icon' viewBox='0 -960 960 960' xmlns='http://www.w3.org/2000/svg'><path d='M572.14-240Q526-240 494-271.86t-32-78Q462-396 493.86-428t78-32Q618-460 650-428.14t32 78Q682-304 650.14-272t-78 32ZM194-50q-43.73 0-74.86-31.14Q88-112.28 88-156v-572q0-43.72 31.14-74.86Q150.27-834 194-834h8v-76h106v76h344v-76h106v76h8q43.72 0 74.86 31.14T872-728v572q0 43.72-31.14 74.86T766-50H194Zm0-106h572v-424H194v424Z'/></svg>" +
      task.deadline +
      "</p>";

    var deleteButton = document.createElement("span");

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("id", "icon");
    svg.setAttribute("style", "position: relative;bottom: 20px;");
    svg.setAttribute("viewBox", "0 0 24 24");

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
    );
    path.setAttribute("class", "fill");

    svg.appendChild(path);
    deleteButton.appendChild(svg);

    deleteButton.onclick = function () {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();
    };

    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

function clearInputs() {
  document.getElementById("homeworkInput").value = "";
  document.getElementById("deadlineInput").valueAsDate = new Date();
  document.getElementById("subjectInput").value = "";
}

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    // If the permission is granted, show the notification
    var notification = new Notification(title, { body: body });
  } else if (Notification.permission !== "denied") {
    // If the permission is not denied, request permission
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(title, { body: body });
      }
    });
  }
}

function homeButton() {
  window.location.replace("/");
}
