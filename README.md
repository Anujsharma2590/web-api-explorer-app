# Web API Explorer App

This is the **Web API Explorer App**, a React-based application that allows users to explore various APIs provided by different providers. The app lists APIs in an accordion-style interface, enabling users to browse APIs from multiple providers, view detailed information about each API, and navigate to specific API documentation.

The project is built using **React**, **React Router**, **styled-components**, and **TypeScript** with **Webpack** as the module bundler.

---

## Live Demo

You can access the deployed version of the project here:  
[Web API Explorer App](https://stupendous-lolly-1b8128.netlify.app/)

---

## Features

- View and explore multiple APIs from different providers.
- Accordion-style UI to expand and collapse the list of APIs.
- Navigate to detailed API information.
- Markdown rendering for API descriptions with syntax highlighting.
- Styled using **styled-components** for a clean, modern UI.
- Deployed on **Netlify** for easy access.

---

## Getting Started

Follow the instructions below to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16+ recommended)  
- **npm** (comes with Node.js)

---

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Anujsharma2590/web-api-explorer-app.git
   cd web-api-explorer-app


## Project Structure
web-api-explorer-app/ │ ├── public/ # Contains the index.html template ├── src/ # Contains source code │ ├── components/ # Reusable React components │ ├── pages/ # Pages like Home and APIDetailsPage │ ├── services/ # API service to fetch data from providers │ ├── types/ # TypeScript type definitions │ ├── App.tsx # Main app component │ └── index.tsx # Entry point for React app │ ├── .gitignore # Files and directories to ignore in Git ├── package.json # Project metadata and dependencies ├── webpack.config.js # Webpack configuration └── README.md # Documentation for the project
