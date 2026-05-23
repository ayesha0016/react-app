// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api/products';

function App() {
  // State management
  const [products, setProducts] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });
  const [submitError, setSubmitError] = useState('');

  // Fetch product list on component load
  const fetchProducts = async () => {
    try {
      const response = await axios.get(BACKEND_URL);
      setProducts(response.data);
      setIsOnline(true); // Server responded successfully
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsOnline(false); // Flag server status as Offline
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Track text input updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form data to Node Server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      const response = await axios.post(BACKEND_URL, formData);
      
      // Update state instantly with the newly returned product
      setProducts([...products, response.data]);
      setIsOnline(true);
      
      // Reset Form fields
      setFormData({ name: '', price: '', category: '' });
    } catch (error) {
      console.error("Error posting data:", error);
      setIsOnline(false); // Catch submission dropouts if the server goes down midway
      setSubmitError('Failed to save product. Check server connection.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Banner & Status Block */}
      <header style={styles.header}>
        <h1>Product Management Dashboard</h1>
        <div style={styles.statusBox}>
          Server Status: {' '}
          <span style={{ 
            ...styles.statusBadge, 
            backgroundColor: isOnline ? '#22c55e' : '#ef4444' 
          }}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>

      <div style={styles.layoutGrid}>
        {/* Creation Form Block */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Add New Product</h2>
          {submitError && <p style={styles.errorText}>{submitError}</p>}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={!isOnline} style={{
              ...styles.button,
              backgroundColor: isOnline ? '#4f46e5' : '#9ca3af',
              cursor: isOnline ? 'pointer' : 'not-allowed'
            }}>
              Add Product
            </button>
          </form>
        </section>

        {/* Dynamic Display Inventory Grid */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Current Inventory</h2>
          {!isOnline && (
            <p style={styles.warningText}>
              ⚠️ Displaying cached data. Reconnecting to backend...
            </p>
          )}
          
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Category</th>
                <th style={styles.tableHeader}>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{product.id}</td>
                  <td style={styles.tableCell}><strong>{product.name}</strong></td>
                  <td style={styles.tableCell}>{product.category}</td>
                  <td style={styles.tableCell}>${product.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

// Simple embedded layout styling objects
const styles = {
  container: { fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '20px', color: '#1f2937' },
  header: { display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  statusBox: { marginLeft: 'auto', fontSize: '1.1rem', fontWeight: '600' },
  statusBadge: { color: '#fff', padding: '5px 12px', borderRadius: '15px', fontSize: '0.9rem', marginLeft: '5px' },
  layoutGrid: { display: 'grid', gridTemplateColumns: 'window.innerWidth > 768 ? "1fr 2fr" : "1fr"', gap: '30px' },
  card: { background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  sectionTitle: { marginTop: 0, borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#111827' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  input: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '1rem' },
  button: { color: '#fff', padding: '10px', borderRadius: '4px', border: 'none', fontSize: '1rem', fontWeight: 'bold', transition: 'background 0.2s' },
  errorText: { color: '#ef4444', background: '#fee2e2', padding: '10px', borderRadius: '4px', margin: '0 0 15px 0' },
  warningText: { color: '#b45309', background: '#fef3c7', padding: '8px', borderRadius: '4px', margin: '0 0 15px 0', fontSize: '0.9rem' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeadRow: { borderBottom: '2px solid #e5e7eb' },
  tableHeader: { padding: '12px 8px', color: '#4b5563', fontWeight: '600' },
  tableRow: { borderBottom: '1px solid #f3f4f6' },
  tableCell: { padding: '12px 8px' }
};

export default App;