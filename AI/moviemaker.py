import os
os.environ["IMAGEMAGICK_BINARY"] = r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\magick.exe"

from moviepy.editor import VideoFileClip, TextClip, AudioFileClip, CompositeVideoClip
from moviepy.video.fx.loop import loop
from google import genai
import google.cloud.texttospeech as tts
from plswork import text_to_speech_api
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file

import zipfile


import time
import os
load_dotenv()
api_key = os.getenv("GENAI_API_KEY")

app = Flask(__name__)

client = genai.Client(api_key=api_key)

system_prompt = """You are an expert in Computer Science. Your job is to analyze and extract key technical concepts from a course syllabus related to a hardware-based model of computation.

The goal is to return exactly **7 deep and insightful technical concepts**. Each concept must be a **1 full sentence** (at least 30 words long and avoid use long words, make it sound simple unless its a technical term) that directly explains a **core computational or programming concept** from the syllabus. Avoid summarizing administrative information like grading or schedules. Focus only on the **technical content**.

Provide the concepts in a structured way, using the '|' symbol to separate them. Do not include extra explanations, numbering, or unnecessary formatting.

Example output (for a course on **compilers and memory management**):  
The translation from high-level code to assembly language involves several stages including lexical analysis, parsing, and optimization. | Memory management bugs often arise from incorrect pointer dereferencing or buffer overflows. | Concurrency challenges in multi-threaded programs can be mitigated using synchronization primitives like mutexes. | Understanding the stack and heap is crucial for efficient memory allocation and avoiding memory leaks. | Garbage collection introduces tradeoffs in performance and memory usage, particularly in high-performance applications. | Static analysis tools can help detect common bugs related to memory access violations. | Optimization techniques such as loop unrolling and constant folding improve execution speed and reduce overhead.

The output should focus on explaining **deep technical concepts** clearly, not on course logistics or administrative details. Don't use sentences like "this course" or "students learn"  
...
"""

