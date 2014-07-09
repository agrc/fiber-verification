using System.Collections.Generic;

namespace FiberVerification.Editing.Api.Models.ArcGis {

    public class Error
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public List<object> Details { get; set; }
    }

}