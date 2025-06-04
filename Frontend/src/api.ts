
export interface SellerSummary {
  month: string;
  seller: string;
  orderCount: number;
  totalPrice: number;
}

export async function fetchSellerSummary(branch: string): Promise<SellerSummary[]> {
  const response = await fetch(`http://localhost:5090/api/sellers?branch=${encodeURIComponent(branch)}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}
