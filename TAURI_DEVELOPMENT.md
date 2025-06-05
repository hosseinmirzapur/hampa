# Tauri Development Guide for Hampa Running Companion

This document provides instructions for developing and building the Hampa Running Companion desktop application using Tauri.

## 1. Prerequisites

Before you can develop or build the Tauri application, you need to install system dependencies. Please follow the official Tauri guide for your operating system:

[https://tauri.app/v1/guides/getting-started/prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

In summary, you'll generally need:
- **Rust and Cargo:** Tauri's backend is written in Rust.
- **Node.js and bun:** For managing the frontend and running scripts. (bun is used in this project)
- **Platform-specific build tools:**
    - **Linux:** `webkit2gtk` (for the WebView), `AppIndicator` or `ayatana-appindicator` (for system tray), and other common build tools (`gcc`, `g++`, `make`, etc.).
    - **macOS:** Xcode Command Line Tools.
    - **Windows:** Microsoft Visual Studio C++ Build Tools (ensure "Desktop development with C++" is selected). WebView2 is usually pre-installed on modern Windows, but Tauri can bundle it if needed.

## 2. Project Structure for Tauri

- **`src-tauri/`**: This directory contains all the Rust code for the Tauri application shell, configurations, icons, and platform-specific resources.
    - **`tauri.conf.json`**: The main configuration file for your Tauri application. Here you define aspects like the application identifier, window properties, security settings (CSP, allowlist), and build configurations.
    - **`src/main.rs`**: The entry point for the Rust application.
    - **`Cargo.toml`**: The Rust package manager file for the Tauri backend.
    - **`icons/`**: Application icons for different platforms.
- **`package.json` (root)**: Contains scripts for developing and building the Tauri application.
- **`dist/`**: The directory where the frontend (Vite) build output is generated. This is what Tauri bundles into the desktop app.

## 3. Development Mode

To run the application in development mode:

1.  **Ensure your backend is running:** The Tauri app will communicate with your NestJS backend (usually on `http://localhost:3000`). Start it if it's not already running (e.g., using its own `bun run dev` or similar command in the `backend/` directory).
2.  **Start the Tauri development process:**
    Open your terminal in the root of the project and run:
    ```bash
    bun run dev:tauri
    ```
    This command will:
    - Start the frontend development server (Vite, serving from `http://localhost:5173`).
    - Launch the Tauri application window, which will load the content from the Vite dev server.
    - Enable hot reloading for both the frontend and, to some extent, the Rust backend (rebuilds on Rust code change).

## 4. Building for Production

To build the application for production:

1.  **Ensure your backend will be accessible:** For a real deployment, your backend API needs to be accessible from where the user runs the desktop app. This might involve deploying your backend to a server or considering bundling a local version (more advanced). For now, ensure it's running and accessible during the build if any build-time checks are made, and definitely when the user runs the app.
2.  **Run the build command:**
    Open your terminal in the root of the project and run:
    ```bash
    bun run build:tauri
    ```
    This command will:
    - First, build the frontend application using `bun run build` (which runs `vite build`), placing the static assets in the `dist/` directory.
    - Then, compile the Rust backend and bundle the frontend assets into a native desktop application for your current platform. The resulting installers or executables will be located in `src-tauri/target/release/bundle/`.

## 5. Debugging

-   **Frontend (WebView):** Right-click inside the Tauri app window and select "Inspect Element" (or similar, depending on your OS and if devtools are enabled in `tauri.conf.json` - they usually are for dev builds). This will open the browser's developer tools, allowing you to inspect the DOM, debug JavaScript, view network requests, etc., just like in a regular web browser.
-   **Rust Backend:** Use standard Rust debugging techniques. `println!` macros can be helpful for quick logging, and output will typically appear in the terminal where you ran `bun run dev:tauri`. For more advanced debugging, you might need to configure your IDE for Rust debugging.
-   **Tauri Logs:** Check `src-tauri/logs/` if you've enabled logging there or if issues occur during the build or runtime.

## 6. Important Configuration Files

-   **`src-tauri/tauri.conf.json`**:
    -   `build.devPath`: URL of your frontend dev server.
    -   `build.distDir`: Path to your built frontend assets (relative to `src-tauri/`).
    -   `identifier`: Unique bundle identifier for your app.
    -   `app.security.csp`: Content Security Policy to protect your app. Ensure it allows connections to your backend.
    -   `app.security.allowlist`: Defines which Tauri APIs your frontend can access. Keep this scoped to only what's necessary.
-   **`package.json` (root)**: Contains the `dev:tauri` and `build:tauri` scripts.

## 7. Interacting with the Backend

The frontend within Tauri will continue to interact with your NestJS backend via HTTP/GraphQL requests (e.g., using Apollo Client or `fetch`) to `http://localhost:3000` (or your configured backend URL). Ensure the `tauri.conf.json` CSP and HTTP allowlist scope permit these requests.

Happy Coding!
