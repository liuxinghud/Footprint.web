using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace FootPrint.Business.Models
{
    public class ApplicationUser : IdentityUser<long>
    {
        public string Name { get; set; }
        public bool IsDisabled { get; set; }

        public string LoginIp { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsLockedOut => this.LockoutEnabled && this.LockoutEnd >= DateTimeOffset.UtcNow;
        public virtual ICollection<IdentityUserRole<long>> Roles { get; set; }
        public virtual ICollection<IdentityUserClaim<long>> Claims { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
