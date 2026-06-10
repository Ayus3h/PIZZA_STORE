import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'CUSTOMER',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .matches(/@gmail\.com$/, 'Email must be a @gmail.com address')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^\S*$/, 'Password cannot contain spaces')
        .required('Required'),
      role: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setError('');
      try {
        setLoading(true);
        const response = await axios.post(`${API_BASE}/api/auth/register`, {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        
        navigate('/dashboard'); 
        
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Create Account</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your name" 
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Create a password" 
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && !!formik.errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicRole">
              <Form.Label>Account Type</Form.Label>
              <Form.Select 
                name="role"
                value={formik.values.role} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.role && !!formik.errors.role}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.role}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? 'Registering...' : 'Sign Up'}
            </Button>
          </Form>

          <div className="text-center">
            <Link to="/login" className="text-decoration-none">Already have an account? Login.</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;