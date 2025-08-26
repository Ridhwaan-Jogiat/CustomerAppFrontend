## CustomerApp - Angular Customer Management Frontend

A modern, responsive Angular application for customer relationship management. Built with Angular 18+ and Bootstrap, this SPA provides an intuitive interface for managing customer data with real-time validation and seamless CRUD operations.

### Live Demo
**Application URL**: [https://customer-app-iota.vercel.app](https://customer-app-iota.vercel.app)

⚠️ **Note**: The backend API may take 20-30 seconds to respond on first load as it wakes up from sleep mode (hosted on Render free tier).

### Key Features
- **Responsive Design** that works seamlessly on desktop and mobile devices
- **Real-time Search** functionality across all customer fields
- **Form Validation** with immediate feedback for data integrity
- **Modal Forms** for creating and editing customers
- **Clean UI** built with Bootstrap 5 for professional appearance
- **Standalone Components** using Angular 18+ architecture
- **Type Safety** with TypeScript interfaces and models

### Technical Stack
- Angular 18+ with TypeScript
- Bootstrap 5 for styling
- Reactive Forms with validation
- HTTPClient for API communication
- Deployed on Vercel

### Features Overview
| Feature | Description |
|---------|-------------|
| Customer List | Paginated table with all customer records |
| Search | Filter customers by name, email, phone |
| Create Customer | Add new customers with validated forms |
| Edit Customer | Update existing customer information |
| Delete Customer | Remove customers with confirmation |

### Local Development
```bash
npm install
ng serve
