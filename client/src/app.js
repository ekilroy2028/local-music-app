import { fetchVenues, fetchVenueBySlug } from "./api/venues.js";

const app = document.getElementById("app");
const homeLink = document.getElementById("home-link");

// ─── Router ───────────────────────────────────────────────────────────────────

function getSlugFromPath() {
  const match = window.location.pathname.match(/^\/venues\/([^/]+)/);
  return match ? match[1] : null;
}

async function route() {
  const slug = getSlugFromPath();
  if (slug) {
    await renderDetail(slug);
  } else {
    await renderHome();
  }
}

// Navigate without full page reload
function navigate(path) {
  history.pushState({}, "", path);
  route();
}

window.addEventListener("popstate", route);
homeLink.addEventListener("click", () => navigate("/"));

// ─── Home Page ────────────────────────────────────────────────────────────────

async function renderHome(search = "") {
  app.innerHTML = `<div class="loading-state">Loading venues...</div>`;
  try {
    const venues = await fetchVenues(search);

    const searchBar = `
      <div class="search-bar">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Search by genre, neighborhood, or vibe..." 
          value="${search}"
        />
      </div>
    `;

    const count = `<div class="section-label">// ${venues.length} venue${venues.length !== 1 ? "s" : ""} found</div>`;

    const cards = venues.length === 0
      ? `<p class="no-results">No venues matched your search. <button class="link-btn" id="clear-search">Clear search</button></p>`
      : venues.map(v => {
          const cover = v.cover_charge === 0 ? "Free Entry" : `$${v.cover_charge} cover`;
          return `
            <article class="venue-card" data-slug="${v.slug}">
              <div class="card-genre-tag">${v.genre}</div>
              <div class="card-emoji">${v.emoji}</div>
              <h2 class="card-name">${v.name}</h2>
              <p class="card-neighborhood">📍 ${v.neighborhood}</p>
              <p class="card-desc">${v.short_desc}</p>
              <div class="card-footer">
                <span class="card-cover">${cover}</span>
                <span class="card-age">${v.age_restriction}</span>
              </div>
            </article>
          `;
        }).join("");

    app.innerHTML = `
      ${searchBar}
      ${count}
      <div class="venue-grid">${cards}</div>
    `;

    // Search handler
    document.getElementById("search-input").addEventListener("input", (e) => {
      clearTimeout(window._searchTimer);
      window._searchTimer = setTimeout(() => renderHome(e.target.value), 300);
    });

    // Clear button (shown when no results)
    document.getElementById("clear-search")?.addEventListener("click", () => renderHome(""));

    // Card click → detail
    document.querySelectorAll(".venue-card").forEach(card => {
      card.addEventListener("click", () => navigate(`/venues/${card.dataset.slug}`));
    });

  } catch (err) {
    app.innerHTML = `<p class="error-msg">Could not load venues. Is the server running?</p>`;
    console.error(err);
  }
}

// ─── Detail Page ──────────────────────────────────────────────────────────────

async function renderDetail(slug) {
  app.innerHTML = `<div class="loading-state">Loading...</div>`;
  try {
    const v = await fetchVenueBySlug(slug);

    const cover = v.cover_charge === 0 ? "Free" : `$${v.cover_charge}`;

    const showRows = (v.upcoming_shows || []).map(show => {
      const price = show.price === 0 ? "Free" : `$${show.price}`;
      return `
        <div class="show-row">
          <span class="show-date">${show.show_date}</span>
          <span class="show-artist">${show.artist}</span>
          <span class="show-price">${price}</span>
        </div>
      `;
    }).join("") || `<div class="show-row"><span>No upcoming shows listed.</span></div>`;

    app.innerHTML = `
      <a class="back-btn" id="back-btn">← All Venues</a>

      <div class="detail-hero">
        <div class="detail-emoji">${v.emoji}</div>
        <div class="detail-hero-text">
          <div class="card-genre-tag">${v.genre}</div>
          <h1 class="detail-name">${v.name}</h1>
          <p class="detail-neighborhood">📍 ${v.neighborhood} — ${v.address}</p>
        </div>
      </div>

      <div class="detail-grid">
        <section class="detail-about">
          <h2>About</h2>
          <p>${v.full_desc}</p>
          <div class="detail-meta-grid">
            <div class="meta-item"><span class="meta-label">Cover Charge</span><span class="meta-value">${cover}</span></div>
            <div class="meta-item"><span class="meta-label">Age Policy</span><span class="meta-value">${v.age_restriction}</span></div>
            <div class="meta-item"><span class="meta-label">Capacity</span><span class="meta-value">${v.capacity} people</span></div>
            <div class="meta-item"><span class="meta-label">Hours</span><span class="meta-value">${v.hours}</span></div>
            <div class="meta-item"><span class="meta-label">Best Night</span><span class="meta-value">${v.best_night}</span></div>
            <div class="meta-item"><span class="meta-label">Vibe</span><span class="meta-value">${v.vibe}</span></div>
          </div>
        </section>

        <section class="detail-shows">
          <h2>Upcoming Shows</h2>
          <div class="show-list">
            <div class="show-row show-header">
              <span>Date</span><span>Artist</span><span>Price</span>
            </div>
            ${showRows}
          </div>
        </section>
      </div>
    `;

    document.getElementById("back-btn").addEventListener("click", () => navigate("/"));

    if (window.location.pathname !== `/venues/${slug}`) {
      history.replaceState({}, "", `/venues/${slug}`);
    }

  } catch (err) {
    app.innerHTML = `
      <div class="not-found">
        <div class="not-found-code">404</div>
        <h1>Venue not found</h1>
        <p>Looks like this spot closed down.</p>
        <a class="back-btn" id="back-btn">← Back to all venues</a>
      </div>
    `;
    document.getElementById("back-btn").addEventListener("click", () => navigate("/"));
    }
}

// ─── Start ────────────────────────────────────────────────────────────────────
route();