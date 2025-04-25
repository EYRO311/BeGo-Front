import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';

const Tabs = ({ onOrderSelect }) => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const url = activeTab === "Upcoming" 
          ? "https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders/upcoming"
          : "https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders";
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data?.status === 200) {
          setOrders(Array.isArray(data.result) ? data.result : [data.result]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  const filteredOrders = orders.filter(order => 
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="tabs-container">
      <div className="header">
        <h2>Cargo Orders</h2>
      </div>

      <div className="tabs-navigation">
        {["Upcoming", "Completed", "Past"].map(tab => (
          <div 
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="search-container">
        <span>🔍</span>
        <input 
          type="text" 
          placeholder="Search order number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <OrderCard 
              key={order._id} 
              order={order} 
              isExpanded={expandedOrderId === order._id}
              onToggleExpand={() => toggleExpandOrder(order._id)}
              onDetailsClick={() => onOrderSelect(order)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tabs;