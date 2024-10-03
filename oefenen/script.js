// Hier worden de vragen geladen uit een tekstbestand
let questions = [];
let selectedQuestions = []; // Variabele om de geselecteerde vragen op te slaan

async function loadQuestions() {
  const level = document.getElementById("level").value;
  const year = document.getElementById("year").value;
  const subject = document.getElementById("subject").value;
  const chapter = document.getElementById("chapter").value;

  const response = await fetch(
    `oefenen/vragen/${level}_${year}_${subject}_${chapter}.txt`
  ); // Laad het .txt-bestand
  const text = await response.text();
  questions = text
    .split("\n")
    .map((line) => {
      const parts = line.split(",");
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
        // Controleer of vraag en antwoord bestaan
        return { question: parts[0], answer: parts[1] };
      }
    })
    .filter(Boolean); // Verwijder eventuele ongeldige vragen

  document.getElementById("generateBtn").style.display = "inline"; // Toon de genereren knop
}
function generateQuiz() {
  const numQuestions = Math.min(
    document.getElementById("numQuestions").value,
    questions.length
  ); // Zorg ervoor dat je niet meer vragen kiest dan er beschikbaar zijn
  const quizContainer = document.getElementById("quizContainer");
  quizContainer.innerHTML = ""; // Maak het quiz-container leeg
  selectedQuestions = []; // Maak de lijst van geselecteerde vragen leeg

  const usedIndices = []; // Array om de gebruikte indices van de vragen bij te houden

  for (let i = 0; i < numQuestions; i++) {
    let randIndex;

    // Probeer een unieke index te vinden
    do {
      randIndex = Math.floor(Math.random() * questions.length);
    } while (usedIndices.includes(randIndex)); // Als de vraag al gekozen is, kies opnieuw

    usedIndices.push(randIndex); // Voeg de gekozen vraag toe aan de gebruikte lijst
    const question = questions[randIndex]; // Haal de vraag op met de unieke index
    selectedQuestions.push(question); // Sla de geselecteerde vraag op

    // Vervang de placeholder &input& door een invulveld
    const formattedQuestion = question.question.replace(
      /&input&/g,
      '<input type="text" class="answer" placeholder="antwoord">'
    );

    const questionHtml = `<div class="question">${
      i + 1
    }. ${formattedQuestion}</div>`;
    quizContainer.innerHTML += questionHtml;
  }

  document.getElementById("downloadBtn").style.display = "inline"; // Toon de downloadknop
  document.getElementById("downloadAnswersBtn").style.display = "inline"; // Toon de antwoorden downloadknop

  // Toon de informatie dialoog
  openDialog();
}

function openDialog() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("dialog").style.display = "block";
}

function closeDialog() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("dialog").style.display = "none";
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Koptekst voor de toets
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Toets Duits", 105, 20, { align: "center" });

  // Details van de toets zoals Naam, Klas, etc. in één rij
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Plaats de naam, klas en datum hoger
  doc.text("Naam: __________", 10, 40);
  doc.text("Klas: __________", 70, 40);
  doc.text("Datum: __________", 130, 40);
  doc.text("Cijfer:", 180, 19); // Cijfer label boven het vierkant
  doc.rect(180, 21, 20, 20); // Cijfer als vierkantje (10x10)

  // Lijst met vragen
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  let yPosition = 60; // Startpositie voor de vragen
  selectedQuestions.forEach((question, index) => {
    // Vervang de placeholder &input& in de vraag met een lege lijn
    const formattedQuestion = question.question.replace(
      /&input&/g,
      "__________"
    );
    doc.text(`${index + 1}. ${formattedQuestion}`, 10, yPosition);
    yPosition += 10;

    if (yPosition > 280) {
      // Nieuwe pagina als de huidige vol is
      doc.addPage();
      yPosition = 20;
    }
  });

  // Voettekst en paginanummering
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Pagina ${i} van ${pageCount}`, 105, 290, { align: "center" });
  }

  doc.save("toets.pdf"); // Download de toets PDF
}

async function downloadAnswersPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Koptekst voor de antwoorden
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Antwoorden en Normering", 105, 20, { align: "center" });

  // Lijst met vragen en antwoorden
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");

  selectedQuestions.forEach((question, index) => {
    const formattedQuestion = question.question.replace(
      /&input&/g,
      "__________"
    );
    doc.text(`${index + 1}. ${formattedQuestion}`, 10, 40 + index * 10);
    doc.text(`Antwoord: ${question.answer}`, 10, 45 + index * 10);
  });

  // Normering
  doc.text("Normering:", 10, 50 + selectedQuestions.length * 10);
  doc.text(
    "Minimaal 70% goed voor voldoende.",
    20,
    55 + selectedQuestions.length * 10
  );
  doc.text(
    "Bereken je cijfer: (Aantal goed / Totaal aantal vragen) * 10",
    20,
    60 + selectedQuestions.length * 10
  );
  doc.text(
    `Totaal: ${selectedQuestions.length} punten`,
    20,
    65 + selectedQuestions.length * 10
  );

  doc.save("antwoorden_en_normering.pdf"); // Download de antwoorden PDF
}

function closeDialog() {
  document.getElementById("dialog").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}
