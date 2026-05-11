🚀 Full-Stack E-Commerce Platform
<div align="center">
https://img.shields.io/badge/Backend-Django-092E20?style=for-the-badge&logo=django
https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react
https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql
https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis
https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker
https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render

Complete production-ready e-commerce solution with Django REST API + React Frontend

Features • Tech Stack • Quick Start • Deployment • API Docs

</div>
📋 Table of Contents
Overview

Features

Project Structure

Tech Stack

Quick Start

Option 1: Docker (Recommended)

Option 2: Manual Setup

Backend API Documentation

Frontend Guide

Deployment

Environment Variables

Troubleshooting

License

🎯 Overview
This is a complete full-stack e-commerce platform with:

Backend: Django REST Framework API with MySQL database, Redis caching, Celery for background tasks, and Stripe payment integration

Frontend: React 18 application with shopping cart, user authentication, product browsing, and checkout process

The platform is fully containerized with Docker and ready for production deployment on Render (free tier).

Key Features
Module	Features
User Management	Register, Login, Profile, Password Reset, Email Verification
Products	Browse, Search, Filter by category/price, Product details, Reviews
Shopping Cart	Add/Remove items, Update quantities, Save for later
Orders	Place orders, Track status, Order history, Email confirmation
Payments	Stripe integration, Card payments, Webhook handling
Admin Panel	Manage products, View orders, User management, Analytics
Wishlist	Save favorite products, Move to cart
Newsletter	Subscribe/Unsubscribe, Email campaigns
🏗 Project Structure
text
ecommerce-platform/
├── backend/                    # Django Backend
│   ├── config/                # Project configuration
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── production.py
│   │   │   └── development.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── wsgi.py
│   ├── apps/                  # Django applications
│   │   ├── accounts/         # User authentication
│   │   ├── products/         # Product management
│   │   ├── cart/             # Shopping cart
│   │   ├── orders/           # Order processing
│   │   ├── payments/         # Stripe integration
│   │   ├── reviews/          # Product reviews
│   │   ├── wishlist/         # Wishlist functionality
│   │   ├── newsletter/       # Email newsletter
│   │   └── core/             # Core utilities
│   ├── staticfiles/          # Collected static files
│   ├── media/                # User uploaded files
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile           # Backend Docker configuration
│   ├── entrypoint.sh        # Container startup script
│   └── manage.py
│
├── frontend/                  # React Frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── OrderHistory.jsx
│   │   ├── context/         # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── api/             # API integration
│   │   │   └── client.js
│   │   ├── styles/          # CSS modules
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile.frontend
│   └── nginx.conf
│
├── docker-compose.yml         # Complete stack configuration
├── .env.example              # Environment variables template
├── .gitignore
└── README.md
🛠 Tech Stack
Backend
yaml
Framework: Django 4.2
API: Django REST Framework 3.14
Database: MySQL 8.0
Cache & Broker: Redis 7.0
Task Queue: Celery 5.3
Payment: Stripe API
Server: Gunicorn
Frontend
yaml
Framework: React 18
Build Tool: Vite 4
State Management: Context API + Reducers
HTTP Client: Axios
Routing: React Router v6
Styling: Tailwind CSS
Payment: Stripe Elements
Infrastructure
yaml
Containerization: Docker & Docker Compose
Cloud: Render (Free Tier)
Version Control: Git & GitHub
🚀 Quick Start
Prerequisites
Docker & Docker Compose (Recommended) or

Python 3.11+ & Node.js 18+ (Manual setup)

Git

Option 1: Docker (Recommended - One Command Setup)
This will run both backend and frontend together.

Step 1: Clone Repository
bash
git clone https://github.com/yourusername/ecommerce-platform.git
cd ecommerce-platform
Step 2: Configure Environment
bash
cp .env.example .env
# Edit .env with your values (or use defaults for testing)
Step 3: Run with Docker Compose
bash
docker-compose up --build
This will start:

MySQL Database on port 3306

Redis on port 6379

Backend API on port 8000

Frontend App on port 5173

Celery Worker (background tasks)

