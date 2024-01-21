using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GoldPriceMonitorApi_DotNet.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BaoTinMinhChaus",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HamLuongKara = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HamLuongVang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GiaMuaVao = table.Column<float>(type: "real", nullable: false),
                    GiaBanRa = table.Column<float>(type: "real", nullable: false),
                    GiaTheGioi = table.Column<float>(type: "real", nullable: false),
                    ThoiGianNhap = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaoTinMinhChaus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VangSjcs",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BuyPrice = table.Column<float>(type: "real", nullable: false),
                    SellPrice = table.Column<float>(type: "real", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VangSjcs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaoTinMinhChaus");

            migrationBuilder.DropTable(
                name: "VangSjcs");
        }
    }
}
