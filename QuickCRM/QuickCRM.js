/*******************************************************************************
* MSCRM 2011-2013-2015 Quick CRM Toolkit for JavaScript
* Author: Jorge Moreno
* Version: 0.0.1 (beta)
* Date: January, 2015.
********************************************************************************
* Credits:
*   Library that improves the permonance the Javascript developement.
********************************************************************************/

// <summary>
// Qk is the main library and fastest way to use it.
// </summary>
Qk = function()
{
    // <summary>
    // Qk.Entity about entity form functions.
    // Qk.Form about form functions.
    // Qk.Field about field functions.
    // Qk.Tab about tab functions.
    // Qk.Section for section functions.
    // </summary>
}

Qk.Entity = function()
{
    return {
        Id: Xrm.Page.data.entity.getId(),
        Name: Xrm.Page.data.entity.getEntityName()
    }
}();

Qk.Field = function(fieldNamesParam)
{
    var fieldNames = fieldNamesParam;

    // Common methods:
    var setDisable = function(action)
    {
        if (typeof (fieldNames) == "string")
            Xrm.Page.getControl(fieldNames).setDisabled(action);
        else if (fieldNames.constructor === Array)
            for (i = 0; i < fieldNames.length; i++)
                Xrm.Page.getControl(fieldNames[i]).setDisabled(action);
        else
            return "fieldNames is not a String or Array.";
    };

    var setVisible = function(action)
    {
        if (typeof (fieldNames) == "string")
            Xrm.Page.getControl(fieldNames).setVisible(action);
        else if (fieldNames.constructor === Array)
            for (i = 0; i < fieldNames.length; i++)
                Xrm.Page.getControl(fieldNames[i]).setVisible(action);
        else
            return "fieldNames is not a String or Array.";
    }

    var setSubmitMode = function(modeName)
    {
        if (modeName == "none" || modeName == "always" || modeName == "dirty")
        {
            if (typeof (fieldNames) == "string")
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
        if (levelName == "none" || levelName == "recommended" || levelName == "required")
        {
            if (typeof (fieldNames) == "string")
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

        if (typeof (fieldNames) == "string")
        {
            lookup = Xrm.Page.getAttribute(fieldNames).getValue();
            if (lookup != null && lookup.constructor === Array)
                info = lookup[0][typeInfo];
            else info = "The field is not a Lookup field.";
        }
        else if (fieldNames.constructor === Array)
        {
            info = new Array;
            for (i = 0; i < fieldNames.length; i++)
            {
                lookup = Xrm.Page.getAttribute(fieldNames[i]).getValue();
                if (lookup != null && lookup.constructor === Array)
                    info.push(lookup[0][typeInfo]);
                else info = "Some of the fields is not a Lookup field.";
            }
        }
        return info ? info : "There was a problem obtaining the " + typeInfo + " attribute.";
    };

    var getValue = function()
    {
        var info;

        if (typeof (fieldNames) == "string")
            return Xrm.Page.getAttribute(fieldNames).getValue();
        else if (fieldNames.constructor === Array)
        {
            info = new Array;
            for (i = 0; i < fieldNames.length; i++)
                info.push(Xrm.Page.getAttribute(fieldNames[i]).getValue());
            return info ? info : "There was a problem obtaining the values.";
        }
    };

    // Explicit methods:
    var disable = function() { return setDisable(true); };

    var enable = function() { return setDisable(false); };

    var hide = function() { return setVisible(false); };

    var show = function() { return setVisible(true); };

    var submitAlways = function() { return setSubmitMode("always"); };

    var submitNever = function() { return setSubmitMode("never"); };

    var submitDirty = function() { return setSubmitMode("dirty"); };

    var fieldRequired = function() { return setRequirementLevel("required") };

    var fieldRecommended = function() { return setRequirementLevel("recommended") };

    var fieldNotRequired = function() { return setRequirementLevel("none") };

    var id = function() { return getLookupInfo("id") };

    var name = function() { return getLookupInfo("name") };

    var entityType = function() { return getLookupInfo("entityType") };

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
        Value: getValue()
    };
};

Qk.Form = function()
{
    var showAlert = function(message)
    {
        return Xrm.Utility.alertDialog(message)
    };

    var showConfirm = function(message)
    {
        return Xrm.Utility.confirmDialog(message)
    };

    var getOrgLCID = function() { return Xrm.Page.context.getOrgLCID() };

    var getUserLCID = function() { return Xrm.Page.context.getUserLcid() };

    var getIsDirty = function() { return Xrm.Page.data.entity.getIsDirty() };

    return {
        Alert: showAlert,
        Confirm: showConfirm,
        OrgLCID: getOrgLCID,
        UserLCID: getUserLCID,
        IsDirty: getIsDirty
    }
}();

Qk.Tab = function(tabSelector)
{
    var tabName = tabSelector;

    var _tab;

    var getTabByName = function()
    {
        return Xrm.Page.ui.tabs.forEach(
            function(tab)
            {
                if (tab.getLabel().toLowerCase() === tabName.toLowerCase())
                    _tab = tab;
            });
    };

    var disable = function(action)
    {
        var typeTabName = typeof (tabName);
        getTabByName();
        var tabControl = tab;
        if (tabControl != null)
        {
            Xrm.Page.ui.controls.forEach(
                function(control)
                {
                    if (control.getControlType() != "subgrid")
                        control.setDisabled(action);
                });
        }
    };

    var disableAllControls = function() { disable(true) };

    var enableAllControls = function() { disable(false) };

    return {
        DisableAllControls: disableAllControls,
        EnableAllControls: enableAllControls
    }
};

Qk.Section = function(sectionLabelParam)
{
    var sectionLabel = sectionLabelParam;

    var disable = function(action)
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
                            if (control.getControlType() != "subgrid")
                                control.setDisabled(action);
                        });
                    break;
                }
            }
        }
    };

    var disableAllControls = function() { return disable(true) };

    var enableAllControls = function() { return disable(false) };

    return {
        DisableAllControls: disableAllControls,
        EnableAllControls: enableAllControls
    }
};

// <summary>
// An alias to access Quick CRM Library too with long name.
// </summary>
QuickCRM = Qk;