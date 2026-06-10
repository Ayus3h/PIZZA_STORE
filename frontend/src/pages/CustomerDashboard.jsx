import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Badge, ListGroup, Alert, Navbar } from 'react-bootstrap';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CustomerDashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState('Home Delivery');
  const [paymentOption, setPaymentOption] = useState('Cash on Delivery');
  const [notifications, setNotifications] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const navigate = useNavigate();
  const categories = ['all', 'pizza', 'veg pizza', 'non-veg pizza', 'sides', 'beverages', 'combo', 'others', 'new launches', 'bestsellers'];

  // --- Domino's Theme Colors ---
  const theme = {
    blue: '#0f782f',
    red: '#18e392',
    bg: '#f8f9fa'
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else {
      fetchItems();
      fetchOrders();
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/items`);
      setItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching items', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      showStatusNotifications(response.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  const showStatusNotifications = (ordersList) => {
    try {
      const seenMessages = JSON.parse(localStorage.getItem('seenOrderMessages') || '{}');
      const updatedSeen = { ...seenMessages };
      let hasNewMessage = false;

      ordersList.forEach((order) => {
        if (order.statusMessage && updatedSeen[order._id] !== order.statusMessage) {
          pushNotification(`Order update: ${order.statusMessage}`, order.orderStatus === 'Rejected' ? 'danger' : 'info');
          updatedSeen[order._id] = order.statusMessage;
          hasNewMessage = true;
        }
      });

      if (hasNewMessage) {
        localStorage.setItem('seenOrderMessages', JSON.stringify(updatedSeen));
      }
    } catch (error) {
      console.error('Unable to sync order notifications', error);
    }
  };

  useEffect(() => {
    let result = items;
    if (selectedCategory !== 'all') result = result.filter(item => item.category === selectedCategory);
    if (searchQuery) result = result.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredItems(result);
  }, [searchQuery, selectedCategory, items]);

  const addToCart = (item) => {
    const existingIndex = cart.findIndex(cartItem => cartItem._id === item._id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => setCart(cart.filter(item => item._id !== itemId));
  const calculateTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const pushNotification = (message, type = 'success') => {
    const newNotif = { id: Date.now(), message, type };
    setNotifications(prev => [newNotif, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== newNotif.id)), 5000);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      pushNotification('Order cancelled successfully.', 'warning');
      fetchOrders();
    } catch (error) {
      pushNotification(error.response?.data?.message || 'Unable to cancel order.', 'danger');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        orderItems: cart.map(cItem => ({ name: cItem.name, quantity: cItem.quantity, price: cItem.price, item: cItem._id })),
        totalAmount: calculateTotal(),
        paymentOption,
        deliveryMode
      };
      const response = await axios.post(`${API_BASE}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      pushNotification(`Order Placed Successfully! (Order ID: ${response.data?._id?.substring(0,6) || ''})`, 'success');
      setCart([]);
      fetchOrders();
    } catch (error) {
      pushNotification(error.response?.data?.message || 'Failed to place order.', 'danger');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
      {/* Domino's Style Header */}
      <Navbar style={{ backgroundColor: theme.blue }} variant="dark" className="px-4 shadow-sm mb-4">
        <Navbar.Brand className="fw-bold fs-4">🍕 Pizzeria</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="light" size="sm" onClick={handleLogout} className="fw-bold" style={{ color: theme.blue }}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="px-lg-5">
        <Row className="g-4">
          
          {/* LEFT COLUMN: Menu Items */}
          {/* Changed to lg=8 so it takes up exactly 2/3 of the screen on large monitors, preventing overlap */}
          <Col lg={8} md={12}>
            
            {/* Search & Filters */}
            <div className="bg-white p-3 rounded shadow-sm mb-4">
              <Form.Control 
                type="text" 
                placeholder="🔍 Search for pizzas, sides, beverages..." 
                className="mb-3" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button 
                    key={cat} 
                    variant={selectedCategory === cat ? 'primary' : 'outline-dark'} 
                    size="sm"
                    className="text-capitalize fw-bold rounded-pill px-3"
                    style={selectedCategory === cat ? { backgroundColor: theme.blue, borderColor: theme.blue } : {}}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pizza Grid */}
            <Row>
              {filteredItems.map((item) => (
                <Col key={item._id} xl={4} md={6} sm={12} className="mb-4">
                  <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                    <Card.Img 
                      variant="top" 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'} 
                      style={{ height: '200px', objectFit: 'cover' }} 
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fw-bold">{item.name}</Card.Title>
                      <Card.Text className="text-muted small mb-3 flex-grow-1">{item.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold fs-5">₹{item.price}</span>
                        <Button 
                          style={{ backgroundColor: theme.red, borderColor: theme.red }} 
                          className="fw-bold px-4 rounded-pill"
                          onClick={() => addToCart(item)}
                        >
                          ADD
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {filteredItems.length === 0 && <p className="text-center text-muted mt-5">No items found.</p>}
            </Row>
          </Col>

          {/* RIGHT COLUMN: Sticky Cart */}
          <Col lg={4} md={12}>
            <div className="sticky-top" style={{ top: '20px', zIndex: 100 }}>
              
              {notifications.map(n => <Alert key={n.id} variant={n.type} className="shadow-sm">{n.message}</Alert>)}

              <Card className="shadow-sm border-0 rounded-3 mb-4">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-2">
                  <h5 className="fw-bold mb-0 text-center">Your Cart</h5>
                </Card.Header>
                <Card.Body>
                  {cart.length > 0 ? (
                    <>
                      <ListGroup variant="flush" className="mb-3">
                        {cart.map((cartItem) => (
                          <ListGroup.Item key={cartItem._id} className="px-0 d-flex justify-content-between align-items-center border-bottom">
                            <div>
                              <div className="fw-bold">{cartItem.name}</div>
                              <small className="text-muted">₹{cartItem.price} x {cartItem.quantity}</small>
                            </div>
                            <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => removeFromCart(cartItem._id)}>✕</Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                      
                      <div className="bg-light p-3 rounded mb-3">
                        <Form.Group className="mb-2">
                          <Form.Label className="small fw-bold text-muted">Delivery Mode</Form.Label>
                          <Form.Select size="sm" value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value)}>
                            <option>Home Delivery</option>
                            <option>Takeaway</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="small fw-bold text-muted">Payment</Form.Label>
                          <Form.Select size="sm" value={paymentOption} onChange={(e) => setPaymentOption(e.target.value)}>
                            <option>Cash on Delivery</option>
                            <option>Credit Card</option>
                            <option>UPI</option>
                          </Form.Select>
                        </Form.Group>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                        <h6 className="fw-bold mb-0">Grand Total</h6>
                        <h5 className="fw-bold mb-0" style={{ color: theme.blue }}>₹{calculateTotal()}</h5>
                      </div>
                      
                      <Button 
                        style={{ backgroundColor: theme.red, borderColor: theme.red }} 
                        className="w-100 py-2 fw-bold text-uppercase fs-6 rounded-pill" 
                        onClick={handleCheckout} 
                        disabled={isCheckingOut}
                      >
                        {isCheckingOut ? 'Processing...' : 'Checkout'}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <div className="fs-1 mb-2">🛒</div>
                      Your cart is empty. <br/> Please add some items from the menu.
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-2">
                  <h5 className="fw-bold mb-0">My Orders</h5>
                </Card.Header>
                <Card.Body>
                  {orders.length === 0 ? (
                    <p className="text-muted mb-0">You have no orders yet.</p>
                  ) : (
                    <ListGroup variant="flush">
                      {orders.slice(0, 5).map((order) => (
                        <ListGroup.Item key={order._id} className="px-0">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div>
                              <strong>#{(order._id || '').slice(-6).toUpperCase()}</strong>
                              <div className="small text-muted">{(order.orderItems || []).map(item => `${item.quantity}x ${item.name}`).join(', ')}</div>
                              <div className="small text-muted">₹{order.totalAmount} • {order.paymentOption} • {order.deliveryMode}</div>
                              {order.statusMessage && <div className="small text-primary mt-1">Message: {order.statusMessage}</div>}
                            </div>
                            <Badge bg={
                              order.orderStatus === 'Cancelled' || order.orderStatus === 'Rejected' ? 'danger' :
                              order.orderStatus === 'Accepted' || order.orderStatus === 'Preparing' || order.orderStatus === 'Out for Delivery' ? 'primary' :
                              'success'
                            }>{order.orderStatus}</Badge>
                          </div>
                          {order.orderStatus === 'Pending' && (
                            <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => handleCancelOrder(order._id)}>Cancel</Button>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default CustomerDashboard;