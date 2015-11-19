# How to Publish the map

1. Service Name: "FiberVerification"
1. Register the SDE datasource as a **Database**
1. Enable mapping access
    1. Enable dynamic access
        1. Click the Mapping tab and select **Allow per request modification of layer order and symbology**
            1. Click "Manage"
            1. Modify datasource to match type. **SDE**
            1. Name the workspace id `FiberVerification`
            1. Add the connection string to the SDE database
1. max record count: 10000
1. Enable feature access
1. Security
    1. Make service secure and grant access to the "fiberverification_admin" & "fiberverification_editor" roles.
