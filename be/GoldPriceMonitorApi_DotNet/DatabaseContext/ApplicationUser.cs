using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace DatabaseContext
{
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(64)]
        public string? FirstName { get; set; }
        
        [MaxLength(64)]
        public string? LastName { get; set; }
        
        public DateOnly? BirthDay { get; set; }
    }
}
