class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  before_action :set_current_user

  def set_current_user
    puts "SESSION COOOKIEEE"
    puts session[:user_id]
    if session[:user_id]
      Current.user = User.find_by(id: session[:user_id])
    end
  end
end
