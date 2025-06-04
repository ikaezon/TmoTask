
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
}

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
  isLoading: boolean;
}

const BranchSelector = ({ branches, selectedBranch, onBranchChange, isLoading }: BranchSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Building2 className="h-4 w-4" />
        Select Branch
      </label>
      <Select
        value={selectedBranch}
        onValueChange={onBranchChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full max-w-sm bg-white border border-gray-300 hover:border-blue-400 transition-colors">
          <SelectValue 
            placeholder={isLoading ? "Loading branches..." : "Choose a branch"} 
          />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
          {branches?.map((branch) => (
            <SelectItem 
              key={branch.id} 
              value={branch.id}
              className="hover:bg-blue-50 cursor-pointer"
            >
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;
