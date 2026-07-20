import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`
================================================
🚀 Portfolio AI Backend is running
================================================
Environment : ${env.NODE_ENV}
Port        : ${PORT}
Health      : http://localhost:${PORT}/api/v1/health
================================================
`);
});