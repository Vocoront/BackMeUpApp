using BackMeUpApp.Hubs;
using BackMeUpApp.Repository;
using BackMeUpApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Neo4jClient;
using ServiceStack.Redis;
using System;
using System.IO;
using System.Text;

namespace BackMeUpApp
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
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            //GraphClient client = new GraphClient(new Uri("http://localhost:7474/db/data"), "neo4j", "misahaker69");
            //client.Connect();
            //services.AddSingleton<IGraphClient>(provider => client);
            services.AddSingleton<IGraphClientFactory>(provider => new GraphClientFactory(NeoServerConfiguration.GetConfiguration(new Uri("http://localhost:7474/db/data"), "neo4j", "misacringeboy")));
            services.AddSingleton<IRedisClientsManager>(c =>new RedisManagerPool("127.0.0.1:6379"));


            services.AddScoped<NotificationService, NotificationService>();
            services.AddScoped<RedisMessageService, RedisMessageService>();
            services.AddScoped<IUserRepository, UserRepoistory>();
            services.AddScoped<IPostRepository, PostRepository>();
            

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        RequireExpirationTime = true,
                        ValidateLifetime=true,
                        ClockSkew=TimeSpan.FromMinutes(0),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddSignalR();

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
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "ImageFolder")),
                RequestPath = "/images"
            });
            app.UseSpaStaticFiles();

            app.UseAuthentication();

            app.UseSignalR(routes =>
            {
                routes.MapHub<MessageHub>("/messagehub");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
           
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
