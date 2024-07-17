using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DatabaseContext
{
    public class GoldPriceDbContext : IdentityDbContext<ApplicationUser>
    {
        public GoldPriceDbContext(DbContextOptions<GoldPriceDbContext> options) : base(options) { }

        public DbSet<BaoTinMinhChau> BaoTinMinhChaus { get; set; }
        public DbSet<VangSjc> VangSjcs { get; set; }
    }
}
