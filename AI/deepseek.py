import asyncio
import aiohttp

async def fetch_gemini_response(full_prompt):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBI_gPYqF-jKtxDOaRuNHHn1uKkXPRhAog"  
    headers = {
        "Content-Type": "application/json",
    }
    data = {
        "contents": [
            {
                "parts": [
                    {"text": full_prompt}
                ]
            }
        ]
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data, headers=headers) as response:
            if response.status == 200:
                json_response = await response.json()
                print(response.json())
                return json_response.get('generated_text', 'No response')
            else:
                return f"Error: {response.status}"