/// <reference types="jest" />
import '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import * as api from './api';

jest.mock('./api');

const mockData = [
  { month: 'January', seller: 'Seller A', orderCount: 5, totalPrice: 1234.56 },
  { month: 'February', seller: 'Seller B', orderCount: 3, totalPrice: 789.01 },
];

describe('Key Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. The branch dropdown list', () => {
    it('renders and handles branch selection correctly', async () => {
      jest.spyOn(api, 'fetchSellerSummary').mockResolvedValue(mockData);
      render(<App />);
      
      // Check dropdown exists
      const dropdown = screen.getByRole('combobox', { name: /Select Branch to View Performance Data/i });
      expect(dropdown).toBeInTheDocument();
      
      // Test branch selection
      fireEvent.change(dropdown, { target: { value: 'Branch 2' } });
      await waitFor(() => {
        expect(api.fetchSellerSummary).toHaveBeenCalledWith('Branch 2');
      });
    });
  });

  describe('2. The table that displays the top sellers', () => {
    it('displays seller data in table format', async () => {
      jest.spyOn(api, 'fetchSellerSummary').mockResolvedValue(mockData);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('January')).toBeInTheDocument();
        expect(screen.getByText('Seller A')).toBeInTheDocument();
        expect(screen.getByText('February')).toBeInTheDocument();
      });
    });
  });

  describe('3. Proper rendering of seller data after branch selection', () => {
    it('updates data when branch changes', async () => {
      const mockBranch2Data = [
        { month: 'March', seller: 'Seller C', orderCount: 7, totalPrice: 2345.67 }
      ];
      
      const apiSpy = jest.spyOn(api, 'fetchSellerSummary')
        .mockResolvedValueOnce(mockData)
        .mockResolvedValueOnce(mockBranch2Data);

      render(<App />);
      
      // Initial data load
      await waitFor(() => {
        expect(screen.getByText('Seller A')).toBeInTheDocument();
      });

      // Change branch
      const dropdown = screen.getByRole('combobox', { name: /Select Branch to View Performance Data/i });
      fireEvent.change(dropdown, { target: { value: 'Branch 2' } });

      // Check new data renders
      await waitFor(() => {
        expect(screen.getByText('Seller C')).toBeInTheDocument();
      });
    });

    it('handles error states', async () => {
      jest.spyOn(api, 'fetchSellerSummary').mockRejectedValue(new Error('API Error'));
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText(/Error Loading Data/i)).toBeInTheDocument();
      });
    });

    it('handles empty data states', async () => {
      jest.spyOn(api, 'fetchSellerSummary').mockResolvedValue([]);
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText(/No Data Available/i)).toBeInTheDocument();
      });
    });
  });
});
