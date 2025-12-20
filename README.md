# E-Commerce Frontend

A modern, responsive e-commerce frontend built with Next.js 16, featuring a complete shopping experience with vendor management, admin dashboard, and customer-facing store.

## 🚀 Features

### Customer Features
- 🛍️ **Product Browsing** - Browse products by categories with advanced filtering
- 🔍 **Search & Filter** - Advanced search with price, category, and rating filters
- 🛒 **Shopping Cart** - Add, update, remove items with real-time updates
- ❤️ **Wishlist** - Save favorite products for later
- 👤 **User Authentication** - Secure login/register with JWT tokens
- 📦 **Order Management** - Place orders and track order history
- ⭐ **Product Reviews** - Read and write product reviews with ratings
- 🏪 **Shop Profiles** - Visit individual vendor shop pages
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile

### Vendor Features
- 📊 **Vendor Dashboard** - Comprehensive dashboard for managing business
- 📦 **Product Management** - Full CRUD operations for products with image uploads
- 🖼️ **Shop Customization** - Upload shop background images and customize profile
- 📈 **Sales Analytics** - View sales statistics and performance metrics
- 📋 **Order Management** - Manage incoming orders and update status
- 🏪 **Shop Profile** - Public-facing shop page for customers
- 📸 **Image Management** - Upload and manage product images

### Admin Features
- 🎛️ **Admin Dashboard** - Complete platform management interface
- 👥 **User Management** - Manage customers and vendors
- 🏪 **Vendor Approval** - Review and approve vendor applications
- 📊 **Analytics** - Platform-wide analytics and reporting
- 🛍️ **Product Oversight** - Manage all products across the platform
- 📦 **Order Management** - Oversee all orders and transactions

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: JWT with refresh tokens
- **Image Handling**: Next.js Image optimization
- **Form Handling**: Native React forms with validation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:3001`

## Installation

1. **Clone the repository**
   ```bash
   cd e-commerce-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   
   Create `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── vendor-register/
│   ├── admin/                   # Admin dashboard
│   │   ├── products/
│   │   ├── users/
│   │   └── vendors/
│   ├── vendor/                  # Vendor dashboard
│   │   ├── dashboard/
│   │   ├── products/
│   │   └── profile/
│   ├── shop/                    # Public shop pages
│   │   └── vendor/[vendorId]/
│   ├── cart/                    # Shopping cart
│   ├── checkout/                # Checkout process
│   ├── profile/                 # User profile
│   └── wishlist/                # User wishlist
├── components/                   # Reusable components
│   ├── auth/                    # Authentication components
│   ├── nav-bar/                 # Navigation components
│   ├── footer/                  # Footer components
│   └── pages/                   # Page-specific components
├── context/                     # React Context providers
│   ├── AuthContext.js          # Authentication state
│   ├── CartContext.js          # Shopping cart state
│   ├── WishlistContext.js      # Wishlist state
│   └── AlertContext.js         # Alert notifications
├── lib/                        # Utility libraries
│   └── api.js                  # Axios configuration
└── styles/                     # Global styles
```

## Key Features Implementation

### Authentication System
- JWT-based authentication with automatic token refresh
- Role-based access control (Customer, Vendor, Admin)
- Protected routes with automatic redirects
- Persistent login state across browser sessions

### Shopping Experience
- Real-time cart updates with quantity management
- Wishlist functionality with heart animations
- Advanced product filtering and search
- Product comparison features
- Responsive product grid/list views

### Vendor Management
- Complete vendor dashboard with analytics
- Product CRUD operations with image uploads
- Shop profile customization with background images
- Order management and status updates
- Sales performance tracking

### Admin Panel
- User and vendor management
- Platform-wide analytics dashboard
- Product approval and management
- Order oversight and reporting
- System configuration options

## API Integration

The frontend integrates with the backend API for:

- **Authentication**: `/auth/*` endpoints
- **Products**: `/products/*` endpoints
- **Cart**: `/cart/*` endpoints
- **Orders**: `/orders/*` endpoints
- **Vendors**: `/vendors/*` endpoints
- **Admin**: Various admin endpoints

## Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Tailwind CSS breakpoints
- Optimized navigation for mobile devices
- Touch-friendly interface elements
- Adaptive layouts for different screen sizes

## Performance Optimizations

- Next.js Image optimization for faster loading
- Code splitting with dynamic imports
- Lazy loading for non-critical components
- Optimized bundle size with tree shaking
- Client-side caching for API responses

## Security Features

- JWT token management with automatic refresh
- Protected routes with authentication checks
- Input validation and sanitization
- CSRF protection through API design
- Secure file upload handling

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Fix ESLint issues automatically

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Analytics and tracking
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure backend is running on `http://localhost:3001`
   - Check CORS configuration in backend
   - Verify environment variables

2. **Authentication Problems**
   - Clear browser localStorage and cookies
   - Check JWT token expiration
   - Verify API endpoints are accessible

3. **Image Upload Issues**
   - Check file size limits (5MB max)
   - Verify supported formats (JPEG, PNG, GIF, WebP)
   - Ensure upload directories exist in backend

## License

This project is licensed under the UNLICENSED License.