user_query = "CPSC 213 Syllabus (Last Updated: January 17, 2025) Description The primary goal of 213 is to help you develop a model of computation that is rooted in what really happens when a program executes. In the first 8 weeks of the course we will implement a simple instruction set in a hardware simulator and then examine how features of C are implemented in this instruction set. We will refer back to Java when considering memory management and polymorphism and to Dr Racket when considering functions as parameters. You will also develop an ability to read and understand small assembly-language programs. In the remaining five weeks, devices and asynchrony (and thus asynchronous programming) are introduced. Asynchrony is used to motivate threads and threads to motivate synchronization. You will see both how these abstractions are implemented and how they are used. You will see the connection between thread switch and procedure call. You will be introduced to the notion of atomicity and see why atomic memory-exchange operations are needed to implement synchronization. You will also examine the difference between busy and blocking waiting and solve a set of problems using monitors and condition variables and semaphores in C. Topics • Numbers and Memory • Static Scalars and Arrays • Instance Variables and Dynamic Allocation • Static Control Flow • Procedures and Stack • Dynamic Control Flow • I/O Devices and Asynchronous Programming • Virtual Processors (Threads) • Synchronization Course Learning Outcomes (High-Level) 1. Using a hardware based model of execution, reason about the limitations, vulnerabilities and idiosyncrasies of the behaviour of a particular program, specifically concerning performance, bugs and security vulnerabilities. 2. Using a hardware based model of data, reason about how programs access data using different types of variables, including the implicit and explicit use of memory references. 3. Translate a statement from a high-level programming language into assembly language; from a large block of assembly language, identify groups of instructions that correspond to high level language features and then write an equivalent high level programming language expression. 4. Identify and correct memory management bugs, particularly in languages with explicit deallocation, and use best practices to write code that is less likely to incur such issues. 5. Compare and contrast how Java and C are translated into a language the CPU understands; identify common features that are implemented in significantly different ways in either language (for instance, memory management, and the duality of subtype polymorphism in Java and function pointers in C). In doing so, explain the tradeoffs associated with each. 6. Reason about the execution of concurrent programs, incl. real time interrupts, and use both asynchronous programming and threads to write concurrent and/or parallel programs. Explain the tradeoffs associated with each. 7. Solve problems using monitors, condition variables and semaphores. After this Course You Will ... • Be a better and full-stack programmer. ◦ have a deeper understanding of the features of a programming language; ◦ understand the execution of your program at various levels of abstraction; ◦ be able to more easily learn new programming languages; ◦ be able to evaluate design tradeoffs in considering languages most appropriate for solving a given problem. • Appreciate that system design is a complex set of tradeoffs: a system will not have exactly one optimal answer, there are often many sub-optional answers. Experience with tradeoffs prepares you to deal with tradeoffs in design in real world programming scenarios. • Develop distinctions between static and dynamic components of programs and systems and be able to describe their implications. • Utilize synchronization primitives to control interaction in various situations including among processes, threads, and networked communication. • Understand how computer systems work. Contacts Use Piazza to contact the course staff when your issue is related to course content, including questions about material presented in class, questions about assignments, or logistical questions. Given that your question may be answered by any of the course staff, as well as other students if your question is public, you should expect faster turnout there as compared to email. All administrative questions should be directed to our course coordinator at cpsc213- admin@cs.ubc.ca. For questions that are sensitive or potentially not best asked using other channels, you may contact your instructor, Jordon Johnson, at jordon@cs.ubc.ca. Instructor and TA office hours are listed on Piazza. Textbook and Other Resources The primary resource for the course is the 213 Companion. The 213 Companion and the SM213 Simulator are available for download from Lab 0 on PrairieLearn. Additional material is found in the textbook: Computer Systems: A Programmer's Perspective (3rd edition), by Randal Bryant and David O'Hallaron. Note, however, that this textbook is considered optional for the course, and that there are copies available in the CS Reading Room. PrairieLearn Most course material and all assessments are on PrairieLearn (https://us.prairielearn.com/). These assessments are tagged by learning goal. A supplementary Marks by Learning Goal web page organizes all of this material by learning goal and summarizes your progress (i.e., grades) by goal. This page is accessible via PrairieLearn Lab 0. Course Schedule The course schedule is available in Lab 0 on PrairieLearn. The course is divided into Units 1a- 1f and 2a-2c. The schedule shows when we estimate we'll be covering each of these units in lecture. There is a Canvas module for each Unit that lists the unit's reading assignments, learning objectives, and lecture slides. Additional lecture material including in-class code examples, exercises, and summary videos are available on PrairieLearn. The videos are short summaries organized by topic. They are provided in lieu of lecture streaming or recordings. Additional videos may be added by request; please feel free to request a video for any topic at all if we don't have one and if you think it will help (contact Mike at feeley@cs.ubc.ca). The schedule also shows which topics are covered by labs and assignments, as well as by the three quizzes. Colour coding connects the lecture content to the labs and assignments. Generally, a week's lab and assignment will cover the material completed in the prior week's lectures (note that in summer terms, each week’s lectures are compressed into a single day’s 3- 3.5h lecture, and each calendar week is split into two weeks’ worth of content and activities). Assessments Your grade in the course will be based on the following components: 2% Lecture Participation only applied if it improves your overall grade 1% Lab Participation full marks for active participation in 80% of 1-hour group labs 18% Assignments (10) best 8 of first 9 assignments, plus assignment 10 36% Quizzes (3) can be improved by doing better on the final exam 43% Final Exam To pass the course you must: • Achieve a score of at least 50% on the weighted average of the quizzes (after adjustment) and final exam (note that it is not required to achieve 50% on them all individually) • Submit 80% of the homework assignments (with reasonable attempts to most questions) • Achieve an overall course grade of 50% If these requirements are not all met, then your course grade will be at most 45%. Lecture Participation Lecture participation is based on submitting answers to iClicker questions while attending lectures in your registered section (which is based on your registered section at the end of the course); points are granted for both participation and correctness (1 point each per question). Concessions on lecture participation will not be granted under any circumstances; however, the lecture participation score will only be applied if it improves your overall grade. Labs Lab assignments occur in your 1-hr scheduled lab section each week (or, for summer terms, the first hour of each 3-hour session). They are interactive and led by a TA. To receive credit for the lab you must attend your registered section and actively participate. The other (2-hr) lab session is open for help with assignments, and you can attend any of these you like (with priority given to students in their registered section). You receive full credit if you actively participate in at least 80% of the 1-hr lab sessions. You do not have to answer any of the questions correctly, but you must participate. Otherwise, your lab participation score is the percentage of 1-hr lab sessions in which you did participate. Assignments Assignments in winter terms start at the beginning of the week and end at the end (in summer terms, each week is split into two parts, with some potential overlap in due dates). Due dates for assignments will be displayed in PrairieLearn. For each assignment, there is an automatic, no- penalty 24-hour grace period after the due date. After that, no late assignments will be accepted. The first two assignments are individual work. For the remaining assignments, you will be permitted to work with a partner, if you like. Once you join a group for a particular assignment, you are not permitted to leave it (though you are welcome to join a different group for subsequent assignments). Your mark for the first nine assignments is determined by your best eight scores. Quizzes The course schedule shows when the three 50-minute Quizzes are held, which you can take at a day and time of your choosing (from a set of options we will provide). These quizzes are in- person, and held in the Computer-Based Test Facility (CBTF). You can only view your quiz while taking the quiz in the facility. In lieu of additional quiz viewings, feedback on performance on quizzes will be provided in the Marks by Learning Goal page, accessible via PrairieLearn Lab 0. As indicated in the course schedule, each quiz covers material covered up to the end of the preceding week (or half-week in the case of summer terms), generally focusing on the material not already covered by the previous quizzes (though earlier content may be indirectly tested, given the nature of the course material). You can improve your quiz grades with your final exam. The way this works is that every learning goal assessed on a quiz is assessed again on the final. If you do better on a given final exam question, then your mark(s) for the corresponding quiz question(s) will be increased to 80% of the corresponding mark from your final. So, for example, if Quiz 1 Question 3 and Final Question 2 both assess the same learning goal(s), and you get 70% on the quiz question and 95% on the corresponding final exam question, your mark for the quiz question will be increased to 76% (i.e., 95% x 80%). • This benefit will only be applied to quizzes that you take; missing a quiz without an exemption from the instructor/course coordinator will result in a score of zero for that quiz. • The effects of this benefit are not computed within PrairieLearn and thus will not be displayed there. • For students who take deferred final exams, we cannot guarantee that the benefit will be applied. Practice Quizzes Practice problems are provided in PrairieLearn and are not for marks. You can take these from anywhere, see the answers, and repeat them as often as you like. Please note that quiz/exam questions may be different than the practice quiz questions, and so it is preferable to approach the practice quizzes as tools for understanding rather than simply drilling them to “train” for the quizzes/exam. Academic Concessions We understand that sometimes circumstances arise beyond our control that significantly impact our ability to complete assigned work. If such is the case for you, please fill out a concession request form at https://ubc.ca1.qualtrics.com/jfe/form/SV_0IZUyTvCa6g1GWa. If needed, you may also contact the course coordinator at cpsc213-admin@cs.ubc.ca. Depending on the circumstances, the following exemptions may be granted: • Assignments: the assignment weight would be transferred to the remaining assignments. o Note that an exemption will likely not be granted for the first missed assignment, since such cases are already covered by the best-8-of-9 policy. o An exempted assignment would not result in a failure to achieve the 80% submission requirement in order to pass the course. • Labs: the participation weight would be transferred to the remaining labs. o Note that an exemption will likely not be granted for the first two missed labs, since such cases are already covered by the existing course policy. • Quizzes: the quiz weight would be transferred to the final exam. If the final exam is missed: the course staff is not authorized to approve accommodations for missed final exams; such cases are handled at the faculty level, and so you will need to contact your faculty advising office. Note that, once you begin taking the final exam, per UBC policy you will not be able to receive accommodations for it. Similarly, once you begin taking a quiz, you will not be able to receive accommodations for it. Please note that the following concession mechanisms will not be available in CPSC 213: • Extensions on assignments beyond the 24-hour grace periods already provided • Additional assignments or other work not assigned to the entire class during the term in order to obtain extra credit • Rescheduling a quiz/exam beyond the end of the provided assessment window • Retaking a quiz/exam o In the case of quizzes, such cases are largely covered by the policy of final exam scores retroactively improving quiz scores. Online Community Piazza provides our official forum for discussing course material; getting help from each other, the TAs, and the instructor(s); and providing help to each other. Course Rules and Academic Integrity — READ THIS CAREFULLY Assignments are individual work (or group work, as indicated). You must not share any portion of your assignment with anyone (other than your group partner). You must not consult online or other resources that include any portion of a solution to an assignment. You must not use a tutor for help with an assignment. You must not use generative AI tools (e.g., ChatGPT) for help with an assignment. All work that you submit must be your own work (or in the case of group assignments, a collaboration of you and your partner and no one else) unless you explicitly indicate otherwise. Lecture iClicker answers attributed to you must have have been entered by you while you were attending the lecture in person. You must not ask another student to answer for you. Course material is provided for registered students only. You must not provide this material to anyone else in any form. Violation of these course rules constitutes academic misconduct. Other examples of misconduct and a more detailed description can be found on the department page on collaboration and on the University Academic Integrity page. Some Additional Tips What's allowed 1. Helping each other understand material and assignment specifications. 2. Discussing approaches to assignments, so long as you do not: 1. look at each other’s code 2. exchange anything written/drawn 3. make any record or keep anything written/drawn during such discussions (including code) 3. Referring to existing public approaches to a problem, provided it is properly cited, unless the “public approach” is a solution written/posted by another student (current or previous), or if it relates to generative AI (e.g., ChatGPT). 4. Discussing the merits of a proposed solution with the course instructor or TAs. What's not allowed 1. Submitting someone else's work as your own. Examples include: having in your possession previous solutions to the assignments (either someone else's or the instructor’s). 2. Working in a group and then handing in the work, even a part of it, as your own, unless the assignment explicitly permits doing so. 3. Submitting work you have handed in to another course (all work must be new work). For example, if you have taken this course before and failed, you may not reuse the code you wrote in the previous term. 4. Using public pages to share code with any group members you might be working with (e.g., public GitHub repos, Pastebin). Any such pages/repositories must be kept private both during and after your time as a CPSC 213 student. 5. Making a solution available as an aid to others, either now or in the future. (Note that this includes publicly-accessible pages/repositories as per the previous point.) 6. Talking about a quiz or exam to another student while the quiz or exam is open (i.e., before the deadline). This includes clarification questions about the wording or meaning; those must be directed to the instructor. This applies even if all students involved have already completed the quiz or exam. 7. Using any resource in a quiz or exam that is not explicitly permitted. This includes calculators that do not conform to the specification (programming calculators, cell phone calculators, Google, Wolfram Alpha, etc.) 8. Any violations of Computer-Based Testing Facility policies. Misconduct Outcomes When misconduct occurs, it weakens/removes the ability to assess your work. Therefore, misconduct on graded assessments will result in the following outcomes: • Assignment – the assignment score will be set to zero. In addition, the assignment is not considered to have been “reasonably attempted”, and so: o It cannot be treated as the “lowest score” that gets dropped from the overall grade. o It does not count toward the 80% submission requirement to pass the course. This means that it is possible to automatically fail the course due to assignment misconduct, regardless of your quiz/exam performance. • iClickers – the overall iClicker score will be set to zero and will be applied to your overall grade. • Quiz – the quiz score will be set to zero, and that score cannot be retroactively improved by your performance on the final exam. • Final exam – the final exam score will be set to zero. In addition, all misconduct cases are reported to the Computer Science department and Faculty of Science. Additional outcomes based on the severity and/or history of misconduct (up to expulsion from the university) may be considered at that point."

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
    video = VideoFileClip("minecraft_video.mp4")
    
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
        
        text_clip = TextClip(word, fontsize=30, color='white', font='Open Sans')
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
