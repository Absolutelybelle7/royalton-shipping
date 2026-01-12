# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Configuring a custom admin path

You can make the admin dashboard accessible via a custom path by setting the Vite environment variable `VITE_ADMIN_PATH` (default: `/admin`). For example, add the following to your `.env` file:

```
VITE_ADMIN_PATH=/super-secret-admin
```

The app will use the configured path for the admin route and header links. If not set, it falls back to `/admin`.

---

## Supabase: Admin role setup & migration

I added a migration to create an `admins` table, `admin_logs` audit table, a `public.is_admin()` helper function, and admin RLS policies. File: `supabase/migrations/20260105120000_create_admins_and_admin_logs.sql`.

Quick setup steps:

1. Run the migration using the Supabase CLI or Dashboard SQL editor. Example (CLI):

   supabase db push

2. Create an initial admin (must be done with the service role or in the SQL editor):

   ```sql
   INSERT INTO public.admins (user_id, role, created_by)
   VALUES ('<USER_UUID>', 'admin', '<YOUR_SERVICE_OR_YOUR_USER_UUID>');
   ```

   To find a user's UUID: `SELECT id, email FROM auth.users WHERE email = '<email@example.com>';`

3. After the insertion, authenticated users that are admins will be able to manage resources (shipments, quotes, locations, etc.) according to the new policies.

Notes and recommendations:
- The first admin must be created via the Dashboard SQL editor or using the service role key (since no admin exists to insert the first row).
- For security, ease-of-use, and auditability, promote/demote actions should be executed server-side with the service role or using a secure RPC that validates the caller is an admin.
- I added a helper `isAdminUser(userId?)` in `src/lib/supabase.ts` to check admin status from the client side (falls back to currently authenticated Supabase user if `userId` is not provided).

Would you like me to also:
- Add an RPC function (security-definer) to safely promote/demote users (done), and
- Add a page in the Admin dashboard that calls an admin-only RPC (via service) to promote users automatically (done).

How to use the new RPCs:

- Run the migrations (includes `admins` table, `admin_logs`, helper `is_admin()`, and the RPCs `promote_user_by_email` and `demote_user_by_email`):
  - `supabase db push` or paste the migration SQL into the Supabase SQL editor.

- Use the Admin dashboard UI:
  - Go to `/admin` (or your configured admin path), open the **Users** tab, and use the "Supabase user email" field in the top-right to promote/demote by email.

Notes:
- The RPCs check that the caller is already an admin (via `public.admins`) and log actions to `admin_logs`.
- The first admin must still be created manually via the SQL editor (INSERT into `public.admins`).
- For production, prefer invoking these RPCs from server-side code using service-role keys for automation (and ensure audit logging).

Troubleshooting "TypeError: Failed to fetch" from Supabase

If you see "TypeError: Failed to fetch" coming from the Supabase client (common when calling RPCs or queries), try these steps:

1. Check environment variables
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in your `.env` (see `.env.example`). Restart dev server after changing `.env`.

2. Check network & protocol
   - The Supabase URL must include the scheme (https://...). A missing or malformed URL will cause fetch to fail.
   - Ensure your machine has network access to the Supabase host.

3. CORS / Browser blocked requests
   - If requests are blocked by CORS or browser extensions, open the browser DevTools Network tab and inspect the failing request and response. For extension blocks, try in an incognito window with extensions disabled.

4. Supabase project status
   - Make sure your Supabase project is running and the RPCs/migrations were applied.
   - You can test with `supabase db remote status` or try a simple select from the SQL editor.

5. Use the connectivity helper
   - The app includes `checkSupabaseConnectivity()` in `src/lib/supabase.ts`. Call it in the console or use it in your app to get a clearer message about the problem.

6. If you still see issues
   - Paste the full network request/response from DevTools or the browser console errors and I’ll help debug further.

