using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Footprint.web.ViewModel;
using FootPrint.Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Footprint.web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {

        private readonly IAccountManager _accountManager;
        private readonly IAuthorizationService _authorizationService;

        public AccountController(IAccountManager accountManager, IAuthorizationService authorizationService)
        {
            _accountManager = accountManager;
            _authorizationService = authorizationService;
        }


        [HttpGet,Route("userList/{page:int}/{pageSize:int}")]
        [Produces(typeof(List<UserViewModel>))]
        [Authorize(Policies.ViewAllUsersPolicy)]
        public async Task<IActionResult> GetUserList(int page,int pageSize)
        {
            var usersAndRoles = await _accountManager.GetUsersAndRolesAsync(page, pageSize);

            List<UserViewModel> usersVM = new List<UserViewModel>();

            foreach (var item in usersAndRoles)
            {
                var userVM = Mapper.Map<UserViewModel>(item.Item1);
                userVM.Roles = item.Item2;

                usersVM.Add(userVM);
            }

            return Ok(usersVM);
        }

    }
}