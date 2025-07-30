import {acceptCase, getCaseByInvite} from "./api";

const appCont = document.querySelector("main");
const inviteNotFound = `<div style="display: flex; flex-direction: column; margin: auto;">
  <h1>Invite not found</h1>
  <a href="/student-homepage" class="btn btn-secondary">Home</a>
</div>`;

(async () => {
  const token = new URLSearchParams(window.location.search).get("token");
  if(!token) appCont.innerHTML = inviteNotFound;

  const invite = await getCaseByInvite(token);
  if(!invite?.id) appCont.innerHTML = inviteNotFound;

  appCont.innerHTML = `<div class="shadow-sm" style="display: flex; flex-direction: column; margin: 0 auto; max-width: 50%;">
  <h1 style="margin-bottom: 0;">Detective!</h1>
  <h2 style="font-size: 1.5rem;">You have been invited to solve a case.</h2>
  <div style="display: flex; flex-direction: column; text-align: left;">
    <h2 id="case-title">
      Case title: <span></span>
    </h2>
    <p style="font-size: 1.25rem" id="case-description">
    </p>
  </div>
  <button class="btn btn-secondary">
    <h3 style="font-size: 1.5rem;">Accept</h3>
  </button>
  <span id="error"></span>
</div>`
  appCont.querySelector("#case-title").innerText = invite.title;
  appCont.querySelector("#case-description").innerText = invite.description;

  const accept = appCont.querySelector("button");
  accept.addEventListener("click", async ()=>{
    const header = accept.querySelector("h3");
    accept.disabled = true;
    header.innerText = "Accepting...";
    try{
      const accepted = await acceptCase(token);
      window.location.href = `/game-playing?id=${accepted.id}`;
    }catch(e){
      if(e.message.includes("Invite already accepted")){
        return window.location.href = `/game-playing?id=${invite.id}`;
      }
      accept.disabled = false;
      header.innerText = "Accept";
      appCont.querySelector("#error").innerText = e.message;
    }
  });
})();

document.getElementById("user_fname").innerText = JSON.parse(localStorage.getItem('userData')).firstname;
