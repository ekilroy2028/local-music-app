const express = require("express");
const path = require("path");
const { venues, getVenueBySlug } = require("./data");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

function homePage(venueList) {
  const cards = venueList.map(function(v) {
    const cover = v.coverCharge === 0 ? "Free Entry" : "$" + v.coverCharge + " cover";
    return '<article class="venue-card" onclick="window.location=\'/venues/' + v.slug + '\'">' +
      '<div class="card-genre-tag">' + v.genre + '</div>' +
      '<div class="card-emoji">' + v.emoji + '</div>' +
      '<h2 class="card-name">' + v.name + '</h2>' +
      '<p class="card-neighborhood">📍 ' + v.neighborhood + '</p>' +
      '<p class="card-desc">' + v.shortDesc + '</p>' +
      '<div class="card-footer">' +
        '<span class="card-cover">' + cover + '</span>' +
        '<span class="card-age">' + v.ageRestriction + '</span>' +
      '</div>' +
      '</article>';
  }).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Local Sounds</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"/><link rel="stylesheet" href="/style.css"/></head><body><header class="site-header"><div class="header-inner"><div class="logo">🎵 LOCAL<span>SOUNDS</span></div><p class="tagline">The underground guide to live music in your city</p></div><div class="header-wave"></div></header><main class="main-content"><div class="section-label">// ${venueList.length} venues found</div><div class="venue-grid">${cards}</div></main><footer class="site-footer"><p>Local Sounds &copy; 2026 &mdash; Built for music lovers</p></footer></body></html>`;
}

function detailPage(venue) {
  const rows = venue.upcomingShows.map(function(show) {
    const price = show.price === 0 ? "Free" : "$" + show.price;
    return '<div class="show-row">' +
      '<span class="show-date">' + show.date + '</span>' +
      '<span class="show-artist">' + show.artist + '</span>' +
      '<span class="show-price">' + price + '</span>' +
      '</div>';
  }).join("");

  const cover = venue.coverCharge === 0 ? "Free" : "$" + venue.coverCharge;

  return '<!DOCTYPE html>' +
    '<html lang="en"><head>' +
    '<meta charset="UTF-8"/>' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' +
    '<title>' + venue.name + ' — Local Sounds</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">' +
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"/><link rel="stylesheet" href="/style.css"/>' +
    '</head><body>' +
    '<header class="site-header">' +
      '<div class="header-inner"><a href="/" class="logo">🎵 LOCAL<span>SOUNDS</span></a></div>' +
      '<div class="header-wave"></div>' +
    '</header>' +
    '<main class="main-content detail-main">' +
      '<a href="/" class="back-btn">← All Venues</a>' +
      '<div class="detail-hero">' +
        '<div class="detail-emoji">' + venue.emoji + '</div>' +
        '<div class="detail-hero-text">' +
          '<div class="card-genre-tag">' + venue.genre + '</div>' +
          '<h1 class="detail-name">' + venue.name + '</h1>' +
          '<p class="detail-neighborhood">📍 ' + venue.neighborhood + ' — ' + venue.address + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="detail-grid">' +
        '<section class="detail-about">' +
          '<h2>About</h2>' +
          '<p>' + venue.fullDesc + '</p>' +
          '<div class="detail-meta-grid">' +
            '<div class="meta-item"><span class="meta-label">Cover Charge</span><span class="meta-value">' + cover + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">Age Policy</span><span class="meta-value">' + venue.ageRestriction + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">Capacity</span><span class="meta-value">' + venue.capacity + ' people</span></div>' +
            '<div class="meta-item"><span class="meta-label">Hours</span><span class="meta-value">' + venue.hours + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">Best Night</span><span class="meta-value">' + venue.bestNight + '</span></div>' +
            '<div class="meta-item"><span class="meta-label">Vibe</span><span class="meta-value">' + venue.vibe + '</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="detail-shows">' +
          '<h2>Upcoming Shows</h2>' +
          '<div class="show-list">' +
            '<div class="show-row show-header"><span>Date</span><span>Artist</span><span>Price</span></div>' +
            rows +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
    '<footer class="site-footer"><p>Local Sounds &copy; 2026</p></footer>' +
    '</body></html>';
}

function notFoundPage() {
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>404 — Local Sounds</title>' +
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"/><link rel="stylesheet" href="/style.css"/></head><body>' +
    '<main class="main-content not-found">' +
    '<div class="not-found-code">404</div>' +
    '<h1>Page not found</h1>' +
    '<p>Looks like this spot closed down.</p>' +
    '<a href="/" class="back-btn">← Back to all venues</a>' +
    '</main></body></html>';
}

app.get("/", function(req, res) {
  res.send(homePage(venues));
});

app.get("/venues/:slug", function(req, res) {
  const venue = getVenueBySlug(req.params.slug);
  if (!venue) return res.status(404).send(notFoundPage());
  res.send(detailPage(venue));
});

app.use(function(req, res) {
  res.status(404).send(notFoundPage());
});

app.listen(PORT, function() {
  console.log("🎵 Local Sounds running at http://localhost:" + PORT);
});
