{"entities": {"Track": {"fullName": "backlog.Track", "code": "Track", "properties": {"comment": {"code": "comment", "description": "", "baseType": "string", "isPrimary": true, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "comment", "isRequired": true, "isNullable": false, "isLookUpResult": true, "prpDefault": ""}, "issue": {"code": "issue", "onRefDelete": "", "relatedName": "", "typeRelation": "", "refMin": "", "isPrimary": true, "refEntity": "Issue", "baseType": "string", "isReadOnly": false, "isSensitive": false, "prpScale": 0, "refCode": "Issue", "isForeign": true, "vType": "", "description": "", "prpChoices": null, "isRequired": true, "baseMax": "", "crudType": "", "prpLength": null, "isNullable": false, "prpDefault": null, "isLookUpResult": true, "notes": "", "refMax": "", "isEssential": false, "baseMin": "", "property": "issue", "dbName": null}}, "prototypes": {"backlog-track": {"prototype": "backlog_track", "notes": null, "code": "backlog-track", "description": "", "metaDefinition": {"viewCode": "prototype.ProtoTable.backlog-track", "gridConfig": {"baseFilter": [{"property": "entity", "filterStmt": "=30"}], "listDisplay": ["info__comment", "info__issue"], "hiddenFields": ["id", "info", "entity_id"], "readOnlyFields": [], "sortFields": ["info__comment", "info__issue", "__str__"], "searchFields": ["info"]}, "updateTime": "2013-11-06T16:32:26.166624", "description": "", "shortTitle": "backlog-track", "localSort": true, "protoEntity": "backlog-track", "formConfig": {"items": [{"items": [{"name": "info__comment", "__ptType": "formField"}, {"name": "info__issue", "__ptType": "formField"}], "fsLayout": "2col", "__ptType": "fieldset"}], "__ptType": "formConfig"}, "viewIcon": "icon-proto", "__ptType": "pcl", "protoEntityId": 30, "metaVersion": "13.0301", "fields": [{"readOnly": true, "type": "autofield", "hidden": true, "name": "id"}, {"readOnly": true, "hidden": true, "name": "entity"}, {"readOnly": true, "prpDefault": 30, "hidden": true, "name": "entity_id"}, {"readOnly": true, "type": "jsonfield", "hidden": true, "searchable": true, "name": "info"}, {"readOnly": true, "type": "foreigntext", "name": "smOwningUser"}, {"readOnly": true, "type": "foreigntext", "name": "smOwningTeam"}, {"readOnly": true, "type": "datetime", "name": "smCreatedOn"}, {"vType": "", "name": "info__comment", "required": true, "primary": true, "tooltip": "", "choices": "", "prpScale": 0, "header": "comment", "readOnly": false, "crudType": "", "prpLength": 0, "type": "string", "prpDefault": ""}, {"fkField": "info__issue_id", "readOnly": true, "type": "foreignid", "hidden": true, "name": "info__issue_id"}, {"zoomModel": "prototype.ProtoTable.backlog-issue", "vType": "", "name": "info__issue", "fkId": "info__issue_id", "required": true, "primary": true, "tooltip": "", "choices": null, "prpScale": 0, "header": "issue", "readOnly": false, "crudType": "", "prpLength": null, "type": "foreigntext", "prpDefault": null}, {"flex": 1, "sortable": true, "name": "__str__", "fkId": "id", "zoomModel": "prototype.ProtoTable.backlog-track", "cellLink": true, "physicalName": "@myStr(\"info__comment\",\"info__issue\")", "header": "backlog-track", "readOnly": true, "type": "string"}], "viewEntity": "prototype.ProtoTable", "idProperty": "id", "jsonField": "info", "detailsConfig": []}}}, "entity": "Track"}, "Issue": {"fullName": "backlog.Issue", "code": "Issue", "properties": {"comment": {"code": "comment", "description": "", "baseType": "string", "isPrimary": false, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "comment", "isRequired": false, "isNullable": false, "isLookUpResult": false, "prpDefault": ""}, "estimatedDate": {"code": "estimatedDate", "description": "", "baseType": "date", "isPrimary": false, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "estimateddate", "isRequired": false, "isNullable": false, "isLookUpResult": false, "prpDefault": ""}, "description": {"code": "description", "description": "", "baseType": "string", "isPrimary": false, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "description", "isRequired": false, "isNullable": false, "isLookUpResult": false, "prpDefault": ""}, "title": {"code": "title", "description": "", "baseType": "string", "isPrimary": true, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "title", "isRequired": true, "isNullable": false, "isLookUpResult": true, "prpDefault": ""}, "priority": {"code": "priority", "description": "", "baseType": "string", "isPrimary": false, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "priority", "isRequired": false, "isNullable": false, "isLookUpResult": false, "prpDefault": ""}, "state": {"code": "state", "description": "", "baseType": "string", "isPrimary": false, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "state", "isRequired": false, "isNullable": false, "isLookUpResult": false, "prpDefault": ""}, "tag": {"code": "tag", "description": "", "baseType": "string", "isPrimary": false, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "tag", "isRequired": false, "isNullable": false, "isLookUpResult": false, "prpDefault": ""}, "requiredDate": {"code": "requiredDate", "description": "", "baseType": "date", "isPrimary": false, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "requireddate", "isRequired": false, "isNullable": false, "isLookUpResult": false, "prpDefault": ""}, "type": {"code": "type", "description": "", "baseType": "string", "isPrimary": false, "notes": "", "isSensitive": false, "crudType": "", "dbName": null, "prpScale": 0, "isReadOnly": false, "prpLength": 0, "vType": "", "isEssential": false, "prpChoices": "", "isForeign": false, "property": "type", "isRequired": false, "isNullable": false, "isLookUpResult": false, "prpDefault": ""}}, "prototypes": {"backlog-issue": {"prototype": "backlog_issue", "notes": null, "code": "backlog-issue", "description": "", "metaDefinition": {"viewCode": "prototype.ProtoTable.backlog-issue", "sheetConfig": [], "updateTime": "2013-11-10 12:03:37", "shortTitle": "backlog-issue", "localSort": true, "viewIcon": "icon-proto", "formConfig": {"items": [{"items": [{"name": "info__title", "__ptType": "formField"}, {"name": "info__description", "__ptType": "formField"}, {"name": "info__comment", "__ptType": "formField"}, {"name": "info__requireddate", "__ptType": "formField"}, {"name": "info__priority", "__ptType": "formField"}, {"name": "info__estimateddate", "__ptType": "formField"}, {"name": "info__type", "__ptType": "formField"}, {"name": "info__state", "__ptType": "formField"}, {"name": "info__tag", "__ptType": "formField"}], "fsLayout": "2col", "__ptType": "fieldset"}], "__ptType": "formConfig"}, "gridSets": {"filtersSet": [], "sortersSet": [], "listDisplaySet": [], "__ptType": "gridSets"}, "protoEntity": "backlog-issue", "gridConfig": {"initialSort": [], "baseFilter": [{"property": "entity", "filterStmt": "=29", "__ptType": "filterDef"}], "listDisplay": ["info__title", "info__description", "info__priority", "info__estimateddate", "info__state"], "hiddenFields": ["id", "info", "entity_id"], "__ptType": "gridConfig", "readOnlyFields": [], "sortFields": ["info__title", "info__description", "info__comment", "info__requireddate", "info__priority", "info__estimateddate", "info__type", "info__state", "info__tag", "__str__"], "initialFilter": [], "searchFields": ["info"]}, "__ptType": "pcl", "detailsConfig": [{"conceptDetail": "prototype.ProtoTable.backlog-track", "__ptType": "detailDef", "detailField": "info__issue_id", "detailName": "track", "menuText": "Track", "masterField": "pk"}], "actions": [], "metaVersion": "13.0111", "fields": [{"flex": 1, "sortable": true, "name": "__str__", "fkId": "id", "zoomModel": "prototype.ProtoTable.backlog-issue", "cellLink": true, "__ptType": "field", "header": "backlog-issue", "readOnly": true, "physicalName": "@myStr(\"info__title\")", "type": "string"}, {"header": "comment", "sortable": true, "type": "string", "name": "info__comment", "__ptType": "field"}, {"flex": 2, "sortable": true, "name": "info__description", "__ptType": "field", "header": "description", "wordWrap": true, "type": "string", "xtype": "textarea"}, {"header": "estimatedDate", "sortable": true, "type": "date", "name": "info__estimateddate", "__ptType": "field"}, {"header": "priority", "sortable": true, "type": "string", "name": "info__priority", "__ptType": "field"}, {"header": "requiredDate", "sortable": true, "type": "date", "name": "info__requireddate", "__ptType": "field"}, {"header": "state", "sortable": true, "type": "string", "name": "info__state", "__ptType": "field"}, {"header": "tag", "sortable": true, "type": "string", "name": "info__tag", "__ptType": "field"}, {"sortable": true, "name": "info__title", "required": true, "primary": true, "__ptType": "field", "header": "title", "type": "string"}, {"header": "type", "sortable": true, "type": "string", "name": "info__type", "__ptType": "field"}, {"readOnly": true, "type": "foreigntext", "name": "smOwningTeam", "__ptType": "field"}, {"readOnly": true, "type": "foreigntext", "name": "smOwningUser", "__ptType": "field"}, {"readOnly": true, "type": "string", "hidden": true, "__ptType": "field", "name": "entity"}, {"name": "entity_id", "__ptType": "field", "readOnly": true, "hidden": true, "type": "string", "prpDefault": 29}, {"readOnly": true, "type": "autofield", "hidden": true, "__ptType": "field", "name": "id"}, {"name": "info", "searchable": true, "__ptType": "field", "readOnly": true, "hidden": true, "type": "jsonfield"}, {"readOnly": true, "type": "datetime", "name": "smCreatedOn", "__ptType": "field"}], "viewEntity": "prototype.ProtoTable", "idProperty": "id", "jsonField": "info", "protoEntityId": 29, "usrDefProps": {"__ptType": "usrDefProps"}, "businessRules": {"__ptType": "businessRules"}}}}, "entity": "Issue"}}, "model": "backlog", "code": "BackLog"}