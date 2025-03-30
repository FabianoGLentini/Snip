class Short < ApplicationRecord
  has_one_attached :pdf
  has_many_attached :vid
end
