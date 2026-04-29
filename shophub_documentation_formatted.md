# SHOP HUB - E-COMMERCE PLATFORM

**Authors:** Vincent Michael Angelo Schoenke, Joshua Adante  
**Section:** IT-32  

---

## 1. System Overview 
The **ShopHub E-Commerce Platform** is a web-based multi-vendor platform designed to facilitate secure and interactive online shopping for customers, while providing comprehensive store management for sellers, and oversight tools for administrators. The system provides powerful tools for managing product catalogs, processing orders, and tracking sales analytics.

The application follows a layered architecture using the MVC (Model-View-Controller) pattern implemented through a Laravel backend with a modern React frontend powered by Inertia.js.

---

## 2. System Objectives 
The system aims to: 
- Provide an engaging and user-friendly digital marketplace for customers.
- Enable sellers to easily create, manage, and distribute their product listings.
- Ensure product quality through an Admin Product Approval workflow.
- Implement secure shopping carts, checkouts, and order tracking mechanics.
- Track sales performance and platform analytics.
- Facilitate secure transactions and transparent customer-seller interactions.
- Ensure secure authentication and strict role-based access control (RBAC).

---

## 3. Technology Stack 
- **Backend Framework:** PHP 8.x+ with Laravel 11.0
- **Database:** MySQL
- **Frontend Framework:** React 18.0
- **User Interface (UI):** Tailwind CSS and Custom Vanilla CSS
- **Animations:** Framer Motion
- **State Management/Routing:** Inertia.js
- **Authentication:** Laravel Sanctum / Session-based
- **Build Tools:** Vite and Laravel Vite Plugin
- **Data Visualization:** Chart.js & react-chartjs-2
- **Icons:** Lucide React

---

## 4. System Architecture 
The system follows a three-layer architecture: 

### Presentation Layer 
Handles the user interface and frontend rendering. 
**Components:** 
- React Components 
- Tailwind CSS UI Components 
- Customer Storefront 
- Seller Dashboard 
- Admin Dashboard 
- Authentication Portals (Customer, Seller, Admin)

### Application Layer 
Handles business logic and request processing. 
**Components:** 
- Controllers (Auth, Product, Cart, Checkout, AdminCrud, SellerDashboard) 
- Middleware (Authentication, Role Authorization: `role:admin`, `role:seller`) 
- Product Approval Service 
- Order & Checkout Logic 
- Notification Engine 

### Data Layer 
Handles persistent data storage. 
**Components:** 
- MySQL Database 
- Eloquent ORM Models 
- Database Migrations & Seeders
- File Storage System (for product images and shop logos) 

---

## 5. User Roles and Permissions 

### Customer (User) 
Customers can: 
- View and access the product catalog.
- Filter products by category and search by keyword.
- Add products to the shopping cart and proceed to checkout.
- Track personal order status and history.
- Manage their personal profile and password.
- Receive and manage system notifications.
- Leave reviews and ratings on purchased products.

### Seller 
Sellers can: 
- Create and manage their dedicated Shop Profile (logo, description).
- Upload and manage product listings (CRUD operations).
- Track specific orders made for their products.
- View shop performance, earnings, and sales analytics.
- Update order statuses for fulfillment (processing, shipped).
- Receive notifications regarding product approvals and orders.

### Admin 
Administrators can: 
- Manage all user accounts (customers, sellers, and fellow admins).
- View a system-wide dashboard with total platform statistics.
- Review, approve, reject, or flag products submitted by sellers.
- Manage global product categories.
- Monitor all orders platform-wide.
- Send messages and announcements to users.
- Verify new seller registrations.

---

## 6. Core Functional Modules 

### 6.1 Authentication Module 
**Features:** 
- Separate User, Seller, and Admin registration and login portals.
- OTP (One-Time Password) verification for secure registration.
- Profile and password management.
- Session management and logout functionality. 

**Security Mechanisms:** 
- Session-based authentication.
- CSRF protection and password hashing (Bcrypt).
- Role-based route access restrictions.

### 6.2 E-Commerce & Product Module 
**Functions:** 
- Global category management.
- Product listing creation with specifications, stock, and pricing.
- Multiple image uploads for products.
- Product approval workflow (Pending, Approved, Rejected).
- Dynamic product filtering and search.

**Key Models:** `Product`, `ProductImage`, `Category`, `ProductApproval`

### 6.3 Cart & Checkout Module 
**Functions:** 
- Add/remove items to/from the cart.
- Quantity updates and total calculations.
- Secure checkout process with shipping address inputs.
- Payment method selection (COD, GCash, Maya).

**Key Models:** `Cart`, `CartItem`, `Order`, `OrderItem`

