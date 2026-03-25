import React from "react";

function Pagination({ currentPage, totalPages, onPrevious, onNext }) {
  return (
    <div className="pagination">
      <button className="pagination-button" onClick={onPrevious} disabled={currentPage === 1}>
        Previous
      </button>
      <span className="page-indicator">Page {currentPage}</span>
      <button
        className="pagination-button"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
