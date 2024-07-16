using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace GoldPriceMonitorApi_DotNet.Services
{
    public class MySecurityStampValidator : ISecurityStampValidator
    {
        public Task ValidateAsync(CookieValidatePrincipalContext context)
        {
            return Task.CompletedTask;
        }
    }
}
