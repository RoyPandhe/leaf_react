import React, { useState, useMemo, useEffect } from 'react';
import './HistoryPage.css';

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('plantHistory')) || [];
    setHistory(storedHistory);
    console.log(history);

    storedHistory.forEach((item) => {
      getPresignedUrl(item.imageKey).then((url) => {
        setImageUrls((prev) => ({
          ...prev,
          [item.imageKey]: url,
        }));
      });
    });
  }, []);

  const getPresignedUrl = async (imageKey) => {
    try {
      const response = await fetch(`https://wf85g6ao27.execute-api.us-east-1.amazonaws.com/dev/presigned-url/download?fileName=${imageKey}`);
      const data = await response.json();
      return data.presignedUrl;
    } catch (error) {
      console.error("Error getting presigned URL:", error);
      return '';
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(item =>
      item.plantName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, history]);

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
                  src={imageUrls[item.imageKey] || ''}
                  alt={item.plantName}
                  onError={(e) => {
                    e.target.src = '';
                  }}
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.plantName}</h3>
                <p className="card-details">
                  {item.scientificName} • {item.category}
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
