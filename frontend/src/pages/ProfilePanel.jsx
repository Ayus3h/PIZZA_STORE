import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Form, Alert, Row, Col } from 'react-bootstrap';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProfilePanel({ darkMode, refreshSignal }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftPhone, setDraftPhone] = useState('');


  const fetchMe = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  useEffect(() => {
    if (profile && isEditing) {
      setDraftName(profile.name || '');
      setDraftEmail(profile.email || '');
      setDraftPhone(profile.phone || '');

    }
  }, [profile, isEditing]);

  const saveProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/api/auth/me`,
        { name: draftName, email: draftEmail, phone: draftPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsEditing(false);
      await fetchMe();
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`shadow-sm border-0 rounded-3 ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}
    >
      <Card.Header className={`border-bottom-0 pt-4 pb-2 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
        <div className="d-flex justify-content-between align-items-center gap-2">
          <h5 className="fw-bold mb-0">Your Profile</h5>
          <Button
            size="sm"
            variant={darkMode ? 'outline-light' : 'outline-dark'}
            className="fw-bold"
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        {loading && <div className="small text-muted">Loading...</div>}

        {!loading && profile && !isEditing && (
          <>
            <Row className="g-3">
              <Col xs={12} sm={6}>
                <div className="small text-muted">Name</div>
                <div className="fw-bold">{profile.name}</div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="small text-muted">Phone</div>
                <div className="fw-bold">{profile.phone || '-'}</div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="small text-muted">Email</div>
                <div className="fw-bold">{profile.email}</div>
              </Col>

              <Col xs={12} sm={6}>
                <div className="small text-muted">Role</div>
                <div className="fw-bold text-capitalize">{profile.role?.toLowerCase()}</div>
              </Col>
            </Row>
          </>
        )}

        {!loading && profile && isEditing && (
          <Form>
            <Form.Group className="mb-3" controlId="profileName">
              <Form.Label className={darkMode ? 'text-light' : ''}>Name</Form.Label>
              <Form.Control
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className={darkMode ? 'bg-secondary text-white border-secondary' : ''}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="profileEmail">
              <Form.Label className={darkMode ? 'text-light' : ''}>Email</Form.Label>
              <Form.Control
                type="email"
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                className={darkMode ? 'bg-secondary text-white border-secondary' : ''}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="profilePhone">
              <Form.Label className={darkMode ? 'text-light' : ''}>Phone</Form.Label>
              <Form.Control
                type="text"
                value={draftPhone}
                onChange={(e) => setDraftPhone(e.target.value)}
                className={darkMode ? 'bg-secondary text-white border-secondary' : ''}
              />
            </Form.Group>


            <div className="d-flex gap-2">
              <Button
                style={{ backgroundColor: '#E31837', borderColor: '#E31837' }}
                className="fw-bold"
                onClick={saveProfile}
                disabled={loading}
              >
                Save
              </Button>
              <Button
                variant={darkMode ? 'outline-light' : 'outline-dark'}
                className="fw-bold"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Back
              </Button>
            </div>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
}

