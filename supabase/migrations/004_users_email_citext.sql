-- Make users.email case-insensitive for reliable invite linking (Clerk normalizes emails).

CREATE EXTENSION IF NOT EXISTS citext;

ALTER TABLE users
    ALTER COLUMN email TYPE CITEXT;

