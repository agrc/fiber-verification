namespace FiberVerification.Editing.Api.Configuration {

    internal class StageConfig : IConfigurable {
        /// <summary>
        ///     Gets or sets the secure test URL.
        /// </summary>
        /// <value>
        ///     The secure URL to test the arcgis server token against.
        /// </value>
        public string SecureTestUrl
        {
            get { return "http://test.mapserv.utah.gov/arcgis/rest/services/FiberVerification/MapServer?f=json"; }
        }
    }

}