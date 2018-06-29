using Footprint.web.Filter;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Footprint.web.ViewModel
{
    public class UserViewModel
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "用户名不能为空"), StringLength(50, MinimumLength = 7, ErrorMessage = "用户名长度在7到50之间")]
        public string UserName { get; set; }

        public string FullName { get; set; }

        //[Required(ErrorMessage = "Email is required"), StringLength(200, ErrorMessage = "Email must be at most 200 characters"), EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        public string JobTitle { get; set; }

        public string PhoneNumber { get; set; }

        public string Configuration { get; set; }

        public bool IsEnabled { get; set; }

        public bool IsLockedOut { get; set; }

        [MinimumCount(1, ErrorMessage = "用户组不能为空")]
        public string[] Roles { get; set; }

    }
}
