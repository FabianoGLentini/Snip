Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  root to: "main#home"
  
  get "/sign-up", to: "registrations#new"
  
  post "/sign-up", to: "registrations#create"

  get "/sign-in", to: "sessions#new"

  post "/sign-in", to: "sessions#create"
  
  delete "/sign-out", to: "sessions#destroy"

  get "/getvids", to: "shorts#video_links"

  get "/view", to: "shorts#showvid"

  get "/nvid/:id", to: "shorts#nvid"

  post "/upvid/:id", to: "shorts#upvid"

  get "/docs/new", to: "shorts#new", as: :new_short
  post "/docs", to: "shorts#create", as: :shorts
  get "/docs/:id", to: "shorts#show", as: :short

  post "/success", to: "shorts#vvid"
end
