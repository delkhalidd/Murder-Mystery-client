import {beforeAll, describe, expect, test, vi, afterAll} from "vitest";

import {doLogin} from "./helpers";

describe("case analytics page", ()=>{
  let mockDoc;
  const fakeDivs = {};
  beforeAll(async () => {
    await doLogin("john_doe", "test_user");

    mockDoc = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if(fakeDivs[id]) return fakeDivs[id];
      fakeDivs[id] = document.createElement("div");
      document.body.append(fakeDivs[id]);
      return fakeDivs[id];
    });

    window.history.pushState({}, '', `${window.location.pathname}?id=1`);W
  });


  test("renders charts correctly", async () => {
    await import("../assets/js/case-analytics");
    await new Promise(r=>setTimeout(r, 2000));
    expect(fakeDivs["student-performance"].querySelector(".heat-0.cell")).toBeDefined();
    expect(fakeDivs["questions-list"].querySelectorAll(".item").length).toBe(10);
  });

  afterAll(()=>{
    mockDoc.mockRestore();
  });
});
