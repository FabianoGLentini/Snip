import requests
import json
import base64
from dotenv import load_dotenv
import os
load_dotenv()
api_key = os.getenv("SPEECH_KEY")

def text_to_speech_api(text, output_file="output.mp3", api_key= api_key):
    url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}"
    payload = {"input": {"text": text}, "voice": {"languageCode": "en-US", "ssmlGender": "NEUTRAL"}, "audioConfig": {"audioEncoding": "MP3"}}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    if response.status_code == 200:
        audio_binary = base64.b64decode(response.json()["audioContent"])
        with open(output_file, "wb") as out:
            out.write(audio_binary)
        print(f"Audio content written to file '{output_file}'")
    else:
        print(f"Error: {response.status_code} - {response.text}")