| table_name             | column_name           | data_type                |
| ---------------------- | --------------------- | ------------------------ |
| recurring_transactions | start_date            | date                     |
| budgets                | user_id               | uuid                     |
| budgets                | category_id           | uuid                     |
| budgets                | amount                | numeric                  |
| budgets                | id                    | uuid                     |
| recurring_transactions | end_date              | date                     |
| recurring_transactions | next_occurrence       | date                     |
| recurring_transactions | is_active             | boolean                  |
| recurring_transactions | requires_confirmation | boolean                  |
| recurring_transactions | created_at            | timestamp with time zone |
| recurring_transactions | updated_at            | timestamp with time zone |
| profiles               | id                    | uuid                     |
| profiles               | user_id               | uuid                     |
| profiles               | is_default            | boolean                  |
| profiles               | created_at            | timestamp with time zone |
| profiles               | budget_start_day      | integer                  |
| contacts               | id                    | uuid                     |
| contacts               | user_id               | uuid                     |
| contacts               | profile_id            | uuid                     |
| contacts               | created_at            | timestamp with time zone |
| transaction_splits     | id                    | uuid                     |
| transaction_splits     | transaction_id        | uuid                     |
| transaction_splits     | contact_id            | uuid                     |
| transaction_splits     | profile_id            | uuid                     |
| transaction_splits     | amount                | numeric                  |
| transaction_splits     | is_paid               | boolean                  |
| transaction_splits     | paid_at               | timestamp with time zone |
| transaction_splits     | created_at            | timestamp with time zone |
| budgets                | start_date            | date                     |
| budgets                | alert_threshold       | numeric                  |
| budgets                | is_active             | boolean                  |
| budgets                | created_at            | timestamp with time zone |
| budgets                | updated_at            | timestamp with time zone |
| payment_methods        | id                    | uuid                     |
| payment_methods        | user_id               | uuid                     |
| payment_methods        | is_active             | boolean                  |
| payment_methods        | created_at            | timestamp with time zone |
| payment_methods        | updated_at            | timestamp with time zone |
| payment_methods        | closing_day           | integer                  |
| payment_methods        | due_day               | integer                  |
| payment_methods        | credit_limit          | numeric                  |
| payment_methods        | personal_limit        | numeric                  |
| payment_methods        | balance               | numeric                  |
| transactions           | id                    | uuid                     |
| transactions           | user_id               | uuid                     |
| transactions           | category_id           | uuid                     |
| transactions           | payment_method_id     | uuid                     |
| transactions           | amount                | numeric                  |
| transactions           | transaction_date      | date                     |
| transactions           | has_installments      | boolean                  |
| transactions           | total_installments    | integer                  |
| transactions           | installment_amount    | numeric                  |
| transactions           | created_at            | timestamp with time zone |
| transactions           | updated_at            | timestamp with time zone |
| transactions           | transfer_id           | uuid                     |
| installments           | id                    | uuid                     |
| installments           | transaction_id        | uuid                     |
| installments           | installment_number    | integer                  |
| installments           | amount                | numeric                  |
| installments           | due_date              | date                     |
| installments           | is_paid               | boolean                  |
| installments           | paid_date             | date                     |
| installments           | paid_transaction_id   | uuid                     |
| installments           | created_at            | timestamp with time zone |
| installments           | updated_at            | timestamp with time zone |
| installments           | payment_method_id     | uuid                     |
| installments           | total_installments    | integer                  |
| categories             | id                    | uuid                     |
| categories             | user_id               | uuid                     |
| categories             | created_at            | timestamp with time zone |
| categories             | updated_at            | timestamp with time zone |
| categories             | is_active             | boolean                  |
| notifications          | id                    | uuid                     |
| notifications          | user_id               | uuid                     |
| notifications          | related_id            | uuid                     |
| notifications          | scheduled_for         | timestamp with time zone |
| notifications          | is_sent               | boolean                  |
| notifications          | is_read               | boolean                  |
| notifications          | sent_at               | timestamp with time zone |
| notifications          | created_at            | timestamp with time zone |
| shopping_items         | id                    | uuid                     |
| shopping_items         | transaction_id        | uuid                     |
| shopping_items         | category_id           | uuid                     |
| shopping_items         | price                 | numeric                  |
| shopping_items         | quantity              | integer                  |
| shopping_items         | created_at            | timestamp with time zone |
| recurring_transactions | id                    | uuid                     |
| recurring_transactions | user_id               | uuid                     |
| recurring_transactions | category_id           | uuid                     |
| recurring_transactions | payment_method_id     | uuid                     |
| recurring_transactions | amount                | numeric                  |
| budgets                | period                | character varying        |
| notifications          | message               | text                     |
| transactions           | description           | text                     |
| shopping_items         | description           | character varying        |
| installments           | description           | text                     |
| contacts               | name                  | character varying        |
| recurring_transactions | description           | text                     |
| transactions           | notes                 | text                     |
| payment_methods        | alias                 | character varying        |