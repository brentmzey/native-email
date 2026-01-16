# Desktop & Mobile App

This is the **Tauri v2** application that provides the desktop and mobile interfaces for Native Email.

## Structure

```
desktop/
├── src/                    # React frontend
│   ├── App.tsx            # Main email UI component
│   ├── index.css          # Apple-style design system
│   ├── main.tsx           # React entry point
│   └── assets/            # Static assets
├── src-tauri/             # Rust backend
│   ├── src/
│   │   └── lib.rs         # Tauri commands (bridges Rust ↔ React)
│   ├── gen/               # Generated mobile projects
│   │   ├── android/       # Android Studio project
│   │   └── ios/           # Xcode project
│   ├── tauri.conf.json    # Tauri configuration
│   ├── build.rs           # Build script
│   └── Cargo.toml
├── package.json
├── vite.config.ts         # Vite bundler config
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
└── postcss.config.js      # PostCSS config
```

## Commands

### Development

```bash
# Desktop development with hot reload
npm run tauri dev

# Android development
npm run tauri android dev

# iOS development (macOS only)
npm run tauri ios dev
```

### Building

```bash
# Build React frontend only
npm run build

# Build desktop app (installer)
npm run tauri build

# Build Android APK/AAB
npm run tauri android build

# Build iOS IPA
npm run tauri ios build
```

### Mobile Setup

```bash
# Initialize Android project
npm run tauri android init

# Initialize iOS project (macOS only)
npm run tauri ios init
```

## Adding Tauri Commands

To expose Rust functionality to React:

1. **Define command in `src-tauri/src/lib.rs`**:

```rust
#[tauri::command]
async fn my_command(param: String) -> Result<String, String> {
    // Use email-core functions here
    Ok(format!("Processed: {}", param))
}
```

2. **Register command**:

```rust
.invoke_handler(tauri::generate_handler![
    greet,
    run_core_task,
    get_inbox,
    my_command  // Add here
])
```

3. **Call from React**:

```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke("my_command", { param: "test" });
```

## Styling

This app uses **Tailwind CSS v4** with a custom Apple-inspired design system.

### Design Tokens

Defined in `src/index.css`:

```css
:root {
  --system-background: #ffffff;
  --system-grouped-background: #f2f2f7;
  --system-separator: #c6c6c8;
}

@media (prefers-color-scheme: dark) {
  :root {
    --system-background: #000000;
    --system-grouped-background: #1c1c1e;
    --system-separator: #38383a;
  }
}
```

### Tailwind Classes

Use system colors and utilities:

```tsx
<div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
    Primary Action
  </button>
</div>
```

### UI Components

Key design patterns used:

- **Glassmorphism**: `backdrop-blur-xl bg-white/60 dark:bg-gray-900/60`
- **Gradients**: `bg-gradient-to-r from-blue-500 to-purple-600`
- **Shadows**: `shadow-lg hover:shadow-xl`
- **Animations**: `transition-all duration-200 transform hover:scale-[1.02]`
- **Rounded corners**: `rounded-xl` (12px), `rounded-2xl` (16px)

## Mobile-Specific Notes

### Android

- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **Permissions**: Defined in `src-tauri/gen/android/app/src/main/AndroidManifest.xml`

To test on a physical device:
1. Enable Developer Mode on your Android device
2. Enable USB Debugging
3. Connect via USB
4. Run `npm run tauri android dev`

### iOS

- **Minimum iOS**: 14.0
- **Requires**: macOS with Xcode
- **Signing**: Configure in Xcode (`src-tauri/gen/ios/`)

To test on a physical device:
1. Open Xcode project: `open src-tauri/gen/ios/desktop.xcodeproj`
2. Select your device
3. Configure signing & capabilities
4. Build and run

## Troubleshooting

### "NDK not found" (Android)

The NDK should be installed automatically. If you see this error:

```bash
# Manually install NDK
/Users/YOUR_USER/Library/Android/sdk/cmdline-tools/bin/sdkmanager \
  --sdk_root=/Users/YOUR_USER/Library/Android/sdk "ndk;27.0.12077973"
```

### "Command line tools not found"

Install from Android Studio:
1. Open Android Studio
2. Settings → Appearance & Behavior → System Settings → Android SDK
3. SDK Tools tab
4. Check "Android SDK Command-line Tools"
5. Apply

### "Xcode not found" (iOS)

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Accept Xcode license
sudo xcodebuild -license accept
```

### TypeScript errors after changes

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Performance

- **Bundle Size**: ~207KB (gzipped: ~64KB)
- **Startup Time**: < 1 second
- **Memory Usage**: ~50MB (idle)

## Resources

- [Tauri Docs](https://tauri.app/v2/guides/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Docs](https://vite.dev/)
