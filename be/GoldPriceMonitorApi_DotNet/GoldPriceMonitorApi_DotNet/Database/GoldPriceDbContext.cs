using Microsoft.EntityFrameworkCore;

namespace GoldPriceMonitorApi_DotNet.Database
{
    public class GoldPriceDbContext : DbContext
    {
        public GoldPriceDbContext(DbContextOptions<GoldPriceDbContext> options) : base(options) { }

        public DbSet<BaoTinMinhChau> BaoTinMinhChaus { get; set; }

    }
}
