import React from "react";
import MovieCard from "./MovieCard";

function MovieList({ movies, loading, error }) {
  if (loading) {
    return <p className="status-message">Loading movies...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  if (movies.length === 0) {
    return <p className="status-message">No movies found.</p>;
  }

  return (
    <section className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}

export default MovieList;
