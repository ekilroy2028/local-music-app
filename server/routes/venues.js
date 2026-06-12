const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET /api/venues — return all venues (with optional ?search= query)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let query = "SELECT * FROM venues";
    let params = [];

    if (search) {
      query += ` WHERE 
        LOWER(name) LIKE $1 OR 
        LOWER(genre) LIKE $1 OR 
        LOWER(neighborhood) LIKE $1 OR 
        LOWER(vibe) LIKE $1`;
      params = [`%${search.toLowerCase()}%`];
    }

    query += " ORDER BY name ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/venues/:slug — return one venue with its upcoming shows
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const venueResult = await pool.query(
      "SELECT * FROM venues WHERE slug = $1",
      [slug]
    );

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    const venue = venueResult.rows[0];

    const showsResult = await pool.query(
      "SELECT * FROM upcoming_shows WHERE venue_id = $1 ORDER BY id ASC",
      [venue.id]
    );

    venue.upcoming_shows = showsResult.rows;
    res.json(venue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;