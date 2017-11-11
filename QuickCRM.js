/*******************************************************************************
* Quick CRM - Toolkit for Dynamics CRM JavaScript 2011/13/15
* Author: Jorge Moreno - jorge.moreno.com
* Releases. Version         Date
*           0.0.3           July, 2015
*           0.0.2           March, 2015.
*           0.0.1 (beta)    January, 2015.
*
* For more information see documentation on https://quickcrm.codeplex.com 
********************************************************************************
* Credits:
*   Library that improves the performance the Javascript development in 
*   Dynamics CRM Forms and its use.
********************************************************************************/

// <summary>
// Qk is the main library and fastest way to use it.
// </summary>
Qk = function () {
    // <summary>
    // Qk.Entity about entity form functions.
    // Qk.User about connected user.
    // Qk.Form about form functions.
    // Qk.Field about field functions.
    // Qk.Tab about tab functions.
    // Qk.Section for section functions.
    // Qk.Utilities for general actions.
    // </summary>
}

// <summary>
// Namespace with methods which the form entity is about.
// </summary>
Qk.Entity = function () {
    return {
        Id: Xrm.Page.data.entity.getId(),
        Name: Xrm.Page.data.entity.getEntityName()
    };
}();

// <summary>
// Namespace with methods which user information.
// </summary>
Qk.User = function () {

    // <summary>
    // Gets the logged username.
    // </summary>
    var getName = function () {
        // CRM 2011, CRM 2013-15.
        return Xrm.Page.context.getUserName ?
               Xrm.Page.context.getUserName() : 'CRM 2011 has not this functionality.';
    };

    return {
        Id: Xrm.Page.context.getUserId(),
        Lcid: Xrm.Page.context.getUserLcid(),
        Name: getName(),
        Roles: Xrm.Page.context.getUserRoles()
    };
}();

