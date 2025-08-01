import {beforeAll, describe, expect, test, vi, afterAll} from "vitest";

import {doLogin} from "./helpers";

describe("teacher analytics page", ()=>{
  let mockDoc, mockDoc2;
  const fakeDivs = {};
  beforeAll(async () => {
    await doLogin("john_doe", "test_user");

    const getFake = (key) => {
      if(fakeDivs[key]) return fakeDivs[key];
      fakeDivs[key] = document.createElement("div");
      document.body.append(fakeDivs[key]);
      return fakeDivs[key];
    }

    mockDoc = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      const key = "#" + id;
      return getFake(key);
    });

    mockDoc2 = vi.spyOn(document, "querySelector").mockImplementation(getFake)
  });


  test("renders cases correctly", async () => {
    await import("../assets/js/teacher-dashboard");
    await new Promise(r=>setTimeout(r, 2000));
    expect(fakeDivs[".cases"].querySelectorAll(".case").length).toBeGreaterThan(0);
  });

  test("renders case details correctly", async () => {
    fakeDivs[".cases"].querySelector(".case:last-child a[href='#case-info']").click();
    await new Promise(r=>setTimeout(r, 3000));
    expect(fakeDivs["#questions-status"].innerText.includes("ready for students")).toBeTruthy();
  });

  afterAll(()=>{
    mockDoc.mockRestore();
    mockDoc2.mockRestore();
  });
});
