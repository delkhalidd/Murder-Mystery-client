import {describe, beforeAll, test, expect, vi} from "vitest";
import {page} from "@vitest/browser/context";

describe("Login Page", () => {
    beforeAll(async ()=>{
        window.location.href = "http://localhost:4173/login";

        await new Promise((resolve) => {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            resolve(null);
        } else {
            window.addEventListener("DOMContentLoaded", () => resolve(null));
        }
        });
    });

    test("can login", async ()=>{
        const username = window.document.querySelector("input");
        const password = window.document.querySelector("input#password");
        console.log(username, password, window.location.href, window.document.body.innerHTML);
        await page.elementLocator(username).fill('john_doe')
        await page.elementLocator(password).fill('test_user')

        await page.getByRole('button', { name: /submit/i }).click()
        expect("asdasd").toBeDefined();
    });
});