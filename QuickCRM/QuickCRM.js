/*******************************************************************************
* Quick CRM - Toolkit for Dynamics CRM JavaScript 2011/13/15
* Author: Jorge Moreno - jorge.moreno.com
* Releases. Version         Date
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
Qk = function() {
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
Qk.Entity = function() {
    return {
        Id: Xrm.Page.data.entity.getId(),
        Name: Xrm.Page.data.entity.getEntityName()
    }
}();

// <summary>
// Namespace with methods which user information.
// </summary>
Qk.User = function() {
    var getName = function()
    {
        if (!Xrm.Page.context.getUserName)  // CRM 2011                            
            return 'CRM 2011 has not this functionality.';        
        else                                // CRM 2013-15
            return Xrm.Page.context.getUserName()
    };

    return {
        Id: Xrm.Page.context.getUserId(),
        Lcid: Xrm.Page.context.getUserLcid(), 
        Name: getName(),
        Roles: Xrm.Page.context.getUserRoles()
    }
}();

// <summary>
// Namespace with methods to manipulate the form's fields/controls.
// </summary>
Qk.Field = function(fieldNamesParam) {
    // Name of the field to manipulate.
    var fieldNames = fieldNamesParam;

    // Common methods.
    var setDisable = function(action)
    {
        if (typeof (fieldNames) == 'string')
            Xrm.Page.getControl(fieldNames).setDisabled(action);
        else if (fieldNames.constructor === Array)
            for (i = 0; i < fieldNames.length; i++)
                Xrm.Page.getControl(fieldNames[i]).setDisabled(action);
        else
            return 'fieldNames is not a String or Array.';
    };

    var setVisible = function(action)
    {
        if (typeof (fieldNames) == 'string')
            Xrm.Page.getControl(fieldNames).setVisible(action);
        else if (fieldNames.constructor === Array)
            for (i = 0; i < fieldNames.length; i++)
                Xrm.Page.getControl(fieldNames[i]).setVisible(action);
        else
            return 'fieldNames is not a String or Array.';
    }

    var setSubmitMode = function(modeName)
    {
        if (modeName == 'none' || modeName == 'always' || modeName == 'dirty')
        {
            if (typeof (fieldNames) == 'string')
                Xrm.Page.getControl(fieldNames).setSubmitMode(modeName);
            else if (fieldNames.constructor === Array)
                for (i = 0; i < fieldNames.length; i++)
                    Xrm.Page.getControl(fieldNames[i]).setSubmitMode(modeName);
            return true;
        }
        else
            return false;
    };

    var setRequirementLevel = function(levelName)
    {
        if (levelName == 'none' || levelName == 'recommended' || levelName == 'required')
        {
            if (typeof (fieldNames) == 'string')
                Xrm.Page.getControl(fieldNames).setRequiredLevel(levelName);
            else if (fieldNames.constructor === Array)
                for (i = 0; i < fieldNames.length; i++)
                    Xrm.Page.getControl(fieldNames[i]).setRequiredLevel(levelName);
            return true;
        }
        else
            return false;
    };

    var getLookupInfo = function(typeInfo)
    {
        var info,
            lookup;

        if (typeof (fieldNames) == 'string')
        {
            lookup = Xrm.Page.getAttribute(fieldNames).getValue();
            if (lookup != null && lookup.constructor === Array)
                info = lookup[0][typeInfo];
            else info = 'The field is not a Lookup field.';
        }
        else if (fieldNames.constructor === Array)
        {
            info = new Array;
            for (i = 0; i < fieldNames.length; i++)
            {
                lookup = Xrm.Page.getAttribute(fieldNames[i]).getValue();
                if (lookup != null && lookup.constructor === Array)
                    info.push(lookup[0][typeInfo]);
                else info = 'Some of the fields is not a Lookup field.';
            }
        }
        return info ? info : 'There was a problem obtaining the ' + typeInfo + ' attribute.';
    };

    var getValue = function()
    {
        var info;

        if (typeof (fieldNames) == 'string')
            return Xrm.Page.getAttribute(fieldNames).getValue();
        else if (fieldNames.constructor === Array)
        {
            info = [];
            for (i = 0; i < fieldNames.length; i++)
                info.push(Xrm.Page.getAttribute(fieldNames[i]).getValue());
            return info ? info : 'There was a problem obtaining the values.';
        }
    };

    var getAttributeType = function()
    {
        if (typeof (fieldNames) == 'string')        
            return Xrm.Page.getAttribute(fieldNames).getAttributeType();        
        else if (fieldNames.constructor === Array)
        {
            var types = [];
            for (i = 0; i < fieldNames.length; i++)
                types.push(Xrm.Page.getAttribute(fieldNames[i]).getAttributeType());
            return types;
        }
    };
    
    var setValue = function(value)
    {
        var isMatch = Qk.Utilities.CheckTypes(fieldNamesParam, value);

        if (isMatch.match)
            Xrm.Page.getAttribute(fieldNames).setValue(value);
        else if (isMatch.type == 'optionset') // The type 'optionset' has a special save.
        {
            if (typeof (value) == 'string') // Special case by text:
            {
                var options = Xrm.Page.getAttribute(fieldNames).getOptions();
                for (i = 0; i < options.length; i++)
                    if (options[i].text.toLowerCase() == value.toLowerCase())
                    {
                        Xrm.Page.getAttribute(fieldNames).setValue(options[i].value);
                        return;
                    }
            }
        }
        else
            Qk.Form.Alert('There was a problem during saving.');
    };

    var addOption = function(value, index)
    {
        if (typeof (value) != 'object')
        {
            Qk.Form.Alert('Cannot add an option. The value type is not correct.');
            return false;
        }

        if (!Qk.Utilities.IsArray(value)) // Add an option through standar way. Index does not necessary.
        {
            (index) ? Xrm.Page.getControl(fieldNames).addOption(value, index) :
                        Xrm.Page.getControl(fieldNames).addOption(value);
        }
        else // When we want add many new options. No index required.
            for (i = 0; i < value.length; i++)
            {
                if (typeof value[i] != 'object')
                {
                    Qk.Form.Alert('Cannot add an option. The value type is not correct.');
                    return false;
                }

                Xrm.Page.getControl(fieldNames).addOption(value[i]);
            }
    };

    var removeOption = function(value)
    {
        if (value == 'all')
            Xrm.Page.getControl(fieldNames).clearOptions();
        else if (typeof value == 'string')
        {
            var options = Xrm.Page.getAttribute(fieldNames).getOptions();
            for (i = 0; i < options.length; i++)
                if (options[i].text.toLowerCase() == value.toLowerCase())
                    Xrm.Page.getControl(fieldNames).removeOption(options[i].value);
        }
        else
            Xrm.Page.getControl(fieldNames).removeOption(value);
    };

    // Explicit methods.
    var disable = function() { return setDisable(true); };

    var enable = function() { return setDisable(false); };

    var hide = function() { return setVisible(false); };

    var show = function() { return setVisible(true); };

    var submitAlways = function() { return setSubmitMode('always'); };

    var submitNever = function() { return setSubmitMode('never'); };

    var submitDirty = function() { return setSubmitMode('dirty'); };

    var fieldRequired = function() { return setRequirementLevel('required') };

    var fieldRecommended = function() { return setRequirementLevel('recommended') };

    var fieldNotRequired = function() { return setRequirementLevel('none') };

    var id = function() { return getLookupInfo('id') };

    var name = function() { return getLookupInfo('name') };

    var entityType = function() { return getLookupInfo('entityType') };

    var removeAllOptions = function() { return removeOption('all') };

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
        Add: addOption,
        Remove: removeOption,
        RemoveAll: removeAllOptions
    };
};

// <summary>
// Namespace to do the main operations with the form.
// </summary>
Qk.Form = function() {
    var showAlert = function(message) { return Xrm.Utility.alertDialog(message) };

    var showConfirm = function(message) { return Xrm.Utility.confirmDialog(message) };

    var getOrgLCID = function() { return Xrm.Page.context.getOrgLCID() };    

    var getIsDirty = function() { return Xrm.Page.data.entity.getIsDirty() };

    return {
        Alert: showAlert,
        Confirm: showConfirm,
        OrgLCID: getOrgLCID,
        IsDirty: getIsDirty
    };
}();

// <summary>
// Namespace to do operations with the tab and its elements.
// </summary>
Qk.Tab = function(tabSelector) {
    
    var tabName = tabSelector;

    var _tab;

    // Common methods.
    var getTabByName = function()
    {
        return Xrm.Page.ui.tabs.forEach(
            function(tab)
            {
                if (tab.getLabel().toLowerCase() === tabName.toLowerCase())
                    _tab = tab;
            });
    };

    var setDisable = function(action)
    {
        var typeTabName = typeof (tabName);
        getTabByName();        
        if (_tab != null)
        {
            Xrm.Page.ui.controls.forEach(
                function(control)
                {
                    if (control.getControlType() != 'subgrid')
                        control.setDisabled(action);
                });
        }
    };

    var setVisible = function(action)
    {
        var typeTabName = typeof (tabName);
        getTabByName();        
        if (_tab != null)
        {
            Xrm.Page.ui.controls.forEach(
                function(control)
                {
                    if (control.getControlType() != 'subgrid')
                        control.setVisible(action);
                });
        }
    };

    // Explicit methods.
    var disableAllControls = function() { setDisable(true) };

    var enableAllControls = function() { setDisable(false) };

    var hideAllControls = function() { setVisible(false) };

    var showAllControls = function() { setVisible(true) };

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
Qk.Section = function(sectionLabelParam) {
    var sectionLabel = sectionLabelParam;    

    // Common methods.
    var setDisable = function(action)
    {
        var tabs = Xrm.Page.ui.tabs;
        for (var i = 0; i < tabs.getLength() ; i++)
        {
            var tab = tabs.get(i);
            var sections = tab.sections;
            for (var j = 0; j < sections.getLength() ; j++)
            {
                var section = sections.get(j);
                if (section.getLabel().toLowerCase() === sectionLabel.toLowerCase())
                {
                    Xrm.Page.ui.controls.forEach(
                        function(control)
                        {
                            if (control.getControlType() != 'subgrid')
                                control.setDisabled(action);
                        });
                    break;
                }
            }
        }
    };

    var setVisible = function(action)
    {
        var tabs = Xrm.Page.ui.tabs;
        for (var i = 0; i < tabs.getLength() ; i++)
        {
            var tab = tabs.get(i);
            var sections = tab.sections;
            for (var j = 0; j < sections.getLength() ; j++)
            {
                var section = sections.get(j);
                if (section.getLabel().toLowerCase() === sectionLabel.toLowerCase())
                {
                    Xrm.Page.ui.controls.forEach(
                        function(control)
                        {
                            if (control.getControlType() != 'subgrid')
                                control.setVisible(action);
                        });
                    break;
                }
            }
        }
    };

    var disableAllControls = function() { return setDisable(true) };

    var enableAllControls = function() { return setDisable(false) };

    var hideAllControls = function() { return setVisible(false) };

    var showAllControls = function() { return setVisible(true) };

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
Qk.Utilities = function() {
    var areGuidEqual = function(guid1, guid2)
    {
        if (guid1.toLowerCase() === guid2.toLowerCase()) return true;
        return false;
    };    

    var checkTypes = function(fielName, value)
    {
        var type = Qk.Field(fielName).AttributeType;
        var isMatch = false;

        switch (type)
        {
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
                if (typeof (value) == ('object' || 'number') &&
                    !Qk.Utilities.IsArray(value))
                    isMatch = true;
                break;
        }

        var result = {};
        result.type = type;

        if (isMatch)        
            result.match = true;
        else        
            result.match = false;            

        return result;
    };

    var isArray = function(value)
    {
        if (value.constructor === Array)
            return true;
        else
            return false;
    };

    return {
        IdCompare: areGuidEqual,
        CheckTypes: checkTypes,
        IsArray: isArray
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