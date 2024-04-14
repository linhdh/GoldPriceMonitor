
using GoldPriceMonitorApi_DotNet.Database;
using GoldPriceMonitorApi_DotNet.Services;
using Hangfire;
using Hangfire.Storage.SQLite;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace GoldPriceMonitorApi_DotNet
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "MyCORSPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:4200", "http://b3.myddns.me:4300/", "http://192.168.100.200:4300").AllowAnyMethod();
                });
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<GoldPriceDbContext>(options => options.UseMySql(builder.Configuration.GetConnectionString("default"), ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("default"))));
            builder.Services.AddHangfire(configuration => configuration.UseSimpleAssemblyNameTypeSerializer().UseRecommendedSerializerSettings().UseSQLiteStorage());

            builder.Services.AddHangfireServer();

            builder.Services.AddScoped<IHangFireService, HangFireService>();

            var app = builder.Build();

            app.UseHangfireDashboard();

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            if (app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }            

            app.UseCors();

            app.UseAuthorization();

            app.MapHangfireDashboard();

            app.MapControllers();

            app.Run();
        }
    }
}
