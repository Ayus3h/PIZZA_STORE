import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-shell" style={{ background: 'linear-gradient(180deg, #fff 0%, #fff7f7 45%, #ffffff 100%)', minHeight: '100vh' }}>
      <nav className="navbar navbar-dark sticky-top shadow-sm px-3 px-lg-4" style={{ backgroundColor: '#0055A5' }}>
        <span className="navbar-brand mb-0 h1 fw-bold fs-3">🍕 Pizzeria</span>
        <div className="d-flex flex-wrap gap-2 justify-content-end">
          <Button variant="light" className="fw-bold" style={{ color: '#0055A5' }} onClick={() => navigate('/login')}>Login</Button>
          <Button variant="outline-light" className="fw-bold" onClick={() => navigate('/register')}>Sign Up</Button>
          <Button variant="outline-light" className="fw-bold" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Contact</Button>
        </div>
      </nav>

      <Container className="py-5">
        <Row className="align-items-center g-5 py-4" id="top">
          <Col lg={6} className="homepage-hero">
            <p className="text-uppercase fw-bold mb-3" style={{ color: '#18e392', letterSpacing: '0.25rem' }}>Fresh. Fast. Full of flavor.</p>
            <h1 className="homepage-hero-title fw-bold mb-4" style={{ color: '#0f782f' }}>The modern pizza store for quick orders, premium taste, and easy delivery.</h1>
            <p className="lead text-muted mb-4">Browse pizza, sides, combos, and beverages on one smooth page. Place your order in minutes with secure login and a clean checkout flow.</p>
            <div className="homepage-hero-actions mb-4">
              <Button size="lg" className="px-4 py-3 fw-bold rounded-pill shadow" style={{ backgroundColor: '#E31837', borderColor: '#E31837' }} onClick={() => navigate('/login')}>Order Now</Button>
              <Button size="lg" variant="outline-dark" className="px-4 py-3 fw-bold rounded-pill" onClick={() => navigate('/register')}>Create Account</Button>
            </div>
            <div className="homepage-hero-stats text-muted small">
              <span>✅ 10+ menu items</span>
              <span>✅ Delivery + takeaway</span>
              <span>✅ Admin order control</span>
            </div>
          </Col>
          <Col lg={6}>
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80" alt="Pizza store hero" className="img-fluid rounded-4 shadow-lg" />
          </Col>
        </Row>

        <Row className="g-4 my-2" id="menu">
          {['Pizza', 'Sides', 'Beverages', 'Combos'].map((item, index) => (
            <Col md={6} lg={3} key={item}>
              <Card className="h-100 border-0 shadow-sm rounded-4 text-center p-3">
                <div className="display-6 mb-2" style={{ color: '#E31837' }}>{['🍕', '🍟', '🥤', '🎁'][index]}</div>
                <Card.Title className="fw-bold">{item}</Card.Title>
                <Card.Text className="text-muted small">Fresh menu sections designed for a polished pizza-store experience.</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4 my-4 align-items-center" id="about">
          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4">
              <h3 className="fw-bold mb-3" style={{ color: '#0055A5' }}>Why Pizzeria stands out</h3>
              <p className="text-muted mb-0">Built as a one-page, responsive app with a modern landing section, category filters, order tracking, and admin management—ideal for a capstone presentation and real-world demo.</p>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4 bg-dark text-white">
              <h3 className="fw-bold mb-3">Fast, simple, and customer-friendly</h3>
              <ul className="mb-0 ps-3 text-white-50">
                <li>One-page flow from browsing to checkout</li>
                <li>Responsive layout for desktop and mobile</li>
                <li>Admin tools to manage menu and order status</li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm rounded-4 p-4 my-4" id="contact">
          <Row className="g-4 align-items-center">
            <Col lg={7}>
              <h3 className="fw-bold mb-2" style={{ color: '#0055A5' }}>Contact & support</h3>
              <p className="text-muted mb-3">Need help with your order, menu suggestions, or a custom event booking? Reach out to our team anytime.</p>
              <ul className="list-unstyled text-muted mb-0">
                <li>📍 12, Pizza Street, Wipro </li>
                <li>📞 +91 1234567890</li>
                <li>✉️ support@pizzeria.app</li>
              </ul>
            </Col>
            <Col lg={5}>
              <Card className="border rounded-4 shadow-sm p-3 bg-light">
                <h5 className="fw-bold mb-3">Quick contact</h5>
                <Button variant="outline-danger" className="w-100 fw-bold rounded-pill mb-2" onClick={() => window.open('mailto:support@pizzeria.app')}>Email Support</Button>
                <Button variant="outline-primary" className="w-100 fw-bold rounded-pill" onClick={() => window.open('tel:+919876543210')}>Call Us</Button>
              </Card>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default HomePage;