const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_TMDB_KEY || "YOUR_API_KEY_HERE";

// Build a TMDB URL with the API key and query params.
function buildUrl(path, params = {}) {
  const query = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });

  return `${API_BASE_URL}${path}?${query.toString()}`;
}

// Fetches popular movies from TMDB (20 per page by default).
export async function fetchPopularMovies(page = 1) {
  const url = buildUrl("/movie/popular", { page });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch popular movies.");
  }

  return response.json();
}

// Fetches movies that match a search query.
export async function searchMovies(query, page = 1) {
  const url = buildUrl("/search/movie", {
    query,
    page,
    include_adult: false,
  });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to search movies.");
  }

  return response.json();
}

export const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
