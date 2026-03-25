import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar-wrapper">
      <input
        className="search-input"
        type="text"
        placeholder="Search movies by title..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;
