import os
os.environ["IMAGEMAGICK_BINARY"] = r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\magick.exe"

from moviepy.editor import VideoFileClip, TextClip, AudioFileClip, CompositeVideoClip
from moviepy.video.fx.loop import loop
from google import genai
import google.cloud.texttospeech as tts
from plswork import text_to_speech_api
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file
import requests
import json


import zipfile


import time
import os
load_dotenv()
api_key = os.getenv("GENAI_API_KEY")

app = Flask(__name__)

client = genai.Client(api_key=api_key)

system_prompt = """You are an expert in Computer Science. Your job is to provide simple yet clear definitions for technical terms related to computational models and programming concepts.

The goal is to return exactly 7 definitions of key technical terms, where each definition should be a full sentence (at least 30 words long). The terms should be directly related to core computational or programming concepts such as compilers, stack, heap, memory management, and others.

The definitions should be easy to understand, avoiding overly complex jargon unless it is a necessary technical term. The focus should be on explaining the terms in a simple and approachable way, using examples where needed.

Provide the definitions in a structured way, using the '|' symbol to separate them. Do not include extra explanations, numbering, or unnecessary formatting.

Example output (for terms like compilers, stack, and heap):  
A compiler is a program that translates high-level programming languages into machine code, enabling a program to be executed on a computer. | The stack is a region of memory used for storing local variables and function calls in a last-in, first-out order, crucial for managing the execution flow of programs. | The heap is a region of memory used for dynamically allocating and freeing memory at runtime, which is typically controlled by the programmer to manage resources. | Memory management ensures that a program correctly allocates and frees memory during execution, preventing leaks or crashes. | A pointer is a variable that stores the memory address of another variable, and is often used in languages like C for direct memory access. | A buffer overflow occurs when data overflows a buffer’s boundaries, potentially leading to program crashes or security vulnerabilities. | A dangling pointer is a pointer that still points to a memory location that has already been freed, causing undefined behavior and potential errors.

The output should focus on providing clear and simple definitions of technical terms related to computational models and programming concepts, not on course logistics or administrative details. Avoid any special characters in your answer like *.
"""


# full_prompt = f"{system_prompt}\n{user_query}"

# response = client.models.generate_content(
#     model="gemini-2.0-flash",
#     contents=full_prompt,
# )

# print(response.text)
# concepts = response.text.split(" | ")

def zip_videos(video_files):
    zip_filename = "videos.zip"
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for video in video_files:
            zipf.write(video, os.path.basename(video))  
    return zip_filename


def generate_video(text, count):
    if count % 2 == 0:  
        video = VideoFileClip("minecraft_video.mp4")
    elif count % 3 == 0: 
        video = VideoFileClip("subway.mp4")
    else: 
        video = VideoFileClip("minecraft2.mp4")

    words = text.strip().split()
    print(words)
    
    text_to_speech_api(text)
    time.sleep(10)
    
    audio = AudioFileClip("output.mp3")
    total_text_duration = sum(len(word) / 23.6 + 0.1 for word in words) + 0.3
    
    if audio.duration < video.duration:
        audio = audio.fx(loop, duration=total_text_duration)
    else:
        audio = audio.subclip(0, total_text_duration)
    
    video = video.set_audio(audio)
    
    word_clips = []
    current_start_time = 0
    
    for word in words:
        word_duration = len(word) / 23.6 + 0.1
        
        text_clip = TextClip(word, fontsize=30, color='white', font='Impact', stroke_width=1, stroke_color='black')
        x_position = (video.w - text_clip.w) / 2
        y_position = video.h / 2
        
        text_clip = text_clip.set_position((x_position, y_position)).set_start(current_start_time).set_duration(word_duration)
        word_clips.append(text_clip)

        current_start_time += word_duration  
    
    final_video = CompositeVideoClip([video] + word_clips)
    final_video = final_video.set_audio(audio).subclip(0, total_text_duration)
    
    output_filename = f"output_video{count}.mp4"
    output_dir = "generated_videos"

    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, output_filename)
    final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")
    print(f"Rendered: {output_filename}")

    return output_path


@app.route('/generate_video', methods=['POST'])
def generate_video_from_text():
    user_text = request.json.get("text")
    if not user_text:
        return jsonify({"error": "No text provided"}), 400
    
    full_prompt = f"{system_prompt}\n{user_text}"
    
    response = client.models.generate_content(model="gemini-2.0-flash", contents=full_prompt)
    
    concepts = response.text.split(" | ")
    video_files = []
    start = 1
    
    for concept in concepts:
        file_path = generate_video(concept, start)
        video_files.append(file_path)
        start += 1
    
    zip_filename = zip_videos(video_files)
    url = "http://localhost:3000/success"  

    data = {
        "key1": "value1",
        "key2": "value2"
    }

# Send the POST request with the data
    response = requests.post(url, json=data)
    
    return send_file(zip_filename, mimetype='application/zip', as_attachment=True, download_name=zip_filename)

if __name__ == '__main__':
    app.run(debug=True)


# video = VideoFileClip("minecraft_video.mp4")
# response_text = response.text.strip() 
# response_text = ' '.join(response_text.split())
# words = response.text.split()
# print(words)
# text_to_speech_api(response.text)


# time.sleep(10)
# audio = AudioFileClip("output.mp3")
# total_text_duration = sum(len(word) / 23.6 + 0.1 for word in words)

# print(f"Video duration: {total_text_duration}")
# print(f"Audio duration: {audio.duration}")

# if audio.duration < video.duration:
#     audio = audio.fx(loop, duration=total_text_duration)
# else:
#     audio = audio.subclip(0, total_text_duration)

# video = video.set_audio(audio)

# text = TextClip(response.text, fontsize=20, color='white', font="Arial")
# text = text.set_position('center').set_duration(total_text_duration)

# final_video = CompositeVideoClip([video, text])
# print("Rendering final video...")
# print(words)
# word_clips = []

# current_start_time = 0  # Initialize the start time for the first word
# total_text_duration = sum(len(word) / 23.6 + 0.1 for word in words)

# for word in words:
#     word_duration = len(word) / 23.6  + 0.1

#     text_clip = TextClip(word, fontsize=30, color='white', font='Open Sans')
#     x_position = (video.w - text_clip.w) / 2
#     y_position = video.h / 2

#     text_clip = text_clip.set_position((x_position, y_position)).set_start(current_start_time).set_duration(word_duration)
#     word_clips.append(text_clip)

#     current_start_time += word_duration  
    

# final_video = CompositeVideoClip([video] + word_clips)
# final_video = final_video.set_audio(audio).subclip(0, total_text_duration)

# final_video = final_video.set_audio(audio)
# final_video.write_videofile("output_video.mp4", codec="libx264", audio_codec="aac")
