class User < ApplicationRecord
  has_secure_password

  has_many :short
  validates :email, presence: true
  validates :username, presence: true, uniqueness: true
end