Step 4: Initialize Database
bash
# Open new terminal
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py collectstatic --noinput
Step 5: Access Applications
Frontend Website: http://localhost:5173

Backend API: http://localhost:8000/api/

Admin Panel: http://localhost:8000/admin/

API Documentation: http://localhost:8000/api/docs/

Step 6: Stop Everything
bash
docker-compose down
# Remove volumes (clean slate)
docker-compose down -v
Option 2: Manual Setup (Without Docker)
Backend Setup
bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup MySQL database
mysql -u root -p
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4;
EXIT;

# 5. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 6. Run migrations
python manage.py migrate
python manage.py createsuperuser

# 7. Start backend server
python manage.py runserver
# Backend runs on http://localhost:8000
Frontend Setup
bash
# 1. Open new terminal, navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Configure API URL
echo "VITE_API_URL=http://localhost:8000/api" > .env

# 4. Start frontend development server
npm run dev
# Frontend runs on http://localhost:5173
Start Additional Services (Optional)
bash
# Start Redis (if not running)
redis-server

# Start Celery worker (new terminal)
cd backend
celery -A config worker --loglevel=info

# Start Celery beat for scheduled tasks
celery -A config beat --loglevel=info
📡 Backend API Documentation
Base URL
Development: http://localhost:8000/api/

Production: https://your-api.onrender.com/api/

