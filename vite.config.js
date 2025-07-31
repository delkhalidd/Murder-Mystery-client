import {defineConfig} from "vite";
import {resolve} from "path";

export default defineConfig({
  root: "src",
  publicDir: "../static",
  build: {
    rollupOptions: {
      input: {
        login: resolve(__dirname, "src/login.html"),
        register: resolve(__dirname, "src/register.html"),
        caseAnalytics: resolve(__dirname, "src/case-analytics.html"),
        createCase: resolve(__dirname, "src/create-case.html"),
        gamePlaying: resolve(__dirname, "src/game-playing.html"),
        invite: resolve(__dirname, "src/invite.html"),
        studentHomepage: resolve(__dirname, "src/student-homepage.html"),
        teacherDashboard: resolve(__dirname, "src/teacher-dashboard.html"),
        unauthorized: resolve(__dirname, "src/unauthorised.html"),
      }
    },
    outDir: resolve(__dirname, "dist")
  },
  server: {
    port: 3001
  },
  test: {
    browser:{
      provider: "playwright",
      enabled: true,
      instances: [
        { browser: 'chromium' },
      ],
    },
  }
});
