# Mis Finanzas

App personal para llevar gastos, ingresos e inversiones (CEDEARs, acciones,
cripto, bonos) en pesos y dólares, pensada para usarse desde el celular.

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS 4
- **Base de datos**: Postgres (Neon), agregada directamente desde Vercel
- **Login**: Auth.js (email + contraseña), cuentas separadas y privadas
- **Cotizaciones en vivo**: dólar (dolarapi.com), acciones/CEDEARs (Yahoo
  Finance), cripto (CoinGecko) — todas APIs públicas y gratuitas
- **Hosting**: Vercel (plan gratuito)

Todo el setup de abajo se puede hacer con el navegador del celular; no hace
falta instalar nada ni usar la terminal, salvo el primer `git push` si
elegís subir el código vos mismo en lugar de pedirle a alguien que lo haga.

---

## 1. Subir el código a GitHub

1. Entrá a [github.com](https://github.com) → **New repository** → dale un
   nombre (ej. `mis-finanzas`) → **Create repository** (dejalo vacío, sin
   README).
2. Subí el contenido de esta carpeta a ese repositorio. Si tenés una
   computadora a mano, la forma más simple es:
   ```bash
   git init
   git add .
   git commit -m "Primer commit"
   git remote add origin https://github.com/TU-USUARIO/mis-finanzas.git
   git push -u origin main
   ```

## 2. Importar el proyecto en Vercel

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión **con GitHub**
   (funciona igual desde el navegador del celular).
2. **Add New → Project** → elegí el repo `mis-finanzas` → **Import**.
3. Todavía no toques "Deploy" — primero seguí el paso 3 para tener la base
   de datos y las variables listas (si ya lo desplegaste, no pasa nada,
   simplemente redeployá al final).

## 3. Agregar la base de datos (Neon, sin salir de Vercel)

1. Dentro del proyecto en Vercel, andá a la pestaña **Storage**.
2. **Create Database** → elegí **Neon** (Postgres) → seguí los pasos
   (nombre, región — la que esté más cerca, ej. `sa-east-1` si aparece).
3. Cuando termine, **Connect** el proyecto a esta base (Vercel te lo va a
   ofrecer automáticamente). Esto agrega solo la variable `DATABASE_URL`
   a tu proyecto.
4. Andá a **Storage → tu base → Query** (o el botón "Open in Neon" →
   **SQL Editor**) y pegá todo el contenido de [`db/schema.sql`](./db/schema.sql)
   → **Run**. Esto crea las tablas `users`, `transacciones` e `inversiones`.

## 4. Variable de autenticación

1. En el proyecto de Vercel: **Settings → Environment Variables**.
2. Agregá una variable `AUTH_SECRET` con cualquier texto largo y aleatorio
   (podés usar el que viene en `.env.local.example`, o generar el tuyo con
   cualquier generador de contraseñas — cuanto más largo, mejor).
3. Guardá.

## 5. Desplegar

1. Volvé a **Deployments** → si quedó pendiente el primer deploy, dale
   **Redeploy** (para que tome las variables de entorno recién creadas).
   Si es la primera vez, simplemente **Deploy**.
2. En 1-2 minutos vas a tener tu URL: `mis-finanzas.vercel.app`.

## 6. Crear tu cuenta

1. Abrí `tuapp.vercel.app/setup` — esta pantalla solo funciona la primera
   vez (antes de que exista alguna cuenta).
2. Cargá tu email y una contraseña → **Crear cuenta**.
3. Iniciá sesión normalmente en `/login`.

Para agregar una segunda cuenta (por ejemplo, para tu pareja) **no hace
falta volver a `/setup`**: una vez logueado, andá a la pestaña **Cuenta**
dentro de la app y creála ahí. Cada cuenta ve únicamente sus propios
movimientos e inversiones — el aislamiento está garantizado porque **cada
consulta a la base de datos filtra por el usuario de la sesión activa**
(ver `lib/actions/*.ts`), nunca por algo que decida el navegador.

## 7. Agregarla al celular

Abrí la URL en Chrome o Safari del celular → menú → **"Agregar a pantalla
de inicio"**. Queda como un ícono más, a pantalla completa.

---

## Variables de entorno (resumen)

| Variable | De dónde sale | Dónde configurarla |
|---|---|---|
| `DATABASE_URL` | La agrega sola la integración de Neon | Automático al conectar la base (paso 3) |
| `AUTH_SECRET` | La generás vos (cualquier texto largo) | Vercel → Settings → Environment Variables |

Para probar en tu computadora antes de subir a Vercel (opcional):

```bash
cp .env.local.example .env.local
# completá DATABASE_URL con el valor de Vercel → Storage → tu base → .env.local
npm install
npm run dev
```

## Cómo funciona la valuación de inversiones

- **CEDEARs**: se consulta el ticker con sufijo `.BA` en Yahoo Finance
  (ej. `AAPL.BA`), que ya devuelve el precio real de mercado en pesos
  (BYMA), sin necesidad de calcular ratios a mano.
- **Acciones de EE.UU.**: se consulta el ticker tal cual (ej. `AAPL`),
  devuelve el precio en dólares, y se convierte a pesos usando el dólar
  contado con liqui (CCL) del momento.
- **Cripto**: precio en USD vía CoinGecko (necesitás el "id" de CoinGecko,
  ej. `bitcoin`, `ethereum` — se puede buscar en coingecko.com), convertido
  a pesos con el CCL.
- **Bonos y "otro"**: no tienen fuente gratuita de precio en vivo
  integrada; se muestra el valor de compra.

Estas fuentes son gratuitas y sin necesidad de API key, pero son datos
públicos no oficiales — para uso personal andan perfecto; si en algún
momento necesitás el precio exacto y garantizado de BYMA, herramientas
como IOL o Rava tienen API propia (requieren cuenta).

## Seguridad de las cuentas

- Las contraseñas nunca se guardan en texto plano: se guardan con
  `bcrypt` (hash + salt) en la tabla `users`.
- Las sesiones son cookies firmadas (JWT) que administra Auth.js.
- No existe un formulario de registro público — la única forma de crear
  una cuenta nueva es `/setup` (solo antes de que exista la primera) o
  desde adentro de la app, ya logueado, en la pestaña Cuenta.

## Estructura del proyecto

```
app/
  login/              → pantalla de login
  setup/               → creación de la primera cuenta (bootstrap)
  (protected)/         → rutas que requieren sesión iniciada
    page.tsx             → resumen / dashboard
    movimientos/         → ingresos y gastos
    inversiones/         → cartera de inversiones
    cuenta/              → sesión activa, cerrar sesión, agregar cuenta
  api/auth/            → route handler de Auth.js
lib/
  db.ts                 → cliente de Postgres (Neon)
  actions/              → Server Actions (leer/crear/borrar, todo filtrado
                          por el usuario de la sesión)
  prices.ts             → funciones para cotizaciones en vivo
  valuacion.ts          → cálculo de valor actual / ganancia de inversiones
  types.ts              → tipos compartidos
components/            → UI reutilizable
db/schema.sql           → esquema completo de la base de datos
auth.ts                 → configuración central de Auth.js
proxy.ts                → protección de rutas (redirige a /login si no hay sesión)
```

## Próximos pasos posibles

- Editar/actualizar movimientos e inversiones (hoy se pueden crear y
  borrar, no editar).
- Exportar a CSV.
- Gráfico de evolución mensual del balance.
- Notificación o resumen automático semanal.
