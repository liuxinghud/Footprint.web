using System;
using System.Collections.Generic;
using System.Text;

namespace FootPrint.Business.Models
{
    public class UserModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Password { get; set; }

        public DateTime Birthday { get; set; }


    }
}
