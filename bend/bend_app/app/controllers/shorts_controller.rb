class ShortsController < ApplicationController
  def new
    @document = Document.new
  end

  def create
    @document = Document.new(document_params)
    if @document.save
      redirect_to @document, notice: "PDF uploaded successfully!"
    else
      render :new
    end
  end

  def show
    @document = Document.find(params[:id])
  end

  private

  def document_params
    params.require(:document).permit(:file)
  end
end
