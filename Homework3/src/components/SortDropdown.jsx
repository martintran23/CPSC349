import React from "react";

function SortDropdown({ value, onChange }) {
  return (
    <div className="sort-wrapper">
      <select
        id="sortOption"
        className="sort-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="release_desc">Sort By</option>
        <option value="release_asc">Release Date (Asc)</option>
        <option value="release_desc">Release Date (Desc)</option>
        <option value="rating_asc">Rating (Asc)</option>
        <option value="rating_desc">Rating (Desc)</option>
      </select>
    </div>
  );
}

export default SortDropdown;
