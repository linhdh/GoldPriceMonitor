
using GoldPriceMonitorApi_DotNet.Services;
using Hangfire;
using Hangfire.Storage.SQLite;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using Hangfire.MySql;
using DatabaseContext;
using Microsoft.AspNetCore.Routing;
using Microsoft.OpenApi.Models;


namespace GoldPriceMonitorApi_DotNet
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "MyCORSPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:4200", "http://b3.myddns.me:4300", "http://192.168.100.200:4300").AllowAnyHeader().AllowAnyMethod();
                });
            });

            builder.Services.AddControllers();

            builder.Services.AddIdentityApiEndpoints<ApplicationUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = false;
            }).AddEntityFrameworkStores<GoldPriceDbContext>();
            builder.Services.AddAuthorization();
            
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Gold Price Monitor", Version = "v1" });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });

            builder.Services.AddDbContext<GoldPriceDbContext>(options =>
            {
                var provider = builder.Configuration["DatabaseSettings:Provider"]?.ToString();
                switch (provider)
                {
                    case "MYSQL":
                        options.UseMySql(builder.Configuration.GetConnectionString("MYSQL"), ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("MYSQL")), b => b.MigrationsAssembly("MYSQL_Migrations"));
                        break;
                    case "MSSQL":
                        options.UseSqlServer(builder.Configuration.GetConnectionString("MSSQL"), b => b.MigrationsAssembly("MSSQL_Migrations"));
                        break;
                    default:
                        throw new NotSupportedException("Database provider is not supported");
                }
            });
            builder.Services.AddHangfire(configuration =>
            {
                var provider = builder.Configuration["HangFireSettings:Storage"]?.ToString();
                switch(provider)
                {
                    case "MYSQL":
                        configuration.SetDataCompatibilityLevel(CompatibilityLevel.Version_180).UseSimpleAssemblyNameTypeSerializer().UseRecommendedSerializerSettings().UseStorage(new MySqlStorage(builder.Configuration.GetConnectionString("HangFire_MYSQL"), new MySqlStorageOptions
                        {
                            QueuePollInterval = TimeSpan.FromSeconds(10),
                            JobExpirationCheckInterval = TimeSpan.FromHours(1),
                            CountersAggregateInterval = TimeSpan.FromMinutes(5),
                            PrepareSchemaIfNecessary = true,
                            TransactionTimeout = TimeSpan.FromMinutes(1),
                        }));
                        break;
                    case "SQLLITE":
                        configuration.UseSimpleAssemblyNameTypeSerializer().UseRecommendedSerializerSettings().UseSQLiteStorage();
                        break;
                    case "MSSQL":
                        configuration.SetDataCompatibilityLevel(CompatibilityLevel.Version_180).UseSimpleAssemblyNameTypeSerializer().UseRecommendedSerializerSettings().UseSqlServerStorage(builder.Configuration.GetConnectionString("HangFire_MSSQL"));
                        break;
                    default:
                        throw new NotSupportedException("HangFire storage is not supported.");
                }
            });

            builder.Services.AddHangfireServer();

            builder.Services.AddScoped<IHangFireService, HangFireService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseHangfireDashboard();

            app.UseSwagger();
            app.UseSwaggerUI();

            if (app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }            

            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapHangfireDashboard();

            app.MapGroup("api/identity").MapIdentityApi<ApplicationUser>()/*.AllowAnonymous()*/;

            app.MapControllers();

            app.Run();
        }
    }
}
