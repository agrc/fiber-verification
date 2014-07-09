using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using Containers;
using FiberVerification.Editing.Api.Configuration;
using FiberVerification.Editing.Api.Formatters;
using FiberVerification.Editing.Api.Models;
using FiberVerification.Editing.Api.Models.ArcGis;
using Nancy.ModelBinding;

namespace FiberVerification.Editing.Api
{
    using Nancy;

    public class EditModule : NancyModule
    {
        public EditModule(IConfigurable config) : base("/api")
        {
            Post["/edit", true] = async (_, ctx) =>
                {
                    var model = this.Bind<InputParameters>();

                    if (string.IsNullOrEmpty(model.Token))
                    {
                        var m = new ResponseContainer((System.Net.HttpStatusCode) 498, "Token Required");

                        return Negotiate
                                .WithModel(m)
                                .WithStatusCode(498);
                    }

                    if(string.IsNullOrEmpty(model.Role) ||
                        string.IsNullOrEmpty(model.Provider) ||
                        string.IsNullOrEmpty(model.Coverage) ||
                        (model.HoneyComb == null || !model.HoneyComb.Any()))
                    {
                        return Negotiate
                                .WithModel(new ResponseContainer(System.Net.HttpStatusCode.BadRequest, "Missing required fields."))
                                .WithStatusCode(HttpStatusCode.BadRequest);
                    }

                    if (model.Role.ToUpperInvariant().Contains("READONLY"))
                    {
                        return Negotiate
                                .WithModel(new ResponseContainer(System.Net.HttpStatusCode.Unauthorized, "You are not allowed to edit."))
                                .WithStatusCode(HttpStatusCode.Forbidden);
                    }

                    using (var r = new HttpClient())
                    {
                        var request = await r.GetAsync(config.SecureTestUrl + string.Format("&token={0}", model.Token));
                        if (!request.IsSuccessStatusCode)
                        {
                            return Negotiate
                                .WithModel(new ResponseContainer(System.Net.HttpStatusCode.Unauthorized, "Token required."))
                                .WithStatusCode(HttpStatusCode.Forbidden);
                        }

                        var content = await request.Content.ReadAsAsync<SecurityErrorResponse>(new MediaTypeFormatter[]{new TextPlainResponseFormatter()});

                         if (content.Error != null)
                        {
                            var statusCode = content.Error.Code;
                            return Negotiate
                                .WithModel(new ResponseContainer((System.Net.HttpStatusCode)statusCode, content.Error.Message))
                                .WithStatusCode(content.Error.Code); 
                        }
                    }

                    return Negotiate.WithStatusCode(200);
                };
        }
    }
}