// <summary>
// Namespace with methods to manipulate the form's fields/controls.
// </summary>
Qk.Field = function (fieldNamesParam) {

    // <summary>
    // Name of the field or fields to manipulate.
    // </summary>
    var fieldNames = fieldNamesParam;


    // Generic Methods.

    // <summary>
    // Enables or disable the field or fields.
    // </summary>
    var setDisable = function (action) {
        if (Qk.Utilities.IsString(fieldNames)) {
            Xrm.Page.getControl(fieldNames).setDisable(action);

            return true;
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            for (i = 0; i < fieldNames.length; i++) {
                Xrm.Page.getControl(fieldNames[i]).setDisabled(action);
            }

            return true;
        }

        return 'fieldNames is not a String or Array.';
    };

    // <summary>
    // Shows or hide the field or fields.
    // </summary>
    var setVisible = function (action) {
        if (Qk.Utilities.IsString(fieldNames)) {
            Xrm.Page.getControl(fieldNames).setVisible(action);

            return true;
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            for (var i = 0; i < fieldNames.length; i++) {
                Xrm.Page.getControl(fieldNames[i]).setVisible(action);
            }

            return true;
        }

        return 'fieldNames is not a String or Array.';
    }

    // <summary>
    // Determines the submit type of the field or fields.
    // </summary>
    var setSubmitMode = function (modeName) {
        if (modeName !== "none" && modeName !== "always" && modeName !== "dirty") {
            return false;
        }

        if (Qk.Utilities.IsString(fieldNames)) {
            Xrm.Page.getControl(fieldNames).setSubmitMode(modeName);

            return true;
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            for (var i = 0; i < fieldNames.length; i++) {
                Xrm.Page.getControl(fieldNames[i]).setSubmitMode(modeName);
            }

            return true;
        }

        return false;
    };

    // <summary>
    // Determines the requeriment type of the field or fields.
    // </summary>
    var setRequirementLevel = function (levelName) {
        if (levelName !== 'none' && levelName !== 'recommended' && levelName !== 'required') {
            return false;
        }

        if (Qk.Utilities.IsString(fieldNames)) {
            Xrm.Page.getControl(fieldNames).setRequiredLevel(levelName);

            return true;
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            for (var i = 0; i < fieldNames.length; i++) {
                Xrm.Page.getControl(fieldNames[i]).setRequiredLevel(levelName);
            }
        }

        return true;
    };

    // <summary>
    // Obtains the specific lookup value of the field or fields.
    // </summary>
    var getLookupInfo = function (typeInfo) {
        if (Qk.Utilities.IsString(fieldNames)) {
            var lookup = Xrm.Page.getAttribute(fieldNames).getValue();

            return lookup != null && Qk.Utilities.IsArray(lookup) ?
                   lookup[0][typeInfo] :
                   "The field is not a Lookup field.";
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            var info = [];

            for (var i = 0; i < fieldNames.length; i++) {
                var lookup2 = Xrm.Page.getAttribute(fieldNames[i]).getValue();

                if (lookup2 != null && Qk.Utilities.IsArray(lookup2)) {
                    info.push(lookup2[0][typeInfo]);
                }
                else {
                    info = "Some of the fields are not a Lookup fields.";
                }
            }

            return info;
        }

        return null;
    };

    // <summary>
    // Obtains the values of the field or fields.
    // </summary>
    var getValue = function () {
        if (Qk.Utilities.IsString(fieldNames)) {
            return Xrm.Page.getAttribute(fieldNames).getValue();
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            var info = [];

            for (var i = 0; i < fieldNames.length; i++) {
                info.push(Xrm.Page.getAttribute(fieldNames[i]).getValue());
            }

            return info.length !== 0 ? info : "There was a problem obtaining the values.";
        }

        return null;
    };

    // <summary>
    // Gets the attribute type of the field or fields.
    // </summary>
    var getAttributeType = function () {
        if (Qk.Utilities.IsString(fieldNames)) {
            return Xrm.Page.getAttribute(fieldNames).getAttributeType();
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            var types = [];

            for (var i = 0; i < fieldNames.length; i++) {
                types.push(Xrm.Page.getAttribute(fieldNames[i]).getAttributeType());
            }

            return types;
        }

        return null;
    };
    
    // <summary>
    // Sets the value of the field or fields.
    // </summary>
    var setValue = function (value) {
        var isMatch = Qk.Utilities.CheckTypes(fieldNamesParam, value);

        if (isMatch.match) {
            Xrm.Page.getAttribute(fieldNames).setValue(value);
        }
        else if (isMatch.type === 'optionset') // The type 'optionset' has a special save.
        {
            if (Qk.Utilities.IsString(fieldNames)) { // Special case by text:
                var options = Xrm.Page.getAttribute(fieldNames).getOptions();

                for (var i = 0; i < options.length; i++)
                    if (Qk.Utilities.AreValuesEqual(options[i].text, value)) {
                        Xrm.Page.getAttribute(fieldNames).setValue(options[i].value);

                        return;
                    }
            }
        }
        else {
            Qk.Form.Alert("There was a problem during saving.");
        }
    };

    // <summary>
    // Adds an option or options in a field.
    // </summary>
    var addOption = function (value, index) {
        if (typeof (value) != 'object') {
            Qk.Form.Alert('Cannot add an option. The value type is not correct.');

            return false;
        }

        if (!Qk.Utilities.IsArray(value)) // Add an option through standar way. Index does not necessary.
        {
            (index) ? Xrm.Page.getControl(fieldNames).addOption(value, index) :
                        Xrm.Page.getControl(fieldNames).addOption(value);
        }
        else // When we want add many new options. No index required.
            for (i = 0; i < value.length; i++) {
                if (typeof value[i] != 'object') {
                    Qk.Form.Alert('Cannot add an option. The value type is not correct.');
                    return false;
                }

                Xrm.Page.getControl(fieldNames).addOption(value[i]);
            }
    };

    // <summary>
    // Removes all or an option. Could be selected by name.
    // </summary>
    var removeOption = function (value) {
        if (value === 'all') {
            Xrm.Page.getControl(fieldNames).clearOptions();

            return;
        }

        if (typeof value == 'string') {
            var options = Xrm.Page.getAttribute(fieldNames).getOptions();

            for (i = 0; i < options.length; i++) {
                if (Qk.Utilities.AreValuesEqual(options[i].text, value)) {
                    Xrm.Page.getControl(fieldNames).removeOption(options[i].value);
                }
            }

            return;
        }

        Xrm.Page.getControl(fieldNames).removeOption(value);
    };

    // <summary>
    // Resets an boolean or optionset attribute type field.
    // </summary>
    var resetValue = function () {
        if (Qk.Utilities.IsString(fieldNames)) {
            if (Qk.Field(fieldNames).AttributeType !== "boolean" &&
                Qk.Field(fieldNames).AttributeType !== "optionset") {
                return false;
            }

            var initialValue = Xrm.Page.getAttribute(fieldNames).getInitialValue();
            Xrm.Page.getAttribute(fieldNames).setValue(initialValue);
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            fieldNames.forEach(function (field) {
                if (Qk.Field(field).AttributeType !== "boolean" &&
                    Qk.Field(field).AttributeType !== "optionset") {
                    return;
                }

                var initialValue = Xrm.Page.getAttribute(fieldNames).getInitialValue();
                Xrm.Page.getAttribute(fieldNames).setValue(initialValue);
            });

            return true;
        }

        return false;
    };

    // <summary>
    // Sets the notification to show about a control or controls.
    // </summary>
    var showNotification = function (message, id) {
        if (!Xrm.Page.getControl(fieldNames).setNotification) { // unavailable for CRM 2011
            return;
        }

        if (Qk.Utilities.IsString(fieldNames)) {
            Xrm.Page.getControl(fieldNames).setNotification(message, id);
        }

        if (Qk.Utilities.IsArray(fieldNames)) {
            fieldNames.forEach(function (field) {
                Xrm.Page.getControl(fieldNames).setNotification(message, id);
            });
        }
    };

    // <summary>
    // Clears the notifications about a control or controls.
    // </summary>
    var hideNotification = function (id) {
        if (!Xrm.Page.getControl(fieldNames).clearNotification) { // unavailable for CRM 2011
            return;
        }

        Xrm.Page.getControl(fieldNames).clearNotification(id);
    };


    // Explicit Methods.

    // <summary>
    // Disables the field or fields.
    // </summary>
    var disable = function () { return setDisable(true); };

    // <summary>
    // Enables the field or fields.
    // </summary>
    var enable = function () { return setDisable(false); };

    // <summary>
    // Hides the field or fields.
    // </summary>
    var hide = function () { return setVisible(false); };

    // <summary>
    // Shows the field or fields.
    // </summary>
    var show = function () { return setVisible(true); };

    // <summary>
    // Sets the submit mode of the field or fields to always.
    // </summary>
    var submitAlways = function () { return setSubmitMode('always'); };

    // <summary>
    // Sets the submit mode of the field or fields to never.
    // </summary>
    var submitNever = function () { return setSubmitMode('never'); };

    // <summary>
    // Sets the submit mode of the field or fields to dirty.
    // </summary>
    var submitDirty = function () { return setSubmitMode('dirty'); };

    // <summary>
    // Sets the requeriment mode of the field or fields to required.
    // </summary>
    var fieldRequired = function () { return setRequirementLevel('required') };

    // <summary>
    // Sets the requeriment mode of the field or fields to recommended.
    // </summary>
    var fieldRecommended = function () { return setRequirementLevel('recommended') };

    // <summary>
    // Sets the requeriment mode of the field or fields to none.
    // </summary>
    var fieldNotRequired = function () { return setRequirementLevel('none') };

    // <summary>
    // Gets the id from a lookup.
    // </summary>
    var id = function () { return getLookupInfo('id') };

    // <summary>
    // Gets the name from a lookup.
    // </summary>
    var name = function () { return getLookupInfo('name') };

    // <summary>
    // Gets the entity type from a lookup.
    // </summary>
    var entityType = function () { return getLookupInfo('entityType') };

    // <summary>
    // Removes all options from a picklist.
    // </summary>
    var removeAllOptions = function () { return removeOption('all') };

    return {
        Disable: disable,
        Enable: enable,
        Hide: hide,
        Show: show,
        SubmitAlways: submitAlways,
        SubmitNever: submitNever,
        SubmitDirty: submitDirty,
        FieldRequired: fieldRequired,
        FieldRecommended: fieldRecommended,
        FieldNotRequired: fieldNotRequired,
        Id: id(),
        Name: name(),
        EntityType: entityType(),
        Value: getValue(),
        AttributeType: getAttributeType(),
        SetValue: setValue,
        ResetValue: resetValue,
        Add: addOption,
        Remove: removeOption,
        RemoveAll: removeAllOptions,
        ShowNotification: showNotification,
        HideNotification: hideNotification
    };
};

