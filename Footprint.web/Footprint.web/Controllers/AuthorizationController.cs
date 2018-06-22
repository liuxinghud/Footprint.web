using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FootPrint.Business.Models;
using IdentityModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Footprint.web.Controllers
{
    [Route("api/[controller]")]//api/authorization/'
    [AllowAnonymous]
    public class AuthorizationController : Controller
    {
        private IConfiguration Configuration { get; }
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public AuthorizationController(IConfiguration configuration, SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager)
        {
            this._signInManager = signInManager;
            this._userManager = userManager;
            this.Configuration = configuration;
        }

        [HttpPost, Route("token")]
        [Produces("application/json")]
        public async Task<IActionResult> LogIn([FromBody] UserLogin userLogin)
        {
            var user = await _userManager.FindByEmailAsync(userLogin.UserName) ?? await _userManager.FindByNameAsync(userLogin.UserName);
            if (user == null)
            {
                ModelState.AddModelError("username", "用户不存在");
                return BadRequest(ModelState);
            }
            // Ensure the user is enabled.
            if (user.IsDisabled)
            {
                ModelState.AddModelError("username", "用户不存在");
                return BadRequest(ModelState);
            }
            // Validate the username/password parameters and ensure the account is not locked out.
            var result = await _signInManager.CheckPasswordSignInAsync(user, userLogin.Password, true);

            // Ensure the user is not already locked out.
            if (result.IsLockedOut)
            {
                ModelState.AddModelError("username", "用户已被锁定");
                return BadRequest(ModelState);
            }

            // Reject the token request if two-factor authentication has been enabled by the user.
            if (result.RequiresTwoFactor)
            {
                ModelState.AddModelError(string.Empty, "双因素验证失败");
                return BadRequest(ModelState);
            }

            // Ensure the user is allowed to sign in.
            if (result.IsNotAllowed)
            {
                ModelState.AddModelError(string.Empty, "指定用户不允许登录");
                return BadRequest(ModelState);
            }

            if (!result.Succeeded)
            {
                ModelState.AddModelError(string.Empty, "请检查用户名或密码是否正确");
                return BadRequest(ModelState);
            }

            // var principal = await _signInManager.CreateUserPrincipalAsync(user);
            var tokenHandler = new JwtSecurityTokenHandler();
            //var key = Encoding.ASCII.GetBytes(Consts.Secret);
            var authTime = DateTime.UtcNow;
            var expiresAt = authTime.AddMinutes(5);
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration["SigningKey"]));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    //new Claim(JwtClaimTypes.Audience,"api"),
                    //new Claim(JwtClaimTypes.Issuer,"http://localhost:5000"),
                    new Claim(JwtClaimTypes.Id, user.Id.ToString()),
                    new Claim(JwtClaimTypes.Name, user.Name),
                    new Claim(JwtClaimTypes.Email, user.Email),
                    new Claim(JwtClaimTypes.PhoneNumber, user.PhoneNumber),
                    new Claim(JwtClaimTypes.Role,string.Join(",",user.Roles))
                }),
                Expires = expiresAt,
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            //    var ticket = await CreateTicketAsync(request, user);
            // var s= SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            //error: string;
            //error_description: string;
            //error_uri: string;
            //expires_at: number;
            //id_token: string;
            //profile: any;
            //scope: string;
            //session_state: any;
            //state: any;
            //token_type: string;
            return Ok(new
            {
                access_token = tokenString,
                token_type = "Bearer",
                id_token=user.Id.ToString(),
                profile = new
                {
                    roles=user.Roles.Select(x=>x),
                    auth_time = new DateTimeOffset(authTime).ToUnixTimeSeconds(),
                    expires_at = new DateTimeOffset(expiresAt).ToUnixTimeSeconds()
                }
            });
        }

        private async Task<IActionResult> Jwtsimple(UserLogin userLogin)
        {
            var user = await _userManager.FindByNameAsync(userLogin.UserName);
            if (user == null) return Unauthorized();
            var tokenHandler = new JwtSecurityTokenHandler();
            //var key = Encoding.ASCII.GetBytes(Consts.Secret);
            var authTime = DateTime.UtcNow;
            var expiresAt = authTime.AddMinutes(5);
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration["SigningKey"]));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    //new Claim(JwtClaimTypes.Audience,"api"),
                    //new Claim(JwtClaimTypes.Issuer,"http://localhost:5000"),
                    new Claim(JwtClaimTypes.Id, user.Id.ToString()),
                    new Claim(JwtClaimTypes.Name, user.Name),
                    new Claim(JwtClaimTypes.Email, user.Email),
                    new Claim(JwtClaimTypes.PhoneNumber, user.PhoneNumber),
                    new Claim(JwtClaimTypes.Role,string.Join(",",user.Roles))
                }),
                Expires = expiresAt,
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            //    var ticket = await CreateTicketAsync(request, user);
            // var s= SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            return Ok(new
            {
                access_token = tokenString,
                token_type = "Bearer",
                profile = new
                {
                    userId = user.Id,
                    name = user.Name,
                    auth_time = new DateTimeOffset(authTime).ToUnixTimeSeconds(),
                    expires_at = new DateTimeOffset(expiresAt).ToUnixTimeSeconds()
                }
            });
        }

















    }
}