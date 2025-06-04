using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/branches")]
    public class BranchController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public BranchController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public IActionResult GetBranches()
        {
            var branches = _orderService.GetBranches();
            return Ok(branches);
        }
    }
}
