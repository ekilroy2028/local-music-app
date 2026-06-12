// Fetch all venues (optionally with a search query)
export async function fetchVenues(search = "") {
    const url = search
    ? `/api/venues?search=${encodeURIComponent(search)}`
    : "/api/venues";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch venues");
    return res.json();
}

// Fetch a single venue by slug
export async function fetchVenueBySlug(slug) {
    const res = await fetch(`/api/venues/${slug}`);
    if (!res.ok) throw new Error("Venue not found");
    return res.json();
}