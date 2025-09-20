export function gridDef (logo, color, title, title2) {
    let basicConf = {
        defaultColDef: {
            sortable: true,
            resizable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
        },
        autoSizeStrategy: {
            type: 'fitGridWidth',
        },
        autoGroupColumnDef: null,
        rowSelection: null,
        rowGroupPanelShow: null,
        pivotPanelShow: null,
        paginationPageSize: 20,
        rowData: null,
        excelStyles: [
            {
                id: 'headerBlue',
                alignment: {
                    horizontal: 'Center'
                },
                interior: {
                    color: color,
                    pattern: 'Solid',
                },
                font: {
                    bold: true,
                    color: '#ffffff'
                },
                borders: {
                    borderBottom: {
                        color: '#b7b7b7',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },
                    borderLeft: {
                        color: '#b7b7b7',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },
                },
            },
            {
                id: 'headerCenter',
                alignment: {
                    horizontal: 'Center'
                },
                interior: {
                    color: color,
                    pattern: 'Solid',
                },
                font: {
                    bold: true,
                    color: '#ffffff'
                },
                borders: {
                    borderBottom: {
                        color: '#b7b7b7',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },
                    borderLeft: {
                        color: '#b7b7b7',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },
                },
            },
            {
                id: 'headerWhite',
                alignment: {
                    horizontal: 'Center'
                },
                interior: {
                    color: '#fcfcfc',
                    pattern: 'Solid',
                },
                font: {
                    bold: true,
                    color: '#000000'
                },
                borders: {
                    borderBottom: {
                        color: '#b7b7b7',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },
                    borderLeft: {
                        color: '#b7b7b7',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },

                    borderTop: {
                        color: '#b7b7b7',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },

                    borderRight: {
                        color: '#b7b7b7',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },
                },
            },

            {
                id: 'excelTitle',
                font: {
                    bold: true,
                    color: '#2c2c2c',
                    size: 14
                },
                alignment: {
                    horizontal: 'left'
                },
                borders: {
                    borderRight: {
                        color: '#cecece',
                        lineStyle: 'Continuous',
                        weight: 1,
                    },
                },

            },
            {
                id: 'greenContentCell',
                font: {
                    color: '#1e6700',
                },
                alignment: {
                    horizontal: 'left'
                },
            },
            {
                id: 'redContentCell',
                font: {
                    color: '#a40a1f',
                },
                alignment: {
                    horizontal: 'left'
                },
            },
            {
                id: 'errorCell',
                font: {
                    color: '#e80000',
                },
                alignment: {
                    horizontal: 'left'
                },
            },
            {
                id: 'stringType',
                dataType: 'String',
            },
            {
                id: 'numberType',
                numberFormat: {
                    format: '#,##0.00',
                },
            },
            {
                id: 'dateType',
                numberFormat: {
                    format: 'yyy-mm-dd'
                }
            },
            {
                id: 'currencyFormat',
                numberFormat: {
                    format: '#,##0.00 $',
                },
            },
            {
                id: 'cell',
                alignment: {
                    wrapText: false,
                },
                font: {
                    size: 11
                }
            }
        ],
        defaultExcelExportParams : {
            sheetName:'Datos',
            prependContent: [
                {
                    cells: [
                        {
                            data: {
                                type: 'String',
                                value: logo,
                            },
                            mergeAcross: 3,
                        },
                    ],
                },
                {
                    cells: [
                        {   data:
                                {
                                    value: title,
                                    type: 'String',
                                },
                            mergeAcross: 2,
                            styleId: 'excelTitle',
                        },
                    ],
                },
                { cells: [
                        {
                            data:
                                {
                                    value: title2,
                                    type: 'String',
                                },
                            mergeAcross: 2,
                            styleId: 'excelTitle',
                        },
                    ] },
                /*{ cells: [
                        {
                            mergeAcross: 2,
                        },
                    ] },*/
            ],
            appendContent: [
                { cells: [] },
                { cells: [] },
                { cells: [] },
                {
                    cells: [
                        {   data:
                                {
                                    value: '  Created using TEINSA Validator',
                                    type: 'String',
                                },
                            mergeAcross: 0,
                            styleId: 'excelFooterText',
                        },
                    ],
                },
            ],
            rowHeight: (params) => (params.rowIndex === 1 ? 72 : 30),
            addImageToCell: (rowIndex, col, value) => {
                if (rowIndex !== 1 ) {
                    return;
                }
                return {
                    image: {
                        id: 'logo',
                        base64: value,
                        imageType: 'png',
                        width: 295,
                        height: 76,
                        position: {
                            colSpan: 2,
                        },
                    },
                }
            },
        }
    };
    return basicConf;
}



const getPropertyNames = (arr = []) => arr.length > 0 ? Object.keys(arr[0]) : [];

export function getColDefinitionsDyna(recsData, rawDef) {
    try {
        let colHeaders =  getPropertyNames(recsData);

        function currencyFormatFnx (value) {
            const options = {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            };
            if (isNaN(value) || value == null) {
                return parseFloat(0).toFixed(2);
            } else {
                let formatedValue = Number(value).toLocaleString('en', options);
                return formatedValue;
            }
        };

        function addColDefinition(item, index) {
            if (item == 'COD_REGION_SB03' || item == 'TIPO_CUADRE'){
                let rawDefinition =  {
                    headerName: item,
                    field: item,
                    sortable: false,
                    headerClass: 'headerBlue',
                    cellClass: 'stringType',
                    minWidth: 120
                }
            } else {
                let rawDefinition =  {
                    headerName: item,
                    field: item,
                    sortable: false,
                    headerClass: 'headerBlue',
                    valueFormatter: params => currencyFormatFnx(params.data[item]),
                    cellClass: 'numberType',
                    minWidth: 120
                }
                rawDef.push(rawDefinition)
            }
        }
        colHeaders.forEach(addColDefinition);
        return rawDef;
        console.log('hola')

    } catch (err) {
        throw err;
    }
}


