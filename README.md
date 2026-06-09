# YPF El Puente — Río Colorado, Patagonia

Menú digital, combustibles y boxes para la estación de servicio YPF El Puente en Río Colorado, Río Negro.

Desarrollado por **AXPE Soluciones Digitales**.

---

## Stack Tecnológico

| Tecnología     | Uso                              |
| -------------- | -------------------------------- |
| Next.js 16     | Framework React (App Router)     |
| TypeScript     | Tipado estricto                  |
| Tailwind CSS 4 | Estilos y sistema de diseño      |
| Supabase       | Base de datos, Auth y Storage    |
| Framer Motion  | Animaciones y transiciones       |
| Zustand        | Estado del carrito               |
| Sonner         | Notificaciones toast             |

---

## Cómo correr en local

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd ypf-el-puente

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Completar con las credenciales de Supabase

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Variables de Entorno

| Variable                          | Descripción                     |
| --------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | URL del proyecto Supabase       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Anon key (pública)              |
| `SUPABASE_SERVICE_ROLE_KEY`       | Service role key (solo server)  |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`     | Número de WhatsApp de contacto  |
| `NEXT_PUBLIC_SITE_NAME`           | Nombre visible del sitio        |

---

## Guía para el Administrador

### Acceder al Panel Admin

1. Ir a `/login`
2. Ingresar con las credenciales creadas desde el Dashboard de Supabase
3. El panel se encuentra en `/admin`

### Actualizar Precios (Excel)

1. Ir a **Admin → Actualizar Precios** (`/admin/precios`)
2. Arrastrar o seleccionar el archivo Excel (.xlsx) enviado por YPF Central
3. Revisar la vista previa con los primeros 10 registros
4. Confirmar la actualización masiva
5. Los precios se actualizan inmediatamente en la web

**Estructura esperada del Excel:**
El parser detecta automáticamente las columnas. Necesita al menos:
- Una columna con el **Código PLU** (texto o número)
- Una columna con el **Precio** (número)

### Gestionar Productos

En **Admin → Productos** (`/admin/productos`):
- **Activar/desactivar** productos con el toggle
- **Asignar etiquetas** (NUEVA, PROMO, RECOMENDADO)
- **Cambiar la imagen** (solo PNG con fondo transparente)

### Actualizar Combustibles

En **Admin → Combustibles** (`/admin/combustibles`):
- Editar el precio manualmente (no viene del Excel)
- Activar/desactivar combustibles

### Cambiar número de WhatsApp

En **Admin → Configuración** (`/admin/configuracion`):
- Editar el número de WhatsApp (formato: +54...)
- Personalizar el mensaje que se genera al hacer checkout
- Vista previa en tiempo real del mensaje

### Crear un nuevo usuario Admin

1. Ir al Dashboard de Supabase → Authentication → Users
2. Click en "Add user" → "Create new user"
3. Ingresar email y contraseña
4. El nuevo usuario podrá acceder al panel con esas credenciales

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/          # Páginas públicas
│   │   ├── page.tsx       # Landing page (/)
│   │   ├── full/          # Menú FULL (/full)
│   │   ├── combustibles/  # Precios de combustibles
│   │   └── boxes/         # Servicio de boxes
│   ├── (admin)/           # Panel de administración
│   │   ├── login/         # Login
│   │   └── admin/         # Dashboard, productos, precios, etc.
│   └── api/
│       └── upload-excel/  # API para procesar Excel
├── components/
│   ├── public/            # Componentes del sitio público
│   ├── admin/             # Componentes del panel admin
│   └── ui/                # Componentes base (shadcn/ui)
├── lib/
│   ├── supabase/          # Clientes y queries de Supabase
│   ├── excel/             # Parser de archivos Excel
│   └── whatsapp/          # Generador de mensajes WhatsApp
├── stores/                # Zustand stores (carrito)
└── types/                 # TypeScript types
```

---

## Deploy en Vercel

1. Conectar el repositorio a Vercel
2. En **Settings → Environment Variables**, agregar todas las variables de `.env.local`
3. Aplicar a: Production, Preview y Development
4. Deploy automático en cada push a `main`

### Configurar Supabase para producción

1. **Dashboard → Auth → URL Configuration:**
   - Site URL: `https://TU-DOMINIO.com`
   - Redirect URLs: `https://TU-DOMINIO.com/**`
2. Verificar que **RLS** está habilitado en todas las tablas
3. Test: intentar un INSERT con la anon key → debe fallar

---

## Checklist de Entrega

- [ ] Precios se leen de Supabase (no hardcodeados)
- [ ] Subir Excel actualiza precios correctamente
- [ ] Carrito funciona en mobile y desktop
- [ ] WhatsApp checkout abre con el mensaje correcto
- [ ] Login del admin funciona
- [ ] Rutas /admin/* redirigen al login sin sesión
- [ ] RLS verificado
- [ ] Imágenes PNG subidas al Storage
- [ ] Variables de entorno en Vercel
- [ ] .env.local en .gitignore

---

*AXPE Soluciones Digitales — Río Colorado, Patagonia, Argentina*
