export default [
    {
        header: 'Menu',
    },
    {
        title: 'Inicio',
        route: 'atom-dashboard',
        icon: 'HomeIcon',
    },
/*
    {
        title: 'Consulta de Periodos',
        icon: 'SunIcon',
        route: {
            name: 'atom-periods'
        },
    },*/
    {
        title: 'Reportes',
        icon: 'DatabaseIcon',
        children: [
            {
                title: 'Comparaciones',
                icon: 'SidebarIcon',
                children:[
                    {
                        title: 'Comparaciones',
                        route: {
                            name: 'Usp_Rep_Comparacion',
                            query: {
                                report:  'Comparaciones'
                            }
                        },
                    },
                    {
                        title: 'Comp. AT03',
                        route: {
                            name: 'Usp_Rep_AT03_Comparacion',
                            query: {
                                report:  'Comparación AT03'
                            }
                        },
                    },
                    {
                        title: 'Comp. AT03 x Actividad',
                        route: {
                            name: 'Usp_Rep_AT03_Comparacion_Actividad',
                            query: {
                                report:  'Comparación AT03 x Actividad'
                            }
                        },
                    },
                    {
                        title: 'Comp. AT03 x Región',
                        route: {
                            name: 'Usp_Rep_AT03_Comparacion_Region',
                            query: {
                                report:  'Comparación AT03 x Región'
                            }
                        },
                    },
                    {
                        title: 'Comp. AT12',
                        route: {
                            name: 'Usp_Rep_AT12_Comparacion',
                            query: {
                                report:  'Comp. AT12'
                            }
                        },
                    },
                    {
                        title: 'Comp. AT15',
                        route: {
                            name: 'Usp_Rep_AT15_Comparacion',
                            query: {
                                report:  'Comp. AT15'
                            }
                        },
                    },
                    {
                        title: 'Comp. AT21',
                        route: {
                            name: 'Usp_Rep_AT21_Comparacion',
                            query: {
                                report:  'Comp. AT21'
                            }
                        },
                    },
                    {
                        title: 'Comp. AT21 | AT03 | AT02 | BAN06',
                        route: {
                            name: 'Usp_Rep_Cuadre_AT21_At12_At03VSAT02',
                            query: {
                                report:  'Comp. AT21 | AT03 | AT02 | BAN06'
                            }
                        },
                    },
                    /*
                    {
                        title: 'Comparación BAN06 CINU',
                        route: {
                            name: 'USP_VAL_REP_COMPARACION_BAN06_CINU',
                            query: {
                                report:  'Comparación BAN06 CINU'
                            }
                        },
                    },
                    */
                    /*
                    {
                        title: 'Comparación CINU BAN06 vs AT03',
                        route: {
                            name: 'USP_VAL_REP_COMPARA_CINU_BAN06_AT03',
                            query: {
                                report:  'Comparación CINU BAN06 vs AT03'
                            }
                        },
                    },
                    */
                ]
            },
            {
                title: 'Cuadre',
                icon: 'SquareIcon',
                children:[
                    {
                        title: 'Cuadre AT02 vs AT07',
                        route: {
                            name: 'Usc_AT02_AT07',
                            query: {
                                report:  'Cuadre AT02 vs AT07'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN10 vs AT03 Provisión',
                        route: {
                            name: 'Usc_BAN10_AT03_R1',
                            query: {
                                report:  'Cuadre BAN10 vs AT03 Provisión'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN10 vs AT03 Categoría Normal',
                        route: {
                            name: 'USC_BAN10_AT03_R2',
                            query: {
                                report:  'Cuadre BAN10 vs AT03 Categoría Normal'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN06 VS AT03',
                        route: {
                            name: 'Usc_BAN06_AT03_R1',
                            query: {
                                report:  'Cuadre AT03 vs BAN06'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN01 VS AT05',
                        route: {
                            name: 'Usc_BAN01_AT05_R1',
                            query: {
                                report:  'Cuadre BAN01 VS AT05'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN10 General',
                        route: {
                            name: 'USC_BAN10_ONLY',
                            query: {
                                report:  'Cuadre BAN10 General'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT02 vs AT21',
                        route: {
                            name: 'USC_AT02_AT21_x_REGION',
                            query: {
                                report:  'Cuadre AT02 vs AT21'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT03 vs AT21x',
                        route: {
                            name: 'USC_AT03_AT21_X_REGION',
                            query: {
                                report:  'Cuadre AT03 vs AT21'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT04 vs AT21',
                        route: {
                            name: 'USC_AT04_AT21',
                            query: {
                                report:  'Cuadre AT04 vs AT21'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT05 vs AT21',
                        route: {
                            name: 'USC_AT05_AT21',
                            query: {
                                report:  'Cuadre AT05 vs AT21'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT12 vs AT21',
                        route: {
                            name: 'USC_AT12_AT21',
                            query: {
                                report:  'Cuadre AT12 vs AT21'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT15 vs AT21 x Región',
                        route: {
                            name: 'USC_AT15_AT21_x_REGION',
                            query: {
                                report:  'Cuadre AT15 vs AT21 x Región'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT15 vs AT07',
                        route: {
                            name: 'USC_AT15_AT07_R1',
                            query: {
                                report:  'Cuadre AT15 vs AT07'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT09',
                        route: {
                            name: 'USC_AT09_ALL',
                            query: {
                                report:  'Cuadre AT09 vs AT02 - AT03 - AT15'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT07 vs AT21',
                        route: {
                            name: 'USC_AT07_AT21_x_Region',
                            query: {
                                report:  'Cuadre AT07 vs AT21'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN09 vs AT21',
                        route: {
                            name: 'USC_BAN09_AT21',
                            query: {
                                report:  'Cuadre BAN09 vs AT21'
                            }
                        },
                    },
                    {
                        title: 'Monto Garantía vs Valor Ponderado',
                        route: {
                            name: 'Usp_Val_Rep_Cuadre_AT12_Mto_Garantia_Valor_Ponderado',
                            query: {
                                report:  'Monto Garantía vs Valor Ponderado'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT10 EVAP',
                        route: {
                            name: 'Usp_Val_Rep_Cuadre_AT10_EVAP',
                            query: {
                                report:  'Cuadre AT10 EVAP'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN06 VS AT03 Globales',
                        route: {
                            name: 'Usp_Val_Rep_Cuadre_BAN06_AT03_Globales',
                            query: {
                                report:  'Cuadre BAN06 VS AT03 Globales'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN06 VS AT03 Clasificaciones Diferentes',
                        route: {
                            name: 'Usp_Val_Rep_Cuadre_BAN06_AT03_Clasif_Diferentes',
                            query: {
                                report:  'Cuadre BAN06 VS AT03 Clasificaciones Diferentes'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT03 vs BAN03 Tipo Relación',
                        route: {
                            name: 'Usp_Val_Rep_BAN03_AT03_Tipo_Relacion',
                            query: {
                                report:  'Cuadre AT03 vs BAN03 Tipo Relación'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN01 VS AT08',
                        route: {
                            name: 'Usp_Val_Rep_Cuadre_BAN01_AT08',
                            query: {
                                report:  'Cuadre BaN01 VS AT08'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT12 vs AT02',
                        route: {
                            name: 'Usp_Val_Rep_Cuadre_AT12_AT02',
                            query: {
                                report:  'Cuadre AT12 vs AT02'
                            }
                        },
                    },
                    {
                        title: 'Cuadre AT12 vs AT03',
                        route: {
                            name: 'Usp_Val_Rep_Cuadre_AT12_AT03',
                            query: {
                                report:  'Cuadre AT12 vs AT03'
                            }
                        },
                    },
                    {
                        title: 'Cuadre BAN03 vs AT03',
                        route: {
                            name: 'Usp_Val_Rep_Cuadre_BAN03_AT03',
                            query: {
                                report:  'Cuadre BAN03 vs AT03'
                            }
                        },
                    },
                    {
                        title: 'AT03 Revisión Cruzada Datos',
                        route: {
                            name: 'Usp_Val_Rep_AT03_Revision_Cruzada_Datos',
                            query: {
                                report:  'AT03 Revisión Cruzada Datos'
                            }
                        },
                    },
                    /*{
                        title: 'Préstamos Excluidos AT03',
                        route: {
                            name: 'USP_VAL_REP_PRESTAMOS_EXCKUIDOS',
                            query: {
                                report:  'Préstamos Excluidos AT03'
                            }
                        },
                    },*/
                    {
                        title: 'Cuadre AT12 vs BAN06 Tipo Garantía',
                        route: {
                            name: 'USP_VAL_REP_CUADRE_AT12_BA06_TIPOGARANTIAS',
                            query: {
                                report:  'Cuadre AT12 vs BAN06 Tipo Garantía'
                            }
                        },
                    },
                ]
            },
            {
                title: 'Indices',
                icon:'KeyIcon',
                children: [
                    {
                        title: 'Índice Liquidez Semanal',
                        route: {
                            name: 'USC_INIDICE_LIQUIDEZ_SEMANAL',
                            query: {
                                report:  'Índice Liquidez Semanal'
                            }
                        },
                    },
                ]
            },
            {
                title: 'Contable',
                icon:'KeyIcon',
                children: [

                    {
                        title: 'AT21 Revisión Utilidad',
                        route: {
                            name: 'USC_AT21_ONLY_2',
                            query: {
                                report:  'AT21 Revisión Utilidad'
                            }
                        },
                    },
                    {
                        title: 'AT21 Resumen Global',
                        route: {
                            name: 'USC_AT21_ONLY',
                            query: {
                                report:  'AT21 Resumen Global'
                            }
                        },
                    },

                ]
            },
            {
                title: 'Reporte Matemático',
                route: {
                    name: 'Rep_Matematico',
                    query: {
                        report:  'Reporte Matemático'
                    }
                },
            },
        ],
    },
]
