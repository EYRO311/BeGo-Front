import React, { useState } from 'react';
import Tabs from './components/tabs';
import OrderDetails from './components/OrderDetails';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('tabs');
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="app-container">
      {currentView === 'tabs' ? (
        <Tabs 
          onOrderSelect={(order) => {
            setSelectedOrder(order);
            setCurrentView('details');
          }} 
        />
      ) : (
        <OrderDetails 
          order={selectedOrder} 
          onBack={() => setCurrentView('tabs')} 
        />
      )}
    </div>
  );
}

export default App;