// <summary>
// Namespace to do the main operations with the form.
// </summary>
Qk.Form = function () {
    
    // Generic Methods.

    // <summary>
    // Shows an alert.
    // </summary>
    var showAlert = function (message) { return Xrm.Utility.alertDialog(message) };

    // <summary>
    // Shows an confirm dialog.
    // </summary>
    var showConfirm = function (message) { return Xrm.Utility.confirmDialog(message) };

    // <summary>
    // Closes the form.
    // </summary>
    var close = function () { Xrm.Page.ui.close(); };

    // <summary>
    // Saves the record.
    // </summary>
    var saveRecord = function () { Xrm.Page.data.entity.save(); };

    // <summary>
    // Gets the organization language Id.
    // </summary>
    var getOrgLcid = function() { return Xrm.Page.context.getOrgLcid() };

    // <summary>
    // Gets the form dirty status.
    // </summary>
    var getIsDirty = function() { return Xrm.Page.data.entity.getIsDirty() };

    // <summary>
    // Shows a form notification.
    // </summary>
    var showNotification = function (message, notificationType, id) {
        if (!Xrm.Page.ui.setFormNotification) { // unavailable for CRM 2011
            return;
        }

        if (notificationType !== "ERROR" &&
            notificationType !== "WARNING" &&
            notificationType !== "INFO")
            notificationType = "INFO";

        Xrm.Page.ui.setFormNotification(message, notificationType, id);
    };

    // <summary>
    // Clears the form notification.
    // </summary>
    var hideNotification = function (id) {
        if (!Xrm.Page.ui.clearFormNotification) { // unavailable for CRM 2011
            return;
        }

        Xrm.Page.ui.clearFormNotification(id);
    };


    // Explicit Methods.

    // <summary>
    // Shows an info notification.
    // </summary>
    var showInfoNotification = function (message, id) {
        return showInfoNotification(message, 'INFO', id)
    };

    // <summary>
    // Shows an error notification.
    // </summary>
    var showErrorNotification = function (message, id) {
        return showInfoNotification(message, 'ERROR', id)
    };

    // <summary>
    // Shows a warning notification.
    // </summary>
    var showWarningNotification = function (message, id) {
        return showInfoNotification(message, 'WARNING', id)
    };

    return {
        Type: {
            Create: 1,
            Update: 2,
            ReadOnly: 3,
            Disabled: 4,
            QuickCreate: 5,
            BulkEdit: 6
        },
        Notification:{
            Info: showInfoNotification,
            Error: showErrorNotification,
            Warning: showWarningNotification,
            Hide: hideNotification
        },
        Alert: showAlert,
        Confirm: showConfirm,
        Close: close,
        Save: saveRecord,
        OrgLCID: getOrgLcid,
        IsDirty: getIsDirty
    };
}();

