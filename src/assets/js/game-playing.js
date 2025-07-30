import { checkAuth } from "./auth";
import {answerQuestion, getCaseDetails, startCase} from "./api";

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
  if(prevBtn.disabled){
    prevBtn.style.display = "none";
  }else{
    prevBtn.style.display = "block";
  }
  if(currentIndex === briefs.length-1){
    nextBtn.innerText = "Begin Case";
  }else{
    nextBtn.innerText = "Next";
  }
}


function typeWriter(text, el, speed = 30) {
  el.innerText = "";
  let idx = 0;
  return new Promise(r => {
    const ticker = setInterval(() => {
      if (idx < text.length) {
        el.innerText += text[idx++];
      } else {
        clearInterval(ticker);
        r();
      }
    }, speed);
  });
}

function renderQuestion() {
  const q = questions[questionIndex];
  const contentEl = document.getElementById("question-content");

  return typeWriter(q.body || q.question || "", contentEl, 30);
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


    const submitBtn = document.getElementById("submitBtn");
    const briefCont = document.querySelector(".brief-container");
    const questionCont = document.getElementById("question-container");

    // toggleBtn.addEventListener("click", () => {
    //   if (mode === "brief") {
    //     if (!questions.length) return alert("No questions available.");
    //     mode = "question";
    //     briefCont.style.display = "none";
    //     questionCont.style.display = "";
    //     toggleBtn.innerText =
    //       questions.length > 1 ? "Next" : "Submit";
    //     renderQuestion();
    //   } else {
    //     answers[questionIndex] = document.getElementById("answerInput").value;
    //     if (questionIndex < questions.length - 1) {
    //       questionIndex++;
    //       toggleBtn.innerText =
    //         questionIndex === questions.length - 1
    //           ? "Submit"
    //           : "Next";
    //       renderQuestion();
    //     } else {
    //
    //       console.log("Collected answers:", answers);
    //       window.location.href = "/student-homepage";
    //     }
    //   }
    // });

    questionCont.addEventListener("submit", async e => {
      e.preventDefault();
      const q = caseData.questions[questionIndex];
      const textarea = document.getElementById("answer-input");
      const answer = textarea.value;
      const result = await answerQuestion(caseData.id, q.id, answer).catch(e=>alert(`Something went wrong: ${e}`));
      if(!!result){
        alert(result.correct ? "Correct!" : `Incorrect, the answer was: ${result.answer}`);
      }
      textarea.value = "";
      questionIndex++;
      submitBtn.disabled = true;

      if(questionIndex >= questions.length) return window.location.href = "/student-homepage";

      await renderQuestion();
      submitBtn.disabled = false;
    });


    document.getElementById("prevBrief").addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderBrief();
      }
    });
    document.getElementById("nextBrief").addEventListener("click", async () => {
      if (currentIndex < briefs.length - 1) {
        currentIndex++;
        renderBrief();
      } else if (mode === "brief") {
        if (!questions.length) return alert("No questions available.");
        await startCase(caseData.id).catch(e=>null);
        mode = "question";
        briefCont.style.display = "none";
        questionCont.style.display = "";
        submitBtn.innerText =
          questions.length > 1 ? "Next" : "Submit";

        submitBtn.disabled = true;
        await renderQuestion();
        submitBtn.disabled = false;
      }
    });
  } catch (err) {
    document.getElementById("case-title").innerText = "Error loading case";
    document.getElementById("case-brief").innerHTML =
      `<p style="color:red;">${err.message}</p>`;
  }
});

