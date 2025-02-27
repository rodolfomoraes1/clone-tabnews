import database from "infra/database";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public");
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(201);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const responseBody = await response.json();
  const responseBody2 = await response2.json();

  responseBody.forEach((migration) => {
    expect(migration).toHaveProperty("timestamp");
  });
  responseBody2.forEach((migration) => {
    expect(migration).not.toHaveProperty("timestamp");
  });

  expect(Array.isArray(responseBody)).toBe(true);
  expect(Array.isArray(responseBody2)).toBe(true);

  expect(responseBody.length).toBeGreaterThanOrEqual(1);
  expect(responseBody2.length).toBe(0);
});
