import ApiClient from './ApiClient'
import { getParameters } from './params';
import path from 'path';
import { exec } from 'child_process';

async function asyncExec(command: string) {
  return new Promise<void>(function(resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      console.error(stderr)
      console.log(stdout)
      resolve();
    });
  });
}

async function zipDir(dir: string, output: string) {
  const name = path.basename(dir)
  const parent = path.join(dir, '..')
  await asyncExec(`cd "${parent}" && zip -r "${output}" "${name}"`)
}

async function run() {
  const {
    apiKey,
    apiUrl,
    name,
    appFile,
    mappingFile,
    branchName,
    repoOwner,
    repoName,
    pullRequestId
  } = await getParameters()

  const client = new ApiClient(apiKey, apiUrl)

  if (appFile.type === 'ANDROID_APK') {
    const { id: appId } = await client.uploadApp(appFile.path, 'apk');
    if (mappingFile) await client.uploadMapping(mappingFile, appId)
    await client.createAnalysisRequest({
      benchmarkName: name,
      apkId: appId,
      branch: branchName,
      repoOwner: repoOwner,
      repoName: repoName,
      pullRequestId: pullRequestId
    })
  } else if (appFile.type === 'IOS_APP_ZIP' || appFile.type === 'IOS_APP_DIR') {
    let appFilePath = appFile.path
    if (appFile.type === 'IOS_APP_DIR') {
      await zipDir(appFile.path, '/tmp/app.zip')
      appFilePath = '/tmp/app.zip'
    }
    const { id: appId } = await client.uploadApp(appFilePath, 'iosAppBinary');
    const response = await client.createAnalysisRequest({
      benchmarkName: name,
      iosAppBinaryId: appId,
      branch: branchName,
      repoOwner: repoOwner,
      repoName: repoName,
      pullRequestId: pullRequestId
    })
    console.log(response)
  } else {
    throw new Error(`Unsupported app file type: ${appFile.type}`)
  }
}

run().catch(e => {
  console.error(`Error running mobile.dev Upload Action: ${e.message}`)
  process.exit(1)
})