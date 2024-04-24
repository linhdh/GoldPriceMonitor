
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
                    policy.WithOrigins("http://localhost:4200").AllowAnyMethod();
                });
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            builder.Services.AddDbContext<GoldPriceDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("default")));
            builder.Services.AddHangfire(configuration => configuration.SetDataCompatibilityLevel(CompatibilityLevel.Version_180).UseSimpleAssemblyNameTypeSerializer().UseRecommendedSerializerSettings().UseSqlServerStorage(builder.Configuration.GetConnectionString("HangFireConnection")));

            builder.Services.AddHangfireServer();

            builder.Services.AddScoped<IHangFireService, HangFireService>();

            var app = builder.Build();

            app.UseHangfireDashboard();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseHttpsRedirection();
            }            

            app.UseCors();

            //app.UseAuthorization();

            app.MapHangfireDashboard();

            app.MapControllers();

            app.Run();
        }
    }
}
