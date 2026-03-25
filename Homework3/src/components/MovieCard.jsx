import React from "react";
import { POSTER_BASE_URL } from "../api";

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <article className="movie-card">
      <img className="movie-poster" src={posterUrl} alt={movie.title} loading="lazy" />
      <div className="movie-content">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">Release Date: {movie.release_date || "N/A"}</p>
        <p className="movie-meta">Rating: {movie.vote_average?.toFixed(1) || "N/A"}</p>
      </div>
    </article>
  );
}

export default MovieCard;
