import React from "react";
import { Link } from "react-router-dom";

export const TrailerButton = ({ id, title, trailer_url }) => {
  // For videos database items, use the standard content route
  return (
    <Link to={`/singlePage/content/${id}`} className="trailer-btn-link">
      <button className="trailer-btn">
        <i className="fas fa-film"></i>
        {trailer_url ? "WATCH TRAILER" : "WATCH NOW"}
      </button>
    </Link>
  );
};