// <summary>
// Namespace to do operations with the tab and its elements.
// </summary>
Qk.Tab = function (tabSelector) {

    // <summary>
    // Name of the tab to manipulate.
    // </summary>
    var tabName = tabSelector;

    // <summary>
    // Private name that picks the tab control.
    // </summary>
    var _tab;

    // <summary>
    // Detects and select the name of the tab.
    // </summary>
    var getTabByName = function () {
        return Xrm.Page.ui.tabs.forEach(
            function (tab) {
                if (Qk.Utilities.AreValuesEqual(tab.getLabel(), tabName)) {
                    _tab = tab;
                    return;
                }
            });
    };

    // <summary>
    // Adapted method to enable/disable controls in a Tab.
    // </summary>
    var setDisable = function (action) {
        getTabByName();
        if (_tab != null) {
            Xrm.Page.ui.controls.forEach(
                function (control) {
                    if (Qk.Utilities.DoesControlHaveAttribute(control))
                        control.setDisabled(action);
                });
        }
    };

    // <summary>
    // Adapted method to show/hide controls in a Tab.
    // </summary>
    var setVisible = function (action) {
        getTabByName();
        if (_tab != null) {
            Xrm.Page.ui.controls.forEach(
                function (control) {
                    if (Qk.Utilities.DoesControlHaveAttribute(control))
                        control.setVisible(action);
                });
        }
    };


    // Explicit Methods.

    // <summary>
    // Disables all controls in a tab.
    // </summary>
    var disableAllControls = function () { setDisable(true) };

    // <summary>
    // Enables all controls in a tab.
    // </summary>
    var enableAllControls = function () { setDisable(false) };

    // <summary>
    // Hides all controls in a tab.
    // </summary>
    var hideAllControls = function () { setVisible(false) };

    // <summary>
    // Shows all controls in a tab.
    // </summary>
    var showAllControls = function () { setVisible(true) };

    return {
        DisableAllControls: disableAllControls,
        EnableAllControls: enableAllControls,
        HideAllControls: hideAllControls,
        ShowAllControls: showAllControls
    };
};

