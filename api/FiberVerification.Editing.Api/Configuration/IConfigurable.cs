namespace FiberVerification.Editing.Api.Configuration {

    public interface IConfigurable {
        /// <summary>
        ///     Gets or sets the secure test URL.
        /// </summary>
        /// <value>
        ///     The secure URL to test the arcgis server token against.
        /// </value>
        string SecureTestUrl { get; }
    }

}