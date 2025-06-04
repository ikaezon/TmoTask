using Backend.Models;

namespace Backend.Services
{
    public interface IOrderService
    {
        List<string> GetBranches();
        List<SellerSummary> GetTopSellersByBranch(string branch);
    }
}
