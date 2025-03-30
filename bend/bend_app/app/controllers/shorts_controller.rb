require 'pdf/reader'
require 'net/http'
require 'uri'
require 'json'

class ShortsController < ApplicationController
  def new
    @short = Short.new
  end

  def create
    puts "DOCS HERE"
    puts document_params
    @short = Short.create(document_params)
    if @short.save
      puts "SAVING"
      puts session[:user_id]
      if session[:user_id]
        Current.user = User.find_by(id: session[:user_id])
      end
      Current.user.short << @short
      pdf_text = []
      @short.pdf.open do |tempfile|
        reader = PDF::Reader.new(tempfile.path)
        reader.pages.each do |page|
          pdf_text << page.text
        end
      end
  
      @pdf_text = pdf_text.join("\n\n")

      request_body = {
        text: @pdf_text
      }.to_json

      uri = URI.parse('http://127.0.0.1:5000/generate_video')
      http = Net::HTTP.new(uri.host, uri.port)

      http.read_timeout = 600 # 5 minutes instead of default 60 seconds
      http.open_timeout = 600 # 5 minutes for connection opening

      # Create the request
      request = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
      request.body = request_body

      # Send the request and get the response
      Thread.new do
        response = http.request(request)  # Runs in a separate thread
        puts "RUN DOWNLOAD PROCESS"
        file1 = File.open('C:/Users/James/Documents/.Desktop_Docs/Code/Ruby/bcsh/Snip/AI/generated_videos/output_video1.mp4')
        @short.vid.attach(io: file1, filename: 'output_video1.mp4', content_type: 'video/mp4')
        file2 = File.open('C:/Users/James/Documents/.Desktop_Docs/Code/Ruby/bcsh/Snip/AI/generated_videos/output_video2.mp4')
        @short.vid.attach(io: file2, filename: 'output_video2.mp4', content_type: 'video/mp4')
        file3 = File.open('C:/Users/James/Documents/.Desktop_Docs/Code/Ruby/bcsh/Snip/AI/generated_videos/output_video3.mp4')
        @short.vid.attach(io: file3, filename: 'output_video3.mp4', content_type: 'video/mp4')
        file4 = File.open('C:/Users/James/Documents/.Desktop_Docs/Code/Ruby/bcsh/Snip/AI/generated_videos/output_video4.mp4')
        @short.vid.attach(io: file4, filename: 'output_video4.mp4', content_type: 'video/mp4')
        file5 = File.open('C:/Users/James/Documents/.Desktop_Docs/Code/Ruby/bcsh/Snip/AI/generated_videos/output_video5.mp4')
        @short.vid.attach(io: file5, filename: 'output_video5.mp4', content_type: 'video/mp4')
        file6 = File.open('C:/Users/James/Documents/.Desktop_Docs/Code/Ruby/bcsh/Snip/AI/generated_videos/output_video6.mp4')
        @short.vid.attach(io: file6, filename: 'output_video6.mp4', content_type: 'video/mp4')
        file7 = File.open('C:/Users/James/Documents/.Desktop_Docs/Code/Ruby/bcsh/Snip/AI/generated_videos/output_video7.mp4')
        @short.vid.attach(io: file7, filename: 'output_video7.mp4', content_type: 'video/mp4')
        
      end

      redirect_to "http://localhost:8080/loading", allow_other_host: true


      # Output the response
      puts "Response code: #{response.code}"
      puts "Response body: #{response.body}"

    else
      render :new
    end
  end

  def video_links
    puts "USERIDD"
    puts Current.user.id
    @shorts = Current.user.short
    video_data = {}
    index = 0
    # @shorts.each do |shs|
    shs = @shorts.last
      if shs.vid.attached?
        shs.vid.each do |sh|
          video_data["url#{index + 1}"] = url_for(sh)
          index = index + 1
        end
      end
    # end
    render json: video_data
  end

  def show
    if Current.user
      @shorts = Current.user.short
    end
    @short = Short.find(params[:id])
    pdf_text = []

    @short.pdf.open do |tempfile|
      reader = PDF::Reader.new(tempfile.path)
      reader.pages.each do |page|
        pdf_text << page.text
      end
    end

    @pdf_text = pdf_text.join("\n\n")
  end


  def nvid
    @short = Short.new
    @id = params[:id]
    puts "NVID ID"
    puts params[:id]
  end

  def upvid
    puts "VIEWING VIDAAA"
    puts params[:id]
    @short = Short.find(params[:id])
    @short.vid.attach(vid_params[:vid])
    if @short.save
      Current.user.short << @short
      redirect_to view_path, notice: "file uploaded successfully."
    else
      render :new
    end
  end

  def showvid
    if Current.user
      @shorts = Current.user.short
    end
  end

  def newzip
    @short = Short.new
    @id = params[:id]

  end

  def upzip
    puts "VIEWING ZIPAAA"
    puts params[:id]
    @short = Short.find(params[:id])
        
  end

  def vvid
    puts "PUUSHING VID YAY"
  end

  private

  def document_params
    params.require(:short).permit(:pdf)
  end

  def vid_params
    params.require(:short).permit(:vid, :title)
  end
end
