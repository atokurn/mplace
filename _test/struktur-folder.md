src/
├── app/                         # Folder routing berbasis file (Next.js App Router)
│   ├── (admin)/                # Route group khusus halaman admin
│   │   ├── layout.tsx         # Layout global admin (sidebar, navbar, dll)
│   │   ├── dashboard/         # /admin/dashboard
│   │   │   └── page.tsx
│   │   ├── products/          # /admin/products
│   │   │   ├── page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/            # /admin/orders
│   │   │   └── page.tsx
│   │   ├── categories/        # /admin/categories
│   │   │   └── page.tsx
│   │   ├── users/             # /admin/users
│   │   │   └── page.tsx
│   │   ├── analytics/         # /admin/analytics
│   │   │   └── page.tsx
│   │   └── settings/          # /admin/settings
│   │       └── page.tsx
│   └── layout.tsx             # Layout global (public)
│   └── page.tsx               # Landing page (public)
│
├── _components/                # Semua komponen modular
│   ├── features/               # Komponen khusus per fitur
│   │   └── admin/              # Fitur khusus halaman admin
│   │       ├── dashboard/
│   │       │   └── DashboardOverview.tsx
│   │       ├── products/
│   │       │   ├── ProductTable.tsx
│   │       │   ├── ProductForm.tsx
│   │       │   └── ProductToolbar.tsx
│   │       ├── orders/
│   │       │   └── OrderTable.tsx
│   │       ├── categories/
│   │       │   └── CategoryTable.tsx
│   │       ├── users/
│   │       │   └── UserTable.tsx
│   │       ├── analytics/
│   │       │   └── AnalyticsChart.tsx
│   │       └── settings/
│   │           └── SettingsForm.tsx
│
│   ├── shared/                 # Komponen shared lintas fitur
│   │   ├── layouts/            # Layout untuk sidebar, navbar, dsb
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AdminTopbar.tsx
│   │   ├── modals/             # Modal umum seperti confirm
│   │   │   └── ConfirmDeleteModal.tsx
│   │   └── navigation/         # Breadcrumb, menu, dll
│   │       └── Breadcrumbs.tsx
│
│   ├── ui/                     # Komponen UI generik (bisa dipakai di semua fitur)
│   │   ├── buttons/
│   │   ├── forms/
│   │   ├── sheets/
│   │   └── tables/
│
│   └── data-table/             # Modul data table reusable
│       ├── DataTable.tsx
│       ├── DataTableToolbar.tsx
│       ├── DataTablePagination.tsx
│       ├── DataTableFacetedFilter.tsx
│       ├── DataTableSkeleton.tsx
│       └── ...
│
├── _lib/                       # Logic dan utilitas non-komponen
│   ├── actions/                # Handler aksi server (create, update, delete)
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── categories.ts
│   │   ├── users.ts
│   │   ├── analytics.ts
│   │   └── settings.ts
│   ├── queries/                # Data fetching
│   ├── seeds/                  # Data awal
│   ├── utils/                  # Fungsi utilitas umum
│   └── validations/            # Validasi (zod, yup, dll)
│
├── components/                 # Legacy atau shared antar sistem
│   ├── layout/
│   ├── ui/
│   └── shell.tsx
│
├── config/                     # Konfigurasi proyek
│   ├── site.ts
│   ├── flag.ts
│   └── data-table.ts
│
├── db/                         # Integrasi database (schema, migration, seed)
│   ├── index.ts
│   ├── migrate.ts
│   ├── schema.ts
│   └── utils.ts
│
├── hooks/                      # Custom hooks
│   ├── use-data-table.ts
│   ├── use-media-query.ts
│   └── ...
│
├── styles/                     # Styling global (CSS, Tailwind, dsb)
├── types/                      # Deklarasi TypeScript (interface, enum, dll)
└── env.js                      # Environment loader
