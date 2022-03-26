import { AppFile, validateAppFile, validateMappingFile } from './app_file';

export type Params = {
  apiKey: string,
  apiUrl: string,
  name: string,
  appFile: AppFile
  mappingFile?: string,
  branchName: string
  repoName: string
  repoOwner: string
  pullRequestId?: string
}

function getEnv(name: string): string | undefined {
  return process.env[name]
}

function requireEnv(name: string): string {
  const value = getEnv(name)
  if (!value) throw Error(`Environment variable required: $${name}`)
  return value
}

function getName(): string {
  let message = getEnv('BITRISE_GIT_MESSAGE')
  if (message) return message
  return requireEnv('BITRISE_BUILD_TRIGGER_TIMESTAMP')
}

export async function getParameters(): Promise<Params> {
  const apiUrl = 'https://api.mobile.dev'
  const name = getName()
  const apiKey = requireEnv('api_key')
  const appFileInput = requireEnv('app_file')
  const mappingFileInput = getEnv('mapping_file')
  const mappingFile = mappingFileInput && validateMappingFile(mappingFileInput)
  const appFile = await validateAppFile(appFileInput)
  const branchName = requireEnv('BITRISE_GIT_BRANCH')
  const repoOwner = requireEnv('BITRISEIO_GIT_REPOSITORY_OWNER');
  const repoName = requireEnv('BITRISEIO_GIT_REPOSITORY_SLUG');
  const pullRequestId = getEnv('BITRISE_PULL_REQUEST')
  return { apiUrl, name, apiKey, appFile, mappingFile, branchName, repoOwner, repoName, pullRequestId }
}
