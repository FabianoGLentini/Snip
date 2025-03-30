class CreateShorts < ActiveRecord::Migration[7.1]
  def change
    create_table :shorts do |t|
      t.string :title
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
