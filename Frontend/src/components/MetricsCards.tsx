
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

interface MetricsCardsProps {
  branchName: string;
  totalOrders: number;
  totalRevenue: number;
}

const MetricsCards = ({ branchName, totalOrders, totalRevenue }: MetricsCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Selected Branch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-gray-900 leading-tight">
            {branchName}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Total Orders (Year)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">
            {totalOrders.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Revenue (Year)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Avg. Order Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(averageOrderValue)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
