using Xunit;
using Backend.Models;
using Backend.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Tests.Services
{
    /// <summary>
    /// Tests for OrderService class which handles sales performance tracking across branches
    /// </summary>
    public class OrderServiceTests
    {
        // Test implementation of OrderService that uses in-memory test data
        private class TestOrderService : OrderService
        {
            private readonly List<Order> _testOrders;

            public TestOrderService(List<Order> testOrders)
            {
                _testOrders = testOrders;
                base._orders = _testOrders;
            }

            protected override List<Order> LoadOrders()
            {
                return _testOrders;
            }
        }

        // Creates a standard set of test orders across different branches and months
        private static List<Order> CreateTestOrders()
        {
            return new List<Order>
            {
                // Branch1 - January orders
                new Order { Branch = "Branch1", Seller = "Alice", OrderDate = new DateTime(2023, 1, 1), Price = 100 },
                new Order { Branch = "Branch1", Seller = "Alice", OrderDate = new DateTime(2023, 1, 15), Price = 100 },
                new Order { Branch = "Branch1", Seller = "Bob", OrderDate = new DateTime(2023, 1, 5), Price = 150 },
                // Branch1 - February orders
                new Order { Branch = "Branch1", Seller = "Charlie", OrderDate = new DateTime(2023, 2, 1), Price = 200 },
                new Order { Branch = "Branch1", Seller = "David", OrderDate = new DateTime(2023, 2, 15), Price = 200 },
                // Other branches - January orders
                new Order { Branch = "Branch2", Seller = "Eve", OrderDate = new DateTime(2023, 1, 1), Price = 300 },
                new Order { Branch = "Branch3", Seller = "Frank", OrderDate = new DateTime(2023, 1, 1), Price = 250 },
                // Edge cases
                new Order { Branch = "Branch1", Seller = "Alice", OrderDate = new DateTime(2023, 3, 1), Price = -50 }, // Negative price
                new Order { Branch = "Branch1", Seller = "Bob", OrderDate = new DateTime(), Price = 100 }, // Invalid date
            };
        }

        // Basic functionality tests
        
        /// <summary>
        /// Verifies that GetBranches returns all unique branch names
        /// </summary>
        [Fact]
        public void GetBranches_ReturnsDistinctBranches()
        {
            // Arrange
            var service = new TestOrderService(CreateTestOrders());

            // Act
            var branches = service.GetBranches();

            // Assert
            Assert.Equal(3, branches.Count);
            Assert.Contains("Branch1", branches);
            Assert.Contains("Branch2", branches);
            Assert.Contains("Branch3", branches);
        }

        /// <summary>
        /// Verifies that invalid branch names throw appropriate exceptions
        /// </summary>
        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData(" ")]
        public void GetTopSellersByBranch_ThrowsOnInvalidBranchName(string branchName)
        {
            // Arrange
            var service = new TestOrderService(CreateTestOrders());

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => service.GetTopSellersByBranch(branchName));
            Assert.Contains("Branch name cannot be null or empty", exception.Message);
        }

        /// <summary>
        /// Verifies that non-existent branch names return empty results
        /// </summary>
        [Fact]
        public void GetTopSellersByBranch_ReturnsEmptyListForNonExistentBranch()
        {
            // Arrange
            var service = new TestOrderService(CreateTestOrders());

            // Act
            var result = service.GetTopSellersByBranch("NonExistentBranch");

            // Assert
            Assert.Empty(result);
        }

        // Branch-specific tests
        
        /// <summary>
        /// Comprehensive test of Branch1's performance across all months
        /// Tests January (Alice: $200), February (Charlie: $200), March (Alice: $0)
        /// </summary>
        [Fact]
        public void Branch1_VerifyAllMonths()
        {
            // Arrange
            var service = new TestOrderService(CreateTestOrders());
            var results = service.GetTopSellersByBranch("Branch1");
            
            // Assert
            Assert.Equal(3, results.Count); // Should have results for January, February, March

            // January
            var january = results.First(r => r.Month == "January");
            Assert.Equal("Alice", january.Seller); // Alice wins with $200
            Assert.Equal(200, january.TotalPrice); // Two orders of $100 each
            Assert.Equal(2, january.OrderCount);

            // February
            var february = results.First(r => r.Month == "February");
            Assert.Equal("Charlie", february.Seller); // Charlie wins tie with David alphabetically
            Assert.Equal(200, february.TotalPrice);
            Assert.Equal(1, february.OrderCount);

            // March
            var march = results.First(r => r.Month == "March");
            Assert.Equal("Alice", march.Seller);
            Assert.Equal(0, march.TotalPrice); // Negative price converted to 0
            Assert.Equal(1, march.OrderCount);
        }

        // Edge case tests
        
        /// <summary>
        /// Tests tie-breaking rules when sellers have same total sales:
        /// - Same total, different order counts
        /// - Exact same amounts
        /// </summary>
        [Fact]
        public void Branch1_EdgeCase_TieBreaking()
        {
            // Arrange
            var testOrders = new List<Order>
            {
                // January - Same total, different order counts
                new Order { Branch = "Branch1", Seller = "Alice", OrderDate = new DateTime(2023, 1, 1), Price = 200 },
                new Order { Branch = "Branch1", Seller = "Bob", OrderDate = new DateTime(2023, 1, 1), Price = 100 },
                new Order { Branch = "Branch1", Seller = "Bob", OrderDate = new DateTime(2023, 1, 1), Price = 100 },
                
                // February - Exact same amounts
                new Order { Branch = "Branch1", Seller = "Charlie", OrderDate = new DateTime(2023, 2, 1), Price = 100 },
                new Order { Branch = "Branch1", Seller = "Alice", OrderDate = new DateTime(2023, 2, 1), Price = 100 }
            };
            var service = new TestOrderService(testOrders);

            // Act
            var results = service.GetTopSellersByBranch("Branch1");

            // Assert
            // January - Same total, different order counts
            var january = results.First(r => r.Month == "January");
            Assert.Equal("Alice", january.Seller); // Alice wins (alphabetical when tied)
            Assert.Equal(200, january.TotalPrice);
            Assert.Equal(1, january.OrderCount);

            // February - Exact same amounts
            var february = results.First(r => r.Month == "February");
            Assert.Equal("Alice", february.Seller); // Alice wins (alphabetical)
            Assert.Equal(100, february.TotalPrice);
            Assert.Equal(1, february.OrderCount);
        }

        /// <summary>
        /// Tests handling of large decimal values across branches:
        /// - Values near decimal.MaxValue
        /// - Multiple large value comparisons
        /// </summary>
        [Fact]
        public void AllBranches_EdgeCase_LargeNumbers()
        {
            // Arrange
            var testOrders = new List<Order>
            {
                // Branch1 - January
                new Order { Branch = "Branch1", Seller = "Alice", OrderDate = new DateTime(2023, 1, 1), Price = decimal.MaxValue / 2 },
                new Order { Branch = "Branch1", Seller = "Bob", OrderDate = new DateTime(2023, 1, 1), Price = decimal.MaxValue - 1 },
                
                // Branch2 - January
                new Order { Branch = "Branch2", Seller = "Charlie", OrderDate = new DateTime(2023, 1, 1), Price = decimal.MaxValue },
                
                // Branch3 - January
                new Order { Branch = "Branch3", Seller = "David", OrderDate = new DateTime(2023, 1, 1), Price = decimal.MaxValue / 4 }
            };
            var service = new TestOrderService(testOrders);

            // Act & Assert
            // Branch1
            var branch1Results = service.GetTopSellersByBranch("Branch1");
            var branch1January = branch1Results.First(r => r.Month == "January");
            Assert.Equal("Bob", branch1January.Seller);
            Assert.Equal(decimal.MaxValue - 1, branch1January.TotalPrice);

            // Branch2
            var branch2Results = service.GetTopSellersByBranch("Branch2");
            var branch2January = branch2Results.First(r => r.Month == "January");
            Assert.Equal("Charlie", branch2January.Seller);
            Assert.Equal(decimal.MaxValue, branch2January.TotalPrice);

            // Branch3
            var branch3Results = service.GetTopSellersByBranch("Branch3");
            var branch3January = branch3Results.First(r => r.Month == "January");
            Assert.Equal("David", branch3January.Seller);
            Assert.Equal(decimal.MaxValue / 4, branch3January.TotalPrice);
        }

        /// <summary>
        /// Tests handling of invalid and future dates:
        /// - Orders with default DateTime
        /// - Orders with future dates
        /// - Mix of valid and invalid dates
        /// </summary>
        [Fact]
        public void AllBranches_EdgeCase_InvalidAndFutureDates()
        {
            // Arrange
            var futureDate = DateTime.Now.AddYears(1);
            var testOrders = new List<Order>
            {
                // Branch1
                new Order { Branch = "Branch1", Seller = "Alice", OrderDate = new DateTime(), Price = 100 }, // Invalid date
                new Order { Branch = "Branch1", Seller = "Alice", OrderDate = futureDate, Price = 100 }, // Future date
                new Order { Branch = "Branch1", Seller = "Bob", OrderDate = new DateTime(2023, 1, 1), Price = 100 }, // Valid date
                
                // Branch2
                new Order { Branch = "Branch2", Seller = "Charlie", OrderDate = new DateTime(), Price = 200 }, // Invalid date
                new Order { Branch = "Branch2", Seller = "Charlie", OrderDate = futureDate, Price = 200 }, // Future date
                new Order { Branch = "Branch2", Seller = "David", OrderDate = new DateTime(2023, 1, 1), Price = 200 } // Valid date
            };
            var service = new TestOrderService(testOrders);

            // Act & Assert
            // Branch1
            var branch1Results = service.GetTopSellersByBranch("Branch1");
            Assert.Single(branch1Results); // Only valid date should be included
            Assert.Equal("Bob", branch1Results.First().Seller);
            Assert.Equal("January", branch1Results.First().Month);

            // Branch2
            var branch2Results = service.GetTopSellersByBranch("Branch2");
            Assert.Single(branch2Results);
            Assert.Equal("David", branch2Results.First().Seller);
            Assert.Equal("January", branch2Results.First().Month);
        }
    }
} 