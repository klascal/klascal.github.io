document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
  
    // Set default value for deadline input
    document.getElementById("deadlineInput").valueAsDate = new Date();
  
    document.getElementById("addButton").addEventListener("click", addTask);
  
    // Luister naar het 'keypress'-evenement op de invoervelden
    document.getElementById("homeworkInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        addTask();
      }
    });
    document.getElementById("deadlineInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        document.getElementById("subjectInput").focus();
      }
    });
    document.getElementById("subjectInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        document.getElementById("homeworkInput").focus();
      }
    });
  });
  
  function addTask() {
    var homework = document.getElementById("homeworkInput").value;
    var deadline = document.getElementById("deadlineInput").value;
    var subject = document.getElementById("subjectInput").value;
    
    if (homework.trim() !== "" && deadline.trim() !== "" && subject.trim() !== "") {
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
        showNotification("Deadline nadert!", "Je hebt huiswerk met de deadline " + deadline + " voor het vak " + subject + ". Bereid je voor!");
      }
    }
  }
  
  function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(function(task, index) {
      var li = document.createElement("li");
      li.innerHTML = "<strong>Deadline:</strong> " + task.deadline + "<br><strong>Vak:</strong> " + task.subject + "<br><strong>Huiswerk:</strong> " + task.homework;
      
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Verwijderen";
      deleteButton.style.position = "absolute";
      deleteButton.style.top = "30%";
      deleteButton.style.right = "10px";
      deleteButton.style.transform = "translateY(-50%)";
      deleteButton.style.padding = "5px 10px";
      deleteButton.style.background = "red";
      deleteButton.style.color = "white";
      deleteButton.style.border = "none";
      deleteButton.style.cursor = "pointer";
      deleteButton.style.borderRadius = "3px";
      deleteButton.onclick = function() {
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
      Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
          var notification = new Notification(title, { body: body });
        }
      });
    }
  }
  
