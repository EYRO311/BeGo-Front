import React, { useState } from 'react';
import { FaCheck, FaPhone, FaEnvelope, FaCalendarAlt, FaTruck, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

const OrderDetails = ({ order, onBack }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [activeDestination, setActiveDestination] = useState('pickup');

  // Función para obtener datos de manera segura con múltiples alternativas
  const getSafeData = (obj, ...paths) => {
    if (!obj) return 'N/A'; // Manejo de objeto undefined
    for (const path of paths) {
      const value = path.split('.').reduce((acc, key) => acc && acc[key], obj);
      if (value !== undefined && value !== null) return value;
    }
    return 'N/A';
  };

  if (!order) return <div className="no-order">No order selected</div>;

  // Obtener pickup y dropoff con múltiples alternativas
  const pickup = order.destinations?.[0] || order.pickup || {};
  const dropoff = order.destinations?.[1] || order.dropoff || {};

  // Obtener información de contacto con múltiples alternativas
  const getContactInfo = (location) => ({
    name: getSafeData(location, 'contact_info.name', 'contact.name', 'contact_info.contact_name'),
    telephone: getSafeData(location, 'contact_info.telephone', 'contact.telephone', 'contact_info.raw_telephone', 'contact.phone'),
    email: getSafeData(location, 'contact_info.email', 'contact.email')
  });

  const pickupContact = getContactInfo(pickup);
  const dropoffContact = getContactInfo(dropoff);

  // Obtener información de carga
  const cargoType = getSafeData(order, 'cargo.type', 'load_type');
  const cargoDescription = getSafeData(order, 'cargo.description', 'load_description');
  const cargoWeight = getSafeData(order, 'cargo.weight.0', 'cargo.weight', 'weight');
  const cargoWeightUnit = getSafeData(order, 'cargo.weight_unit', 'weight_unit', 'unit') || 'kg';
  const hazardousType = getSafeData(order, 'cargo.hazardous_type');

  // Formatear fecha con múltiples alternativas
  const formatDate = (dateObj) => {
    if (!dateObj) return 'N/A';
    try {
      const date = Array.isArray(dateObj) ? new Date(dateObj[0]) : new Date(dateObj);
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
            <div className={`status-circle ${order.status >= item.status ? 'active' : ''}`}>
              {order.status >= item.status ? <FaCheck /> : index + 1}
            </div>
            <div className="status-label">
              {item.label}
              {item.status === 3 && order.driver && (
                <span className="status-detail"> by {order.driver.nickname}</span>
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
          {getSafeData(order.driver, 'driver_thumbnail', 'thumbnail') !== 'N/A' ? (
            <img src={getSafeData(order.driver, 'driver_thumbnail', 'thumbnail')} alt="Driver" />
          ) : (
            <span>{getSafeData(order.driver, 'nickname.0', 'name.0', 'driver_name.0')?.toUpperCase() || '?'}</span>
          )}
        </div>
        <p className="avatar-name">{getSafeData(order.driver, 'nickname', 'name', 'driver_name') || 'Driver'}</p>
      </div>

      <div className="order-details-header">
        <h2>Order #{order.order_number || 'N/A'}</h2>
        <span className="order-reference">Reference: {getSafeData(order, 'reference_number', 'ref_number', 'order_ref')}</span>
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
                <p className="address">{getSafeData(pickup, 'address', 'raw_address', 'location')}</p>
                <div className="contact-info">
                  <p><FaCalendarAlt /> {formatDate(getSafeData(pickup, 'start_date', 'date', 'pickup_date'))}</p>
                  <p><strong>Contact:</strong> {pickupContact.name}</p>
                  <p><FaPhone /> {pickupContact.telephone}</p>
                  <p><FaEnvelope /> {pickupContact.email}</p>
                </div>
              </>
            ) : (
              <>
                <h3>Dropoff Location</h3>
                <p className="address">{getSafeData(dropoff, 'address', 'raw_address', 'location')}</p>
                <div className="contact-info">
                  <p><FaCalendarAlt /> {formatDate(getSafeData(dropoff, 'start_date', 'date', 'dropoff_date'))}</p>
                  <p><strong>Contact:</strong> {dropoffContact.name}</p>
                  <p><FaPhone /> {dropoffContact.telephone}</p>
                  <p><FaEnvelope /> {dropoffContact.email}</p>
                </div>
              </>
            )}
          </div>

          <div className="cargo-card">
            <h3>Cargo Information</h3>
            <p><strong>Type:</strong> {cargoType}</p>
            <p><strong>Description:</strong> {cargoDescription}</p>
            <p><strong>Weight:</strong> {cargoWeight} {cargoWeightUnit}</p>
            {hazardousType !== 'N/A' && (
              <p><strong>Hazardous Type:</strong> {hazardousType}</p>
            )}
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