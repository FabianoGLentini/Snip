class SessionsController < ApplicationController
  def destroy 
      session[:user_id] = nil
      redirect_to root_path, notice: "Logged Out"
  end

  def new
      @user = User.new
  end

  def create
      user = User.find_by(username: params[:username])
      if user.present? && user.authenticate(params[:password])
          session[:user_id] = user.id
          redirect_to root_path, notice: "Logged In"
      else 
          flash[:alert] = "Invalid Log In"
          render :new
      end
  end
end