// <summary>
// Namespace to do operations with the section and its elements.
// </summary>
Qk.Section = function (sectionLabelParam) {

    // <summary>
    // Private member with the section to manipulate.
    // </summary>
    var sectionLabel = sectionLabelParam;    


    // Generic Methods.

    // <summary>
    // Adapted method to enable/disable controls in a Section.
    // </summary>
    var setDisable = function (action) {
        var tabs = Xrm.Page.ui.tabs;

        for (var i = 0; i < tabs.getLength() ; i++) {
            var sections = tab.sections;
            for (var j = 0; j < sections.getLength() ; j++){
                if (Qk.Utilities.AreValuesEqual(sections.get(j).getLabel(), sectionLabel)){
                    Xrm.Page.ui.controls.forEach(
                            function (control) {
                                if (Qk.Utilities.DoesControlHaveAttribute(control))
                                    control.setDisabled(action);
                            });
                    break;
                }
            }
        }
    };

    // <summary>
    // Adapted method to show/hide controls in a Section.
    // </summary>
    var setVisible = function (action) {
        var tabs = Xrm.Page.ui.tabs;

        for (var i = 0; i < tabs.getLength() ; i++) {
            var sections = tab.sections;

            for (var j = 0; j < sections.getLength() ; j++) {
                if (Qk.Utilities.AreValuesEqual(sections.get(j), sectionLabel)) {
                    Xrm.Page.ui.controls.forEach(
                        function (control) {
                            if (Qk.Utilities.DoesControlHaveAttribute(control))
                                control.setVisible(action);
                        });
                    break;
                }
            }
        }
    };


    // Explicit Methods

    // <summary>
    // Disables all controls in a section.
    // </summary>
    var disableAllControls = function () { return setDisable(true) };

    // <summary>
    // Enables all controls in a section.
    // </summary>
    var enableAllControls = function () { return setDisable(false) };

    // <summary>
    // Hides all controls in a section.
    // </summary>
    var hideAllControls = function () { return setVisible(false) };

    // <summary>
    // Shows all controls in a section.
    // </summary>
    var showAllControls = function () { return setVisible(true) };

    return {
        DisableAllControls: disableAllControls,
        EnableAllControls: enableAllControls,
        HideAllControls: hideAllControls,
        ShowAllControls: showAllControls
    };
};

