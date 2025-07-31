import {beforeAll, describe, expect, test} from "vitest";
import {
  acceptCase, answerQuestion,
  createCase, createQuestions,
  getCaseAnalytics,
  getCaseByInvite,
  getCaseDetails, getMyCases, getQuestionsStatus,
  login,
  register, startCase
} from "../assets/js/api";
import {doLogin} from "./helpers";

describe("Authenticated API Requests", () => {
  const generateFakeInfo = (acctType) => {
    let username = Math.random().toString().slice(2, 12);
    return {
      username,
      password: "test_user",
      firstname: username,
      surnames: "test",
      email: `${username}@fake.com`,
      account_type: acctType
    };
  }
  let fakeTeacher, fakeStudent, c;

  test("unauthorized request fails", async () => {
    expect(await getCaseDetails(1).catch(e=>null)).toBeNull();
  });

  describe("account", () => {
    test("incorrect registration fails", async () => {
      expect(await register({}).catch(e=>null)).toBeNull();
    });

    test("register route", async () => {
      fakeTeacher = await register(generateFakeInfo(0)).then(r=>r.user);
      fakeStudent = await register(generateFakeInfo(1)).then(r=>r.user);

      expect(fakeTeacher.account_type).toBe(0);
      expect(fakeStudent.account_type).toBe(1);
    });

    test("incorrect login fails", async () => {
      expect(await login("sdnf", "jkhsdbgk").catch(e=>null)).toBeNull();
    });

    test("login route", async ()=>{
      await doLogin(fakeTeacher.username, "test_user");
    });
  });

  describe("cases", () => {
    test("create case", async () => {
      c = await createCase({
        title: "test1",
        description: "test2"
      });
      expect(c.id).toBeDefined
    });

    test("invalid case fails", async () => {
      expect(await createCase({}).catch(e=>null)).toBeNull();
    });

    test("get case route", async () => {
      let c1 = await getCaseDetails(c.id);
      expect(c1.id).toBeDefined();
    });

    test("get case analytics", async () => {
      const a = await getCaseAnalytics(c.id);
      expect(a.performance).toBeDefined();
    });

    test("teacher can add questions", async () => {
      const status = await createQuestions(c.id, [
        {
          body: "1+1",
          answer: "2"
        }
      ]);
      expect(status.status).toBe("PROCESSING");
    });

    test("invalid questions fails", async () => {
      expect(await createQuestions(1, []).catch(e=>null)).toBeNull();
    });

    test("status resolves", async () => {
      let status;
      for(let i = 0; i < 30; i++){
        await new Promise(r=>setTimeout(r, 1000));
        status = await getQuestionsStatus(c.id);
        if(status.status !== "PROCESSING") break;
      }
      expect(status.status).toBe("COMPLETED");
    });

    test("case appears in my cases", async()=>{
      const cases = await getMyCases();
      expect(cases[0].id).toBe(c.id);
    });
  });

  describe("student", async () => {
    beforeAll(async () => {
      await doLogin(fakeStudent.username, "test_user");
    });

    test("can view invite", async () => {
      const c1 = await getCaseByInvite(c.invite_token);
      expect(c1.id).toBe(c.id);
    });

    test("can accept invite", async () => {
      const i = await acceptCase(c.invite_token);

      expect(i.created_at).toBeTruthy();
      c = await getCaseDetails(c.id);
    });

    test("can start case", async () => {
      const c1 = await startCase(c.id);

      expect(c1.started_at).toBeTruthy();
    });

    test("can answer question", async () => {
      const a = await answerQuestion(c.id, c.questions[0].id, "answer");
      expect(a.correct).toBeDefined();
    });
  });
});
