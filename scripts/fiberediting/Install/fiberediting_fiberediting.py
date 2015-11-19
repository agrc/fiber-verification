import arcpy
import pythonaddins
import os

# fieldnames
HexID = 'HexID'
ProvName = 'ProvName'
ServiceClass = 'ServiceClass'
Code = 'Code'

# layer names
HexagonsJoined = "Hexagons Joined"
Hexagons = "Hexagons"
ProviderServiceAreas = "ProviderServiceAreas"
Providers = "Providers"

editor = None
hasEdits = False


def start_editing():
    global editor, hasEdits
    if editor is None:
        print('creating editor')
        # get layer workspace
        mxd = arcpy.mapping.MapDocument('CURRENT')
        if mxd.filePath.find('Test.mxd') == -1:
            con = 'FiberVerification_PROD.sde'
        else:
            con = 'FiberVerification_TEST.sde'
        print(os.path.join(os.getcwd(), con))
        editor = arcpy.da.Editor(os.path.join(os.getcwd(), con))
        editor.startEditing(True, True)
    editor.startOperation()


def has_selection():
    print('has_selection')
    count = int(arcpy.GetCount_management(Hexagons).getOutput(0))
    if count >= 10000:
        pythonaddins.MessageBox('There are no selected hexagons!', 'Error')
    return count < 10000


def update_data(serviceType):
    global editor, hasEdits
    print('update_data')
    start_editing()
    hasEdits = True
    with arcpy.da.SearchCursor(Hexagons, [HexID]) as scur:
        ids = [row[0] for row in scur]

    where = "{} in ({}) AND {} = '{}'".format(HexID, ','.join([str(id) for id in ids]),
                                              ProvName,
                                              combobox.value)
    arcpy.SelectLayerByAttribute_management(ProviderServiceAreas,
                                            "NEW_SELECTION",
                                            where)

    arcpy.CalculateField_management(ProviderServiceAreas,
                                    ServiceClass,
                                    str(serviceType),
                                    "PYTHON")

    with arcpy.da.SearchCursor(ProviderServiceAreas, [HexID]) as cur:
        existingIds = [row[0] for row in cur]
    newIds = set(ids) - set(existingIds)

    with arcpy.da.InsertCursor(ProviderServiceAreas,
                               [HexID, ProvName, ServiceClass]) as icur:
        for newId in newIds:
            print('newId: {}'.format(str(newId)))
            icur.insertRow([newId, combobox.value, serviceType])

    # clear selections
    arcpy.SelectLayerByAttribute_management(ProviderServiceAreas,
                                            "CLEAR_SELECTION")
    arcpy.SelectLayerByAttribute_management(Hexagons,
                                            "CLEAR_SELECTION")
    editor.stopOperation()
    arcpy.RefreshTOC()
    arcpy.RefreshActiveView()


class BtnNineMonth(object):
    """Implementation for addin_addin.btn_nine (Button)"""
    def __init__(self):
        self.enabled = True
        self.checked = False

    def onClick(self):
        if has_selection():
            update_data(9)


class BtnNone(object):
    """Implementation for addin_addin.btn_none (Button)"""
    def __init__(self):
        self.enabled = True
        self.checked = False

    def onClick(self):
        if has_selection():
            update_data(None)


class BtnOneMonth(object):
    """Implementation for addin_addin.btn_one (Button)"""
    def __init__(self):
        self.enabled = True
        self.checked = False

    def onClick(self):
        if has_selection():
            update_data(1)


class ComboBoxClass1(object):
    """Implementation for addin_addin.combobox (ComboBox)"""
    def __init__(self):
        print('combobox init')
        # self.items = providers
        self.editable = True
        self.enabled = True
        self.dropdownWidth = 'WWWWWWWWWWW'
        self.width = 'WWWWWWWWWWW'

    def onSelChange(self, selection):
        print(selection)
        mxd = arcpy.mapping.MapDocument('CURRENT')
        layer = arcpy.mapping.ListLayers(mxd, HexagonsJoined)[0]
        layer.definitionQuery = "FiberVerification.FIBERADMIN.ProviderServiceAreas.ProvName = '{}'".format(selection)
        arcpy.RefreshTOC()
        arcpy.RefreshActiveView()


class BtnSaveEdits(object):
    """Implementation for fiberediting_fiberediting.btn_save (Button)"""
    def __init__(self):
        self.enabled = True
        self.checked = False

    def onClick(self):
        global editor, hasEdits
        editor.stopEditing(True)
        editor = None
        start_editing()
        hasEdits = False


class FiberEditingExtension(object):
    """Implementation for fiberediting_fiberediting.extension (Extension)"""
    def __init__(self):
        self.enabled = True

    def beforeCloseDocument(self):
        global editor, hasEdits
        if hasEdits:
            if pythonaddins.MessageBox('Do you want to save your edits?',
                                       'Hold on a minute!', 4) == 'Yes':
                editor.stopEditing(True)

    def openDocument(self):
        global providers
        print('openDocument')
        mxd = arcpy.mapping.MapDocument('CURRENT')
        layers = arcpy.mapping.ListTableViews(mxd, Providers)
        if len(layers) > 0:
            with arcpy.da.SearchCursor(Providers, [Code]) as cur:
                for row in cur:
                    combobox.items.append(row[0])
