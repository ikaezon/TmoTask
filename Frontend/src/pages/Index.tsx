
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import BranchSelector from '@/components/BranchSelector';
import TopSellersTable from '@/components/TopSellersTable';
import { mockApiService, Branch, TopSellerData } from '@/services/apiService';

const Index = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('');

  // Fetch branches
  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: () => mockApiService.getBranches()
  });

  // Fetch top sellers data when branch is selected
  const { data: topSellersData, isLoading: topSellersLoading } = useQuery({
    queryKey: ['topSellers', selectedBranch],
    queryFn: () => mockApiService.getTopSellers(selectedBranch),
    enabled: !!selectedBranch
  });

  const selectedBranchName = branches?.find(b => b.id === selectedBranch)?.name || '';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Top Performers Report
            </h1>
          </div>
          <p className="text-gray-600">
            Select a branch to view the top-performing seller for each month
          </p>
        </div>

        {/* Branch Selection */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Branch Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <BranchSelector
              branches={branches || []}
              selectedBranch={selectedBranch}
              onBranchChange={setSelectedBranch}
              isLoading={branchesLoading}
            />
          </CardContent>
        </Card>

        {/* Top Sellers Table */}
        {selectedBranch && (
          <TopSellersTable
            data={topSellersData || []}
            isLoading={topSellersLoading}
            branchName={selectedBranchName}
          />
        )}

        {/* Backend Integration Information */}
        {!selectedBranch && (
          <Card className="shadow-sm bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Backend Integration Ready</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 space-y-3">
              <p>This frontend is built to the exact specifications and ready for your .NET Core backend:</p>
              <div className="text-sm space-y-2">
                <h4 className="font-semibold">API Endpoints Expected:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><code className="bg-blue-100 px-1 rounded">GET /api/branches</code> - Returns list of branches from CSV</li>
                  <li><code className="bg-blue-100 px-1 rounded">GET /api/top-sellers?branch=XYZ</code> - Returns top seller per month for selected branch</li>
                </ul>
                <div className="bg-blue-100 p-3 rounded-lg text-blue-800 mt-3">
                  <p className="font-medium">To connect your backend:</p>
                  <p className="text-sm mt-1">
                    1. Update BASE_URL in <code>src/services/apiService.ts</code><br/>
                    2. Replace <code>mockApiService</code> with <code>apiService</code> in the queries above
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
