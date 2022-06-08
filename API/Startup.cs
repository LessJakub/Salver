using API.Extensions;
using Azure.Storage.Blobs;
using API.Services;
using API.Interfaces;
using System.Diagnostics;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationServices(_config);
            services.AddAuthorizationServices(_config);
            services.AddControllers();
            services.AddControllersWithViews().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.AddCors();
            services.AddIdentityServices(_config);
            services.AddSwaggerService(_config);

            services.AddScoped(x => new BlobServiceClient(_config.GetValue<string>("AzureBlobStorage")));
            services.AddScoped<IBlobService, BlobService>();
            services.AddSingleton<DiagnosticObserver>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DiagnosticListener diagnosticListenerSource, DiagnosticObserver diagnosticObserver)
        {
            diagnosticListenerSource.Subscribe(diagnosticObserver);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(options =>{ 
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1");
                    options.EnableTryItOutByDefault();
                    options.EnablePersistAuthorization();
                    });
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            // Add hostname to CORS for non-local hosts

            app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}