
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface TopSellerData {
  month: string;
  sellerName: string;
  totalOrders: number;
  totalPrice: number;
}

interface TopSellersTableProps {
  data: TopSellerData[];
  isLoading: boolean;
  branchName?: string;
}

const TopSellersTable = ({ data, isLoading, branchName }: TopSellersTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading top performers data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
          Top Performers by Month
          {branchName && <span className="text-sm font-normal text-gray-500">- {branchName}</span>}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Best performing seller for each month based on total sales value
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-700">Month</TableHead>
                <TableHead className="font-semibold text-gray-700">Seller Name</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Count of Total Orders</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((seller) => (
                <TableRow 
                  key={seller.month} 
                  className="border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {seller.month}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {seller.sellerName}
                  </TableCell>
                  <TableCell className="text-right font-mono text-gray-700">
                    {seller.totalOrders.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-gray-700 font-medium">
                    {formatCurrency(seller.totalPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSellersTable;
