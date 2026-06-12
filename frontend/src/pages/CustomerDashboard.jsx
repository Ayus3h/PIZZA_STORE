import { useState, useEffect, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  ListGroup,
  Alert,
  Navbar,
  DropdownButton,
  Dropdown,
  ProgressBar,
  Modal,
} from 'react-bootstrap';
import ProfilePanel from './ProfilePanel';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CustomerDashboard = () => {
  const [items, setItems] = useState([]);


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState('Home Delivery');
  const [paymentOption, setPaymentOption] = useState('Cash on Delivery');

  const [notifications, setNotifications] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const navigate = useNavigate();
  const categories = [
    'all',
    'pizza',
    'veg pizza',
    'non-veg pizza',
    'sides',
    'beverages',
    'combo',
    'others',
    'new launches',
    'bestsellers',
  ];

  // --- Domino's Theme Colors & Dark Mode ---
  const theme = {
    blue: darkMode ? '#0a4f1e' : '#0f782f',
    red: darkMode ? '#109861' : '#18e392',
    bg: darkMode ? '#121212' : '#f8f9fa',
  };

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else {
      fetchItems();
      fetchOrders();

      const intervalId = setInterval(() => {
        fetchOrders();
      }, 5000);

      return () => clearInterval(intervalId);
    }
    // disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items', error);
    }
  };


  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
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
      let lastMessage = '';

      ordersList.forEach((order) => {
        if (order.statusMessage && updatedSeen[order._id] !== order.statusMessage) {
          pushNotification(
            'Order update: ' + order.statusMessage,
            order.orderStatus === 'Rejected' ? 'danger' : 'info'
          );
          lastMessage =
            'Order #' +
            (order._id || '').slice(-6).toUpperCase() +
            ' is now ' +
            order.orderStatus +
            '.\nMessage: ' +
            order.statusMessage;
          updatedSeen[order._id] = order.statusMessage;
          hasNewMessage = true;
        }
      });

      if (hasNewMessage) {
        localStorage.setItem('seenOrderMessages', JSON.stringify(updatedSeen));
        if (lastMessage) {
          setPopupMessage(lastMessage);
          setShowPopup(true);
        }
      }
    } catch (error) {
      console.error('Unable to sync order notifications', error);
    }
  };

  const filteredItems = useMemo(() => {
    let result = items || [];

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => (item.name || '').toLowerCase().includes(q));
    }

    // Avoid mutating the array in-place.
    result = [...result];

    if (sortBy === 'price-asc') result = result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result = result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') result = result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sortBy === 'name-desc') result = result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));

    return result;
  }, [items, selectedCategory, searchQuery, sortBy]);


  const addToCart = (item) => {
    const existingIndex = cart.findIndex((cartItem) => cartItem._id === item._id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => setCart(cart.filter((item) => item._id !== itemId));
  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const pushNotification = (message, type = 'success') => {
    const newNotif = { id: Date.now(), message, type };
    setNotifications((prev) => [newNotif, ...prev]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id)), 5000);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        orderItems: cart.map((cItem) => ({
          name: cItem.name,
          quantity: cItem.quantity,
          price: cItem.price,
          item: cItem._id,
        })),
        totalAmount: calculateTotal(),
        paymentOption,
        deliveryMode,
      };
      await axios.post(`${API_BASE}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      pushNotification('Order Placed Successfully!', 'success');
      setCart([]);
      fetchOrders();
    } catch (error) {
      pushNotification(error.response?.data?.message || 'Failed to place order.', 'danger');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const getOrderProgress = (status) => {
    switch (status) {
      case 'Pending':
        return { percent: 20, variant: 'warning' };
      case 'Accepted':
        return { percent: 40, variant: 'info' };
      case 'Preparing':
        return { percent: 60, variant: 'primary' };
      case 'Out for Delivery':
        return { percent: 80, variant: 'primary' };
      case 'Delivered':
        return { percent: 100, variant: 'success' };
      default:
        return { percent: 0, variant: 'secondary' };
    }
  };

  const pickRandom = (arr, count = 1) => {
    const copy = [...arr];
    copy.sort(() => Math.random() - 0.5);
    return copy.slice(0, count);
  };

  const normalizeEmotionToCategories = (emotion) => {
    // Simple, deterministic mapping (no Gemini needed for cart correctness)
    // Ensure categories exist in your DB/items.
    switch (emotion) {
      case 'sad':
        return ['comfort', 'combo', 'pizza', 'bestsellers', 'others', 'all'];
      case 'lucky':
        return ['bestsellers', 'combo', 'new launches', 'pizza', 'all'];
      case 'surprise':
        return ['new launches', 'bestsellers', 'combo', 'pizza', 'all'];
      default:
        return ['all'];
    }
  };

  const handleEmotionRecommendation = (emotion) => {
    try {
      // Use `items` as source , so recommendation still works
      // even if user is filtered by category/search.
      const source = items || [];
      if (source.length === 0) return;

      const preferredCategories = normalizeEmotionToCategories(emotion);

      // Filter by the first matching category that exists in the data.
      const byCategory = (cat) =>
        source.filter((it) => String(it.category || '').toLowerCase() === String(cat || '').toLowerCase());

      let candidates = [];
      for (const cat of preferredCategories) {
        if (cat === 'all') continue;
        const match = byCategory(cat);
        if (match.length) {
          candidates = match;
          break;
        }
      }

      // Fallback: if none found, use everything.
      if (!candidates.length) candidates = source;

      // Pick 2 items for better “start cart” experience.
      const chosen = pickRandom(candidates, 2);

      chosen.forEach((item) => addToCart(item));

      const label =
        emotion === 'sad' ? 'Feeling Sad' : emotion === 'lucky' ? 'Feeling Lucky' : 'Surprise Me';
      pushNotification(`🎭 ${label}: Added ${chosen.length} recommendations to your cart!`, 'success');

      // Also update filters so user sees the added items in the list.
      if (chosen[0]?.category) setSelectedCategory(chosen[0].category);
    } catch (err) {
      console.error('handleEmotionRecommendation error:', err);
      pushNotification('Unable to get recommendation. Please try again.', 'danger');
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        minHeight: '100vh',
        color: darkMode ? '#ffffff' : '#000000',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Navbar style={{ backgroundColor: theme.blue }} variant="dark" className="px-4 shadow-sm mb-4">
        <Navbar.Brand className="fw-bold fs-4">🍕 Pizzeria</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end gap-3">
          <Button
            variant={darkMode ? 'outline-light' : 'outline-dark'}
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
            className="fw-bold text-white border-white"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={handleLogout}
            className="fw-bold"
            style={{ color: theme.blue }}
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="px-lg-5">
        <Row className="g-4">
          <Col lg={8} md={12}>
            <div className={`p-3 rounded shadow-sm mb-4 ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}>
              <Row className="mb-3 g-2">
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="🔍 Search for pizzas, sides, beverages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={darkMode ? 'bg-secondary text-white border-secondary' : ''}
                  />
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={darkMode ? 'bg-secondary text-white border-secondary' : ''}
                  >
                    <option value="">Sort By: Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </Form.Select>
                </Col>
              </Row>

              <div className="d-none d-md-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'primary' : darkMode ? 'outline-light' : 'outline-dark'}
                    size="sm"
                    className="text-capitalize fw-bold rounded-pill px-3"
                    style={selectedCategory === cat ? { backgroundColor: theme.blue, borderColor: theme.blue } : {}}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="d-md-none">
                  <DropdownButton
                    variant={darkMode ? 'outline-light' : 'outline-dark'}
                    title={`🍔 Category: ${(selectedCategory ?? 'all').toString().toUpperCase()}`}
                    className="w-100 mobile-category-dropdown"
                  >
                    {categories.map((cat) => (
                      <Dropdown.Item
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="text-capitalize"
                      >
                        {cat}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
              </div>
            </div>

            {/* Emotion Recommendation Section */}
            <div className={`p-3 rounded shadow-sm mb-4 ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}>
              <h6 className="fw-bold mb-3 text-center">Confused? Let your mood decide!</h6>
              <Row className="g-2">
                <Col xs={4}>
                  <Card 
                    className={`text-center h-100 shadow-sm border-0 ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => handleEmotionRecommendation('sad')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Card.Body className="p-2 d-flex flex-column justify-content-center">
                      <div className="fs-2 mb-1">😢</div>
                      <small className="fw-bold">Feeling Sad</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={4}>
                  <Card 
                    className={`text-center h-100 shadow-sm border-0 ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => handleEmotionRecommendation('lucky')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Card.Body className="p-2 d-flex flex-column justify-content-center">
                      <div className="fs-2 mb-1">🍀</div>
                      <small className="fw-bold">Feeling Lucky</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={4}>
                  <Card 
                    className={`text-center h-100 shadow-sm border-0 ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => handleEmotionRecommendation('surprise')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Card.Body className="p-2 d-flex flex-column justify-content-center">
                      <div className="fs-2 mb-1">🎁</div>
                      <small className="fw-bold">Surprise Me</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <Row>
              {filteredItems.map((item) => (
                <Col key={item._id} xl={4} md={6} sm={12} className="mb-4">
                  <Card className={`h-100 shadow-sm border-0 rounded-3 overflow-hidden ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}>
                    <Card.Img
                      variant="top"
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fw-bold">{item.name}</Card.Title>
                      <Card.Text className={`small mb-3 flex-grow-1 ${darkMode ? 'text-light' : 'text-muted'}`}>{item.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold fs-5">₹{item.price}</span>
                        <Button style={{ backgroundColor: theme.red, borderColor: theme.red }} className="fw-bold px-4 rounded-pill" onClick={() => addToCart(item)}>
                          ADD
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {filteredItems.length === 0 && <p className={`text-center mt-5 ${darkMode ? 'text-light' : 'text-muted'}`}>No items found.</p>}
            </Row>
          </Col>

          <Col lg={4} md={12}>
            <div className="sticky-top" style={{ top: '20px', zIndex: 100 }}>
              {notifications.map((n) => (
                <Alert key={n.id} variant={n.type} className="shadow-sm">
                  {n.message}
                </Alert>
              ))}

              {/* Profile (half-page) */}
              <div className="mb-4">
                <ProfilePanel darkMode={darkMode} />
              </div>

              <div className="mb-3" />

              <Card

                className={`shadow-sm border-0 rounded-3 mb-4 ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}
              >
                <Card.Header className={`border-bottom-0 pt-4 pb-2 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-0 text-center">Your Cart</h5>
                </Card.Header>

                <Card.Body>
                  {cart.length > 0 ? (
                    <>
                      <ListGroup variant="flush" className="mb-3">
                        {cart.map((cartItem) => (
                          <ListGroup.Item
                            key={cartItem._id}
                            className={`px-0 d-flex justify-content-between align-items-center border-bottom ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                          >
                            <div>
                              <div className="fw-bold">{cartItem.name}</div>
                              <small className={darkMode ? 'text-light' : 'text-muted'}>
                                ₹{cartItem.price} x {cartItem.quantity}
                              </small>
                            </div>
                            <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => removeFromCart(cartItem._id)}>
                              ✕
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>

                      <div className={`p-3 rounded mb-3 ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                        <Form.Group className="mb-2">
                          <Form.Label className={`small fw-bold ${darkMode ? 'text-light' : 'text-muted'}`}>Delivery Mode</Form.Label>
                          <Form.Select
                            size="sm"
                            value={deliveryMode}
                            onChange={(e) => setDeliveryMode(e.target.value)}
                            className={darkMode ? 'bg-dark text-white border-secondary' : ''}
                          >
                            <option>Home Delivery</option>
                            <option>Takeaway</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className={`small fw-bold ${darkMode ? 'text-light' : 'text-muted'}`}>Payment</Form.Label>
                          <Form.Select
                            size="sm"
                            value={paymentOption}
                            onChange={(e) => setPaymentOption(e.target.value)}
                            className={darkMode ? 'bg-dark text-white border-secondary' : ''}
                          >
                            <option>Cash on Delivery</option>
                            <option>Credit Card</option>
                            <option>UPI</option>
                          </Form.Select>
                        </Form.Group>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                        <h6 className="fw-bold mb-0">Grand Total</h6>
                        <h5 className="fw-bold mb-0" style={{ color: theme.blue }}>
                          ₹{calculateTotal()}
                        </h5>
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
                    <div className={`text-center py-5 ${darkMode ? 'text-light' : 'text-muted'}`}>
                      <div className="fs-1 mb-2">🛒</div>
                      Your cart is empty. <br /> Please add some items from the menu.
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Card className={`shadow-sm border-0 rounded-3 ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}>
                <Card.Header className={`border-bottom-0 pt-4 pb-2 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-0">My Orders</h5>
                </Card.Header>
                <Card.Body>
                  {orders.length === 0 ? (
                    <p className={`mb-0 ${darkMode ? 'text-light' : 'text-muted'}`}>You have no orders yet.</p>
                  ) : (
                    <ListGroup variant="flush">
                      {orders.slice(0, 5).map((order) => (
                        <ListGroup.Item key={order._id} className={`px-0 ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div className="w-100">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <strong>#{(order._id || '').slice(-6).toUpperCase()}</strong>
                                <Badge
                                  bg={
                                    order.orderStatus === 'Cancelled' || order.orderStatus === 'Rejected'
                                      ? 'danger'
                                      : order.orderStatus === 'Accepted' ||
                                        order.orderStatus === 'Preparing' ||
                                        order.orderStatus === 'Out for Delivery'
                                      ? 'primary'
                                      : order.orderStatus === 'Delivered'
                                      ? 'success'
                                      : 'warning'
                                  }
                                >
                                  {order.orderStatus}
                                </Badge>
                              </div>
                              <div className={`small ${darkMode ? 'text-light' : 'text-muted'}`}>
                                {(order.orderItems || []).map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                              </div>
                              <div className={`small ${darkMode ? 'text-light' : 'text-muted'}`}>
                                ₹{order.totalAmount} • {order.paymentOption} • {order.deliveryMode}
                              </div>
                              {order.statusMessage && (
                                <div className={`small mt-1 ${darkMode ? 'text-info' : 'text-primary'}`}>Message: {order.statusMessage}</div>
                              )}

                              {!['Cancelled', 'Rejected'].includes(order.orderStatus) && (
                                <div className="mt-3 mb-2">
                                  <div className="d-flex justify-content-between small mb-1" style={{ fontSize: '0.75rem' }}>
                                    <span>Tracking Progress</span>
                                    <span>{getOrderProgress(order.orderStatus).percent}%</span>
                                  </div>
                                  <ProgressBar
                                    now={getOrderProgress(order.orderStatus).percent}
                                    variant={getOrderProgress(order.orderStatus).variant}
                                    striped={order.orderStatus !== 'Delivered'}
                                    animated={order.orderStatus !== 'Delivered'}
                                    style={{ height: '6px' }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {order.orderStatus === 'Pending' && (
                            <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => handleCancelOrder(order._id)}>
                              Cancel
                            </Button>
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

      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-white border-secondary' : 'bg-primary text-white'}>
          <Modal.Title>Order Update</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark text-white' : ''}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{popupMessage}</p>
        </Modal.Body>
        <Modal.Footer className={darkMode ? 'bg-dark border-secondary' : ''}>
          <Button variant={darkMode ? 'outline-light' : 'primary'} onClick={() => setShowPopup(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;

