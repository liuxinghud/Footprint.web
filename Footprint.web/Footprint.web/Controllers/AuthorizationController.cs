using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Server;
using FootPrint.Business;
using FootPrint.Business.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;

namespace Footprint.web.Controllers
{
    [Route("api/[controller]")]//api/authorization/'
    [AllowAnonymous]
    public class AuthorizationController : Controller
    {
        //private IConfiguration Configuration { get; }
        //private readonly SignInManager<ApplicationUser> _signInManager;
        //private readonly UserManager<ApplicationUser> _userManager;
        ////private RoleManager<ApplicationRole> _roleManager;
        //private readonly IOptions<IdentityOptions> _identityOptions;
        //public AuthorizationController(IConfiguration configuration, SignInManager<ApplicationUser> signInManager,
        //    UserManager<ApplicationUser> userManager,)
        //{
        //    this._signInManager = signInManager;
        //    this._userManager = userManager;
        //    this.Configuration = configuration;
        //    //this._roleManager = roleManager;
        //}
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthorizationController(
            IOptions<IdentityOptions> identityOptions,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager)
        {
            _identityOptions = identityOptions;
            _signInManager = signInManager;
            _userManager = userManager;
        }





        [HttpPost, Route("token")]
        [Produces("application/json")]
        public async Task<IActionResult> LogIn(OpenIdConnectRequest request)
        {
            //var user = await _userManager.FindByEmailAsync(userLogin.UserName) ?? await _userManager.FindByNameAsync(userLogin.UserName);
            //if (user == null)
            //{
            //    ModelState.AddModelError("username", "用户不存在");
            //    return BadRequest(ModelState);
            //}
            //// Ensure the user is enabled.
            //if (user.IsDisabled)
            //{
            //    ModelState.AddModelError("username", "用户不存在");
            //    return BadRequest(ModelState);
            //}
            //// Validate the username/password parameters and ensure the account is not locked out.
            //var result = await _signInManager.CheckPasswordSignInAsync(user, userLogin.Password, true);

            //// Ensure the user is not already locked out.
            //if (result.IsLockedOut)
            //{
            //    ModelState.AddModelError("username", "用户已被锁定");
            //    return BadRequest(ModelState);
            //}

            //// Reject the token request if two-factor authentication has been enabled by the user.
            //if (result.RequiresTwoFactor)
            //{
            //    ModelState.AddModelError(string.Empty, "双因素验证失败");
            //    return BadRequest(ModelState);
            //}

            //// Ensure the user is allowed to sign in.
            //if (result.IsNotAllowed)
            //{
            //    ModelState.AddModelError(string.Empty, "指定用户不允许登录");
            //    return BadRequest(ModelState);
            //}

            //if (!result.Succeeded)
            //{
            //    ModelState.AddModelError(string.Empty, "请检查用户名或密码是否正确");
            //    return BadRequest(ModelState);
            //}

            if (request.IsPasswordGrantType())
            {
                var user = await _userManager.FindByEmailAsync(request.Username) ?? await _userManager.FindByNameAsync(request.Username);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Code = "username",
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "账号不存在"
                    });
                }

