import React, { useState } from 'react';
import { FaCheck, FaPhone, FaEnvelope, FaCalendarAlt, FaTruck, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

const OrderDetails = ({ order, onBack }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [activeDestination, setActiveDestination] = useState('pickup');
  console.log("ORDER PASSED TO OrderDetails:", order);

  // Función ultra segura para obtener datos
  const getValue = (obj, path, defaultValue = 'N/A') => {
    if (!obj) return defaultValue;
    try {
      const value = path.split('.').reduce((acc, key) => {
        if (acc && typeof acc === 'object' && key in acc) {
          return acc[key];
        }
        return undefined;
      }, obj);
      
      return value !== undefined && value !== null ? value : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  if (!order) return <div className="no-order">No order selected</div>;

  // Obtener datos con valores por defecto seguros
  const pickup = getValue(order, 'destinations.0', {});
  const dropoff = getValue(order, 'destinations.1', {});

  // Información de contacto segura
  const getContactInfo = (location) => ({
    name: getValue(location, 'contact_info.name') || 
          getValue(location, 'contact.name') || 'N/A',
    telephone: getValue(location, 'contact_info.telephone') || 
               getValue(location, 'contact_info.raw_telephone') || 
               getValue(location, 'contact.telephone') || 'N/A',
    email: getValue(location, 'contact_info.email') || 
           getValue(location, 'contact.email') || 'N/A'
  });

  const pickupContact = getContactInfo(pickup);
  const dropoffContact = getContactInfo(dropoff);

  // Información de carga segura
  const cargoInfo = {
    type: getValue(order, 'cargo.type', 'N/A'),
    description: getValue(order, 'cargo.description', 'N/A'),
    weight: getValue(order, 'cargo.weight.0', 'N/A'),
    weightUnit: getValue(order, 'cargo.weight_unit', 'N/A'),
    hazardousType: getValue(order, 'cargo.hazardous_type', null) // null si no existe
  };

  // Formateo de fecha seguro
  const formatDate = (dateValue) => {
    try {
      if (!dateValue) return 'N/A';
      const date = Array.isArray(dateValue) ? 
                   new Date(dateValue[0]) : 
                   new Date(dateValue);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
    } catch {
      return 'N/A';
    }
  };

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
            <div className={`status-circle ${getValue(order, 'status', 0) >= item.status ? 'active' : ''}`}>
              {getValue(order, 'status', 0) >= item.status ? <FaCheck /> : index + 1}
            </div>
            <div className="status-label">
              {item.label}
              {item.status === 3 && getValue(order, 'driver') && (
                <span className="status-detail"> by {getValue(order, 'driver.nickname')}</span>
              )}
            </div>
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
          {getValue(order, 'driver.driver_thumbnail') !== 'N/A' ? (
            <img src={getValue(order, 'driver.driver_thumbnail')} alt="Driver" />
          ) : (
            <span>{getValue(order, 'driver.nickname.0', '?').toUpperCase()}</span>
          )}
        </div>
        <p className="avatar-name">{getValue(order, 'driver.nickname', 'Driver')}</p>
      </div>

      <div className="order-details-header">
        <h2>Order #{getValue(order, 'order_number', 'N/A')}</h2>
        <span className="order-reference">Reference: {getValue(order, 'reference_number', 'N/A')}</span>
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
                <p className="address">{getValue(pickup, 'address', getValue(pickup, 'raw_address', 'No pickup address available'))}</p>
                <div className="contact-info">
                  <p><FaCalendarAlt /> {formatDate(getValue(pickup, 'start_date'))}</p>
                  <p><strong>Contact:</strong> {pickupContact.name}</p>
                  <p><FaPhone /> {pickupContact.telephone}</p>
                  <p><FaEnvelope /> {pickupContact.email}</p>
                </div>
              </>
            ) : (
              <>
                <h3>Dropoff Location</h3>
                <p className="address">{getValue(dropoff, 'address', getValue(dropoff, 'raw_address', 'No dropoff address available'))}</p>
                <div className="contact-info">
                  <p><FaCalendarAlt /> {formatDate(getValue(dropoff, 'start_date'))}</p>
                  <p><strong>Contact:</strong> {dropoffContact.name}</p>
                  <p><FaPhone /> {dropoffContact.telephone}</p>
                  <p><FaEnvelope /> {dropoffContact.email}</p>
                </div>
              </>
            )}
          </div>

          <div className="cargo-card">
            <h3>Cargo Information</h3>
            <p><strong>Type:</strong> {cargoInfo.type}</p>
            <p><strong>Description:</strong> {cargoInfo.description}</p>
            <p><strong>Weight:</strong> {cargoInfo.weight} {cargoInfo.weightUnit}</p>
            {cargoInfo.hazardousType && (
              <p><strong>Hazardous Type:</strong> {cargoInfo.hazardousType}</p>
            )}
          </div>
        </>
      ) : (
        <div className="timeline-card">
          {renderStatusTimeline()}
          <button
            className={`track-btn ${getValue(order, 'status', 0) >= 3 ? 'active' : 'disabled'}`}
            onClick={() => getValue(order, 'status', 0) >= 3 && console.log("Track Order")}
            disabled={getValue(order, 'status', 0) < 3}
          >
            Track Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;