# Change Maximum Height of Auto-Resized TextAreas
In Fuji release of ServiceNow, all textarea fields are expanded automatically by default. The default maximum height is 435px.

If you do not like the default maximum height and would like to change to a small default, says 100px. You can try one of the following options

## To a specific field only
If you only want to change the maximum height for one particular field only, you can define a [**Field Style**](http://wiki.servicenow.com/index.php?title=Defining_Field_Styles#gsc.tab=0) for the required field.

To do so,
- Right click on the Label of the Field you would like to customize
- Choose **Configure Styles**
- If you found an existing record, you may want to modify the existing one; otherwise, click **New**
- The Table and Field Name should have been pre-filled.
- Put `max-height: 100px !important;` in the Style field and Submit/Update.

## To all forms in ServiceNow
If you would like to apply this change to every textarea field in the system, you can create a UI Script like,

```
document.observe('dom:loaded', function() {
    document.styleSheets[0].insertRule("HTML[data-doctype=true] textarea { max-height: 100px !important; }", 0);
});
```

Alternatively, you can copy the codes from [UI Script - Global.js](./UI Script - Global.js) in this folder.

## To only Problem and/or Incident form
In ServiceNow, each application would have its own form ID. For example:
- Problem form: `id="problem.do"`
- Incident form: `id="incident.do"`

We can adjust the CSS to target specifically to a partcular application if needed. The following codes change the default maximum height for Problem form only.

```
document.observe('dom:loaded', function() {
    // You can also change #problem\\.do to #incident\\.do if you want to apply the new max-height to the Incident Form only.
    document.styleSheets[0].insertRule("HTML[data-doctype=true] #problem\\.do textarea { max-height: 100px !important; }", 0);
});
```

You can copy the codes from [UI Script - Problem Form Only.js](./UI Script - Problem Form Only.js) in this folder.

## To only Record Producer record in Service Catalog
If you need to target the Record Producer definition form, you should target the CSS rule to this ID `sc_cat_item_producer.do`.

However, if you need to target the Record Producer record in the Service Catalog, you should target the CSS rule to #item_table instead.

```
document.observe('dom:loaded', function() {
    // #item_table should be the unique ID available when you view the Record Producer in the Service Catalog
    document.styleSheets[0].insertRule("HTML[data-doctype=true] #item_table textarea { max-height: 100px !important; }", 0);
});
```

You can copy the codes from [UI Script - Record Producer.js](./UI Script - Record Producer.js) in this folder.
