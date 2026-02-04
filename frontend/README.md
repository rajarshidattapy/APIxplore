# Policy-Aware AI API Explorer - Frontend

A Next.js 14 application providing an interactive API Explorer that dynamically adapts based on safety policies.

## ⚙️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the `frontend` directory:

```env
# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Supabase Auth (Must match backend project)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🧩 Key Components

### `Explorer Page` (`/explorer`)
The main interface where users can:
- Select demo endpoints (Safe, Sensitive, Dangerous).
- Analyze API safety (calls backend).
- View dynamic UI restrictions (e.g., disallowed execution).

### `Components`
- **`EndpointList`**: Displays categorized endpoints.
- **`RequestBuilder`**: Allows building requests; strictly controlled by backend permissions.
- **`SafetyInspector`**: Visualizes the AI's safety analysis and risk score.

### `Account Settings` (`/account`)
Manage user profile, bio, and preferences. Integrated with Supabase `user_profiles`.

## 🔄 Integration
The frontend uses `src/services/api.ts` to communicate with the backend:
- `analyzeAndPlan()`: Orchestrates the safety analysis and UI planning in one flow.
