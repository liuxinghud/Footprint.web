using FootPrint.Business;
using FootPrint.Business.Models;
using IdentityModel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.IdentityModel.Tokens.Jwt;
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
            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();//ÍÕ·åÃüÃû·¨(Ê××ÖÄ¸Ð¡Ð´)
                options.SerializerSettings.Converters.Add(new StringEnumConverter());//enumÐòÁÐ»¯Îªstring
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddCors();//¿çÓò

            // services.AddAutoMapper();


          


            #region jwt ÅäÖÃ
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();
            var sharedKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration["SigningKey"]));
            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;


            })
                .AddJwtBearer(x =>
         {
             x.Authority = "http://localhost:5920/";
             x.Audience = "api";
             x.RequireHttpsMetadata = false;
             x.IncludeErrorDetails = true;
             x.SaveToken = true;

             //x.Events = new JwtBearerEvents()
             //{
             //    OnMessageReceived = context =>
             //    {
                     
             //        context.Token = context.Request.Query["access_token"];
             //        return Task.CompletedTask;
             //    }
             //};

             x.TokenValidationParameters = new TokenValidationParameters
             {
                 //ValidateIssuerSigningKey = true,
                 // IssuerSigningKey = sharedKey,
                 // ValidateIssuer = false,
                 //ValidateAudience = false,
                 // NameClaimType = JwtClaimTypes.Name,
                 // RoleClaimType = JwtClaimTypes.Role

                 ValidateIssuerSigningKey = true,
                 IssuerSigningKey = sharedKey,
                  
                 ValidateIssuer = false,
                 ValidateAudience = false

             };
             
         });

            #endregion
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                //options.UseSqlServer(Configuration["ConnectionStrings:DefaultConnection"], b => b.MigrationsAssembly(" Footprint"));
                //options.UseOpenIddict();
                options.UseSqlServer(Configuration["ConnectionStrings:MSSQLConnection"], b => b.MigrationsAssembly("Footprint.web").CommandTimeout(60).EnableRetryOnFailure(2));
            });
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
                // User settings
                options.User.RequireUniqueEmail = true;
             
            });


            services.AddScoped<IAccountManager, AccountManager>();
            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();















            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "FootprintApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
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

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
            app.UseAuthentication();//*
            app.UseCors();
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
    }
}
