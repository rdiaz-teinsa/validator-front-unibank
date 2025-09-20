

export  default [

    // Errors
    {
        path: '/error-404',
        name: 'error-404',
        component: () => import('@/views/atoms/Error404.vue'),
        meta: {
            layout: 'full',
            resource: 'Auth',
            action: 'read',
        },
    },
    {
        path: '/pages/miscellaneous/not-authorized',
        name: 'misc-not-authorized',
        component: () => import('@/views/pages/miscellaneous/NotAuthorized.vue'),
        meta: {
            layout: 'full',
            resource: 'Auth',
        },
    },
    {
        path: '/pages/miscellaneous/error',
        name: 'misc-error',
        component: () => import('@/views/pages/miscellaneous/Error.vue'),
        meta: {
            layout: 'full',
        },
    },


    // Auth
    {
        path: '/login',
        name: 'atoms-auth-login',
        component: () => import('@/views/atoms/Login-v1'),
        meta: {
            layout: 'full',
            resource: 'Auth',
            redirectIfLoggedIn: true,
        },
    },

    // Dashboard
    {
        path: '/atoms/dashboard',
        name: 'atom-dashboard',
        component: () => import('@/views/atoms/dashboard/Dashboard.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },

    // Atom General
    {
        path: '/atoms/atom-results',
        name: 'atom-results',
        component: () => import('@/views/atoms/AtomResults.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/atom-available/:group',
        name: 'atom-available',
        props: true,
        component: () => import('@/views/atoms/AtomAvailable.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/atom-periods/:group',
        name: 'atom-periods',
        props: true,
        component: () => import('@/views/atoms/AtomPeriods.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/atom-periods-processes',
        name: 'atom-periods-processes',
        component: () => import('@/views/atoms/AtomPeriodProcesses.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/atom-drill-down',
        name: 'atom-drill-down',
        component: () => import('@/views/atoms/AtomDrillDown1.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/atom-drill-details',
        name: 'atom-drill-down-details',
        component: () => import('@/views/atoms/AtomDrillDown2.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/atom-load',
        name: 'atom-load',
        component: () => import('@/views/atoms/AtomLoad.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },

    // Atom Reports
    {
        path: '/atoms/reports/Usp_Rep_AT03_Comparacion',
        name: 'Usp_Rep_AT03_Comparacion',
        component: () => import('@/views/atoms/reports/Usp_Rep_AT03_Comparacion'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Rep_AT03_Comparacion_Actividad',
        name: 'Usp_Rep_AT03_Comparacion_Actividad',
        component: () => import('@/views/atoms/reports/Usp_Rep_AT03_Comparacion_Actividad.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Rep_AT03_Comparacion_Region',
        name: 'Usp_Rep_AT03_Comparacion_Region',
        component: () => import('@/views/atoms/reports/Usp_Rep_AT03_Comparacion_Region'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Rep_AT12_Comparacion',
        name: 'Usp_Rep_AT12_Comparacion',
        component: () => import('@/views/atoms/reports/Usp_Rep_AT12_Comparacion'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Rep_AT15_Comparacion',
        name: 'Usp_Rep_AT15_Comparacion',
        component: () => import('@/views/atoms/reports/Usp_Rep_AT15_Comparacion'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usc_AT02_AT07',
        name: 'Usc_AT02_AT07',
        component: () => import('@/views/atoms/reports/Usc_AT02_AT07'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usc_BAN06_AT03_R1',
        name: 'Usc_BAN06_AT03_R1',
        component: () => import('@/views/atoms/reports/Usc_BAN06_AT03_R1'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usc_BAN10_AT03_R1',
        name: 'Usc_BAN10_AT03_R1',
        component: () => import('@/views/atoms/reports/Usc_BAN10_AT03_R1'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usc_BAN01_AT05_R1',
        name: 'Usc_BAN01_AT05_R1',
        component: () => import('@/views/atoms/reports/Usc_BAN01_AT05_R1'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_BAN10_AT03_R2',
        name: 'USC_BAN10_AT03_R2',
        component: () => import('@/views/atoms/reports/USC_BAN10_AT03_R2'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_BAN10_ONLY',
        name: 'USC_BAN10_ONLY',
        component: () => import('@/views/atoms/reports/USC_BAN10_ONLY'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_INIDICE_LIQUIDEZ_SEMANAL',
        name: 'USC_INIDICE_LIQUIDEZ_SEMANAL',
        component: () => import('@/views/atoms/reports/USC_INIDICE_LIQUIDEZ_SEMANAL'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT15_AT07_R1',
        name: 'USC_AT15_AT07_R1',
        component: () => import('@/views/atoms/reports/USC_AT15_AT07_R1'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT09_ALL',
        name: 'USC_AT09_ALL',
        component: () => import('@/views/atoms/reports/USC_AT09_ALL'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Rep_AT21_Comparacion',
        name: 'Usp_Rep_AT21_Comparacion',
        component: () => import('@/views/atoms/reports/Usp_Rep_AT21_Comparacion'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT02_AT21_x_REGION',
        name: 'USC_AT02_AT21_x_REGION',
        component: () => import('@/views/atoms/reports/USC_AT02_AT21_x_REGION'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT03_AT21_X_REGION',
        name: 'USC_AT03_AT21_X_REGION',
        component: () => import('@/views/atoms/reports/USC_AT03_AT21_X_REGION'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT04_AT21',
        name: 'USC_AT04_AT21',
        component: () => import('@/views/atoms/reports/USC_AT04_AT21'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT05_AT21',
        name: 'USC_AT05_AT21',
        component: () => import('@/views/atoms/reports/USC_AT05_AT21'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT12_AT21',
        name: 'USC_AT12_AT21',
        component: () => import('@/views/atoms/reports/USC_AT12_AT21'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT15_AT21_x_REGION',
        name: 'USC_AT15_AT21_x_REGION',
        component: () => import('@/views/atoms/reports/USC_AT15_AT21_x_REGION'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Rep_Cuadre_AT21_At12_At03VSAT02',
        name: 'Usp_Rep_Cuadre_AT21_At12_At03VSAT02',
        component: () => import('@/views/atoms/reports/Usp_Rep_Cuadre_AT21_At12_At03VSAT02'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT21_ONLY',
        name: 'USC_AT21_ONLY',
        component: () => import('@/views/atoms/reports/USC_AT21_ONLY'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT21_ONLY_2',
        name: 'USC_AT21_ONLY_2',
        component: () => import('@/views/atoms/reports/USC_AT21_ONLY_2'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_AT07_AT21_x_Region',
        name: 'USC_AT07_AT21_x_Region',
        component: () => import('@/views/atoms/reports/USC_AT07_AT21_x_Region'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USC_BAN09_AT21',
        name: 'USC_BAN09_AT21',
        component: () => import('@/views/atoms/reports/USC_BAN09_AT21'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_Cuadre_AT12_Mto_Garantia_Valor_Ponderado',
        name: 'Usp_Val_Rep_Cuadre_AT12_Mto_Garantia_Valor_Ponderado',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_Cuadre_AT12_Mto_Garantia_Valor_Ponderado'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_Cuadre_AT10_EVAP',
        name: 'Usp_Val_Rep_Cuadre_AT10_EVAP',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_Cuadre_AT10_EVAP'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_Cuadre_BAN06_AT03_Globales',
        name: 'Usp_Val_Rep_Cuadre_BAN06_AT03_Globales',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_Cuadre_BAN06_AT03_Globales'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_Cuadre_BAN06_AT03_Clasif_Diferentes',
        name: 'Usp_Val_Rep_Cuadre_BAN06_AT03_Clasif_Diferentes',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_Cuadre_BAN06_AT03_Clasif_Diferentes'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_BAN03_AT03_Tipo_Relacion',
        name: 'Usp_Val_Rep_BAN03_AT03_Tipo_Relacion',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_BAN03_AT03_Tipo_Relacion'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_Cuadre_BAN01_AT08',
        name: 'Usp_Val_Rep_Cuadre_BAN01_AT08',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_Cuadre_BAN01_AT08'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_Cuadre_AT12_AT02',
        name: 'Usp_Val_Rep_Cuadre_AT12_AT02',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_Cuadre_AT12_AT02'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_Cuadre_AT12_AT03',
        name: 'Usp_Val_Rep_Cuadre_AT12_AT03',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_Cuadre_AT12_AT03'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_Cuadre_BAN03_AT03',
        name: 'Usp_Val_Rep_Cuadre_BAN03_AT03',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_Cuadre_BAN03_AT03'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Val_Rep_AT03_Revision_Cruzada_Datos',
        name: 'Usp_Val_Rep_AT03_Revision_Cruzada_Datos',
        component: () => import('@/views/atoms/reports/Usp_Val_Rep_AT03_Revision_Cruzada_Datos'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USP_VAL_REP_PRESTAMOS_EXCKUIDOS',
        name: 'USP_VAL_REP_PRESTAMOS_EXCKUIDOS',
        component: () => import('@/views/atoms/reports/USP_VAL_REP_PRESTAMOS_EXCKUIDOS'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USP_VAL_REP_CUADRE_AT12_BA06_TIPOGARANTIAS',
        name: 'USP_VAL_REP_CUADRE_AT12_BA06_TIPOGARANTIAS',
        component: () => import('@/views/atoms/reports/USP_VAL_REP_CUADRE_AT12_BA06_TIPOGARANTIAS'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USP_VAL_REP_COMPARACION_BAN06_CINU',
        name: 'USP_VAL_REP_COMPARACION_BAN06_CINU',
        component: () => import('@/views/atoms/reports/USP_VAL_REP_COMPARACION_BAN06_CINU'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/USP_VAL_REP_COMPARA_CINU_BAN06_AT03',
        name: 'USP_VAL_REP_COMPARA_CINU_BAN06_AT03',
        component: () => import('@/views/atoms/reports/USP_VAL_REP_COMPARA_CINU_BAN06_AT03'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/Usp_Rep_Comparacion',
        name: 'Usp_Rep_Comparacion',
        component: () => import('@/views/atoms/reports/Usp_Rep_Comparacion.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/rep_matematico',
        name: 'Rep_Matematico',
        component: () => import('@/views/atoms/reports/Rep_Matematico.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
    {
        path: '/atoms/reports/rep_matematico_details/:rule',
        name: 'Rep_Matematico_Details',
        props: true,
        component: () => import('@/views/atoms/reports/Rep_Matematico_Details.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
]
