const express = require("express");
const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const venueRoutes = require("./routes/venues");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files from client/src
app.use(express.static(path.join(__dirname, "../client/src")));

// API routes
app.use("/api/venues", venueRoutes);

// All other routes serve the frontend
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/index.html"));
});

app.listen(PORT, () => {
  console.log(`🎵 Local Sounds running at http://localhost:${PORT}`);
});