import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in environment.")
    exit(1)

supabase: Client = create_client(url, key)

def check_profiles():
    print("--- Checking user_profiles table ---")
    try:
        # Check profiles
        response = supabase.table("user_profiles").select("*").execute()
        profiles = response.data
        print(f"Total profiles found: {len(profiles)}")
        for p in profiles:
            print(f" - ID: {p.get('id')} | Email: {p.get('email')} | Name: {p.get('full_name')}")

        # Check auth users (this needs service role key usually, but let's try with what we have)
        # Often standard anon/authenticated keys can't list users.
        # But we can assume if profiles is 0, backend script didn't run.
        
    except Exception as e:
        print(f"Error accessing Supabase: {e}")

if __name__ == "__main__":
    check_profiles()
