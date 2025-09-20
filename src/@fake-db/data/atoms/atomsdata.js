import mock from '@/@fake-db/mock'
/* eslint-disable global-require */
const data = {
    atomsFrequency: [
        {
            frequency: '000',
            title: 'Demo'
        }
    ],
    atomsStats: [
        {
            icon: 'ClockIcon',
            color: 'secondary',
            title: '15',
            subtitle: 'Pendientes',
            customClass: 'mb-2 mb-xl-0',
        },
        {
            icon: 'ActivityIcon',
            color: 'info',
            title: '8',
            subtitle: 'Procesando',
            customClass: 'mb-2 mb-xl-0',
        },
        {
            icon: 'AlertCircleIcon',
            color: 'danger',
            title: '2',
            subtitle: 'Errores',
            customClass: 'mb-2 mb-sm-0',
        },
    ],

    atomsStatus:[
        {
            id:0,
            title: 'Pendiente',
            color: 'light-primary'
        },
        {
            id:1,
            title: 'Error de Carga',
            color: 'light-primary'
        },
        {
            id:2,
            title: 'Cargado',
            color: 'light-primary'
        },
        {
            id:3,
            title: 'Validado',
            color: 'light-primary'
        },
        {
            id:4,
            title: 'Certificado',
            color: 'light-primary'
        },
        {
            id:5,
            title: 'Aprobado',
            color: 'light-primary'
        }
    ],


    atomsCatalog: [
        {
            ID_ATOMO: 2,
            ATOMO: "AT02",
            DESCRIPCION: "Átomo Depósitos",
            TABLA: "dbo.TH_ATOMO_DEPOSITOS",
            NOMBRE_ARCHIVO: "AT02.txt",
            FRECUENCIA: "000",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: 0,
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 3,
            ATOMO: "AT03",
            DESCRIPCION: "Átomo Crédito",
            TABLA: "dbo.TH_ATOMO_CREDITOS",
            NOMBRE_ARCHIVO: "AT03.txt",
            FRECUENCIA: "000",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: 0,
            VALIDADO: "",
            action: ""
        },

        {
            ID_ATOMO: 12,
            ATOMO: "AT12",
            DESCRIPCION: "Átomo Garantías",
            TABLA: "dbo.TH_ATOMO_GARANTIAS",
            NOMBRE_ARCHIVO: "AT12.txt",
            FRECUENCIA: "000",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: 0,
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 106,
            ATOMO: "BAN06",
            DESCRIPCION: "Ban Operaciones fuera de Balances",
            TABLA: "dbo.TH_BAN06",
            NOMBRE_ARCHIVO: "BA06.txt",
            FRECUENCIA: "000",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: 0,
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 2,
            ATOMO: "AT02",
            DESCRIPCION: "Átomo Depósitos",
            TABLA: "dbo.TH_ATOMO_DEPOSITOS",
            NOMBRE_ARCHIVO: "AT02.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 3,
            ATOMO: "AT03",
            DESCRIPCION: "Átomo Crédito",
            TABLA: "dbo.TH_ATOMO_CREDITOS",
            NOMBRE_ARCHIVO: "AT03.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 4,
            ATOMO: "AT04",
            DESCRIPCION: "Átomo de Bienes Adjudicados",
            TABLA: "dbo.TH_ATOMO_BIENES_ADJUDICADOS",
            NOMBRE_ARCHIVO: "AT04.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 5,
            ATOMO: "AT05",
            DESCRIPCION: "Átomo Generales del Banco",
            TABLA: "dbo.TH_ATOMO_GENERALES_BANCO",
            NOMBRE_ARCHIVO: "AT05.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 7,
            ATOMO: "AT07",
            DESCRIPCION: "Átomo Liquidez Mensual",
            TABLA: "dbo.TH_ATOMO_LIQUIDEZ",
            NOMBRE_ARCHIVO: "AT07.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 8,
            ATOMO: "AT08",
            DESCRIPCION: "Átomo de Efectivo",
            TABLA: "dbo.TH_ATOMO_EFECTIVO",
            NOMBRE_ARCHIVO: "AT08.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 9,
            ATOMO: "AT09",
            DESCRIPCION: "Átomo de Tasas",
            TABLA: "dbo.TH_ATOMO_TASAS",
            NOMBRE_ARCHIVO: "AT09.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 12,
            ATOMO: "AT12",
            DESCRIPCION: "Átomo Garantías",
            TABLA: "dbo.TH_ATOMO_GARANTIAS",
            NOMBRE_ARCHIVO: "AT12.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 14,
            ATOMO: "AT14",
            DESCRIPCION: "Átomo de Monedas",
            TABLA: "dbo.TH_ATOMO_MONEDAS",
            NOMBRE_ARCHIVO: "AT14.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 15,
            ATOMO: "AT15",
            DESCRIPCION: "Átomo Inversiones",
            TABLA: "dbo.TH_ATOMO_INVERSIONES",
            NOMBRE_ARCHIVO: "AT15.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 21,
            ATOMO: "AT21",
            DESCRIPCION: "Átomo Contable AT21",
            TABLA: "dbo.TH_ATOMO_CONTABLE_AT21",
            NOMBRE_ARCHIVO: "AT21.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 101,
            ATOMO: "BAN01",
            DESCRIPCION: "Ban Tipo de Establecimiento",
            TABLA: "dbo.TH_BAN01",
            NOMBRE_ARCHIVO: "BA01.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 104,
            ATOMO: "BAN04",
            DESCRIPCION: "Ban Tasa de Interes Activos y Pasivos",
            TABLA: "dbo.TH_BAN04",
            NOMBRE_ARCHIVO: "BA04_V.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 106,
            ATOMO: "BAN06",
            DESCRIPCION: "Ban Operaciones fuera de Balances",
            TABLA: "dbo.TH_BAN06",
            NOMBRE_ARCHIVO: "BA06.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 107,
            ATOMO: "BAN07",
            DESCRIPCION: "Ban Bienes Adquiridos",
            TABLA: "dbo.TH_BAN07",
            NOMBRE_ARCHIVO: "BA07.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 108,
            ATOMO: "BAN08",
            DESCRIPCION: "Ban Banca Electrónica",
            TABLA: "dbo.TH_BAN08",
            NOMBRE_ARCHIVO: "BA08.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 109,
            ATOMO: "BAN09",
            DESCRIPCION: "Ban Derivados",
            TABLA: "dbo.TH_BAN09",
            NOMBRE_ARCHIVO: "BA09.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 112,
            ATOMO: "BAN12",
            DESCRIPCION: "Ratio de Cobertura de Liquidez a Corto Plazo (LCR)",
            TABLA: "dbo.TH_BAN12",
            NOMBRE_ARCHIVO: "BA12.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 113,
            ATOMO: "BAN13",
            DESCRIPCION: "Fondos de Activos Líquidos de Alta Calidad FALAC",
            TABLA: "dbo.TH_BAN13",
            NOMBRE_ARCHIVO: "BA13.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 114,
            ATOMO: "BAN14",
            DESCRIPCION: "Entradas y Salidas de Flujos de Efectivo (ESFE)",
            TABLA: "dbo.TH_BAN14",
            NOMBRE_ARCHIVO: "BA14.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 121,
            ATOMO: "BAN21",
            DESCRIPCION: "Ban Consolidado de las Subsidiarias BA21",
            TABLA: "dbo.TH_BAN21",
            NOMBRE_ARCHIVO: "BA21.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 300,
            ATOMO: "TR01",
            DESCRIPCION: "Átomo Transferencias",
            TABLA: "dbo.TH_ATOMO_TRANSFERENCIA",
            NOMBRE_ARCHIVO: "TR01.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 1190,
            ATOMO: "BAN19",
            DESCRIPCION: "Tipo de Relaciones Financieras",
            TABLA: "dbo.TH_BAN19",
            NOMBRE_ARCHIVO: "BA19.txt",
            FRECUENCIA: "MENSUAL",
            PERIODO: "",
            REG_TOTALES: "",
            ERR_ESTRUCTURALES: "",
            ERR_FUNCIONALES: "",
            REG_CORRECTOS: "",
            STATUS: "",
            VALIDADO: "",
            action: ""
        },
        {
            ID_ATOMO: 10,
            ATOMO: "AT10",
            DESCRIPCION: "Átomo Liquidez Semanal",
            TABLA: "dbo.TH_ATOMO_LIQUIDEZ_SEMANAL",
            NOMBRE_ARCHIVO: "AT10.txt",
            FRECUENCIA: "SEMANAL"
        },
        {
            ID_ATOMO: 11,
            ATOMO: "AT11",
            DESCRIPCION: "Atomo de Efectivo Semanal",
            TABLA: "dbo.TH_ATOMO_EFECTIVO_SEMANAL",
            NOMBRE_ARCHIVO: "AT11.txt",
            FRECUENCIA: "SEMANAL"
        },
        {
            ID_ATOMO: 301,
            ATOMO: "EVAP",
            DESCRIPCION: "Liquidez Estructura de Activos y Pasivos",
            TABLA: "dbo.TH_ATOMO_LIQUIDEZ_EVAP",
            NOMBRE_ARCHIVO: "EVAP.txt",
            FRECUENCIA: "SEMANAL"
        },
        {
            ID_ATOMO: 13,
            ATOMO: "AT13",
            DESCRIPCION: "Átomo Financiero Tenedoras",
            TABLA: "dbo.TH_ATOMO_FINANCIERO",
            NOMBRE_ARCHIVO: "AT13.txt",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 103,
            ATOMO: "BAN03",
            DESCRIPCION: "Ban Grupos Economicos",
            TABLA: "dbo.TH_BAN03",
            NOMBRE_ARCHIVO: "BA03.txt",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 105,
            ATOMO: "BAN05",
            DESCRIPCION: "Ban Adecuación de Capital",
            TABLA: "dbo.TH_BAN05",
            NOMBRE_ARCHIVO: "BA05.txt",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 110,
            ATOMO: "BAN10",
            DESCRIPCION: "Ban Provisión Dinámica",
            TABLA: "dbo.TH_BAN10",
            NOMBRE_ARCHIVO: "BA10.txt",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 111,
            ATOMO: "BAN11",
            DESCRIPCION: "Cuentas Inactivas",
            TABLA: "dbo.TH_BAN11",
            NOMBRE_ARCHIVO: "BA11.txt",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 901,
            ATOMO: "SBCAPA",
            DESCRIPCION: "SBCAP - A",
            TABLA: "dbo.SBCAP_A",
            NOMBRE_ARCHIVO: "SBCAP_A.XLS",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 902,
            ATOMO: "SBCAPB",
            DESCRIPCION: "SBCAP - B",
            TABLA: "dbo.SBCAP_B",
            NOMBRE_ARCHIVO: "SBCAP_B.XLS",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 903,
            ATOMO: "SBCAPC",
            DESCRIPCION: "SBCAP - C",
            TABLA: "dbo.SBCAP_C",
            NOMBRE_ARCHIVO: "SBCAP_C.XLS",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 904,
            ATOMO: "SBCAPD",
            DESCRIPCION: "SBCAP - D",
            TABLA: "dbo.SBCAP_D",
            NOMBRE_ARCHIVO: "SBCAP_D.XLS",
            FRECUENCIA: "TRIMESTRAL"
        },
        {
            ID_ATOMO: 905,
            ATOMO: "SBCAPE",
            DESCRIPCION: "SBCAP - E",
            TABLA: "dbo.SBCAP_E",
            NOMBRE_ARCHIVO: "SBCAP_E.XLS",
            FRECUENCIA: "TRIMESTRAL"
        }
    ],

    available: [
        {
            id: 10,
            atom: 'AT10',
            description: 'Liquidez Semanal',
        },
        {
            id: 11,
            atom: 'AT11',
            description: 'Efectivo Semanal',
        },
        {
            id: 301,
            atom: 'EVAP',
            description: 'Estructura de Vencimientos',
        },
        {
            id: 301,
            atom: 'EVAP',
            description: 'Liquidez Bisemanal',
        },
    ],

    general: [
        {
            id: 1,
            errorQuantity: '3',
            errorCode: '168',
            descriptionCode: "DEPÓSITO A PLAZO CON TASA CERO O MENOR QUE CERO",
            date: '09/23/2021',
            type: 'FUNCIONAL',
        },
        {
            id: 2,
            errorQuantity: '1',
            errorCode: '63',
            descriptionCode: "FECHA DE VENCIMIENTO PARA DEPOSITOS A PLAZO DEBE SER MAYOR A LA FECHA DEL ATOMO",
            date: '09/23/2021',
            type: 'FUNCIONAL',
        },
        {
            id: 3,
            errorQuantity: '4',
            errorCode: '362',
            descriptionCode: "DEPÓSITO A PLAZO CON TASA CERO O MENOR QUE CERO",
            date: '09/23/2016',
            type: 'ESTRUCTURAL',
        },
    ],

    drillDown1: [
        {
            id: 1,
            registry: '3659',
            depositAmount: '$100,000.00',
            pignoredAmount: "$28,6565.00",
        },
    ],

    drillDownDetails: [
        {
            campo: 'ID_RECORD', valor: '422928',
        },
        {
            campo: 'FECHA SIB', valor: '20200831',
        },
        {
            campo: 'COD_BANCO', valor: '002',
        },
        {
            campo: 'COD_SUBSIDIARIA', valor: 'NA',
        },
        {
            campo: 'TIPO_DEPOSITO_SB05', valor: '20 - A Plazo',
        },
        {
            campo: 'TIPO_CLIENTE_SB20', valor: '01 - Persona Natural',
        },
        {
            campo: 'TASA', valor: '0.0000',
        },
        {
            campo: 'ORIGEN', valor: 'L',
        },
        {
            campo: 'COD_REGION', valor: '08 - NA',
        },
        {
            campo: 'FECHA_INICIO', valor: '20130200',
        },
        {
            campo: 'FECHA_VENCIMIENTO', valor: '20240222',
        },
        {
            campo: 'MONTO', valor: '100000.00',
        },
        {
            campo: 'MONTO_PIGNORADO', valor: '28668.00',
        },
        {
            campo: 'NUMERO_RENOVACIÓN', valor: '2',
        },
        {
            campo: 'FECHA_RENOVACION', valor: '20190223',
        },
        {
            campo: 'INTERESES_POR_PAGAR', valor: '0.00',
        },
        {
            campo: 'PERIODIOCIDAD_SB26', valor: '11 - mas de 10 años',
        },
    ],

    products: [
        {
            name: 'Atomos',
            icon: 'atoms.svg',
            active: true,
        },
        {
            name: 'Validator',
            icon: 'validator.svg',
            active: true,
        },
        {
            name: 'Dashboard',
            icon: 'dashboard.svg',
            active: true,
        },
        {
            name: 'APC',
            icon: 'apc.svg',
            active: true,
        },
        {
            name: 'SBCAP',
            icon: 'sbcap.svg',
            active: true,
        },
    ]

}
/* eslint-disable global-require */
mock.onGet('/atoms/data').reply(() => [200, data])
mock.onGet('/atoms/atomsStatus').reply(() => [200, data.atomsStatus])
mock.onGet('/atoms/atomsFrequency').reply(() => [200, data.atomsFrequency])
mock.onGet('/atoms/atomsCatalog').reply(() => [200, data.atomsCatalog])
mock.onGet('/atoms/available').reply(() => [200, data.available])
mock.onGet('/atoms/general').reply(() => [200, data.general])
mock.onGet('/atoms/drillDown1').reply(() => [200, data.drillDown1])
mock.onGet('/atoms/drillDownDetails').reply(() => [200, data.drillDownDetails])
mock.onGet('/atoms/products').reply(() => [200, data.products])
