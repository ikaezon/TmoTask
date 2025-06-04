using Backend.Models;
using CsvHelper;
using System.Globalization;

namespace Backend.Services
{
    public class OrderService : IOrderService
    {
        protected List<Order> _orders;

        public OrderService()
        {
            _orders = LoadOrders() ?? new List<Order>();
        }

        protected virtual List<Order> LoadOrders()
        {
            try
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "orders.csv");
                using var reader = new StreamReader(filePath);
                using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
                return csv.GetRecords<Order>().ToList();
            }
            catch
            {
                return new List<Order>();
            }
        }

        public List<string> GetBranches()
        {
            return _orders?.Select(o => o.Branch).Distinct().ToList() ?? new List<string>();
        }

        public List<SellerSummary> GetTopSellersByBranch(string branch)
        {
            if (string.IsNullOrWhiteSpace(branch))
            {
                throw new ArgumentException("Branch name cannot be null or empty.", nameof(branch));
            }

            if (_orders == null)
            {
                return new List<SellerSummary>();
            }

            var filtered = _orders
                .Where(o => o.Branch.Equals(branch, StringComparison.OrdinalIgnoreCase))
                .Where(o => o.OrderDate != DateTime.MinValue) // Filter out invalid dates
                .Where(o => o.OrderDate.Date <= DateTime.Now.Date) // Filter out future dates
                .Select(o => new { o.OrderDate, o.Seller, Price = Math.Max(0, o.Price) }); // Handle negative prices

            if (!filtered.Any())
            {
                return new List<SellerSummary>();
            }

            var summary = filtered
                .GroupBy(o => new { Month = o.OrderDate.ToString("MMMM"), o.Seller })
                .Select(g => new SellerSummary
                {
                    Month = g.Key.Month,
                    Seller = g.Key.Seller,
                    OrderCount = g.Count(),
                    TotalPrice = SafeSum(g.Select(o => o.Price))
                })
                .ToList();

            // Select top seller for each month with alphabetical tie-breaking
            var topSellers = summary
                .GroupBy(s => s.Month)
                .Select(g => g.OrderByDescending(s => s.TotalPrice)
                            .ThenBy(s => s.Seller) // Alphabetical tie-breaking
                            .First())
                .ToList();

            return topSellers;
        }

        private static decimal SafeSum(IEnumerable<decimal> values)
        {
            decimal sum = 0;
            foreach (var value in values)
            {
                try
                {
                    checked
                    {
                        sum += value;
                    }
                }
                catch (OverflowException)
                {
                    // If overflow occurs, return the maximum possible value
                    return decimal.MaxValue;
                }
            }
            return sum;
        }
    }
}
