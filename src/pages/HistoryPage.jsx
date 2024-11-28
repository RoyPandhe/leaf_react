import React, { useState, useMemo } from 'react';
import './HistoryPage.css';

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with your actual data
  const mockHistory = [
    {
      id: 1,
      plantName: "Monstera Deliciosa",
      scientificName: "Monstera deliciosa",
      family: "Araceae",
      date: "2024-01-15",
      imageUrl: "https://example.com/plant1.jpg"
    },
    {
      id: 2,
      plantName: "Snake Plant",
      scientificName: "Dracaena trifasciata",
      family: "Asparagaceae",
      date: "2024-01-14",
      imageUrl: "https://example.com/plant2.jpg"
    },
    // Add more mock items as needed
  ];

  const filteredHistory = useMemo(() => {
    return mockHistory.filter(item =>
      item.plantName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Scan History</h1>
        <p>View your previous plant identifications</p>
      </div>

      <div className="search-filter-container">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search in history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div className="history-grid">
          {filteredHistory.map((item) => (
            <div key={item.id} className="history-card">
              <div className="card-image">
                <img
                  src={item.imageUrl || '/default-plant-image.jpg'}
                  alt={item.plantName}
                  onError={(e) => {
                    e.target.src = '/default-plant-image.jpg'; // Use a fallback image
                  }}
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.plantName}</h3>
                <p className="card-details">
                  {item.scientificName} • {item.family}
                </p>
                <span className="card-date">
                  Scanned on {formatDate(item.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No History Found</h3>
          <p>Your plant identification history will appear here</p>
        </div>
      )}

      {filteredHistory.length > 0 && (
        <div className="pagination">
          <button className="page-button">Previous</button>
          <button className="page-button active">1</button>
          <button className="page-button">2</button>
          <button className="page-button">3</button>
          <button className="page-button">Next</button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