// <summary>
// Namespace to do common operations.
// </summary>
Qk.Utilities = function () {

    // <summary>
    // Compares two values and determines if are equal.
    // </summary>
    var areValuesEqual = function (value1, value2) {
        return valu1.toLowerCase() === value2.toLowerCase();
    };

    // <summary>
    // Specifies what kind of type is the field.
    // </summary>
    var checkTypes = function (fielName, value) {
        var type = Qk.Field(fielName).AttributeType;
        var isMatch = false;

        switch (type) {
            case 'boolean':
                if (typeof (value) == 'boolean') isMatch = true;
                break;
            case 'datetime':
                if (value instanceof Date ||
                    Object.prototype.toString.call(value) === '[object Date]')
                    isMatch = true;
                break;
            case 'decimal':
            case 'money':
            case 'double':
            case 'integer':
                if (typeof (value) == 'number') isMatch = true;
                break;
            case 'lookup':
                if (value.constructor === Array) isMatch = true;
                break;
            case 'memo':
            case 'string':
                if (typeof (value) == 'string') isMatch = true;
                break;
            case 'optionset':
                if ((typeof (value) == 'object' || typeof (value) == 'number') &&
                    !Qk.Utilities.IsArray(value))
                    isMatch = true;
                break;
        };

        var result = {};
        result.type = type;
        result.match = !!isMatch;
        return result;
    };

    // <summary>
    // Checks if the control has attributes (iframe, webresource or subgrid).
    // </summary>
    var doesControlHaveAttribute = function (control) {
        var controlType = control.getControlType();

        return controlType !== "iframe" &&
               controlType !== "webresource" &&
               controlType !== "subgrid";
    };

    // <summary>
    // Checks if the value is a string.
    // </summary>
    var isString = function (value) {
        return (typeof (value) == 'string');
    };

    // <summary>
    // Checks if the value is an array.
    // </summary>
    var isArray = function (value) {
        return value.constructor === Array;
    };

    // <summary>
    // Sets booleans in a section to false with a single click.
    // </summary>
    var singleCheck = function (executionContext) {
        var self = this;

        var section = executionContext.getEventSource().controls.get(0).getParent();
        var attributeName = executionContext.getEventSource().getName();

        section.controls.forEach(function (control, index) {
            if (self.doesControlHaveAttribute(control)) {
                var attribute = control.getAttribute();

                if (attribute != null) {
                    if (attribute.getAttributeType() === "boolean" &&
                        attribute.getName() !== attributeName) {
                        attribute.setValue(false);
                    }
                }
            }
        });
    };

    return {
        AreValuesEqual: areValuesEqual,
        CheckTypes: checkTypes,
        DoesControlHaveAttribute: doesControlHaveAttribute,
        IdCompare: areValuesEqual,
        IsString: isString,
        IsArray: isArray,
        SingleCheck: singleCheck
    };
}();


// <summary>
// Lookup Class to manage this type of attribute.
// </summary>
function Lookup(entityType, name, id) {
    var object = {
        entityType: entityType,
        name: name,
        id: id
    };

    var lookup = [];

    lookup[0] = object;

    return lookup;
};


// <summary>
// An alias to access Quick CRM Library too with long name.
// </summary>
QuickCRM = Qk;

// <summary
// An alias to access utilities.
// </summary>
Util = Qk.Utilities;