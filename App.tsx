import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.tsx';
import CustomerDashboard from './components/CustomerDashboard.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import { useV2GSystem } from './hooks/useV2GSystem.ts';
import Notification from './components/Notification.tsx';
import type { ViewMode, NotificationMessage, Customer, Vehicle, PreviousCustomer } from './types.ts';
import { MOCK_CUSTOMERS } from './constants.ts';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [previousCustomers, setPreviousCustomers] = useState<PreviousCustomer[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('v2g-previous-customers');
      if (stored) {
        setPreviousCustomers(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load previous customers from localStorage", error);
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateCurrentUserSavings = useCallback((savingsDelta: number) => {
      if (!currentUser) return;
      
      const updatedUser = { ...currentUser, totalSavings: currentUser.totalSavings + savingsDelta };
      setCurrentUser(updatedUser);
      setCustomers(prevCustomers => 
        prevCustomers.map(c => c.id === currentUser.id ? updatedUser : c)
      );
  }, [currentUser]);

  const system = useV2GSystem(currentUser, customers, updateCurrentUserSavings, setNotification);

  const handleSuccessfulCustomerLogin = (customer: Customer) => {
    setCurrentUser(customer);
    showNotification(`Welcome, ${customer.name}! Your session has started.`, 'success');
    setViewMode('customer');

    const customerProfile: PreviousCustomer = {
      name: customer.name,
      email: customer.email,
      vehicle: customer.vehicle
    };

    setPreviousCustomers(prev => {
      const existingIndex = prev.findIndex(p => p.email.toLowerCase() === customerProfile.email.toLowerCase());
      let newList;
      
      if (existingIndex > -1) {
        // Move existing customer to the front
        const updatedList = [...prev];
        const item = updatedList.splice(existingIndex, 1)[0];
        newList = [{...item, ...customerProfile}, ...updatedList]; // Update with latest info
      } else {
        // Add new customer to the front
        newList = [customerProfile, ...prev];
      }

      if (newList.length > 5) newList = newList.slice(0, 5);
      
      try {
        localStorage.setItem('v2g-previous-customers', JSON.stringify(newList));
      } catch (error) {
        console.error("Failed to save previous customers to localStorage", error);
      }
      
      return newList;
    });
  };

  const handleLogin = (details: { mode: 'customer' | 'admin'; data: any }) => {
    setLoginError(null);
    if (details.mode === 'admin') {
      if (details.data.name.toLowerCase().trim() === 'sujan') {
        setCurrentUser(null);
        setViewMode('admin');
        showNotification('Welcome, Admin Sujan!', 'success');
      } else {
        setLoginError('Invalid admin credentials.');
      }
    } else { // Customer login
      const { email, name, model, year } = details.data;
      const existingCustomer = customers.find(c => c.email.toLowerCase() === email.toLowerCase().trim());

      if (existingCustomer) {
        handleSuccessfulCustomerLogin(existingCustomer);
      } else {
        // This branch is for new user registration
        const newCustomer: Customer = {
          id: `CUST-${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          vehicle: {
            make: 'New Vehicle',
            model: model.trim(),
            year: parseInt(year, 10),
            plate: `NEW-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            capacityKwh: 70,
            maxPowerKw: 11,
            initialSoc: 0.4,
          },
          totalSavings: 0,
        };
        setCustomers([...customers, newCustomer]);
        handleSuccessfulCustomerLogin(newCustomer);
      }
    }
  };

  const handleLogout = () => {
    showNotification(`You have been logged out.`, 'info');
    setCurrentUser(null);
    if (system.isSimulating) {
      system.setIsSimulating(false);
    }
  };

  const handleUpdateDetails = (customerId: string, newVehicle: Omit<Vehicle, 'plate' | 'make' | 'capacityKwh' | 'maxPowerKw' | 'initialSoc' >) => {
    let updatedUser: Customer | null = null;
    const updatedCustomers = customers.map(c => {
        if (c.id === customerId) {
            updatedUser = {
                ...c,
                vehicle: {
                    ...c.vehicle,
                    model: newVehicle.model,
                    year: newVehicle.year,
                }
            };
            return updatedUser;
        }
        return c;
    });
    setCustomers(updatedCustomers);
    if(currentUser?.id === customerId && updatedUser) {
        setCurrentUser(updatedUser);
    }
    showNotification("Vehicle details updated successfully!", 'success');
  };

  const renderContent = () => {
    if (viewMode === 'admin') {
      return <AdminDashboard 
                {...system} 
                showNotification={showNotification}
             />;
    }
    if (currentUser) {
      return <CustomerDashboard customer={currentUser} slots={system.slots} bookSlot={system.bookSlot} showNotification={showNotification} onUpdateDetails={handleUpdateDetails}/>;
    }
    return <Login onLogin={handleLogin} loginError={loginError} previousCustomers={previousCustomers} />;
  }

  return (
    <div className="min-h-screen bg-grid-blue-50/50 font-sans text-gray-800">
      <Header viewMode={viewMode} setViewMode={setViewMode} currentUser={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
      <Notification notification={notification} />
    </div>
  );
};

export default App;