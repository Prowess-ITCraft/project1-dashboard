import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("sign in and open the dashboard", async ({ page }) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("request", (request) => {
    const url = request.url();
    if (url.startsWith("http://127.0.0.1:9610") || url.startsWith("data:") || url.startsWith("blob:")) return;
    failures.push(url);
  });

  await page.goto("/?static=1");
  await page.getByRole("button", { name: "Preview as admin" }).click();
  await page.waitForURL("**/dashboard**");
  await page.goto("/dashboard?static=1");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Tasks blocked")).toBeVisible();
  await expect(page.getByText("Plant network refresh").first()).toBeVisible();

  await page.getByRole("button", { name: "7d" }).first().click();
  await page.getByRole("button", { name: "Search customers, projects, tasks" }).click();
  await expect(page.getByPlaceholder("Search customers, projects, tasks")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("tab", { name: /Engineers/ }).click();
  await expect(page.getByRole("heading", { name: "Live field view" })).toBeVisible();
  await page.getByRole("tab", { name: /Waiting on/ }).click();
  await expect(page.getByText("Customer change window for T05")).toBeVisible();
  await page.getByRole("tab", { name: "Activity" }).click();
  await expect(page.getByText(/Bhakti tried to tick/)).toBeVisible();
  await page.getByRole("tab", { name: /Projects/ }).click();
  await page.getByLabel("Customer").selectOption({ label: "Vardhan Logistics" });
  await expect(page.getByText("DC hardening").first()).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(serious).toEqual([]);
  expect(failures).toEqual([]);

  await page.screenshot({ path: `test-results/dashboard-${test.info().project.name}.png`, fullPage: true });
});
