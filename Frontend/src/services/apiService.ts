// API Service for Top Performers Dashboard
// Replace BASE_URL with your ASP.NET Core backend URL

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-domain.com';

export interface Branch {
  id: string;
  name: string;
}

export interface TopSellerData {
  month: string;
  sellerName: string;
  totalOrders: number;
  totalPrice: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers like authorization if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET /api/branches
  async getBranches(): Promise<Branch[]> {
    console.log('Fetching branches from API...');
    return this.makeRequest<Branch[]>('/api/branches');
  }

  // GET /api/top-sellers?branch=XYZ
  async getTopSellers(branchId: string): Promise<TopSellerData[]> {
    console.log(`Fetching top sellers for branch: ${branchId}`);
    return this.makeRequest<TopSellerData[]>(`/api/top-sellers?branch=${encodeURIComponent(branchId)}`);
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Mock data service for development (remove when backend is ready)
export class MockApiService {
  async getBranches(): Promise<Branch[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 'branch-001', name: 'Downtown Branch' },
      { id: 'branch-002', name: 'Mall Location' },
      { id: 'branch-003', name: 'Airport Store' },
      { id: 'branch-004', name: 'Suburban Plaza' },
      { id: 'branch-005', name: 'City Center' }
    ];
  }

  async getTopSellers(branchId: string): Promise<TopSellerData[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockData: Record<string, TopSellerData[]> = {
      'branch-001': [
        { month: 'January', sellerName: 'Sarah Johnson', totalOrders: 145, totalPrice: 28750.50 },
        { month: 'February', sellerName: 'Michael Chen', totalOrders: 132, totalPrice: 31200.75 },
        { month: 'March', sellerName: 'Sarah Johnson', totalOrders: 167, totalPrice: 35400.25 },
        { month: 'April', sellerName: 'Emily Rodriguez', totalOrders: 156, totalPrice: 33850.00 },
        { month: 'May', sellerName: 'Sarah Johnson', totalOrders: 189, totalPrice: 42300.80 },
        { month: 'June', sellerName: 'David Kim', totalOrders: 201, totalPrice: 45670.25 },
        { month: 'July', sellerName: 'Sarah Johnson', totalOrders: 223, totalPrice: 51200.50 },
        { month: 'August', sellerName: 'Michael Chen', totalOrders: 198, totalPrice: 47850.75 },
        { month: 'September', sellerName: 'Emily Rodriguez', totalOrders: 176, totalPrice: 38900.25 },
        { month: 'October', sellerName: 'Sarah Johnson', totalOrders: 234, totalPrice: 56780.00 },
        { month: 'November', sellerName: 'David Kim', totalOrders: 267, totalPrice: 62300.50 },
        { month: 'December', sellerName: 'Sarah Johnson', totalOrders: 289, totalPrice: 71250.75 }
      ],
      'branch-002': [
        { month: 'January', sellerName: 'Alex Thompson', totalOrders: 98, totalPrice: 19650.25 },
        { month: 'February', sellerName: 'Lisa Wong', totalOrders: 112, totalPrice: 23400.50 },
        { month: 'March', sellerName: 'Alex Thompson', totalOrders: 134, totalPrice: 27800.75 },
        { month: 'April', sellerName: 'James Miller', totalOrders: 145, totalPrice: 31250.00 },
        { month: 'May', sellerName: 'Lisa Wong', totalOrders: 167, totalPrice: 36700.25 },
        { month: 'June', sellerName: 'Alex Thompson', totalOrders: 189, totalPrice: 42100.50 },
        { month: 'July', sellerName: 'James Miller', totalOrders: 201, totalPrice: 45850.75 },
        { month: 'August', sellerName: 'Lisa Wong', totalOrders: 178, totalPrice: 39200.25 },
        { month: 'September', sellerName: 'Alex Thompson', totalOrders: 156, totalPrice: 34700.00 },
        { month: 'October', sellerName: 'James Miller', totalOrders: 198, totalPrice: 47300.50 },
        { month: 'November', sellerName: 'Lisa Wong', totalOrders: 234, totalPrice: 55600.75 },
        { month: 'December', sellerName: 'Alex Thompson', totalOrders: 267, totalPrice: 64850.25 }
      ],
      'branch-003': [
        { month: 'January', sellerName: 'Maria Garcia', totalOrders: 87, totalPrice: 17300.40 },
        { month: 'February', sellerName: 'Robert Taylor', totalOrders: 95, totalPrice: 18950.60 },
        { month: 'March', sellerName: 'Maria Garcia', totalOrders: 108, totalPrice: 21600.80 },
        { month: 'April', sellerName: 'Jennifer Lee', totalOrders: 123, totalPrice: 24600.00 },
        { month: 'May', sellerName: 'Robert Taylor', totalOrders: 142, totalPrice: 28400.20 },
        { month: 'June', sellerName: 'Maria Garcia', totalOrders: 165, totalPrice: 33000.50 },
        { month: 'July', sellerName: 'Jennifer Lee', totalOrders: 189, totalPrice: 37800.75 },
        { month: 'August', sellerName: 'Robert Taylor', totalOrders: 156, totalPrice: 31200.30 },
        { month: 'September', sellerName: 'Maria Garcia', totalOrders: 134, totalPrice: 26800.60 },
        { month: 'October', sellerName: 'Jennifer Lee', totalOrders: 178, totalPrice: 35600.40 },
        { month: 'November', sellerName: 'Robert Taylor', totalOrders: 203, totalPrice: 40600.80 },
        { month: 'December', sellerName: 'Maria Garcia', totalOrders: 234, totalPrice: 46800.90 }
      ]
    };
    
    return mockData[branchId] || [];
  }
}

// Use mock service for development, switch to real API when ready
export const mockApiService = new MockApiService();
