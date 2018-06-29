using AutoMapper;
using FootPrint.Business.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Footprint.web.ViewModel
{
    public class AutoMapperProfile: Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>()
                 .ForMember(d => d.Roles, map => map.Ignore());
            CreateMap<UserViewModel, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore());


            //CreateMap<ApplicationUser, UserViewModel>()
            //       .ForMember(d => d.Roles, map => map.Ignore());
            //CreateMap<UserViewModel, ApplicationUser>()
            //    .ForMember(d => d.Roles, map => map.Ignore());

            //CreateMap<ApplicationUser, UserEditViewModel>()
            //    .ForMember(d => d.Roles, map => map.Ignore());
            //CreateMap<UserEditViewModel, ApplicationUser>()
            //    .ForMember(d => d.Roles, map => map.Ignore());
        }

    }
}
