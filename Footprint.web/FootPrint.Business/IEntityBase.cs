using FootPrint.Business.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FootPrint.Business
{
   public interface IEntityBase
    {
         ApplicationUser CreatedBy { get; set; }
        ApplicationUser UpdatedBy { get; set; }
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }
}
