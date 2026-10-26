-- Run by the isolated database/migration owner after migration/restore.
-- reborn_app cannot migrate, edit the ledger or change schema admission.
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO reborn_app;
GRANT SELECT ON reborn_schema, _sqlx_migrations TO reborn_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON users, sessions, auth_state,
    auth_throttles, workspace_notes, crafty_connection,
    directory_state, directory_services, directory_pins TO reborn_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO reborn_app;
