namespace Backend.Models
{
    public class SellerSummary
    {
        public string Month { get; set; }
        public string Seller { get; set; }
        public int OrderCount { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
