import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);
  
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        «
      </button>
      <button 
        className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>
      
      {startPage > 1 && (
        <>
          <button 
            className="pagination-button"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {startPage > 2 && <span className="pagination-ellipsis">…</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination-ellipsis">…</span>}
          <button 
            className="pagination-button"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button 
        className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
      <button 
        className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
      
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .pagination-button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          color: #333;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
          min-width: 36px;
          text-align: center;
        }
        .pagination-button:hover:not(:disabled) {
          background: #f0f0f0;
          border-color: #999;
        }
        .pagination-button.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }
        .pagination-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-ellipsis {
          padding: 6px 8px;
          color: #666;
        }
        @media (max-width: 600px) {
          .pagination {
            gap: 2px;
          }
          .pagination-button {
            padding: 4px 8px;
            min-width: 30px;
            font-size: 0.9em;
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;
