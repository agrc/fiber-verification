namespace FiberVerification.Editing.Api.Models
{

    /// <summary>
    /// The parameters sent to the service
    /// </summary>
    public class InputParameters
    {

        /// <summary>
        /// Gets or sets the token.
        /// </summary>
        /// <value>
        /// The arcgis server token for the logged in user.
        /// </value>
        public string Token { get; set; }

        /// <summary>
        /// Gets or sets the role.
        /// </summary>
        /// <value>
        /// The role must be sent to we don't allow the read only users to edit.
        /// </value>
        public string Role { get; set; }

        /// <summary>
        /// Gets or sets the provider.
        /// </summary>
        /// <value>
        /// The provider name to update hexagons for.
        /// </value>
        public string Provider { get; set; }

        /// <summary>
        /// Gets or sets the honey comb.
        /// </summary>
        /// <value>
        /// The honey comb is a list of id's to update.
        /// </value>
        public int[] HoneyComb { get; set; }

        /// <summary>
        /// Gets or sets the coverage.
        /// </summary>
        /// <value>
        /// The coverage type update the honeycomb id's to.
        /// </value>
        public string Coverage { get; set; }
    }

}