[![Build Status](https://travis-ci.org/agrc/fiber-verification.svg)](https://travis-ci.org/agrc/fiber-verification)

Broadband Provider Fiber Verification
===================================

Boilerplated original from [AGRCJavaScriptBoilerplate](https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate).

[Google Drive Folder](https://drive.google.com/a/utah.gov/folderview?id=0ByBPl4Mwaw9IWVdnZEExZzhtalE&usp=sharing)


[test site](http://test.mapserv.utah.gov/fiberavailabilitymap/)  
[production site](https://fiberediting.mapserv.utah.gov/)


## Deployment
1. Create a new permission proxy app using `permission_proxy_config.json`.
1. Publish `maps/FiberVerification.mxd` as `FiberVerification` map service.
    - enable feature access
    - enable dynamic layer and register a workspace with ID: "FiberVerification" to the SDE database associated with this project.
