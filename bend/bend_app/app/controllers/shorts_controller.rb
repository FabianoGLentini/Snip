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

  private

  def document_params
    params.require(:short).permit(:pdf, :title)
  end
end
