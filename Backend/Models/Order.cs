namespace Backend.Models
{
    public class Order
    {
        public string Seller { get; set; }
        public string Product { get; set; }
        public decimal Price { get; set; }
        public DateTime OrderDate { get; set; }
        public string Branch { get; set; }
    }
}