### 6.4 Order & Fulfillment Module 
**Functions:** 
- Order generation and tracking numbers.
- Status tracking (Pending, Confirmed, Processing, Shipped, Delivered).
- Segmented views (Sellers see only their items; Admins see all).

**Key Models:** `Order`, `OrderItem`

### 6.5 Seller Management Module 
**Functions:** 
- Shop profile creation and customization.
- Seller invite code validation (optional admin control).
- Earnings and sales tracking.

**Key Models:** `SellerProfile`, `User`

### 6.6 Notification & Review Module 
**Functions:** 
- System notifications for order updates and approvals.
- Product rating and commenting post-purchase.

**Key Models:** `Notification`, `Review`

---

## 7. Routing Structure 

**Public Routes:** 
- `/` - Home/Storefront
- `/products` - Product Catalog (`/{slug}` for details)
- `/category/{slug}` - Browse by category

**Authentication Routes:** 
- `/login` & `/register` - Customer Auth
- `/seller/login` & `/seller/register` - Seller Auth
- `/admin/login` & `/admin/register` - Admin Auth
- `/logout` [POST] - Universal Logout

**Customer (Authenticated) Routes:** 
- `/cart` - View Cart (`/add`, `/update`, `/remove`)
- `/checkout` - Checkout Process
- `/orders` - Order History (`/{order}` for tracking)
- `/profile` - Profile Management
- `/notifications` - Notifications Hub

**Seller Routes (Prefix: `/admin/seller`):**  
- `/dashboard` - Seller Analytics
- `/products` - Manage Products
- `/orders` - Fulfillment Dashboard
- `/settings` - Shop Settings

**Admin Routes (Prefix: `/admin`):** 
- `/dashboard` - Admin Analytics
- `/users` & `/sellers` - Account Management
- `/products` & `/categories` - Catalog Control
- `/product-approvals` - Approval Workflow Dashboard (`/approve`, `/reject`)
- `/orders` - Global Order Monitoring
- `/messages/*` - Admin Messaging System

---

## 8. Application Workflow 

### Customer Workflow 
1. Customer registers via OTP or logs in.
2. Customer browses products or categories on the storefront.
3. Customer adds desired items to the shopping cart.
4. Customer proceeds to checkout, enters shipping details, and selects a payment method.
5. Customer tracks the order status through their profile.
6. Once delivered, the customer leaves a product review.

### Seller Workflow 
1. Seller registers and sets up their Shop Profile.
2. Seller uploads new products to the platform.
3. Products undergo Admin review (Product Approval Workflow).
4. Once approved, products appear on the public storefront.
5. Seller receives order notifications when customers buy their products.
6. Seller processes the order and updates the shipping status.
7. Seller tracks earnings via their dashboard.

### Admin Workflow 
1. Admin logs in to the main control panel.
2. Admin reviews pending products submitted by sellers (Approve/Reject).
3. Admin oversees global platform sales and user statistics.
4. Admin manages categories, verifies new sellers, and handles disputes.

---

## 9. File Structure 

- `app/Http/Controllers` - Application controllers (Home, Cart, Checkout, Admin, Seller)
- `app/Models` - Eloquent database models 
- `app/Http/Middleware` - Custom middleware (Role checking)
- `resources/js` - React frontend components 
- `resources/js/Pages` - Page components (Auth, Customer, Seller, Admin)
- `resources/css` - Stylesheets (Tailwind)
- `routes/web.php` - Web routing definitions 
- `database/migrations` - Database schema migrations 
- `database/seeders` - Database seeders 
- `public/` - Public assets, uploaded images, and entry point 
- `config/` - Application configuration 
- `storage/` - File storage for user avatars, shop logos, and product images

---

## 10. Key Features 

### Advanced Product Approval Workflow
- Prevents spam or inappropriate items from going live.
- Admins have complete control over what sellers can publish.

### Multi-Vendor Dashboarding
- Separate, dynamic `Chart.js` powered dashboards for Admins (platform-wide) and Sellers (shop-specific).

### OTP Secure Registration
- Enhanced security ensuring that registered users and sellers have verified contact points.

### Inertia.js SPA Experience
- Provides a fast, seamless browsing experience without page reloads, mimicking a standalone mobile app while keeping Laravel's robust backend.

---

## 11. Future Improvements 
- Integration of live Payment Gateways (PayMongo, Xendit, Stripe).
- Real-time chat system between Customers and Sellers.
- Mobile application counterpart (React Native or Flutter).
- Advanced logistics API integration (Lalamove, J&T) for automated shipping rates and live GPS tracking.
- AI-Powered product recommendations for customers.
- Exportable PDF reporting for Seller and Admin analytics.
