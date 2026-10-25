-- Only the explicit migrate command may change the schema.
CREATE TABLE reborn_schema (
    singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
    product text NOT NULL CHECK (product = 'keida-hub-reborn'),
    schema_version integer NOT NULL CHECK (schema_version = 1)
);
INSERT INTO reborn_schema (singleton, product, schema_version)
VALUES (true, 'keida-hub-reborn', 1);
