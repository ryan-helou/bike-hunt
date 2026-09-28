import { defineRailway, project, service } from "railway/iac";

export const partial = "bike-hunt";

export default defineRailway(() => {
  const app = service("bike-hunt", {
    build: "npm run build",
    start: "npm run start",
    healthcheck: "/api/health",
    healthcheckTimeout: 120,
  });
  return project("bike-hunt", { resources: [app] });
});
