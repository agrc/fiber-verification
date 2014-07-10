using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using CommandPattern;
using Dapper;

namespace FiberVerification.Editing.Api.Commands {

    public class UpdateProviderCoverageCommandAsync : CommandAsync, IDisposable {
        private readonly int _coverage;
        private readonly int[] _hexids;
        private readonly string _provider;
        private SqlConnection _connection;
        private bool _disposed;

        public UpdateProviderCoverageCommandAsync(int[] hexids, string provider, int coverage)
        {
            _hexids = hexids;
            _provider = provider;
            _coverage = coverage;
            _disposed = false;
            _connection = new SqlConnection(ConfigurationManager.ConnectionStrings["FiberVerification"].ConnectionString);
        }

        /// <summary>
        ///     Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public override async Task<int> Execute()
        {
            var itemsToUpdate =
                await
                _connection.QueryAsync<int>(
                    "Select HexID from SERVICEAREAS where ProvName = @provider and HexID in @ids", new
                        {
                            provider = _provider,
                            ids = _hexids
                        });

            var itemsToUpdateList = itemsToUpdate.ToList();

            Debug.Print("updates: {0}", string.Join(",", itemsToUpdateList));

            var itemsToUpdated = 0;
            if (itemsToUpdateList.Any())
            {
                itemsToUpdated = await _connection.ExecuteAsync(
                        "Update SERVICEAREAS Set ServiceClass = @coverage where provname = @provider and hexid in @ids",
                        new
                            {
                                provider = _provider,
                                ids = itemsToUpdateList,
                                coverage = _coverage
                            });
            }

            var itemsToInsert =
                _hexids.Except(itemsToUpdateList).Select(x => new {id = x, name = _provider, coverage = _coverage}).
                        ToArray();

            Debug.Print("inserts: {0}", string.Join(",", itemsToInsert.Select(x => x.id)));

            var itemsInserted =
                await
                _connection.ExecuteAsync(
                    "Insert into SERVICEAREAS (HexID, ProvName, ServiceClass) values (@id, @name, @coverage)",
                    itemsToInsert
                );

            Debug.Assert(itemsToUpdated + itemsInserted == _hexids.Length, "Items updated and inserted do not match");

            return itemsToUpdated + itemsInserted;
        }

        /// <summary>
        ///     Returns a string that represents the current object.
        /// </summary>
        /// <returns>
        ///     A string that represents the current object.
        /// </returns>
        public override string ToString()
        {
            return string.Format("{0}, Provider: {1}, Coverage: {2}, Hexids: {3}", "UpdateProviderCoverageCommandAsync",
                                 _provider, _coverage, _hexids);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
            {
                return;
            }

            if (_connection == null)
            {
                return;
            }

            _connection.Dispose();
            _connection = null;
            _disposed = true;
        }
    }

}