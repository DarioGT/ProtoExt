
Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.Panel',                                
    alias : 'widget.protoGrid',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.state.*',
        'Ext.form.*',
        'Ext.selection.CheckboxModel',
        'Ext.toolbar.TextItem' 
    ],
    // iconCls: 'icon-grid',

    height : 200,
    viewCode: null,
    
    // Internals 
    myMeta : null,  

    // Selection model 
    selModel : null, 
    rowData : null,  
    
    // Navegacion 
    isDetail : false, 
    isPromoted : false, 
    mdFilter : [], 
    initialFilter : null, 
    
    // Para guardar la definicion de cols al cambiar de tabs
    colDictDefinition : {},  
    colSetName : '',
    colSetDefinition : [], 
    colSetCache : {}, 
        
    initComponent: function() {

        var me = this;         

        if ( ! _SM.loadPci( this.viewCode, false ) ) {
            Ext.Msg.show({
               title: this.viewCode ,
               value: 'ERROR Pci  not loaded' 
            });
            return; 
        }

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = _SM.clone( _SM._cllPCI[ this.viewCode ] );
        this.myMeta = myMeta;
        this.myFieldDict = _SM.getFieldDict( myMeta )            
        
        
        // VErifica si el store viene como parametro ( Detail )
        var baseFilter = [];
        var myFilter = []
                
        if ( this.isDetail )  {
            // Inicialmente la grilla esta en blanco hasta q linkDetail le entrega un maestro valido.
            baseFilter = myMeta.gridConfig.baseFilter 
            myFilter   = [{ "property":  this.detailDefinition.detailField , "filterStmt": -1}] 
             
        } else if ( this.isPromoted ) {
            // El filtro base de una grilla promovida ( sacar detalle ) es el filtro base + la llave del maestro
            baseFilter = myMeta.gridConfig.baseFilter  
            baseFilter = baseFilter.concat( this.mdFilter ) 
               
        } else { 
            // La grilla normal tiene los parametros estandar definidos 
            baseFilter = myMeta.gridConfig.baseFilter 
            myFilter   = this.initialFilter || myMeta.gridConfig.initialFilter  
        }              


        var storeDefinition =  {
            viewCode : this.viewCode, 
            autoLoad    : this.autoLoad || true, 

            pageSize    : myMeta.pageSize || _SM._PAGESIZE,
            localSort   : myMeta.localSort , 

            // proxy.extraParams, siempre deben ser string 
            baseFilter  : baseFilter , 
            protoFilter : myFilter ,
            sorters     : myMeta.gridConfig.initialSort , 
            sProtoMeta  : _SM.getSafeMeta( myMeta )    
        };



        // ---------------------------------------------------------

        // Start Row Editing PlugIn
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });



        // Si es un detalle, aqui viene la especificacion de conexion ( detailDef ) 
        if ( me.detailDefinition ) {

            // El estilo de los detalles es siemrpe grid             
            myMeta.pciStyle = 'grid';             
            
            // Columnas heredadas en caso de ser un detalle 
            var nDetId = me.detailDefinition.detailField.replace( /__pk$/, '_id' ); 
            var vFld = me.myFieldDict[ nDetId ];
            
            // Asigna el titulo 
            var nDetTitle =  nDetId;
            if ( vFld ) { nDetTitle = me.detailDefinition.masterTitleField || vFld.fkField; }  
        } 

        createColDictionary()

        // gridColumns: Es un subconjuto para poder manejar diferentes conf de columnas
        // tiene en cuenta siel usuario  definio su vist por defecto la carga 
        var gridColumns,
            tabConfig  

        tabConfig = _SM.defineTabConfig(  myMeta.gridConfig  )          
        if ( myMeta.custom.listDisplay.length > 0  ) { 
            tabConfig.listDisplay = myMeta.custom.listDisplay             
        }
        gridColumns = this.getViewColumns( tabConfig )
        
        // Manejo de seleccion multiple 
        this.selModel = Ext.create('Ext.selection.CheckboxModel', {
            injectCheckbox: 'last', 
            mode : myMeta.gridConfig.gridSelectionMode || 'multi' 
        });    

        this.editable = false; 

        // Definie el grid 
        var grid
        if ( myMeta.pciStyle == 'tree' ) {
            // me.store = _SM.getTreeStoreDefinition( storeDefinition )
            // grid = Ext.create('Ext.tree.Panel', {border:false,region:'center',flex:1,layout:'fit',minSize:50,stripeRows:true,tools:[],useArrows:true,rootVisible:false,multiSelect:false,singleExpand:true,stripeRows:true,rowLines:true,store:me.store,columns:[{xtype:'treecolumn',text:myMeta.shortTitle,flex:3,dataIndex:'__str__'},{text:'protoView',dataIndex:'protoView'},{text:'id',dataIndex:'id'}]}); 
        } else { 

            me.store = _SM.getStoreDefinition( storeDefinition )
                
            grid = Ext.create('Ext.grid.Panel', {
                border : false, 
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 50,
                plugins: [    'headertooltip', this.rowEditing ],            

                selModel: this.selModel,
                columns : gridColumns,   
                store : this.store,  
                stripeRows: true, 
                
                 // Tools  ( necesario para AddTools )
                tools: [], 
                
                viewConfig: {
                    // Manejo de rows y cells  
                   
                    listeners: {


                        cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                            // Esto maneja los vinculos en los campos 
                            var linkClicked = (e.target.tagName == 'A');
                            var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
                            if (linkClicked && clickedDataIndex ) {
                                
                                var myZField = me.myFieldDict[ clickedDataIndex ] 
                                if ( ! myZField ) { return }
                                if (  myZField.zoomModel && myZField.fkId ) {
                                    
                                    if (( myZField.zoomModel == me.myMeta.viewEntity ) && ( myZField.fkId = me.myMeta.idProperty )) {
                                        // Si es el mismo registro lo llama como un upd 
                                        // xxx.call Redefine el scope  
                                        var formController = Ext.create('ProtoUL.UI.FormController', { myMeta : me.myMeta });
                                        formController.openLinkedForm.call( formController, me.selected , ! me.editable    )

                                    } else {
                                        // es un vinculo a otro objeto 
                                        var formController = Ext.create('ProtoUL.UI.FormController', {});
                                        formController.openProtoForm.call( formController, myZField.zoomModel , record.get( myZField.fkId ) , false )
                                    }
                                    
                                    
    
                                } else if ( myZField.zoomModel == '@cellValue' ) {
                                    // Podria usarse con @FieldName para indicar de donde tomar el modelo o la funcion  
    
                                    var pModel  =  record.get( myZField.name ) 
                                    _SM._mainWin.loadPciFromMenu( pModel ) 
    
                                } else {
                                    _SM.errorMessage( 'LinkedForm definition error : ' +  clickedDataIndex, 
                                                  'zoomModel : ' + myZField.zoomModel + '<br>' +
                                                  'fkId : ' + myZField.fkId  
                                                   )
                                }; 
                                
                            }
                        }, 
                        
                    },                
                   
                    getRowClass: function(record, rowIndex, rowParams, store){
                        //    Esto permite marcar los registros despues de la actualizacion 
                        var stRec = record.get('_ptStatus');
                        if ( stRec ) { 
                            if ( stRec == _SM._ROW_ST.NEWROW ) { return stRec; } 
                            else { return _SM._ROW_ST.ERROR; }
                        } else { return '' }
                        
                    }
               }
                
            }); 

        }

        this._extGrid = grid;
        this.setGridTitle( this ) ;

