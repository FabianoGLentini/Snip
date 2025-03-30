Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:5000", "http://127.0.0.0:5000", "http://localhost:5000" # Update with your frontend URL

    resource "*",
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options],
      credentials: true # This is required for session cookies!
  end
end