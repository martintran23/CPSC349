import React, { useEffect, useMemo, useState } from "react";
import { fetchPopularMovies, searchMovies } from "./api";
import MovieList from "./components/MovieList";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import SortDropdown from "./components/SortDropdown";

function App() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("release_desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce search input so we avoid API calls on every keystroke.
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  // Fetch either popular movies or search results.
  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const data = searchQuery
          ? await searchMovies(searchQuery, currentPage)
          : await fetchPopularMovies(currentPage);

        setMovies(data.results || []);
        setTotalPages(Math.max(1, Math.min(data.total_pages || 1, 500)));
      } catch (fetchError) {
        setError(fetchError.message || "Something went wrong while loading movies.");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [currentPage, searchQuery]);

  // Sort the currently displayed page of movies on the client side.
  const sortedMovies = useMemo(() => {
    const moviesCopy = [...movies];

    if (sortOption === "release_asc") {
      moviesCopy.sort((a, b) => {
        const firstDate = a.release_date ? new Date(a.release_date).getTime() : 0;
        const secondDate = b.release_date ? new Date(b.release_date).getTime() : 0;
        return firstDate - secondDate;
      });
    }

    if (sortOption === "release_desc") {
      moviesCopy.sort((a, b) => {
        const firstDate = a.release_date ? new Date(a.release_date).getTime() : 0;
        const secondDate = b.release_date ? new Date(b.release_date).getTime() : 0;
        return secondDate - firstDate;
      });
    }

    if (sortOption === "rating_asc") {
      moviesCopy.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
    }

    if (sortOption === "rating_desc") {
      moviesCopy.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    }

    return moviesCopy;
  }, [movies, sortOption]);

  function handlePreviousPage() {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  }

  function handleNextPage() {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Movie Explorer</h1>
        <div className="header-controls">
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <SortDropdown value={sortOption} onChange={setSortOption} />
        </div>
      </header>

      <main className="app-main">
        <MovieList movies={sortedMovies} loading={loading} error={error} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </main>
    </div>
  );
}

export default App;
