class SessionsController < ApplicationController
  def destroy 
      session[:user_id] = nil
      redirect_to root_path, notice: "Logged Out"
  end

  def new
      @user = User.new
  end

  def create
      @user = User.find_by(username: user_params[:username])
      puts user_params
      puts "User found: #{@user.inspect}" # Check if user exists
      puts "Authentication result: #{@user&.authenticate(params[:password])}" # Check aut
      if @user.present? && @user.authenticate(user_params[:password])
          session[:user_id] = @user.id
          render json: { message: "Sign in successful", user: @user }, status: :created
      else 
        render json: { message: "FAILS", user: @user }, status: :created
      end
  end

  private 

  def user_params
      params.require(:user).permit(:username, :password)
  end
end