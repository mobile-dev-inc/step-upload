import StreamZip from 'node-stream-zip';
import path from 'path';
import fs from 'fs';

export type AppFileType = 'ANDROID_APK' | 'IOS_APP_ZIP' | 'IOS_APP_DIR'
export type AppFile = {
  type: AppFileType,
  path: string,
}

function getAbsolutePath(filePath: string): string {
  const workDir = process.env['GITHUB_WORKSPACE'] || ''
  return path.resolve(workDir, filePath)
}

async function getAppFileType(appFile: string): Promise<AppFileType | null> {
  try {
    if (fs.lstatSync(appFile).isDirectory()) {
      const infoPlistPath = path.join(appFile, 'Info.plist')
      if (!fs.existsSync(infoPlistPath)) {
        return null;
      } else {
        return 'IOS_APP_DIR';
      }
    } else {
      const zip = new StreamZip.async({ file: appFile });
      const entries = await zip.entries()
      if ('AndroidManifest.xml' in entries) {
        return 'ANDROID_APK'
      } else if (Object.keys(entries).find(name => name.includes('Info.plist'))) {
        return 'IOS_APP_ZIP'
      } else {
        return null
      }
    }
  } catch (e) {
    return null
  }
}

function validateAbsolutePath(path: string): string {
  const absolutePath = getAbsolutePath(path)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File does not exist: ${absolutePath}`)
  }
  return absolutePath
}

export function validateMappingFile(path: string): string {
  return validateAbsolutePath(path)
}

export async function validateAppFile(path: string): Promise<AppFile> {
  const absolutePath = getAbsolutePath(path)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File does not exist: ${absolutePath}`)
  }

  const type = await getAppFileType(path)
  if (!type) {
    throw new Error(`Unsupported file format: ${path}`)
  }

  return {
    type: type,
    path: absolutePath,
  };
}
