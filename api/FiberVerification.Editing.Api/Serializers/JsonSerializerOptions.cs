using Newtonsoft.Json;

namespace FiberVerification.Editing.Api.Serializers {

    public sealed class JsonSerializerOptions : JsonSerializer
    {
        public JsonSerializerOptions()
        {
            NullValueHandling = NullValueHandling.Ignore;
        }
    }
}