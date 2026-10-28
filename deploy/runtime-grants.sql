-- Run by the isolated database/migration owner after migration/restore.
-- reborn_app cannot migrate, edit the ledger or change schema admission.
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO reborn_app;
GRANT SELECT ON reborn_schema, _sqlx_migrations TO reborn_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON users, sessions, auth_state,
    auth_throttles, workspace_notes, crafty_connection,
    directory_state, directory_services, directory_pins TO reborn_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO reborn_app;
-- Events are append-only for the ordinary runtime role.
GRANT SELECT, INSERT ON activity_events TO reborn_app;
-- Read watermarks can advance; the runtime cannot erase delivery groups.
GRANT SELECT, INSERT, UPDATE ON notification_groups TO reborn_app;

-- Personal layouts can be replaced but never erased by the runtime role.
GRANT SELECT, INSERT, UPDATE ON dashboard_layouts TO reborn_app;

-- Observation metadata is immutable. Only its bounded retention may erase old
-- batches; dependent rows are removed by that table's own foreign-key cascade.
GRANT SELECT, INSERT, DELETE ON provider_observations TO reborn_app;
GRANT SELECT, INSERT ON provider_server_observations TO reborn_app;

-- Only the migration owner creates the two fixed provider rows. Media keys and
-- revisions may be replaced, but runtime cannot erase/insert or rename providers.
GRANT SELECT ON media_connections TO reborn_app;
GRANT UPDATE (revision, sealed) ON media_connections TO reborn_app;

-- Queue enrollment has a separate fixed provider set. Runtime may replace only
-- revision/sealed columns, never create, erase or rename queue provider rows.
GRANT SELECT ON queue_connections TO reborn_app;
GRANT UPDATE (revision, sealed) ON queue_connections TO reborn_app;
