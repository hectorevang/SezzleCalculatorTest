import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/calculate", (req, res) => {
    const { operation, a, b } = req.body;

    if (operation === undefined || a === undefined) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const numA = parseFloat(a);
    const numB = b !== undefined ? parseFloat(b) : 0;

    if (isNaN(numA) || (b !== undefined && isNaN(numB))) {
      return res.status(400).json({ error: "Invalid numbers provided" });
    }

    let result: number;

    switch (operation) {
      case "add":
        result = numA + numB;
        break;
      case "subtract":
        result = numA - numB;
        break;
      case "multiply":
        result = numA * numB;
        break;
      case "divide":
        if (numB === 0) {
          return res.status(400).json({ error: "Division by zero" });
        }
        result = numA / numB;
        break;
      case "power":
        result = Math.pow(numA, numB);
        break;
      case "sqrt":
        if (numA < 0) {
          return res.status(400).json({ error: "Cannot calculate square root of a negative number" });
        }
        result = Math.sqrt(numA);
        break;
      case "percentage":
        result = numA / 100;
        break;
      default:
        return res.status(400).json({ error: "Invalid operation" });
    }

    res.json({ result });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
