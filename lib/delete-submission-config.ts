export interface DeleteSubmissionFunctionConfig {
  deleteKey: string;
  supabaseUrl: string;
  serviceRoleKey: string;
}

type ReadEnv = (name: string) => string | undefined;

export function resolveDeleteSubmissionFunctionConfig(
  readEnv: ReadEnv
): DeleteSubmissionFunctionConfig | null {
  const deleteKey = readEnv("DELETE_KEY");
  const supabaseUrl =
    readEnv("FUNCTION_SUPABASE_URL") ?? readEnv("SUPABASE_URL");
  const serviceRoleKey =
    readEnv("FUNCTION_SERVICE_ROLE_KEY") ??
    readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!deleteKey || !supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return {
    deleteKey,
    supabaseUrl,
    serviceRoleKey,
  };
}
