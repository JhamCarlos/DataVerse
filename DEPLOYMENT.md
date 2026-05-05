# 📦 Guía de Despliegue

## Opciones de Despliegue

### 1️⃣ Vercel (Recomendado para desarrollo)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 2️⃣ Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### 3️⃣ GitHub Pages

1. Configura en `vite.config.js`:
```javascript
export default {
  base: '/dv_entals/',
  // ... resto de config
}
```

2. Ejecuta:
```bash
npm run build
```

3. Sube carpeta `dist/` a GitHub

### 4️⃣ Servidor propio (Apache/Nginx)

```bash
# Compilar
npm run build

# Copiar contenido de 'dist/' a servidor web
# Configurar .htaccess (Apache) para SPA:
```

**.htaccess** (para Apache):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**nginx.conf** (para Nginx):
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 5️⃣ Docker

Crea `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy:
```bash
docker build -t dv-rentals .
docker run -p 80:80 dv-rentals
```

---

## Variables de Entorno

Crea archivo `.env` en la raíz:

```env
VITE_API_URL=https://api.ejemplo.com
VITE_APP_TITLE=Dataverse Rentals
VITE_APP_VERSION=1.0.0
```

Úsalas en el código:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Checklist Pre-Despliegue

- [ ] `npm run build` sin errores
- [ ] Sin advertencias en consola
- [ ] Todas las rutas funcionan
- [ ] Datos correctos en producción
- [ ] Formularios validan correctamente
- [ ] Responsive en móviles
- [ ] SEO meta tags configurados
- [ ] Performance optimizado

---

## Optimizaciones de Producción

```bash
# Analizar bundle
npm install -D rollup-plugin-visualizer
```

En `vite.config.js`:
```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [
    visualizer()
  ]
}
```

---

## Monitoreo

Integra servicios de monitoreo:
- Sentry (error tracking)
- Google Analytics
- LogRocket
- DataDog

---

**Última actualización**: 26 de abril de 2026