// ---- GridControllers

        if ( this.gridController ) {
            this.gridController.myGrid = this
            this.gridController.store = this.store
        } else {
            this.gridController = Ext.create('ProtoUL.UI.GridController', {
                myMeta: myMeta, 
                myGrid : this, 
                store : this.store  
            }); 
        }
        this.gridController.addGridTools()

        this.sheetCrl = Ext.create('ProtoUL.UI.GridSheetController', { myGrid : this }); 
        

// ---

        var myItems = [ grid ]
        var mySheet = this.sheetCrl.getSheetConfig()
        if ( mySheet ) myItems.push( mySheet )  

        Ext.apply(this, {
            layout: 'border',
            border : false, 
            defaults: { collapsible: false, split: false },
            items: myItems
        });



        this.addEvents(
            'selectionChange', 'rowDblClick', 'promoteDetail'
        );

        this.callParent(arguments);
        this.gridController.addNavigationPanel(); 


        grid.on({
            // select: {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
                // // Select, presenta el rowIndex en  la grilla  
                // me.fireSelectionChange( rowModel , record,  rowIndex,  eOpts   )
            // }, scope: this }, 
            selectionchange: {fn: function(selModel, selected,  eOpts ) {
                // Expone la fila seleccionada. 
                this.selected = selected[0] || null;

                if ( this.selected  ) {
                    me.rowData = this.selected.data 
                    me.fireSelectionChange( selModel, this.selected,  this.selected.index + 1,  eOpts   ) 
                } else { 
                    me.rowData = null 
                    me.fireSelectionChange( selModel, null,  null,  eOpts   )
                } 
                                // Si hay botones o eltos de la interface a modificar 
                // grid4.down('#removeButton').setDisabled(selections.length == 0);
            }, scope: this }, 
            
            itemmouseenter: {fn: function(view, record, item) {
                // Esto maneja los tooltip en las las filas
                var msg = record.get('_ptStatus')
                if ( msg == _SM._ROW_ST.NEWROW  ) msg = '';

                // Asigna un tooltip a la fila, pero respeta los de cada celda y los de los Actiosn
                Ext.fly(item).set({'data-qtip': msg });
                
                // Dgt :  Este tooltip evita las actions columns 
                // Ext.fly(item).select('.x-grid-cell:not(.x-action-col-cell)').set({'data-qtip': 'My tooltip: ' + record.get('name')});
            }, scope: this }, 

            // Para manejar aciones por teclas, ie  ^I Insertar, etc ....     
            // processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
                // if ( type == 'keydown' ) { 
                    // console.log( view, cell, recordIndex, cellIndex, e )
                // } 
            // }, 

            celldblclick: {fn: function ( tbl, el,  cellIndex, record, tr, rowIndex, e,  eOpts ) {
                // para seleccionar en el zoom         
                // Si esta en modo edicion no dispara nada para permitir entrar al editor 
                if ( me.editable ) return  


                //Evento SM (Hmaury)..........................
                //ejemplo:
                //{ "dblClick":"{ fn: function(){ Ext.Msg.alert('','hola') } } " ,"Prueba" : ""  }
                //para cargar un js desde el codigo del evento:
                // var scrpt = document.createElement('script'); scrpt.src='../../static/aplications/GIS/factura_dblclick.js'; document.head.appendChild(scrpt);
                // eval(me.myMeta.businessRulesText["dblClick"]);
                // var event = Ext.decode(me.myMeta.businessRulesText["dblClick"]);
                // event.fn();

                me.fireEvent('rowDblClick', record, rowIndex  );
            }, scope: me }, 


            //   E D I C I O N    --------------------------------------------------------------- 

            beforeedit: {fn: function ( edPlugin, e, eOpts) {
                if ( ! this.editable )  return false;
                
                var perms = _SM._UserInfo.perms[ this.myMeta.viewCode ]
                if ( ! perms['change'] ) return false  
                
                // Resetea el zoom 
                for (var ix in e.grid.columns ) {
                    var vFld = e.grid.columns[ix]
                    var initialConf = vFld.initialConfig 
                    if (! initialConf.editor ) continue;
                    if (  initialConf.editor.xtype != 'protoZoom' ) continue;
                    
                    var zoom = vFld.getEditor()
                    zoom.resetZoom()
                }
            }, scope: me }, 
            
            // canceledit :  function(editor, e, eOpts) {
            // Fires when the user started editing but then cancelled the edit. ...


            validateedit: {fn:  function(editor, e, eOpts) {
                // Fires after editing, but before the value is set in the record. ...
            
                // Resetea el status despues de la edicion 
                if ( ! e.record.getId() ) {
                    e.record.phantom = true;                           
                    e.record.data._ptStatus = _SM._ROW_ST.NEWROW 
                } else {
                    e.record.data._ptStatus = '' 
                }
                e.record.dirty = true;
    
                // Manejo del retorno del zoom 
                for (var ix in e.grid.columns ) {
                    var vFld = e.grid.columns[ix]
                    var initialConf = vFld.initialConfig 
                    if (! initialConf.editor ) continue;
                    if (  initialConf.editor.xtype != 'protoZoom' ) continue;
                    
                    var zoom = vFld.getEditor()
                    var idIndex = initialConf.editor.fkId 
                                
                    if ( ! zoom.zoomRecord ) continue; 
                    // Actualiza el Id con el dato proveniente del zoom 
                    // fix: Agrega el modificado en caso de q no se encuentre         
                    if ( ! e.record.modified[ idIndex ]  ) {
                        e.record.modified[ idIndex ] = e.record.data[ idIndex ]  
                    }         
                    e.record.data[ idIndex ] = zoom.zoomRecord.data.id
                }
            // }, scope: me }, 
            // afterrender: {fn: function( grid, eOpts) {
                // this.setChekSelection( this, this.myMeta.gridConfig )
            }, scope: me } 

        });         
        
        function createColDictionary() {
        // Crea el diccionario de columnas 
            var gCol
            for (var ix in myMeta.fields ) {
                var vFld = myMeta.fields[ix] 
                if ( vFld.crudType == 'storeOnly' ) continue;
    
                // lee las props p
                gCol = _SM.getColDefinition( vFld  );
    
                // Oculta los campos provenientes del maestroo en los detalles 
                if ( gCol.dataIndex in _SM.objConv([nDetId , nDetTitle])  ) { 
                    gCol['readOnly'] = true  
                    delete gCol['editor']
                }
                
                // DGT: No se necesita, la definicion viene automatica  
                // if (( myMeta.pciStyle == 'tree' ) && ( gCol.dataIndex  == '__str__' )) { gCol.xtype = 'treecolumn' };  
                me.colDictDefinition[ gCol.dataIndex ]  = gCol ;
    
            }

            // Crea el rowNumber 
            gCol = { xtype: 'rownumberer', width:37, draggable:false,  sortable: false } // locked: true, lockable: false }
            me.colDictDefinition[ '___numberCol' ]  = gCol ;

        }

        
         
    },

    fireSelectionChange: function ( rowModel, record, rowIndex,  eOpts ) {
        this.fireEvent('selectionChange', rowModel, record, rowIndex,  eOpts );
        if ( this.IdeSheet ) { this.sheetCrl.prepareSheet(); }
    }, 

    getSelectedIds: function() {
        // Lista de registros seleccionados ( id )

        var selectedIds = []
        if ( ! this.selected ) return selectedIds 
        if ( ! this.selModel ) return [ this.selected.get('id') ]

        var cllSelection = this.selModel.getSelection()                 
        for ( var ix in cllSelection ) {
            selectedIds.push( cllSelection[ix].get( 'id') ) 
        } 
        
        return selectedIds
    }, 
    
    getViewColumns: function (  tabConfig  ) {

        // guarda la confAnterior 
        if ( this.colSetName == tabConfig.name ) return this.colSetDefinition
        
        // Lo inicia para volver a crearlo
        this.colSetName = tabConfig.name  
        this.colSetDefinition= [];
        
        var gCol, dataIndex 
                
        // Adding RowNumberer  
        if ( ! tabConfig.hideRowNumbers )  {
            gCol  = this.colDictDefinition[ '___numberCol' ]
            this.colSetDefinition.push( gCol );
        }; 

        for (var ixV in tabConfig.listDisplay  ) {
            dataIndex = tabConfig.listDisplay[ ixV ]
            gCol = this.colDictDefinition[ dataIndex ] 
            if ( gCol ) {  this.colSetDefinition.push( gCol ) }
        }
        
        return this.colSetDefinition
    },
    
    configureColumns: function ( tabConfig ) {

        // guarda la confAnterior 
        if ( this.colSetName == tabConfig.name ) return this.colSetDefinition

        var vColumns = this.getViewColumns( tabConfig )
        
        // para corregir un error ( foros Ext )  
        this._extGrid.view.refresh();

        // Configurar columnas de la grilla 
        // Primero se borran todos exepto el check ( en vez de removeAll() )
        var hCt = this._extGrid.headerCt,  
            removeItems = hCt.items.items.slice(),
            i = 0,
            len = removeItems.length -1,
            item;

        this.suspendLayouts();
        for (; i < len; i++) {
            item = removeItems[i];
            hCt.remove(item, true);
        }

        hCt.add( 0, vColumns );
        
        // this.setChekSelection( this, tabConfig )
        this.resumeLayouts( true );
        
        this._extGrid.view.refresh();

    }, 

    setChekSelection : function( me, tabConfig ) { 
        // Hace visible o no checkColumn ( siempre es la ultima )
        var hCt = me._extGrid.headerCt, 
            ix = hCt.items.items.length -1
        
        if ( !! tabConfig.hideCheckSelect ) {
            hCt.items.items[ix].hide()
        } else { hCt.items.items[ix].show() }

    }, 
    
    setGridTitle: function( me ){
        var gridTitle = ''; 
        
        if ( me.detailTitle ) {
            gridTitle = '" ' + me.detailTitle + ' "' 
        } else if ( me.mdFilter != undefined )  { 
            gridTitle = Ext.encode( me.mdFilter )   
        };
        
        // Titulos cuando son filtros predefinidos 
        if ( me.filterTitle ) {
            if ( gridTitle ) { gridTitle += ' ; '  };
            gridTitle +=  me.filterTitle ; 
        } 

        if ( gridTitle ) { gridTitle = ' filtrés par ' +  gridTitle + '' };
        gridTitle = me.myMeta.shortTitle + gridTitle ; 

        me._extGrid.setTitle( gridTitle )  
    }, 
    
    
    addNewRecord: function( zoomForm ) {
        if ( !(  this.editable  ||  zoomForm )) return; 
        this.insertNewRecord ( _SM.getNewRecord( this.myMeta, this.store )  ) 
    }, 
    

    duplicateRecord: function() {
        if ((! this._extGrid ) || ( ! this.editable )) return; 
        
        var rec =  this.selected
        if ( rec )  this.insertNewRecord ( rec.copy()  ) 
    }, 

    insertNewRecord: function( rec ) {
        
        rec.data._ptStatus = _SM._ROW_ST.NEWROW 
        rec.data._ptId = rec.get( 'id' )   
        rec.data.id = undefined 
        rec.phantom = true 
        this.store.insert(0, rec );
        
        // Selecciona el registro adicionado
        var sm = this._extGrid.getSelectionModel()
        sm.select( 0 )
    },


    getRowIndex: function() {
        
        var sm = this._extGrid.getSelectionModel();
        var rowIndex = this.store.indexOf( sm.getSelection()[0])
        if ( rowIndex < 0 ) rowIndex = 0  
        return rowIndex 
         
    }, 
    
    deleteCurrentRecord: function() {
        if ((! this._extGrid ) || ( ! this.editable )) return; 
        if ( this.rowEditing ) { this.rowEditing.cancelEdit(); }


        var rowIndex = this.getRowIndex();  

        var sm = this._extGrid.getSelectionModel();
        this.store.remove( sm.getSelection()  );

        // this.grid.store.indexOf( this.selections.itemAt(0) );
        if (this.store.getCount() <= rowIndex ) rowIndex = 0 
        if (this.store.getCount() > 0) {
            sm.select( rowIndex  );
        }        
        
    }, 

    setEditMode: function(  bEdit ) {
        // Deshabilita cualquier operacion al server
        this.store.editMode = bEdit 
        this.gridController.setEditMode( bEdit )
    },  

    saveChanges: function( autoSync ){
        this.store.sync();
        if ( autoSync != undefined )  this.store.autoSync = autoSync  
    }, 

    reload: function() {
        this.store.load(); 
    }, 
    
    cancelChanges: function() {
        this.store.load(); 
    }, 
    
    gridLoadData: function( grid,  sFilter, sorter  ) {
        
        grid.store.myLoadData( sFilter, sorter  )
        
        // Para evitar q al filtrar se quede en una pagina vacia 
        if ( grid.store.currentPage != 1 )  grid.store.loadPage(1);
    },
    
    addTools: function( myTools ) {
        // Controles de edicion en el panel de titulo de la grilla 
        this._extGrid.addTool( myTools )
    } 


});
