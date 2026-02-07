# StyleHub - E-Commerce Clothing Marketplace
## Final Year Project Report

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Objectives](#4-objectives)
5. [System Architecture](#5-system-architecture)
6. [Technology Stack](#6-technology-stack)
7. [System Modules](#7-system-modules)
8. [Database Design](#8-database-design)
9. [User Roles and Permissions](#9-user-roles-and-permissions)
10. [Features and Functionality](#10-features-and-functionality)
11. [API Documentation](#11-api-documentation)
12. [Security Implementation](#12-security-implementation)
13. [Testing](#13-testing)
14. [Screenshots](#14-screenshots)
15. [Future Enhancements](#15-future-enhancements)
16. [Conclusion](#16-conclusion)
17. [References](#17-references)

---

## 1. Executive Summary

StyleHub is a comprehensive full-stack e-commerce platform designed specifically for the clothing and fashion industry. The platform serves as a multi-vendor marketplace where vendors can register, list their products, and manage their stores, while customers can browse, search, and purchase clothing items seamlessly.

The application is built using modern web technologies including Next.js 16 for the frontend and NestJS for the backend, with MongoDB as the database. The platform supports multiple user roles including Customers, Vendors, and Administrators, each with specific functionalities and access levels.

**Key Highlights:**
- Multi-vendor marketplace architecture
- Real-time inventory management
- Secure payment integration (Stripe & PayPal)
- Email notification system with OTP verification
- Responsive design for all devices
- Admin dashboard with analytics

---

## 2. Introduction

### 2.1 Background

The e-commerce industry has witnessed exponential growth in recent years, particularly in the fashion and clothing sector. With the increasing demand for online shopping, there is a need for robust, scalable, and user-friendly platforms that can cater to both sellers and buyers effectively.

### 2.2 Project Overview

StyleHub is developed as a comprehensive solution for online clothing retail. It provides a platform where:
- **Vendors** can register their businesses, upload products, and manage orders
- **Customers** can browse products, add items to cart, and make secure purchases
- **Administrators** can oversee the entire platform, approve vendors, and manage operations

### 2.3 Scope

The project encompasses:
- User authentication and authorization
- Product catalog management
- Shopping cart functionality
- Order processing and tracking
- Payment gateway integration
- Vendor management system
- Admin dashboard with analytics
- Email notification system
- Review and rating system

---

## 3. Problem Statement

Traditional retail businesses face several challenges in the digital age:

1. **Limited Reach**: Physical stores are limited to local customers
2. **High Operational Costs**: Maintaining physical stores requires significant investment
3. **Inventory Management**: Manual tracking of inventory is error-prone
4. **Customer Experience**: Limited shopping hours and product availability
5. **Vendor Onboarding**: Difficulty in expanding product range without proper vendor management

StyleHub addresses these challenges by providing a digital platform that:
- Extends market reach globally
- Reduces operational costs through automation
- Provides real-time inventory tracking
- Offers 24/7 shopping availability
- Enables easy vendor onboarding and management

---

## 4. Objectives

### 4.1 Primary Objectives

1. Develop a fully functional multi-vendor e-commerce platform
2. Implement secure user authentication with email verification
3. Create an intuitive product browsing and search experience
4. Enable secure payment processing
5. Provide comprehensive admin controls

### 4.2 Secondary Objectives

1. Implement responsive design for mobile compatibility
2. Create vendor dashboard for store management
3. Develop analytics and reporting features
4. Enable customer reviews and ratings
5. Implement wishlist and cart functionality

---

## 5. System Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Next.js 16 Frontend Application             │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │    │
│  │  │  Pages  │ │Components│ │ Context │ │   Hooks     │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              NestJS Backend Application                  │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │    │
│  │  │Controllers│ │Services │ │ Guards  │ │   DTOs      │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   MongoDB Atlas                          │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │    │
│  │  │  Users  │ │Products │ │ Orders  │ │   Vendors   │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Component Architecture

```
Frontend (Next.js 16)
├── src/
│   ├── app/                    # Page routes (App Router)
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── vendor/            # Vendor dashboard
│   │   ├── shop/              # Product pages
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout process
│   │   └── profile/           # User profile
│   ├── components/            # Reusable UI components
│   ├── context/               # React Context providers
│   ├── lib/                   # Utility functions
│   └── modal/                 # Modal components

Backend (NestJS)
├── src/
│   ├── auth/                  # Authentication module
│   ├── products/              # Products module
│   ├── orders/                # Orders module
│   ├── vendors/               # Vendors module
│   ├── cart/                  # Cart module
│   ├── wishlist/              # Wishlist module
│   ├── payments/              # Payment processing
│   ├── email/                 # Email service
│   ├── analytics/             # Analytics module
│   ├── reviews/               # Reviews module
│   ├── coupons/               # Coupon management
│   ├── newsletter/            # Newsletter module
│   └── reports/               # Reporting module
```

---

## 6. Technology Stack

### 6.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.7 | React framework with App Router |
| React | 19.2.0 | UI library |
| Tailwind CSS | 4.0 | Utility-first CSS framework |
| Axios | 1.13.2 | HTTP client |
| Framer Motion | 11.0.0 | Animation library |
| Lucide React | 0.556.0 | Icon library |
| Recharts | 3.6.0 | Charts and analytics |
| React Hot Toast | 2.4.1 | Toast notifications |

### 6.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 11.0.1 | Node.js framework |
| TypeScript | 5.7.3 | Type-safe JavaScript |
| MongoDB | 8.0.3 | NoSQL database |
| Mongoose | 8.0.3 | MongoDB ODM |
| Passport | 0.7.0 | Authentication middleware |
| JWT | 11.0.0 | Token-based authentication |
| Bcrypt | 5.1.1 | Password hashing |
| Nodemailer | 6.10.1 | Email service |
| Stripe | 14.12.0 | Payment processing |
| Multer | 1.4.5 | File upload handling |

### 6.3 Database

| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose | Object Data Modeling (ODM) |

### 6.4 Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub | Code repository |
| VS Code | Code editor |
| Postman | API testing |
| ESLint | Code linting |
| Prettier | Code formatting |

---

## 7. System Modules

### 7.1 Authentication Module

**Features:**
- User registration with email verification
- OTP-based email verification
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Google OAuth integration (optional)
- Password reset functionality

**Endpoints:**
- POST /auth/register - User registration
- POST /auth/login - User login
- POST /auth/verify-email - Email verification
- POST /auth/send-verification-otp - Resend OTP
- POST /auth/forgot-password - Password reset request
- POST /auth/reset-password - Password reset
- GET /auth/me - Get current user profile

### 7.2 Products Module

**Features:**
- Product CRUD operations
- Category-based filtering (Men, Women, Kids, Footwear)
- Sub-category filtering
- Price range filtering
- Search functionality
- Product recommendations
- Image upload support
- Stock management

**Endpoints:**
- GET /products - List all products
- GET /products/:id - Get product details
- POST /products - Create product (Vendor/Admin)
- PATCH /products/:id - Update product
- DELETE /products/:id - Delete product
- GET /products/featured - Featured products
- GET /products/new - New arrivals
- PATCH /products/:id/approve - Approve product (Admin)

### 7.3 Orders Module

**Features:**
- Order creation and management
- Order status tracking
- Order history
- Vendor order management
- Admin order overview
- Order analytics

**Order Statuses:**
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

**Endpoints:**
- POST /orders - Create order
- GET /orders - Get user orders
- GET /orders/:id - Get order details
- PATCH /orders/:id/status - Update order status
- GET /orders/vendor/me - Vendor orders
- GET /orders/all - All orders (Admin)

### 7.4 Vendors Module

**Features:**
- Vendor registration and application
- Document upload for verification
- Vendor approval workflow
- Vendor profile management
- Vendor dashboard
- Sales analytics

**Vendor Statuses:**
- Pending
- Approved
- Rejected
- Suspended

**Endpoints:**
- POST /vendors/apply - Apply as vendor
- GET /vendors/pending - Pending applications (Admin)
- GET /vendors/all - All vendors (Admin)
- PUT /vendors/:id/approve - Approve vendor
- PUT /vendors/:id/reject - Reject vendor
- PUT /vendors/:id/suspend - Suspend vendor
- GET /vendors/my-profile - Vendor profile
- PUT /vendors/my-profile - Update profile

### 7.5 Cart Module

**Features:**
- Add/remove items
- Update quantities
- Cart persistence
- Price calculation
- Stock validation

**Endpoints:**
- GET /cart - Get cart
- POST /cart/items - Add item
- PATCH /cart/items/:productId - Update quantity
- DELETE /cart/items/:productId - Remove item
- DELETE /cart - Clear cart

### 7.6 Wishlist Module

**Features:**
- Add/remove products
- Wishlist persistence
- Move to cart functionality

**Endpoints:**
- GET /wishlist - Get wishlist
- POST /wishlist/toggle - Toggle product
- DELETE /wishlist/:productId - Remove product

### 7.7 Payments Module

**Features:**
- Stripe integration
- PayPal integration
- Secure payment processing
- Payment confirmation
- Refund handling

**Endpoints:**
- POST /payments/create-intent - Create payment intent
- POST /payments/confirm - Confirm payment
- POST /payments/refund - Process refund
- POST /payments/paypal/create-order - PayPal order
- POST /payments/paypal/capture-order - Capture PayPal

### 7.8 Reviews Module

**Features:**
- Product reviews
- Star ratings
- Review moderation
- Helpful votes

**Endpoints:**
- POST /reviews - Create review
- GET /reviews/product/:productId - Product reviews
- GET /reviews/product/:productId/stats - Review statistics
- POST /reviews/:reviewId/helpful - Mark helpful
- DELETE /reviews/:reviewId - Delete review

### 7.9 Coupons Module

**Features:**
- Coupon creation
- Percentage/fixed discounts
- Free shipping coupons
- Usage limits
- Expiration dates

**Endpoints:**
- POST /coupons - Create coupon (Admin)
- POST /coupons/validate - Validate coupon
- GET /coupons - List coupons
- GET /coupons/active - Active coupons
- PUT /coupons/:id - Update coupon
- DELETE /coupons/:id - Delete coupon

### 7.10 Analytics Module

**Features:**
- Sales analytics
- Order statistics
- Customer insights
- Product performance
- Revenue tracking

**Endpoints:**
- GET /analytics/dashboard - Dashboard stats
- GET /analytics/sales-chart - Sales data
- GET /analytics/top-products - Top products
- GET /analytics/categories - Category stats
- GET /analytics/customers - Customer stats

---

## 8. Database Design

### 8.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Vendor    │       │   Product   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ _id         │───────│ user        │       │ _id         │
│ name        │       │ shopName    │───────│ vendor      │
│ email       │       │ businessName│       │ title       │
│ password    │       │ status      │       │ price       │
│ role        │       │ documents   │       │ category    │
│ isApproved  │       │ bankDetails │       │ stock       │
│ addresses   │       │ isVerified  │       │ images      │
└─────────────┘       └─────────────┘       └─────────────┘
       │                                           │
       │                                           │
       ▼                                           ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Order    │       │    Cart     │       │   Review    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ _id         │       │ _id         │       │ _id         │
│ user        │       │ user        │       │ user        │
│ items       │       │ items       │       │ product     │
│ totalAmount │       │ totalPrice  │       │ rating      │
│ status      │       │ updatedAt   │       │ comment     │
│ address     │       └─────────────┘       │ helpful     │
└─────────────┘                             └─────────────┘
```

### 8.2 Collections Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['user', 'vendor', 'admin'],
  isApproved: Boolean,
  isEmailVerified: Boolean,
  emailVerificationOtp: String,
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Products Collection
```javascript
{
  _id: ObjectId,
  title: String,
  subtitle: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  topCategory: Enum ['Men', 'Women', 'Kids', 'Footwear'],
  subCategory: String,
  colors: [String],
  sizes: [String],
  stock: Number,
  image: String,
  images: [String],
  vendor: ObjectId (ref: User),
  isApproved: Boolean,
  isActive: Boolean,
  averageRating: Number,
  totalReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId,
  orderNumber: String,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    size: String,
    color: String
  }],
  totalAmount: Number,
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  status: Enum ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  createdAt: Date,
  updatedAt: Date
}
```

#### Vendors Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  shopName: String,
  businessName: String,
  businessType: String,
  contactPerson: String,
  phoneNumber: String,
  email: String,
  businessAddress: Object,
  bankDetails: Object,
  documents: Object,
  status: Enum ['pending', 'approved', 'rejected', 'suspended'],
  isVerified: Boolean,
  isActive: Boolean,
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 9. User Roles and Permissions

### 9.1 Customer (User)

**Permissions:**
- Browse products
- Search and filter products
- Add products to cart
- Add products to wishlist
- Place orders
- Track orders
- Write reviews
- Manage profile
- Apply to become vendor

### 9.2 Vendor

**Permissions:**
- All customer permissions
- Add/edit/delete own products
- View own orders
- Update order status
- View sales analytics
- Manage vendor profile
- Upload product images

### 9.3 Administrator

**Permissions:**
- All vendor permissions
- Approve/reject vendors
- Suspend/unsuspend vendors
- Approve/reject products
- View all orders
- Manage all users
- View platform analytics
- Manage coupons
- Send newsletters
- Handle reports

---

## 10. Features and Functionality

### 10.1 Customer Features

1. **User Registration & Authentication**
   - Email registration with OTP verification
   - Secure login with JWT tokens
   - Password reset functionality
   - Profile management

2. **Product Browsing**
   - Category-wise browsing (Men, Women, Kids, Footwear)
   - Advanced search with filters
   - Price range filtering
   - Sort by price, rating, newest
   - Product recommendations

3. **Shopping Cart**
   - Add/remove products
   - Update quantities
   - Size and color selection
   - Real-time price calculation
   - Persistent cart

4. **Wishlist**
   - Save favorite products
   - Move to cart functionality
   - Persistent wishlist

5. **Checkout & Payment**
   - Multiple payment options (Stripe, PayPal, COD)
   - Address management
   - Coupon application
   - Order confirmation

6. **Order Management**
   - Order history
   - Order tracking
   - Order details view

7. **Reviews & Ratings**
   - Write product reviews
   - Star ratings
   - View other reviews

### 10.2 Vendor Features

1. **Vendor Registration**
   - Business information submission
   - Document upload
   - Bank details submission
   - Application tracking

2. **Product Management**
   - Add new products
   - Edit product details
   - Upload product images
   - Manage inventory
   - Set pricing and discounts

3. **Order Management**
   - View incoming orders
   - Update order status
   - Order history

4. **Dashboard & Analytics**
   - Sales overview
   - Revenue tracking
   - Order statistics
   - Product performance

5. **Profile Management**
   - Update business information
   - Manage bank details
   - Update documents

### 10.3 Admin Features

1. **Dashboard**
   - Platform overview
   - Key metrics
   - Recent activity
   - Quick actions

2. **Vendor Management**
   - View pending applications
   - Approve/reject vendors
   - Suspend/unsuspend vendors
   - View vendor details

3. **Product Management**
   - View all products
   - Approve/reject products
   - Delete products

4. **Order Management**
   - View all orders
   - Order analytics
   - Status updates

5. **User Management**
   - View all users
   - Block/unblock users
   - User statistics

6. **Coupon Management**
   - Create coupons
   - Set discount types
   - Set validity periods
   - Usage limits

7. **Newsletter**
   - Send newsletters
   - Target specific audiences
   - View subscribers

8. **Reports**
   - View user reports
   - Resolve issues
   - Assign to team

9. **Analytics**
   - Sales charts
   - Revenue reports
   - Customer insights
   - Product performance

---

## 11. API Documentation

### 11.1 Base URL
```
Development: http://localhost:3001
Production: https://your-domain.com/api
```

### 11.2 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <access_token>
```

### 11.3 Sample API Requests

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Products
```http
GET /products?category=Men&minPrice=0&maxPrice=100&page=1&limit=20
```

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "size": "M",
      "color": "Blue"
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "stripe"
}
```

---

## 12. Security Implementation

### 12.1 Authentication Security

1. **Password Hashing**
   - Bcrypt with salt rounds of 10
   - Passwords never stored in plain text

2. **JWT Tokens**
   - Access token (15 minutes expiry)
   - Refresh token (7 days expiry)
   - Secure token storage

3. **Email Verification**
   - 6-digit OTP
   - 10-minute expiry
   - Rate limiting

### 12.2 API Security

1. **CORS Configuration**
   - Restricted origins
   - Credentials support

2. **Input Validation**
   - DTO validation with class-validator
   - Sanitization of inputs

3. **Rate Limiting**
   - Request throttling
   - Brute force protection

### 12.3 Data Security

1. **Database Security**
   - MongoDB Atlas with encryption
   - Secure connection strings
   - Role-based access

2. **File Upload Security**
   - File type validation
   - Size limits (5MB)
   - Secure storage

---

## 13. Testing

### 13.1 Testing Credentials

**Admin Account:**
- Email: admin@clothingstore.com
- Password: admin123

**Customer Account:**
- Email: customer@example.com
- Password: customer123

**Vendor Accounts:**
- Email: vendor1@fashionhub.com / Password: vendor123
- Email: vendor2@stylestore.com / Password: vendor123

### 13.2 Test Coupons

| Code | Description | Discount |
|------|-------------|----------|
| FASHION20 | 20% off fashion items | 20% |
| NEWUSER15 | 15% off for new users | 15% |
| FREESHIP | Free shipping | Free Shipping |
| SUMMER50 | $50 off summer collection | $50 |

---

## 14. Screenshots

### 14.1 Home Page
- Hero section with featured products
- Category navigation
- New arrivals section
- Featured products carousel

### 14.2 Shop Page
- Product grid layout
- Filter sidebar
- Search functionality
- Pagination

### 14.3 Product Detail Page
- Product images gallery
- Size and color selection
- Add to cart/wishlist
- Product reviews

### 14.4 Cart Page
- Cart items list
- Quantity adjustment
- Price summary
- Checkout button

### 14.5 Checkout Page
- Address form
- Payment method selection
- Order summary
- Place order

### 14.6 Admin Dashboard
- Statistics cards
- Recent activity
- Pending vendors
- Quick actions

### 14.7 Vendor Dashboard
- Sales overview
- Product management
- Order management
- Profile settings

---

## 15. Future Enhancements

### 15.1 Short-term Improvements

1. **Real-time Notifications**
   - WebSocket integration
   - Push notifications
   - Order status updates

2. **Advanced Search**
   - Elasticsearch integration
   - Auto-suggestions
   - Voice search

3. **Social Features**
   - Social login (Facebook, Google)
   - Share products
   - Referral program

### 15.2 Long-term Enhancements

1. **Mobile Application**
   - React Native app
   - iOS and Android support
   - Push notifications

2. **AI Integration**
   - Product recommendations
   - Chatbot support
   - Image search

3. **Multi-language Support**
   - Internationalization
   - Multiple currencies
   - Regional pricing

4. **Advanced Analytics**
   - Machine learning insights
   - Predictive analytics
   - Customer segmentation

---

## 16. Conclusion

StyleHub is a comprehensive e-commerce solution that successfully addresses the needs of modern online clothing retail. The platform provides:

- **For Customers**: A seamless shopping experience with intuitive navigation, secure payments, and reliable order tracking
- **For Vendors**: A complete toolkit for managing their online store, from product listing to order fulfillment
- **For Administrators**: Powerful tools for platform management, vendor oversight, and business analytics

The use of modern technologies like Next.js 16 and NestJS ensures the platform is scalable, maintainable, and performant. The modular architecture allows for easy feature additions and modifications.

The project demonstrates proficiency in:
- Full-stack web development
- Database design and management
- API development and integration
- Security implementation
- User experience design

---

## 17. References

1. Next.js Documentation - https://nextjs.org/docs
2. NestJS Documentation - https://docs.nestjs.com
3. MongoDB Documentation - https://docs.mongodb.com
4. Tailwind CSS Documentation - https://tailwindcss.com/docs
5. Stripe API Documentation - https://stripe.com/docs/api
6. JWT.io - https://jwt.io
7. React Documentation - https://react.dev

---

## Appendix A: Installation Guide

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account for SMTP

### Backend Setup
```bash
cd E-Commerce-Backend
npm install
cp .env.example .env
# Configure .env with your credentials
npm run start:dev
```

### Frontend Setup
```bash
cd E-Commerce-Frontend
npm install
npm run dev
```

### Seed Database
```bash
cd E-Commerce-Backend
npm run seed:clothing
```

---

## Appendix B: Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

**Project Submitted By:**
- Student Name: [Your Name]
- Roll Number: [Your Roll Number]
- Department: [Your Department]
- University: [Your University]
- Submission Date: January 2026

---

*This document is prepared as part of the Final Year Project submission.*
