# Policy-Aware AI API Explorer - Backend

A FastAPI backend for analyzing API safety and generating dynamic UI plans using LLMs.

## ⚙️ Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory with the following:
```env
# Server
HOST=0.0.0.0
PORT=8000
LOCAL_MODE=0  # Set to 0 to use LLM, 1 for mock rules

# Supabase (Required)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# LLM Providers (At least one required if LOCAL_MODE=0)
LLM_PROVIDER=gemini # or openai
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

### 3. Database Setup (Supabase)
Run the SQL scripts in the `sql/` folder using the Supabase SQL Editor:
1. `sql/schema.sql` - Creates tables (`user_profiles`, `safety_verdicts`, etc.).
2. **Backfill Profiles**: If you have existing users, run this query to fix missing profiles:
   ```sql
   insert into public.user_profiles (id, email, full_name, avatar_url)
   select id, email, coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), raw_user_meta_data->>'avatar_url'
   from auth.users
   where id not in (select id from public.user_profiles);
   ```

### 4. Run Server
```bash
uvicorn main:app --reload --port 8000
```
Server runs at `http://localhost:8000`.

## 📚 API Documentation
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)  
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📡 Endpoints

### `/analyze-api` (POST)
Analyzes an API specification and user intent for safety risks.
- **Input**: `api_spec`, `user_intent`
- **Output**: `SafetyVerdict` (threat, urgency, sensitive_request, risk_score)

### `/generate-ui-plan` (POST)
Generates a UI Plan based on the safety verdict.
- **Input**: `SafetyVerdict`, `api_spec`
- **Output**: `UIPlan` (components, restrictions, warnings)

## 🛠️ Utilities
- `check_profiles.py`: A script to verify `user_profiles` table data.
