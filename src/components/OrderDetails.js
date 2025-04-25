import React, { useState } from 'react';
import { FaCheck, FaPhone, FaEnvelope, FaCalendarAlt, FaTruck, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

const OrderDetails = ({ order, onBack }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [activeDestination, setActiveDestination] = useState('pickup');

  if (!order) return <div className="no-order">No order selected</div>;

  const pickup = order.destinations?.[0];
  const dropoff = order.destinations?.[1];

  const renderStatusTimeline = () => {
    const statusItems = [
      { label: 'Created Order', status: 1 },
      { label: 'Accepted Order', status: 2 },
      { label: 'Pickup set up', status: 3 },
      { label: 'Pickup Completed', status: 4 },
      { label: 'Delivery Completed', status: 5 }
    ];

    return (
      <div className="status-timeline">
        {statusItems.map((item, index) => (
          <div key={index} className="status-item">
            <div className={`status-circle ${order.status >= item.status ? 'active' : ''}`}>
              {order.status >= item.status ? <FaCheck /> : index + 1}
            </div>
            <div className="status-label">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="order-details-container">
      <button className="back-button" onClick={onBack}>
        <FaArrowLeft /> Back
      </button>
      <div className="avatar-container">
  <div className="avatar-circle">
    {/* Si no hay imagen, muestra las iniciales o ícono */}
    {order.driver?.profile_image_url ? (
      <img src={order.driver.profile_image_url} alt="Driver" />
    ) : (
      <span>{order.driver?.nickname?.charAt(0)?.toUpperCase() || '?'}</span>
    )}
  </div>
  <p className="avatar-name">{order.driver?.nickname || 'Driver'}</p>
</div>

      <div className="order-details-header">
        <h2>Order #{order.order_number}</h2>
        <span className="order-reference">Reference: {order.reference_number || 'N/A'}</span>
      </div>

      <div className="details-tabs">
        <button
          className={`details-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`details-tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </div>

      {activeTab === 'details' ? (
        <>
          <div className="destination-switch">
            <button
              className={`switch-btn ${activeDestination === 'pickup' ? 'active' : ''}`}
              onClick={() => setActiveDestination('pickup')}
            >
              <FaTruck /> Pickup
            </button>
            <button
              className={`switch-btn ${activeDestination === 'dropoff' ? 'active' : ''}`}
              onClick={() => setActiveDestination('dropoff')}
            >
              <FaMapMarkerAlt /> Dropoff
            </button>
          </div>

          <div className="destination-card">
            {activeDestination === 'pickup' ? (
              <>
                <h3>Pickup Location</h3>
                <p className="address">{pickup?.address || 'No pickup address available'}</p>
                <div className="contact-info">
                  <p><FaCalendarAlt /> {pickup?.startDate ? new Date(pickup.startDate).toLocaleString() : 'N/A'}</p>
                  <p><strong>Contact:</strong> {pickup?.contact_info?.name || 'N/A'}</p>
                  <p><FaPhone /> {pickup?.contact_info?.telephone || 'N/A'}</p>
                  <p><FaEnvelope /> {pickup?.contact_info?.email || 'N/A'}</p>
                </div>
              </>
            ) : (
              <>
                <h3>Dropoff Location</h3>
                <p className="address">{dropoff?.address || 'No dropoff address available'}</p>
                <div className="contact-info">
                  <p><FaCalendarAlt /> {dropoff?.startDate ? new Date(dropoff.startDate).toLocaleString() : 'N/A'}</p>
                  <p><strong>Contact:</strong> {dropoff?.contact_info?.name || 'N/A'}</p>
                  <p><FaPhone /> {dropoff?.contact_info?.telephone || 'N/A'}</p>
                  <p><FaEnvelope /> {dropoff?.contact_info?.email || 'N/A'}</p>
                </div>
              </>
            )}
          </div>

          <div className="cargo-card">
            <h3>Cargo Information</h3>
            <p><strong>Type:</strong> {order.cargo?.type || 'N/A'}</p>
            <p><strong>Description:</strong> {order.cargo?.description || 'N/A'}</p>
            <p><strong>Weight:</strong> {order.cargo?.weigth?.[0] || '0'} {order.cargo?.weight_unit || 'kg'}</p>
          </div>
        </>
      ) : (
        <div className="timeline-card">
          {renderStatusTimeline()}
          <button
            className={`track-btn ${order.status >= 3 ? 'active' : 'disabled'}`}
            onClick={() => order.status >= 3 && console.log("Track Order")}
            disabled={order.status < 3}
          >
            Track Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
