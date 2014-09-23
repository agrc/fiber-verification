import arcpy
import pythonaddins

# layer names
Providers = 'Providers'
HexagonsJoined = 'Hexagons Joined'

# field names
Code = 'Code'


class FiberViewingExtension(object):
    """Implementation for fiberviewing_addin.extension (Extension)"""
    def __init__(self):
        self.enabled = True

    def openDocument(self):
        global providers
        print('openDocument')
        mxd = arcpy.mapping.MapDocument('CURRENT')
        layers = arcpy.mapping.ListTableViews(mxd, Providers)
        if len(layers) > 0:
            with arcpy.da.SearchCursor(Providers, [Code]) as cur:
                for row in cur:
                    combobox.items.append(row[0])


class ProviderComboBox(object):
    """Implementation for fiberviewing_addin.combobox (ComboBox)"""
    def __init__(self):
        # self.editable = True
        self.enabled = True
        self.dropdownWidth = 'WWWWWWWWWWWWWWWW'
        self.width = 'WWWWWWWWWWWWWWWW'

    def onSelChange(self, selection):
        mxd = arcpy.mapping.MapDocument('CURRENT')
        layer = arcpy.mapping.ListLayers(mxd, HexagonsJoined)[0]
        layer.definitionQuery = "FiberVerification.FIBERADMIN.ProviderServiceAreas.ProvName = '{}'".format(selection)
        arcpy.RefreshTOC()
        arcpy.RefreshActiveView()
