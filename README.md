# TMO Top Sellers Dashboard

A full-stack application for tracking and displaying sales performance across different branches. Built with .NET Core backend and React frontend.

## Project Overview

This application provides a dashboard to view top-performing sellers by month across different branches. It processes sales data from a CSV file and presents it through an interactive web interface.

## Tech Stack

### Backend (.NET 8)
- ASP.NET Core Web API - Framework for building RESTful APIs
- CsvHelper - Efficient CSV file parsing and handling
- xUnit - Testing framework for unit tests
- Newtonsoft.Json - JSON serialization/deserialization
- Swashbuckle.AspNetCore - API documentation and Swagger UI

### Frontend (React + TypeScript)
Core:
- React 18 - UI library
- TypeScript - Type safety and better developer experience
- Vite - Fast build tool and development server

State Management & Data Fetching:
- @tanstack/react-query - Server state management and API calls

UI Components & Styling:
- SCSS Modules - Component-scoped styling with preprocessor features
- Lucide React - Modern icon library

Testing:
- Jest - Testing framework
- React Testing Library - Component testing
- @testing-library/jest-dom - Custom DOM matchers

Development Tools:
- ESLint - Code linting
- TypeScript ESLint - TypeScript-specific linting
- SWC (via @vitejs/plugin-react-swc) - Fast TypeScript/JavaScript compiler

## Features

- Branch selection dropdown
- Monthly top seller reports
- Performance metrics including:
  - Total orders
  - Total sales amount
  - Monthly comparisons
- Responsive design for all devices

## Architecture

### Backend Components

#### Data Processing
- CSV file reading and parsing
- Sales calculations and aggregation
- Top performer identification
- Data validation and cleaning

#### API Endpoints
- GET /api/branches
  Returns a list of all available branches.
  ```json
  [
    "Branch1",
    "Branch2",
    "Branch3"
  ]
  ```

- GET /api/sellers?branch={branchName}
  Returns top sellers for a specific branch.
  ```json
  [
    {
      "month": "January",
      "seller": "John Doe",
      "orderCount": 145,
      "totalPrice": 28750.50
    }
  ]
  ```

### Error Handling

The application implements comprehensive error handling:

1. Input Validation
   - Null/empty branch names
   - Invalid date formats
   - Negative price values

2. Edge Cases
   - Empty data sets
   - Non-existent branches
   - Tied performance scores

## Development Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd Backend
   dotnet restore
   dotnet run
   ```

3. Navigate to the frontend directory:
   ```
   cd Frontend
   npm install
   npm run dev
   ```

## Testing

### Backend Tests (.NET)

The backend uses xUnit for comprehensive testing of the business logic:

1. Order Service Tests:
   - Branch Management
     - Retrieval of distinct branches
     - Handling of invalid branch names
     - Empty results for non-existent branches

   - Sales Performance Calculations
     - Monthly top seller identification
     - Total sales calculations
     - Order count tracking

   - Edge Cases
     - Tie-breaking scenarios (alphabetical ordering)
     - Negative price handling (converted to 0)
     - Large number handling (decimal.MaxValue)
     - Invalid dates (ignored)
     - Future dates (ignored)
     - Multiple orders by same seller

2. Test Coverage:
   - Service layer: 100%
   - Model validation
   - Error handling
   - Business logic

Run backend tests:
```bash
cd Backend
dotnet test
```

### Frontend Tests (React)

The frontend uses Jest and React Testing Library for component testing:

1. Component Tests:
   - Branch Selector
     - Dropdown rendering
     - Branch selection handling
     - API integration
   
   - Top Sellers Table
     - Data display formatting
     - Monthly performance rendering
     - Sorting and ordering
   
   - Data Loading States
     - Loading indicators
     - Error state handling
     - Empty state display

2. Integration Tests:
   - API service mocking
   - Data transformation
   - State management
   - User interactions

3. Edge Cases:
   - No data available
   - API errors
   - Invalid data formats
   - Loading states

Run frontend tests:
```bash
cd Frontend
npm test
```

## Deployment

### Backend
1. Build the application:
   ```
   dotnet publish -c Release
   ```

2. Deploy the published files to your hosting environment

### Frontend
1. Create production build:
   ```
   npm run build
   ```

2. Deploy the contents of the dist folder to your web server

