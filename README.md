# Google Ads Preview Simulator

A web-based platform that allows marketers and developers to input headlines, descriptions, and Google assets (images, logos, videos) and see a live preview of how a Google Ads advertisement will appear across different formats.

---

## Table of Contents

* [Features](#features)
* [Demo](#demo)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Customization](#customization)
* [Future Improvements](#future-improvements)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **Live Preview**: Simulate how your Google Ads will render on desktop and mobile.
* **Headline & Description Input**: Add up to three headlines and two descriptions, with real-time validation.
* **Asset Management**: Upload or link to images, logos, and videos supported by Google Ads.
* **Responsive Layouts**: Preview in different ad formats (search, display, responsive).
* **Validation Rules**: Enforce character limits and formatting rules for each ad component.
* **Export & Share**: Download a snapshot of the ad preview or share a public URL.

---

## Demo

Add a link to a live demo or include GIFs/Screenshots. For example:

![Example Preview](docs/screenshot.png)

---

## Tech Stack

* **Frontend**: React, TypeScript, Tailwind CSS
* **Backend**: Node.js, Express
* **Storage**: MongoDB (for asset metadata), AWS S3 (for asset storage)
* **Deployment**: Docker, Kubernetes, GitHub Actions CI/CD

---

## Prerequisites

* Node.js (v14 or newer)
* npm or Yarn
* Docker (for containerized setup)
* AWS account (for S3 credentials)

---

## Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/your-username/google-ads-preview-simulator.git
   cd google-ads-preview-simulator
   ```

2. **Install dependencies**

   ```sh
   # Using npm
   npm install

   # Or using Yarn
   yarn install
   ```

3. **Set up environment variables**
   Copy the `.env.example` file and configure the following values:

   ```text
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ads-preview
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_S3_BUCKET=your-s3-bucket-name
   ```

4. **Run the application**

   ```sh
   # Start backend
   npm run start:server

   # Start frontend
   npm run start:client
   ```

5. Visit `http://localhost:3000` in your browser to get started.

---

## Configuration

* **Character Limits**: Customize limits for headlines and descriptions in `config/validation.js`.
* **Asset Sizes**: Define allowed width/height/aspect ratios in `config/assets.js`.
* **Preview Themes**: Tweak CSS variables in `src/styles/theme.css`.

---

## Usage

1. Navigate to the Preview page.
2. Enter up to three headlines (max 30 characters each).
3. Enter up to two descriptions (max 90 characters each).
4. Upload or paste URLs for your image, logo, or video assets.
5. View the live ad preview on desktop and mobile tabs.
6. Download the preview or copy the shareable link.

---

## Customization

* **Add New Formats**: Extend support for additional Google Ads formats by adding templates to `src/components/previews/`.
* **Localization**: Implement multi-language support by integrating `i18next`.
* **Theming**: Enable dark mode by updating CSS variables.

---

## Future Improvements

* A/B Test Simulation: Compare multiple ad variations side-by-side.
* Analytics Dashboard: Track views and interactions on shared previews.
* Team Collaboration: Allow multiple users to edit and comment on ad drafts.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeatureName`.
3. Make your changes and commit: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature/YourFeatureName`.
5. Open a Pull Request.

Please read our [CODE\_OF\_CONDUCT.md](CODE_OF_CONDUCT.md) and [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## License

This project is licensed under the [MIT License](LICENSE).
