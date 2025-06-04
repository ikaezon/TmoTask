using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/sellers")]
    public class SellersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public SellersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public IActionResult GetSellers([FromQuery] string branch)
        {
            if (string.IsNullOrEmpty(branch))
                return BadRequest("Branch is required.");

            var sellers = _orderService.GetTopSellersByBranch(branch);
            return Ok(sellers);
        }
    }
}
