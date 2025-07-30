import { API_URL } from "./const";
import { createCase, createQuestions, getQuestionsStatus } from "./api";  

let inputCount = 0;


const renumberEntries = () => {
  const entries = Array.from(document.querySelectorAll("#inputs-container .input-entry"));
  entries.forEach((entry, idx) => {
    entry.querySelector("h4").innerText = `Investigation Element ${idx + 1}`;
    const [body, answer] = entry.querySelectorAll("textarea");
    body.name   = `input_body_${idx}`;
    answer.name = `input_answer_${idx}`;
  });
  inputCount = entries.length;
};

const addInput = () => {
  const container = document.getElementById("inputs-container");
  const template  = container.querySelector(".input-entry");
  const clone     = template.cloneNode(true);
  clone.querySelectorAll("textarea").forEach(t => t.value = "");
  container.appendChild(clone);
  renumberEntries();
};

document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading-overlay");
  const form    = document.getElementById("createCaseForm");

  
  document.getElementById("add-input")
    .addEventListener("click", e => { e.preventDefault(); addInput(); });
  document.getElementById("remove-input")
    .addEventListener("click", e => {
      e.preventDefault();
      const entries = document.querySelectorAll("#inputs-container .input-entry");
      if (entries.length > 1) {
        entries[entries.length - 1].remove();
        renumberEntries();
      }
    });

  
  form.addEventListener("submit", async e => {
    e.preventDefault();
    loading.style.display = "flex";

    try {
      
      const title       = form.title.value;
      const description = form.description.value;
      const newCase     = await createCase({ title, description });

      
      const entries = Array.from(document.querySelectorAll("#inputs-container .input-entry"));
      const inputs  = entries.map((entry, idx) => ({
        body:   entry.querySelector(`[name="input_body_${idx}"]`).value,
        answer: entry.querySelector(`[name="input_answer_${idx}"]`).value
      }));
      await createQuestions(newCase.id, inputs);

      
      let statusObj;
      do {
        statusObj = await getQuestionsStatus(newCase.id);
        if (statusObj.status === "PROCESSING") {
         
          await new Promise(r => setTimeout(r, 2000));
        }
      } while (statusObj.status === "PROCESSING");

      
      
      window.location.href = `/teacher-dashboard?case=${newCase.id}`;
    } catch (err) {
      alert("Error creating case: " + err.message);
    } finally {
      loading.style.display = "none";
    }
  });

  
  renumberEntries();
});
