import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Tabs, Tab, Badge, Modal } from 'react-bootstrap';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState({ totalRevenue: 0, orderCount: 0, month: '' });
  
  // Item Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('pizza');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [statusMessageDrafts, setStatusMessageDrafts] = useState({});
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBillOrder, setSelectedBillOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'ADMIN') {
      navigate('/login');
    } else {
      fetchItems();
      fetchOrders();
      fetchRevenue();
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/orders/revenue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRevenueSummary(response.data);
    } catch (error) {
      console.error('Error fetching revenue', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { name, description, price, category, imageUrl };

      if (editingId) {
        await axios.put(`${API_BASE}/api/items/${editingId}`, payload, config);
        setMessage('Item updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/items`, payload, config);
        setMessage('Item added successfully!');
      }

      resetForm();
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE}/api/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Item deleted successfully!');
        fetchItems(); 
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting item');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const customMessage = (statusMessageDrafts[orderId] || '').trim();
      const fallbackMessage =
        newStatus === 'Accepted' ? 'Your order has been accepted.' :
        newStatus === 'Rejected' ? 'Your order has been rejected.' :
        'Your order status has been updated.';

      await axios.put(`${API_BASE}/api/orders/${orderId}/status`,
        { status: newStatus, message: customMessage || fallbackMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessageDrafts(prev => ({ ...prev, [orderId]: '' }));
      fetchOrders();
      fetchRevenue();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setImageUrl(dataUrl || '');
      setImagePreview(dataUrl || '');
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setImageUrl(item.imageUrl || '');
    setImagePreview(item.imageUrl || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('pizza');
    setImageUrl('');
    setImagePreview('');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'warning';
      case 'Accepted': return 'success';
      case 'Rejected': return 'danger';
      case 'Preparing': return 'info';
      case 'Out for Delivery': return 'primary';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const handleGenerateBill = (order) => {
    setSelectedBillOrder(order);
    setShowBillModal(true);
  };

  const handlePrintBill = () => {
    window.print();
  };

  return (
    <Container className="mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0 fw-bold" style={{ color: '#0055A5' }}>Admin Control Panel</h2>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
      </div>
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-3 bg-primary text-white">
            <Card.Body>
              <Card.Title className="small text-uppercase">Monthly Revenue</Card.Title>
              <Card.Text className="display-6 fw-bold">₹{revenueSummary.totalRevenue || 0}</Card.Text>
              <small>{revenueSummary.month || 'Current month'}</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-3 bg-success text-white">
            <Card.Body>
              <Card.Title className="small text-uppercase">Orders Processed</Card.Title>
              <Card.Text className="display-6 fw-bold">{revenueSummary.orderCount || 0}</Card.Text>
              <small>Orders this month</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-3 bg-warning text-dark">
            <Card.Body>
              <Card.Title className="small text-uppercase">Live Activity</Card.Title>
              <Card.Text className="display-6 fw-bold">{orders.filter(order => ['Pending', 'Accepted', 'Preparing', 'Out for Delivery'].includes(order.orderStatus)).length}</Card.Text>
              <small>Open orders in queue</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="menu" className="mb-4">
        {/* TAB 1: MENU MANAGEMENT */}
        <Tab eventKey="menu" title="🍕 Menu Management">
          <Row className="mt-3">
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className={editingId ? "bg-warning text-dark fw-bold" : "bg-primary text-white fw-bold"} style={!editingId ? {backgroundColor: '#0055A5'} : {}}>
                  {editingId ? "Edit Menu Item" : "Add New Menu Item"}
                </Card.Header>
                <Card.Body>
                  {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Item Name</Form.Label>
                      <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (₹)</Form.Label>
                      <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="pizza">Pizza</option>
                        <option value="veg pizza">Veg Pizza</option>
                        <option value="non-veg pizza">Non-Veg Pizza</option>
                        <option value="sides">Sides</option>
                        <option value="beverages">Beverages</option>
                        <option value="combo">Combo</option>
                        <option value="others">Others</option>
                        <option value="new launches">New Launches</option>
                        <option value="bestsellers">Bestsellers</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Image Upload</Form.Label>
                      <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                      <Form.Text className="text-muted">You can upload a local image or paste a URL below.</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    </Form.Group>
                    {imagePreview && (
                      <div className="mb-3 text-center">
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '10px' }} />
                      </div>
                    )}
                    <Button variant={editingId ? "warning" : "primary"} type="submit" className="w-100 mb-2 fw-bold" style={!editingId ? {backgroundColor: '#E31837', borderColor: '#E31837'} : {}}>
                      {editingId ? "Update Item" : "Add Item"}
                    </Button>
                    {editingId && <Button variant="secondary" className="w-100" onClick={resetForm}>Cancel Edit</Button>}
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Header className="bg-dark text-white fw-bold">Current Menu</Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive align="middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item._id}>
                          <td><img src={item.imageUrl} alt={item.name} style={{width: '50px', height:'50px', objectFit:'cover', borderRadius:'5px'}} /></td>
                          <td className="fw-bold">{item.name}</td>
                          <td className="text-capitalize">{item.category}</td>
                          <td>₹{item.price}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(item)}>Edit</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(item._id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* TAB 2: ORDER MANAGEMENT */}
        <Tab eventKey="orders" title="📦 Order Management">
          <Card className="shadow-sm mt-3">
            <Card.Header className="bg-dark text-white fw-bold">Live Orders</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive align="middle">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{(order._id || '').substring(0,8)}...</td>
                      <td>
                        <strong>{order.user?.name}</strong><br/>
                        <small className="text-muted">{order.user?.email}</small>
                      </td>
                      <td>
                        <ul className="mb-0 ps-3">
                          {order.orderItems.map((oi, i) => (
                            <li key={i}><small>{oi.quantity}x {oi.name}</small></li>
                          ))}
                        </ul>
                      </td>
                      <td className="fw-bold">₹{order.totalAmount}</td>
                      <td><Badge bg={getStatusBadge(order.orderStatus)}>{order.orderStatus}</Badge></td>
                      <td>
                        <div className="d-flex flex-column gap-2">
                          <Button variant="outline-primary" size="sm" onClick={() => handleGenerateBill(order)}>
                            Generate Bill
                          </Button>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            size="sm"
                            placeholder="Optional message to customer"
                            value={statusMessageDrafts[order._id] ?? order.statusMessage ?? ''}
                            onChange={(e) => setStatusMessageDrafts(prev => ({ ...prev, [order._id]: e.target.value }))}
                            disabled={order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
                          />
                          <div className="d-flex gap-2">
                            <Button variant="success" size="sm" onClick={() => handleStatusChange(order._id, 'Accepted')} disabled={order.orderStatus === 'Accepted' || order.orderStatus === 'Rejected' || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}>
                              Accept
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleStatusChange(order._id, 'Rejected')} disabled={order.orderStatus === 'Accepted' || order.orderStatus === 'Rejected' || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}>
                              Reject
                            </Button>
                          </div>
                          <Form.Select 
                            size="sm" 
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </Form.Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan="6" className="text-center py-4">No orders received yet.</td></tr>}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <Modal show={showBillModal} onHide={() => setShowBillModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Invoice / Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBillOrder && (
            <div style={{ fontFamily: 'Arial, sans-serif' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="fw-bold mb-1">Pizzeria Bill</h4>
                  <p className="mb-1">Customer: {selectedBillOrder.user?.name || 'Customer'}</p>
                  <p className="mb-1">Email: {selectedBillOrder.user?.email || '-'}</p>
                </div>
                <div className="text-end">
                  <p className="mb-1">Order ID: {selectedBillOrder._id}</p>
                  <p className="mb-1">Date: {new Date(selectedBillOrder.createdAt).toLocaleString()}</p>
                  <p className="mb-1">Status: {selectedBillOrder.orderStatus}</p>
                </div>
              </div>

              <Table bordered size="sm" className="mb-3">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBillOrder.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Grand Total</span>
                <span>₹{selectedBillOrder.totalAmount}</span>
              </div>
              <p className="text-muted small mt-3 mb-0">Payment: {selectedBillOrder.paymentOption} • Delivery: {selectedBillOrder.deliveryMode}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBillModal(false)}>Close</Button>
          <Button variant="primary" onClick={handlePrintBill}>Print Bill</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;