using AspNet.Security.OAuth.Validation;
using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using Footprint.web.ViewModel;
using FootPrint.Business;
using FootPrint.Business.Core;
using FootPrint.Business.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using OpenIddict.Abstractions;
using OpenIddict.Core;
using OpenIddict.EntityFrameworkCore.Models;
using System;
using System.Threading.Tasks;

namespace Footprint.web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();//驼峰命名法(首字母小写)
                options.SerializerSettings.Converters.Add(new StringEnumConverter());//enum序列化为string
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddCors();//跨域
            //配置数据库链接
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(Configuration["ConnectionStrings:MSSQLConnection"], b => b.MigrationsAssembly("Footprint.web").CommandTimeout(60).EnableRetryOnFailure(2));
                options.UseOpenIddict();//第三方库 认证方式
            });

            // add identity
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                    .AddEntityFrameworkStores<ApplicationDbContext>()
                    .AddDefaultTokenProviders();




            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                //options.Password.RequireDigit = true;
                //options.Password.RequiredLength = 8;
                //options.Password.RequireNonAlphanumeric = false;
                //options.Password.RequireUppercase = true;
                //options.Password.RequireLowercase = false;
                //options.Password.RequiredUniqueChars = 6;
                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;
                options.User.RequireUniqueEmail = true;

                // Configure Identity to use the same JWT claims as OpenIddict instead
                // of the legacy WS-Federation claims it uses by default (ClaimTypes),
                // which saves you from doing the mapping in your authorization controller.
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;

            });

            services.AddAuthentication()
              .AddGoogle(options =>
              {
                  options.ClientId = "560027070069-37ldt4kfuohhu3m495hk2j4pjp92d382.apps.googleusercontent.com";
                  options.ClientSecret = "n2Q-GEw9RQjzcRbU3qhfTj8f";
              })

              .AddTwitter(options =>
              {
                  options.ConsumerKey = "6XaCTaLbMqfj6ww3zvZ5g";
                  options.ConsumerSecret = "Il2eFzGIrYhz6BWjYhVXBPQSfZuS4xoHpSSyD9PI";
              });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = OAuthValidationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OAuthValidationDefaults.AuthenticationScheme;
            }).AddOAuthValidation();



            services.AddOpenIddict()
             // Register the OpenIddict core services.
             .AddCore(options =>
             {
                 // Configure OpenIddict to use the Entity Framework Core stores and models.
                 options.UseEntityFrameworkCore()
                     .UseDbContext<ApplicationDbContext>();
             })

             // Register the OpenIddict server handler.
             .AddServer(options =>
             {


                 // Enable the authorization, logout, token and userinfo endpoints.
                 options.EnableTokenEndpoint("/api/authorization/token")
                  
                 ;
                 //  options.EnableTokenEndpoint("/connect/token");
                 // Enable the authorization, logout, token and userinfo endpoints.
                 //options.EnableAuthorizationEndpoint("/connect/authorize")
                 //       .EnableLogoutEndpoint("/connect/logout")
                 //       .EnableTokenEndpoint("/connect/token")
                 //       .EnableUserinfoEndpoint("/api/userinfo");

                 // Note: the Mvc.Client sample only uses the code flow and the password flow, but you
                 // can enable the other flows if you need to support implicit or client credentials.
                 options.AllowPasswordFlow();
                 options.AcceptAnonymousClients();
                 //options.AllowAuthorizationCodeFlow()
                 //       .AllowPasswordFlow()
                 //       .AllowRefreshTokenFlow()
                 //       .AcceptAnonymousClients();

                 // Register the ASP.NET Core MVC services used by OpenIddict.
                 // Note: if you don't call this method, you won't be able to
                 // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
                 options.UseMvc();


                 // Mark the "email", "profile" and "roles" scopes as supported scopes.
                 options.RegisterScopes(OpenIdConnectConstants.Scopes.Email,
                                     OpenIdConnectConstants.Scopes.Profile,
                                     OpenIdConnectConstants.Scopes.OpenId,
                                     OpenIdConnectConstants.Scopes.OfflineAccess,
                                     OpenIdConnectConstants.Scopes.Phone,
                                     OpenIddictConstants.Scopes.Roles);
                 // When request caching is enabled, authorization and logout requests
                 // are stored in the distributed cache by OpenIddict and the user agent
                 // is redirected to the same page with a single parameter (request_id).
                 // This allows flowing large OpenID Connect requests even when using
                 // an external authentication provider like Google, Facebook or Twitter.
            options.EnableRequestCaching();

                 // During development, you can disable the HTTPS requirement.
                 options.DisableHttpsRequirement();
                
                 // Note: to use JWT access tokens instead of the default
                 // encrypted format, the following lines are required:
                 //
                 // options.UseJsonWebTokens();
                 // options.AddEphemeralSigningKey();

                 // Note: if you don't want to specify a client_id when sending
                 // a token or revocation request, uncomment the following line:
                 //
                 // options.AcceptAnonymousClients();

                 // Note: if you want to process authorization and token requests
                 // that specify non-registered scopes, uncomment the following line:
                 //
                 // options.DisableScopeValidation();

                 // Note: if you don't want to use permissions, you can disable
                 // permission enforcement by uncommenting the following lines:
                 //
                 // options.IgnoreEndpointPermissions()
                 //        .IgnoreGrantTypePermissions()
                 //        .IgnoreScopePermissions();
             })

             // Register the OpenIddict validation handler.
             // Note: the OpenIddict validation handler is only compatible with the
             // default token format or with reference tokens and cannot be used with
             // JWT tokens. For JWT tokens, use the Microsoft JWT bearer handler.
             .AddValidation();



            services.AddScoped<IAccountManager, AccountManager>();
            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();



            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.ViewAllUsersPolicy, policy => policy.RequireClaim(CustomClaimTypes.Permission, ApplicationPermissions.ViewUsers));
                options.AddPolicy(Policies.ManageAllUsersPolicy, policy => policy.RequireClaim(CustomClaimTypes.Permission, ApplicationPermissions.ManageUsers));

                options.AddPolicy(Policies.ViewAllRolesPolicy, policy => policy.RequireClaim(CustomClaimTypes.Permission, ApplicationPermissions.ViewRoles));
                options.AddPolicy(Policies.ViewRoleByRoleNamePolicy, policy => policy.Requirements.Add(new ViewRoleAuthorizationRequirement()));
                options.AddPolicy(Policies.ManageAllRolesPolicy, policy => policy.RequireClaim(CustomClaimTypes.Permission, ApplicationPermissions.ManageRoles));

                options.AddPolicy(Policies.AssignAllowedRolesPolicy, policy => policy.Requirements.Add(new AssignRolesAuthorizationRequirement()));
            });

            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });









            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "FootprintApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug(LogLevel.Warning);
            loggerFactory.AddFile(Configuration.GetSection("Logging"));
            Utilities.ConfigureLogger(loggerFactory);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseAuthentication();//*
            app.UseMvcWithDefaultRoute();
            //app.UseMvc(routes =>
            //{
            //    routes.MapRoute(
            //        name: "default",
            //        template: "{controller}/{action=Index}/{id?}");
            //});
            app.UseCors(builder => builder
             .AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod());

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "FootprintApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }




        private async Task InitializeAsync(IServiceProvider services)
        {
            // Create a new service scope to ensure the database context is correctly disposed when this methods returns.
            using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                await context.Database.EnsureCreatedAsync();

                var manager = scope.ServiceProvider.GetRequiredService<OpenIddictApplicationManager<OpenIddictApplication>>();

                if (await manager.FindByClientIdAsync("footprint1") == null)
                {
                    var descriptor = new OpenIddictApplicationDescriptor
                    {
                        ClientId = "footprint1",
                        ClientSecret = "901564A5-E7FE-42CB-B10D-61EF6A8F3654",
                        DisplayName = "足迹",

                        PostLogoutRedirectUris = { new Uri("http://localhost:5920/signout-callback-oidc") },
                        RedirectUris = { new Uri("http://localhost:5920/signin-oidc") },
                        Permissions =
                        {
                            OpenIddictConstants.Permissions.Endpoints.Authorization,
                            OpenIddictConstants.Permissions.Endpoints.Logout,
                            OpenIddictConstants.Permissions.Endpoints.Token,
                            OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode,
                            OpenIddictConstants.Permissions.GrantTypes.RefreshToken,
                            OpenIddictConstants.Permissions.Scopes.Email,
                            OpenIddictConstants.Permissions.Scopes.Profile,
                            OpenIddictConstants.Permissions.Scopes.Roles
                        }
                    };

                    await manager.CreateAsync(descriptor);
                }

                // To test this sample with Postman, use the following settings:
                //
                // * Authorization URL: http://localhost:54540/connect/authorize
                // * Access token URL: http://localhost:54540/connect/token
                // * Client ID: postman
                // * Client secret: [blank] (not used with public clients)
                // * Scope: openid email profile roles
                // * Grant type: authorization code
                // * Request access token locally: yes
                if (await manager.FindByClientIdAsync("postman") == null)
                {
                    var descriptor = new OpenIddictApplicationDescriptor
                    {
                        ClientId = "postman",
                        DisplayName = "Postman",
                        RedirectUris = { new Uri("https://www.getpostman.com/oauth2/callback") },
                        Permissions =
                        {
                            OpenIddictConstants.Permissions.Endpoints.Authorization,
                            OpenIddictConstants.Permissions.Endpoints.Token,
                            OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode,
                            OpenIddictConstants.Permissions.Scopes.Email,
                            OpenIddictConstants.Permissions.Scopes.Profile,
                            OpenIddictConstants.Permissions.Scopes.Roles
                        }
                    };

                    await manager.CreateAsync(descriptor);
                }
            }
        }









    }
}
