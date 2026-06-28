# Estampados Patrón

Tienda web en Next.js para Estampados Patrón.

## Conectar el dominio

El proyecto incluye `public/CNAME` con el dominio `estampadospatron.com` para que GitHub Pages publique el sitio con dominio personalizado.

### Variables de build para GitHub Pages con dominio propio

Usa estas variables cuando generes el sitio estático:

```bash
NEXT_PUBLIC_GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://estampadospatron.com npm run build
```

Con `NEXT_PUBLIC_SITE_URL` definido, `next.config.js` omite el `basePath` `/estampadospatron`, por lo que los assets se sirven desde la raíz del dominio personalizado.

### DNS recomendado

En el proveedor del dominio, configura:

- Un registro `CNAME` para `www` apuntando al host de GitHub Pages del repositorio.
- Registros `A` para el dominio raíz (`estampadospatron.com`) apuntando a las IPs actuales de GitHub Pages.

Después, en GitHub Pages selecciona `estampadospatron.com` como custom domain y activa HTTPS cuando esté disponible.

## Scripts

- `npm run dev`: servidor local de desarrollo.
- `npm run build`: build de Next.js.
- `npm run build:github-pages`: export estático para GitHub Pages.