Authentication Endpoints
Method	Endpoint	Description	Auth
POST	/auth/register/	Create new account	No
POST	/auth/login/	Login with email/password	No
POST	/auth/logout/	Logout user	Yes
POST	/auth/password-reset/	Request password reset	No
POST	/auth/password-reset/confirm/	Reset password	No
GET	/auth/verify-email/{token}/	Verify email	No
GET	/auth/profile/	Get user profile	Yes
PUT	/auth/profile/update/	Update profile	Yes
Product Endpoints
Method	Endpoint	Description	Auth
GET	/products/	List all products	No
GET	/products/{id}/	Get product details	No
GET	/products/categories/	List categories	No
GET	/products/search/?q=query	Search products	No
GET	/products/filter/	Filter by price/category	No
POST	/products/{id}/reviews/	Add product review	Yes
Cart Endpoints
Method	Endpoint	Description	Auth
GET	/cart/	Get user cart	Yes
POST	/cart/add/	Add item to cart	Yes
PUT	/cart/update/{id}/	Update quantity	Yes
DELETE	/cart/remove/{id}/	Remove item	Yes
POST	/cart/apply-coupon/	Apply discount code	Yes
DELETE	/cart/clear/	Clear entire cart	Yes
Order Endpoints
Method	Endpoint	Description	Auth
GET	/orders/	List user orders	Yes
POST	/orders/create/	Create new order	Yes
GET	/orders/{id}/	Get order details	Yes
PUT	/orders/{id}/cancel/	Cancel order	Yes
GET	/orders/{id}/track/	Track order status	Yes
Payment Endpoints
Method	Endpoint	Description	Auth
POST	/payments/create-payment-intent/	Create Stripe payment	Yes
POST	/payments/webhook/stripe/	Stripe webhook	No
GET	/payments/confirm/{id}/	Confirm payment	Yes
Wishlist Endpoints
Method	Endpoint	Description	Auth
GET	/wishlist/	Get wishlist	Yes
POST	/wishlist/add/	Add to wishlist	Yes
DELETE	/wishlist/remove/{id}/	Remove from wishlist	Yes
API Response Format
json
{
  "status": "success",
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
Error Response
json
{
  "status": "error",
  "errors": {
    "field_name": ["Error message"]
  },
  "message": "Validation failed"
}
🎨 Frontend Guide
Frontend Structure
text
frontend/src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Footer.jsx      # Footer component
│   ├── ProductCard.jsx # Product display card
│   ├── CartIcon.jsx    # Cart counter
│   └── Loader.jsx      # Loading spinner
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Products.jsx    # Product listing
│   ├── ProductDetail.jsx # Single product
│   ├── Cart.jsx        # Shopping cart
│   ├── Checkout.jsx    # Checkout process
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration
│   ├── Profile.jsx     # User profile
│   └── OrderHistory.jsx # Order history
├── context/            # React Context
│   ├── AuthContext.jsx # Authentication state
│   ├── CartContext.jsx # Shopping cart state
│   └── ThemeContext.jsx # Theme state
├── api/                # API integration
│   └── client.js       # Axios configuration
├── styles/             # CSS files
│   └── globals.css     # Global styles
├── App.jsx             # Main app component
└── main.jsx           # Entry point
Key Components
1. API Client (src/api/client.js)
javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
2. Auth Context (src/context/AuthContext.jsx)
javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiClient.get('/auth/profile/');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login/', { email, password });
    localStorage.setItem('token', response.data.token);
    await fetchUser();
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
3. Cart Context (src/context/CartContext.jsx)
javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiClient.get('/cart/');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await apiClient.post('/cart/add/', { product_id: productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await apiClient.put(`/cart/update/${itemId}/`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await apiClient.delete(`/cart/remove/${itemId}/`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, loading }}>
      {children}
    </CartContext.Provider>
  );
};
4. Product Listing Page (src/pages/Products.jsx)
jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/products/?${params}`);
      setProducts(response.data.results);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const response = await apiClient.get('/products/categories/');
    setCategories(response.data);
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <select
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border rounded px-4 py-2 flex-1"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}

export default Products;
5. Shopping Cart Page (src/pages/Cart.jsx)
jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

function Cart() {
  const { cart, updateQuantity, removeItem, loading } = useCart();

  if (loading) return <div className="text-center py-12">Loading cart...</div>;

  if (cart.items?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          {cart.items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 mt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>${cart.total?.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="block w-full bg-blue-600 text-white text-center py-3 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
6. Checkout with Stripe (src/pages/Checkout.jsx)
jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderResponse = await apiClient.post('/orders/create/', {
        shipping_address: address,
        items: cart.items,
        total: cart.total
      });

      // Create payment intent
      const paymentResponse = await apiClient.post('/payments/create-payment-intent/', {
        order_id: orderResponse.data.id,
        amount: cart.total
      });

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentResponse.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              address: {
                line1: address.street,
                city: address.city,
                state: address.state,
                postal_code: address.zip,
                country: address.country
              }
            }
          }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Payment successful
      alert('Payment successful! Order confirmed.');
      navigate('/order-confirmation/' + orderResponse.data.id);
      
    } catch (error) {
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Shipping Address</h3>
        <input
          type="text"
          placeholder="Street Address"
          required
          className="w-full border rounded px-4 py-2 mb-2"
          onChange={(e) => setAddress({...address, street: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="City"
            required
            className="border rounded px-4 py-2"
            onChange={(e) => setAddress({...address, city: e.target.value})}
          />
          <input
            type="text"
            placeholder="State"
            required
            className="border rounded px-4 py-2"
            onChange={(e) => setAddress({...address, state: e.target.value})}
          />
          <input
            type="text"
            placeholder="ZIP Code"
            required
            className="border rounded px-4 py-2"
            onChange={(e) => setAddress({...address, zip: e.target.value})}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Payment Details</h3>
        <div className="border rounded p-4">
          <CardElement />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : `Pay $${cart.total?.toFixed(2)}`}
      </button>
    </form>
  );
}

function Checkout() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default Checkout;
Frontend Environment Variables
Create .env file in frontend/:

env
VITE_API_URL=http://localhost:8000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_51H...your_stripe_key
🐳 Docker Configuration
Complete docker-compose.yml
yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: ecommerce_mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: ${DB_NAME:-ecommerce_db}
      MYSQL_USER: ${DB_USER:-ecommerce_user}
      MYSQL_PASSWORD: ${DB_PASSWORD:-ecommerce_pass}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - ecommerce_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Redis Cache & Broker
  redis:
    image: redis:7-alpine
    container_name: ecommerce_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - ecommerce_network
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Django Backend
  backend:
    build: ./backend
    container_name: ecommerce_backend
    environment:
      DJANGO_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: ${DB_NAME:-ecommerce_db}
      DB_USER: ${DB_USER:-ecommerce_user}
      DB_PASSWORD: ${DB_PASSWORD:-ecommerce_pass}
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: ${SECRET_KEY:-django-insecure-dev-key-change-in-production}
      DEBUG: ${DEBUG:-0}
      ALLOWED_HOSTS: ${ALLOWED_HOSTS:-localhost,127.0.0.1}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS:-http://localhost:5173}
      STRIPE_PUBLIC_KEY: ${STRIPE_PUBLIC_KEY}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      EMAIL_HOST: ${EMAIL_HOST}
      EMAIL_PORT: ${EMAIL_PORT}
      EMAIL_HOST_USER: ${EMAIL_HOST_USER}
      EMAIL_HOST_PASSWORD: ${EMAIL_HOST_PASSWORD}
    ports:
      - "8000:8000"
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/media:/app/media
      - ./backend/staticfiles:/app/staticfiles
    networks:
      - ecommerce_network
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000

  # Celery Worker
  celery:
    build: ./backend
    container_name: ecommerce_celery
    environment:
      DJANGO_ENV: production
      DB_HOST: mysql
      DB_NAME: ${DB_NAME:-ecommerce_db}
      DB_USER: ${DB_USER:-ecommerce_user}
      DB_PASSWORD: ${DB_PASSWORD:-ecommerce_pass}
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - mysql
      - redis
    networks:
      - ecommerce_network
    command: celery -A config worker --loglevel=info

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
    container_name: ecommerce_frontend
    environment:
      VITE_API_URL: http://localhost:8000/api
    ports:
      - "5173:5173"
    depends_on:
      - backend
    networks:
      - ecommerce_network

volumes:
  mysql_data:
  redis_data:

networks:
  ecommerce_network:
    driver: bridge
Backend Dockerfile (backend/Dockerfile)
dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    netcat-openbsd \
    && apt-get clean

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . .

# Create necessary directories
RUN mkdir -p /app/staticfiles /app/media

# Collect static files
RUN python manage.py collectstatic --noinput

# Create entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
Backend Entrypoint (backend/entrypoint.sh)
bash
#!/bin/bash
set -e

# Wait for MySQL
while ! nc -z $DB_HOST $DB_PORT; do
    sleep 1
done

# Run migrations
python manage.py migrate --noinput

# Start server
exec "$@"
Frontend Dockerfile (frontend/Dockerfile.frontend)
dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build app
RUN npm run build

# Install serve to run the build
RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
🚢 Deployment
Deploy on Render (Free Tier)
Step 1: Push Code to GitHub
bash
git init
git add .
git commit -m "Initial commit - Full stack e-commerce"
git branch -M main
git remote add origin https://github.com/yourusername/ecommerce-platform.git
git push -u origin main
Step 2: Create MySQL Database on Render
Go to Render Dashboard

Click New → PostgreSQL (Render doesn't offer MySQL free, use PostgreSQL)

Name: ecommerce-db

Plan: Free

Click Create Database

Copy the Internal Database URL

Step 3: Create Redis on Render
Click New → Redis

Name: ecommerce-redis

Plan: Free

Click Create Redis

Step 4: Deploy Backend
Click New → Web Service

Connect GitHub repository

Configure:

Name: ecommerce-backend

Environment: Docker

Root Directory: backend

Dockerfile Path: backend/Dockerfile

Add environment variables:

env
DJANGO_ENV=production
SECRET_KEY=your-generated-secret-key
DEBUG=0
ALLOWED_HOSTS=ecommerce-backend.onrender.com
CSRF_TRUSTED_ORIGINS=https://ecommerce-frontend.onrender.com

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your-db.internal.render.com
DB_PORT=5432

REDIS_URL=rediss://:password@your-redis.internal.render.com:6379

CORS_ALLOWED_ORIGINS=https://ecommerce-frontend.onrender.com

# Stripe (add your keys)
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
Click Create Web Service

Step 5: Deploy Frontend
Click New → Static Site

Connect GitHub repository

Configure:

Name: ecommerce-frontend

Root Directory: frontend

Build Command: npm install && npm run build

Publish Directory: dist

Add environment variable:

env
VITE_API_URL=https://ecommerce-backend.onrender.com/api
Click Create Static Site

Step 6: Deploy Celery Worker (Optional)
Click New → Background Worker

Connect GitHub repository

Configure:

Name: ecommerce-celery

Environment: Docker

Root Directory: backend

Command: celery -A config worker --loglevel=info

Add same environment variables as backend

Click Create Background Worker

Step 7: Initial Setup
After deployment, open Shell in backend service:

bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Create sample data (optional)
python manage.py loaddata sample_data.json
🔧 Environment Variables
Complete .env.example (Copy to .env)
env
# ============================================
# DJANGO BACKEND CONFIGURATION
# ============================================

# Django Core
DJANGO_ENV=development
SECRET_KEY=django-insecure-dev-key-change-in-production
DEBUG=1
ALLOWED_HOSTS=localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://localhost:8000

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306

# Redis Cache
REDIS_URL=redis://localhost:6379/0

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@ecommerce.com

# Stripe Payments
STRIPE_PUBLIC_KEY=pk_test_51H...
STRIPE_SECRET_KEY=sk_test_51H...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Celery
RUN_CELERY=false
RUN_CELERY_BEAT=false

# ============================================
# FRONTEND CONFIGURATION
# ============================================

VITE_API_URL=http://localhost:8000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_51H...
🔍 Troubleshooting
Common Issues & Solutions
1. Database Connection Error
bash
# Error: Can't connect to MySQL
# Solution:
docker-compose exec mysql mysql -u root -p
# Then run:
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
FLUSH PRIVILEGES;
2. Redis Connection Failed
bash
# Error: Error 111 connecting to redis
# Solution:
docker-compose exec redis redis-cli ping
# Should return PONG
3. CORS Error in Browser
javascript
// Error: No 'Access-Control-Allow-Origin' header
// Solution: Check backend CORS settings
CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "https://your-frontend.onrender.com"]
4. Static Files Not Loading
bash
# Solution:
docker-compose exec backend python manage.py collectstatic --noinput
docker-compose restart backend
5. Stripe Payment Not Working
bash
# Solution:
1. Check Stripe keys in .env
2. Verify webhook URL in Stripe Dashboard
3. Test with test card: 4242 4242 4242 4242
View Logs
bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f celery

# Render logs
# Go to Render Dashboard → Your Service → Logs
Reset Everything
bash
# Stop all containers
docker-compose down

# Remove volumes (clear database)
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build
📊 Testing
Test Backend API
bash
# Health check
curl http://localhost:8000/health/

# Get products
curl http://localhost:8000/api/products/

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
Test Frontend
bash
cd frontend
npm run test  # Run unit tests
npm run build # Test production build
📈 Performance
Backend Optimizations
Database indexing on foreign keys

Redis caching for product lists

Pagination (20 items per page)

Lazy loading for images

Frontend Optimizations
Code splitting with React.lazy()

Image optimization with lazy loading

Debounced search input

Memoized components

🔒 Security Checklist
DEBUG=False in production

Strong SECRET_KEY (not in version control)

HTTPS enabled on Render

Database credentials secure

Stripe keys protected

CORS properly configured

CSRF protection enabled

Rate limiting implemented

SQL injection prevention

XSS protection enabled

📞 Support
Backend API: http://localhost:8000/api/docs/

Admin Panel: http://localhost:8000/admin/

Frontend App: http://localhost:5173

GitHub Issues: Create Issue

📄 License
MIT License - Free for personal and commercial use.

🎉 Summary
You now have a complete production-ready e-commerce platform with:

✅ Django REST API backend
✅ React frontend
✅ MySQL database
✅ Redis caching
✅ Stripe payments
✅ Docker containerization
✅ Ready for Render deployment

Quick Commands Reference
bash
# Start everything
docker-compose up --build

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Rebuild frontend
docker-compose build frontend
<div align="center">
Built with ❤️ using Django, React, Docker & Render

⬆ Back to Top

</div> ```