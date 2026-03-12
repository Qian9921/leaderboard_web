import test from "node:test";
import assert from "node:assert/strict";

import { resolveDeleteSubmissionFunctionConfig } from "../../lib/delete-submission-config";

test("delete function config accepts the documented Supabase secret names", () => {
  const env = {
    DELETE_KEY: "secret-delete-key",
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  };

  const config = resolveDeleteSubmissionFunctionConfig((name) => env[name as keyof typeof env]);

  assert.deepEqual(config, {
    deleteKey: "secret-delete-key",
    supabaseUrl: "https://example.supabase.co",
    serviceRoleKey: "service-role-key",
  });
});

test("delete function config also accepts function-prefixed secret names", () => {
  const env = {
    DELETE_KEY: "secret-delete-key",
    FUNCTION_SUPABASE_URL: "https://example.supabase.co",
    FUNCTION_SERVICE_ROLE_KEY: "function-service-role-key",
  };

  const config = resolveDeleteSubmissionFunctionConfig((name) => env[name as keyof typeof env]);

  assert.deepEqual(config, {
    deleteKey: "secret-delete-key",
    supabaseUrl: "https://example.supabase.co",
    serviceRoleKey: "function-service-role-key",
  });
});

test("delete function config prefers function-prefixed names when both are present", () => {
  const env = {
    DELETE_KEY: "secret-delete-key",
    FUNCTION_SUPABASE_URL: "https://preferred.supabase.co",
    SUPABASE_URL: "https://fallback.supabase.co",
    FUNCTION_SERVICE_ROLE_KEY: "preferred-service-role-key",
    SUPABASE_SERVICE_ROLE_KEY: "fallback-service-role-key",
  };

  const config = resolveDeleteSubmissionFunctionConfig((name) => env[name as keyof typeof env]);

  assert.deepEqual(config, {
    deleteKey: "secret-delete-key",
    supabaseUrl: "https://preferred.supabase.co",
    serviceRoleKey: "preferred-service-role-key",
  });
});

test("delete function config returns null when required secrets are missing", () => {
  const env = {
    DELETE_KEY: "secret-delete-key",
    SUPABASE_URL: "https://example.supabase.co",
  };

  const config = resolveDeleteSubmissionFunctionConfig((name) => env[name as keyof typeof env]);

  assert.equal(config, null);
});
