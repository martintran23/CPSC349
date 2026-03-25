const API_BASE = 'https://api.themoviedb.org/3';
const POSTER_BASE = 'https://image.tmdb.org/t/p/w300';
// Paste your TMDB API key from https://www.themoviedb.org/settings/api
const API_KEY = 'YOUR_API_KEY';

let currentPage = 1;
let currentQuery = '';
let currentSort = 'release_date.desc';
let totalPages = 1;

const movieGrid = document.getElementById('movieGrid');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const pageNumberEl = document.getElementById('pageNumber');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');

function sortMoviesClient(movies, sortKey) {
    const [field, direction] = sortKey.split('.');
    const dir = direction === 'asc' ? 1 : -1;

    return movies.slice().sort((a, b) => {
        let aVal;
        let bVal;

        if (field === 'release_date') {
            aVal = a.release_date ? new Date(a.release_date).getTime() : 0;
            bVal = b.release_date ? new Date(b.release_date).getTime() : 0;
        } else if (field === 'vote_average') {
            aVal = typeof a.vote_average === 'number' ? a.vote_average : 0;
            bVal = typeof b.vote_average === 'number' ? b.vote_average : 0;
        } else if (field === 'popularity') {
            aVal = typeof a.popularity === 'number' ? a.popularity : 0;
            bVal = typeof b.popularity === 'number' ? b.popularity : 0;
        } else {
            return 0;
        }

        if (aVal === bVal) return 0;
        return aVal > bVal ? dir : -dir;
    });
}

function fetchMovies() {
    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    errorMessage.textContent = '';

    const isSearch = currentQuery.trim().length > 0;
    const params = new URLSearchParams({
        api_key: API_KEY,
        page: String(currentPage),
    });

    if (isSearch) {
        params.set('query', currentQuery.trim());
    } else {
        params.set('sort_by', currentSort);
    }

    const endpoint = isSearch ? `${API_BASE}/search/movie` : `${API_BASE}/discover/movie`;
    const url = `${endpoint}?${params.toString()}`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            return res.json();
        })
        .then(data => {
            totalPages = Math.min(data.total_pages || 1, 500);
            let movies = (data.results || []).slice(0, 20);

            if (isSearch) {
                movies = sortMoviesClient(movies, currentSort);
            }

            renderMovies(movies);
            updatePagination();
        })
        .catch(err => {
            errorMessage.textContent = err.message || 'Failed to load movies. Check your API key and connection.';
            errorMessage.hidden = false;
            movieGrid.innerHTML = '';
        })
        .finally(() => {
            loadingMessage.hidden = true;
        });
}

function renderMovies(movies) {
    movieGrid.innerHTML = '';

    if (!movies.length) {
        movieGrid.innerHTML = '<p class="loading-message" style="grid-column: 1 / -1;">No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('article');
        card.className = 'movie-card';

        const posterPath = movie.poster_path
            ? `${POSTER_BASE}${movie.poster_path}`
            : '';

        const img = document.createElement('img');
        img.className = 'movie-card-poster';
        img.src = posterPath;
        img.alt = movie.title || 'Movie poster';
        img.loading = 'lazy';
        if (!posterPath) {
            img.style.background = 'var(--bg-secondary)';
        }

        const details = document.createElement('div');
        details.className = 'movie-card-details';

        const title = document.createElement('h2');
        title.className = 'movie-card-title';
        title.textContent = movie.title || 'Untitled';

        const meta = document.createElement('div');
        meta.className = 'movie-card-meta';

        const releaseDate = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : 'N/A';

        const rating = document.createElement('div');
        rating.className = 'movie-card-rating';
        rating.textContent = (movie.vote_average != null ? movie.vote_average.toFixed(1) : 'N/A') + '/10';

        meta.innerHTML = `Released: ${releaseDate}`;
        details.appendChild(title);
        details.appendChild(meta);
        details.appendChild(rating);

        card.appendChild(img);
        card.appendChild(details);
        movieGrid.appendChild(card);
    });
}

function updatePagination() {
    pageNumberEl.textContent = `Page ${currentPage}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

function onSearch() {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    fetchMovies();
}

function onSortChange() {
    currentSort = sortSelect.value;
    currentPage = 1;
    fetchMovies();
}

searchBtn.addEventListener('click', onSearch);

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSearch();
});

let searchDebounce;
searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(onSearch, 400);
});

sortSelect.addEventListener('change', onSortChange);

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies();
    }
});

fetchMovies();
