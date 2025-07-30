import { checkAuth } from "./auth";
import { getCaseDetails } from "./api";

let briefs = [], questions = [], answers = [];
let currentIndex = 0, questionIndex = 0;
let mode = "brief";

function renderBrief() {
  const prevBtn = document.getElementById("prevBrief");
  const nextBtn = document.getElementById("nextBrief");

  
  if (briefs.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "";
    nextBtn.style.display = "";
  }

  const container = document.getElementById("case-brief");
  if (!briefs.length) {
    container.innerHTML = "<p>No briefs available.</p>";
    return;
  }
  const b = briefs[currentIndex];
  container.innerHTML = `
    <section>
      <h2>${b.topic}</h2>
      <p>${b.body}</p>
    </section>`;
  document.getElementById("briefCounter")
          .innerText = `${currentIndex+1} of ${briefs.length}`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === briefs.length-1;
}


function typeWriter(text, el, speed = 50) {
  el.innerText = "";
  let idx = 0;
  const ticker = setInterval(() => {
    if (idx < text.length) {
      el.innerText += text[idx++];
    } else {
      clearInterval(ticker);
    }
  }, speed);
}

function renderQuestion() {
  const q = questions[questionIndex];
  const contentEl = document.getElementById("question-content");
  
  typeWriter(q.body || q.question || "", contentEl, 40);

  
  document.getElementById("answerInput").value =
    answers[questionIndex] || "";
}

document.addEventListener("DOMContentLoaded", async () => {
  await checkAuth(1);

  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");
  if (!caseId) {
    document.getElementById("case-title").innerText = "Invalid Case ID";
    return;
  }

  try {
    const caseData = await getCaseDetails(caseId);
    document.getElementById("case-title").innerText = caseData.title;

    
    briefs = caseData.briefs || [];
    renderBrief();

    
    questions = caseData.questions || [];
    answers = Array(questions.length).fill("");

    
    const toggleBtn = document.getElementById("toggleModeBtn");
    const briefCont = document.querySelector(".brief-container");
    const questionCont = document.getElementById("question-container");

    toggleBtn.addEventListener("click", () => {
      if (mode === "brief") {
        if (!questions.length) return alert("No questions available.");
        mode = "question";
        briefCont.style.display = "none";
        questionCont.style.display = "";
        toggleBtn.innerText =
          questions.length > 1 ? "Next" : "Submit";
        renderQuestion();
      } else {
        answers[questionIndex] = document.getElementById("answerInput").value;
        if (questionIndex < questions.length - 1) {
          questionIndex++;
          toggleBtn.innerText =
            questionIndex === questions.length - 1
              ? "Submit"
              : "Next";
          renderQuestion();
        } else {
          
          console.log("Collected answers:", answers);
          window.location.href = "/student-homepage";
        }
      }
    });

    
    document.getElementById("prevBrief").addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderBrief();
      }
    });
    document.getElementById("nextBrief").addEventListener("click", () => {
      if (currentIndex < briefs.length - 1) {
        currentIndex++;
        renderBrief();
      }
    });
  } catch (err) {
    document.getElementById("case-title").innerText = "Error loading case";
    document.getElementById("case-brief").innerHTML =
      `<p style="color:red;">${err.message}</p>`;
  }
});

