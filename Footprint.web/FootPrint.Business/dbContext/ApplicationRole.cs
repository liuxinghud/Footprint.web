using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace FootPrint.Business.Models
{
    public class ApplicationRole : IdentityRole<long>, IEntityBase
    {
         public ApplicationRole() { }
        public ApplicationRole(string roleName):base(roleName) {}

        public virtual ICollection<IdentityUserRole<long>> Users { get; set; }
        public virtual ICollection<IdentityRoleClaim<long>> Claims { get; set; }
        public ApplicationUser CreatedBy { get; set; }
        public ApplicationUser UpdatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
