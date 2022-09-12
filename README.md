# mobile.dev Bitrise Step

Upload your app to mobile.dev for analysis.

# Android

```yaml
- git::https://github.com/mobile-dev-inc/step-upload.git@1.0.1:
    inputs:
      - api_key: "$MOBILE_DEV_API_KEY"
      - app_file: "$BITRISE_APK_PATH"
```

`app-file` should point to an x86 compatible APK file

### Proguard Deobfuscation

Include the Proguard mapping file to deobfuscate Android performance traces:

```yaml
- git::https://github.com/mobile-dev-inc/step-upload.git@1.0.1:
    inputs:
      - api_key: "$MOBILE_DEV_API_KEY"
      - app_file: "$BITRISE_APK_PATH"
      - mapping_file: "$BITRISE_MAPPING_PATH"
```

# iOS

```yaml
- git::https://github.com/mobile-dev-inc/step-upload.git@1.0.1:
    inputs:
      - api_key: "$MOBILE_DEV_API_KEY"
      - app_file: "$BITRISE_APP_DIR_PATH"
```

`app-file` should point to an x86 compatible Simulator .app directory.
