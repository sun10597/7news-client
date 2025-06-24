import React from "react";
import HotNews from "../com/HotNews";
import LatestNews from "../com/LatestNews";
import CategoryNews from "../com/CategoryNews";
import './NewsDashboard.css';
import usePageTitle from "../hooks/usePageTitle";

export default function NewsDashboard() {
  usePageTitle("7 NEWS");
  return (
    <div className="news-dashboard">
      <div className="top-section">
        <HotNews />
        <LatestNews />
      </div>
      <div className="bottom-section">
        <CategoryNews />
      </div>
    </div>
  );
}