                // Ensure the user is enabled.
                if (user.IsDisabled)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Code = "username",
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "账号已被禁用"
                    });
                }


                // Validate the username/password parameters and ensure the account is not locked out.
                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);

                // Ensure the user is not already locked out.
                if (result.IsLockedOut)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Code = "username",
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "帐户已锁定"
                    });
                }

                // Reject the token request if two-factor authentication has been enabled by the user.
                if (result.RequiresTwoFactor)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Code = "username",
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Invalid login procedure"
                    });
                }

                // Ensure the user is allowed to sign in.
                if (result.IsNotAllowed)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Code = "username",
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "账号不允许登录"
                    });
                }

                if (!result.Succeeded)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Code = "password",
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "密码不正确"
                    });
                }



                // Create a new authentication ticket.
                var ticket = await CreateTicketAsync(request, user);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if (request.IsRefreshTokenGrantType())
            {
                // Retrieve the claims principal stored in the refresh token.
                var info = await HttpContext.AuthenticateAsync(OpenIdConnectServerDefaults.AuthenticationScheme);

                // Retrieve the user profile corresponding to the refresh token.
                // Note: if you want to automatically invalidate the refresh token
                // when the user password/roles change, use the following line instead:
                // var user = _signInManager.ValidateSecurityStampAsync(info.Principal);
                var user = await _userManager.GetUserAsync(info.Principal);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The refresh token is no longer valid"
                    });
                }

                // Ensure the user is still allowed to sign in.
                if (!await _signInManager.CanSignInAsync(user))
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The user is no longer allowed to sign in"
                    });
                }

                // Create a new authentication ticket, but reuse the properties stored
                // in the refresh token, including the scopes originally granted.
                var ticket = await CreateTicketAsync(request, user);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            return BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported"
            });



        }


        private async Task<AuthenticationTicket> CreateTicketAsync(OpenIdConnectRequest request, ApplicationUser user)
        {
            // Create a new ClaimsPrincipal containing the claims that
            // will be used to create an id_token, a token or a code.
            var principal = await _signInManager.CreateUserPrincipalAsync(user);

            // Create a new authentication ticket holding the user identity.
            var ticket = new AuthenticationTicket(principal, new AuthenticationProperties(), OpenIdConnectServerDefaults.AuthenticationScheme);


            //if (!request.IsRefreshTokenGrantType())
            //{
            // Set the list of scopes granted to the client application.
            // Note: the offline_access scope must be granted
            // to allow OpenIddict to return a refresh token.
            ticket.SetScopes(new[]
            {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Phone,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
            }.Intersect(request.GetScopes()));
            //}

            //ticket.SetResources(request.GetResources());
            ticket.SetResources(request.Resources);
            // Note: by default, claims are NOT automatically included in the access and identity tokens.
            // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
            // whether they should be included in access tokens, in identity tokens or in both.

            foreach (var claim in ticket.Principal.Claims)
            {
                // Never include the security stamp in the access and identity tokens, as it's a secret value.
                if (claim.Type == _identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                    continue;


                var destinations = new List<string> { OpenIdConnectConstants.Destinations.AccessToken };

                // Only add the iterated claim to the id_token if the corresponding scope was granted to the client application.
                // The other claims will only be added to the access_token, which is encrypted when using the default format.
                if ((claim.Type == OpenIdConnectConstants.Claims.Subject && ticket.HasScope(OpenIdConnectConstants.Scopes.OpenId)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Role && ticket.HasScope(OpenIddictConstants.Claims.Roles)) ||
                    (claim.Type == CustomClaimTypes.Permission && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                {
                    destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);
                }


                claim.SetDestinations(destinations);
            }


            var identity = principal.Identity as ClaimsIdentity;


            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Profile))
            {
                //if (!string.IsNullOrWhiteSpace(user.JobTitle))
                //    identity.AddClaim(CustomClaimTypes.JobTitle, user.JobTitle, OpenIdConnectConstants.Destinations.IdentityToken);

                if (!string.IsNullOrWhiteSpace(user.Name))
                    identity.AddClaim(CustomClaimTypes.FullName, user.Name, OpenIdConnectConstants.Destinations.IdentityToken);

                //if (!string.IsNullOrWhiteSpace(user.Configuration))
                //    identity.AddClaim(CustomClaimTypes.Configuration, user.Configuration, OpenIdConnectConstants.Destinations.IdentityToken);
            }

            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Email))
            {
                if (!string.IsNullOrWhiteSpace(user.Email))
                    identity.AddClaim(CustomClaimTypes.Email, user.Email, OpenIdConnectConstants.Destinations.IdentityToken);
            }

            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Phone))
            {
                if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                    identity.AddClaim(CustomClaimTypes.Phone, user.PhoneNumber, OpenIdConnectConstants.Destinations.IdentityToken);
            }
            

            return ticket;
        }


















    }
}