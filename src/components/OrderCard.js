import React, { useState, useEffect } from 'react';
import { FaTruckPickup, FaMapMarkerAlt, FaEye } from 'react-icons/fa';

const OrderCard = ({ order, isExpanded, onToggleExpand, onDetailsClick }) => {
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const pickup = order.destinations?.[0];
  const dropoff = order.destinations?.[1];

  useEffect(() => {
    const checkStartTime = () => {
      if (order.start_date) {
        const startTime = new Date(order.start_date).getTime();
        const currentTime = new Date().getTime();
        setIsNavigationEnabled(currentTime >= startTime);
        setTimeLeft(Math.max(0, startTime - currentTime));
      }
    };

    checkStartTime();
    const interval = setInterval(checkStartTime, 1000);

    return () => clearInterval(interval);
  }, [order.start_date]);

  const formatTime = (ms) => {
    if (!ms) return '00:00:00';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResumeClick = () => {
    onDetailsClick();
  };

  const handleNavigateClick = () => {
    if (isNavigationEnabled) {
      console.log("Navegar");
    }
  };

  return (
    <div className={`order-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="order-header" onClick={onToggleExpand}>
        <div>
          <h3>Order #{order.order_number}</h3>
          <span className="order-type">{order.cargo?.type || 'FCL'}</span>
        </div>
        <span className="order-status">{order.status_string || 'In transit'}</span>
      </div>

      {isExpanded && (
        <div className="order-content">
          <div className="destination-section">
            <div className="destination-header">
              <h4 className="destination-title">
                <FaTruckPickup className="destination-icon" />
                PICKUP
              </h4>
              <span className="destination-date">
                {pickup?.startDate ? new Date(pickup.startDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <p className="destination-address">{pickup?.address || 'No pickup address available'}</p>
            <p className="destination-time">
              {pickup?.startDate ? new Date(pickup.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </p>
          </div>

          <div className="destination-section">
            <div className="destination-header">
              <h4 className="destination-title">
                <FaMapMarkerAlt className="destination-icon" />
                DROPOFF
              </h4>
              <span className="destination-date">
                {dropoff?.startDate ? new Date(dropoff.startDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <p className="destination-address">{dropoff?.address || 'No dropoff address available'}</p>
            <p className="destination-time">
              {dropoff?.startDate ? new Date(dropoff.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </p>
          </div>

          {timeLeft && (
            <div className="time-indicator">
              <span>Its time for pickup</span>
              <span className="timer">{formatTime(timeLeft)}</span>
            </div>
          )}
          {order.driver && (
  <div className="driver-section">
    <div className="driver-avatar">
      {order.driver_thumbnail ? (
        <img src={order.driver_thumbnail} alt="Driver" />
      ) : (
        <span>{order.driver?.nickname?.[0]?.toUpperCase()}</span>
      )}
    </div>
    <p className="driver-name">{order.driver?.nickname}</p>
  </div>
)}

          <div className="action-buttons">
            <button 
              className="resume-button"
              onClick={handleResumeClick}
            >
              <FaEye className="button-icon" /> Resume
            </button>
            <button 
              className={`navigate-button ${isNavigationEnabled ? 'enabled' : 'disabled'}`}
              onClick={handleNavigateClick}
              disabled={!isNavigationEnabled}
            >
              Navigate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;