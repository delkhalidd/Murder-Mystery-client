import {login} from "../assets/js/api";
import {expect} from "vitest";

export const doLogin = async (username, password) => {
  const u = await login(username, password);
  expect(u.token).toBeDefined();
  window.localStorage.setItem("authToken", u.token);
  window.localStorage.setItem("userData", JSON.stringify(u.user));
}
