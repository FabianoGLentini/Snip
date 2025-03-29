class CreateShorts < ActiveRecord::Migration[7.1]
  def change
    create_table :shorts do |t|

      t.timestamps
    end
  end
end
