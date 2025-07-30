import {getCaseAnalytics, getCaseDetails} from "./api";
import '@carbon/charts/styles.css'
import {HeatmapChart, MeterChart, PieChart} from "@carbon/charts";
import "../css/chartOverrides.scss";
import {baseChartOpts, baseMeterChartOpts} from "./const";

(async() => {
  const id = new URLSearchParams(window.location.search).get("id");
  if(!id) return window.location.href = "/teacher-dashboard";
  const caseDetails = await getCaseDetails(id);

  const overview = document.createElement("div");
  overview.classList.add("case-info");
  overview.id = "case-info";
  const h = document.createElement("h2");
  h.innerText = caseDetails.title;
  overview.appendChild(h);

  document.getElementById('case-info').outerHTML = overview.outerHTML;

  if(!caseDetails) return window.location.href = "/teacher-dashboard";
  const analytics = await getCaseAnalytics(id);
  console.log(analytics);

  const nonStartedInvites = analytics.accepted_invites - analytics.started_invites;
  const startedInvites = analytics.started_invites;
  const caseInvitesStarted = document.getElementById('accepted-invites')
  new MeterChart(caseInvitesStarted, {
    data: [
      {
        group: "Started",
        value: startedInvites
      },
      {
        group: "Waiting",
        value: nonStartedInvites
      }
    ],
    options: {
      ...baseMeterChartOpts,
      title: 'Case Invites Started',
      height: '130px',
      width: "auto",
      meter: {
        proportional: {
          // total: 2000,
          breakdownFormatter: () => {
          },
          totalFormatter: (x) => {
            return `${startedInvites} of ${analytics.accepted_invites} invited students started solving the case`
          },
          total: analytics.accepted_invites,
        }
      },
    }
  });

  const studentPerformance = document.getElementById('student-performance');
  new HeatmapChart(studentPerformance, {
    data: analytics.performance.map(([name, perf])=>{
      return perf.map((correct, i) => {
        return {
          question: i + 1,
          student: name,
          value: correct
        }
      });
    }).reduce((prev, cur) => [...prev, ...cur.flat()], []).sort((a, b) => a.question < b.question ? -1 : 1),
    options: {
      toolbar: {
        enabled: false
      },
      title: 'Student Performance',
      height: '400px',
      width: "auto",
      color: {
        gradient: {
          enabled: true
        }
      },
      axes: {
        bottom: {
          title: 'Question',
          mapsTo: 'question',
          scaleType: 'labels',
        },
        left: {
          title: 'Student',
          mapsTo: 'student',
          scaleType: 'labels',
        }
      },
      legend: {
        enabled: false
      },
    }
  });

  const qbCont = document.getElementById("questions-list");
  qbCont.id = "questions-list";

  const questions = document.createElement("div");

  const questionsTitle = document.createElement("h2");

  questionsTitle.classList.add("underline", "shadow");

  questionsTitle.innerText = "Questions";

  questions.append(questionsTitle);
  let i = 0;
  for(const item of analytics.questions){
    const el = document.createElement("div");
    el.classList.add("item");

    const itemCont = document.createElement("div");
    const title = document.createElement("a");
    const body = document.createElement("h4");
    const chartCont = document.createElement("div");
    const pieChart = document.createElement("div");
    let qi = i;

    title.innerText = "[SEE TRANSFORMED]";
    title.href = "#";
    body.innerText = caseDetails.questions[qi].original;
    chartCont.classList.add("charts");

    let transformed = false;
    title.addEventListener("click", (e) => {
      e.preventDefault();
      transformed = !transformed;
      title.innerText = transformed ? "[SEE ORIGINAL]" : "[SEE TRANSFORMED]";
      body.innerText = transformed ? item.body : caseDetails.questions[qi].original;
    });

    itemCont.append(title, body);
    el.append(itemCont, chartCont);
    chartCont.append(pieChart);

    new PieChart(pieChart, {
      data: Object.entries(item.analytics.answers).map(([group, value]) => {
        return {
          group, value
        }
      }),
      options: {
        ...baseChartOpts,
        title: 'Answers',
        width: '250px',
        height: "auto",
      }
    });

    questions.append(el);
    i++;
  }

  qbCont.append(questions);
})();

document.getElementById("user_fname").innerText = JSON.parse(localStorage.getItem('userData')).firstname
