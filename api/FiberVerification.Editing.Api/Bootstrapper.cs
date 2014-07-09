using FiberVerification.Editing.Api.Configuration;
using FiberVerification.Editing.Api.Serializers;
using Nancy.TinyIoc;
using Newtonsoft.Json;

namespace FiberVerification.Editing.Api
{
    using Nancy;

    public class Bootstrapper : DefaultNancyBootstrapper
    {
        // The bootstrapper enables you to reconfigure the composition of the framework,
        // by overriding the various methods and properties.
        // For more information https://github.com/NancyFx/Nancy/wiki/Bootstrapper
        protected override void ConfigureApplicationContainer(TinyIoCContainer container)
        {
            base.ConfigureApplicationContainer(container);

            container.Register(typeof(JsonSerializer), typeof(JsonSerializerOptions));
            container.Register<IConfigurable>(new DevConfig());
        }
    }
}