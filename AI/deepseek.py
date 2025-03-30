from google import genai

client = genai.Client(api_key="AIzaSyBI_gPYqF-jKtxDOaRuNHHn1uKkXPRhAog")

system_prompt = "You are an expert historian and your job is to provide accurate, concise, and insightful answers."

user_query = "Give me one question about Canadian history?"

full_prompt = f"{system_prompt}\n{user_query}"

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=full_prompt,
)

print(response.text)