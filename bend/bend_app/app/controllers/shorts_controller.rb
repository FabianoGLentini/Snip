require 'pdf/reader'

class ShortsController < ApplicationController
  def new
    @short = Short.new
  end

  def create
    @short = Short.new(document_params)
    if @short.save
      Current.user.short << @short
      redirect_to @short, notice: "PDF uploaded successfully."
    else
      render :new
    end
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
    params.require(:short).permit(:pdf, :title)
  end

  def vid_params
    params.require(:short).permit(:vid, :title)
  end
end
