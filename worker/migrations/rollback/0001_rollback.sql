-- Rollback: Initial schema
DROP INDEX IF EXISTS idx_assets_project;
DROP TABLE IF EXISTS assets;

DROP INDEX IF EXISTS idx_research_logs_project;
DROP TABLE IF EXISTS research_logs;

DROP INDEX IF EXISTS idx_sources_project;
DROP TABLE IF EXISTS sources;

DROP INDEX IF EXISTS idx_projects_created;
DROP INDEX IF EXISTS idx_projects_user;
DROP TABLE IF EXISTS projects;

DROP INDEX IF EXISTS idx_users_email;
DROP TABLE IF EXISTS users;
