# ClothingViewer - React and ComfyUI Integration Experiment

**Note: This project is an experiment**

ClothingViewer is an experimental project developed with the specific goal of exploring and demonstrating the possibilities of integration between a React application and the ComfyUI API. This is not a finished product or intended for production use, but rather a proof of concept to test the viability and potential of this integration.

## Experiment Objective

The main objectives of this project are:

1. To demonstrate how a React application can interact with the ComfyUI API in real-time.
2. To explore the potential of generating customized clothing images using AI.
3. To test the effectiveness of WebSocket communication for real-time image processing.
4. To serve as a foundation for future explorations and developments in the field of AI applied to fashion and clothing design.

## Description

This experiment implements an interactive user interface that allows users to create visualizations of customized clothing. The application interacts with ComfyUI through its API to process images and generate new clothing visualizations using AI techniques.

## Features

- Interactive user interface for selecting and uploading reference images
- Options to generate full-body clothing or separate top and bottom pieces
- Selection of specific clothing types (e.g., dress, t-shirt, pants)
- Choice of clothing sizes
- Image generation based on textual descriptions and reference images
- Real-time visualization of generated images
- Integration with ComfyUI API via WebSocket for real-time processing

## Technologies Used

- React: for building the user interface
- Tailwind CSS: for styling
- Vite: as the build tool
- react-select: for custom select components
- react-icons: for icons
- WebSocket: for real-time communication with the ComfyUI server
- Fetch API: for HTTP requests and loading JSON files
- ComfyUI: as the backend for image processing and AI generation

### Description of main components:

- `public/workflows/`: Contains JSON files that define ComfyUI workflows.
- `src/`: Main source code directory.
  - `pages/home/`: Contains the main component of the home page.
  - `BrowserComfyUIClient.js`: Client for interacting with the ComfyUI API.
  - `main.jsx`: Entry point of the React application.
- `index.html`: Main HTML file.
- `vite.config.js`: Vite configuration (build tool).
- `tailwind.config.js`: Tailwind CSS configuration.
- `postcss.config.js`: PostCSS configuration.

## Installation

```bash
# Clone the repository
git clone https://github.com/alisson-anjos/ClothingViewer.git

# Enter the project directory
cd ClothingViewer

# Install dependencies
npm install
```

## Configuration

1. Make sure the ComfyUI server is running and accessible.
2. Adjust the server address and clientId in the `src/pages/home/index.jsx` file if necessary:
   ```javascript
   const serverAddress = "https://94.63.225.14:8189";
   const clientId = "baadbabe-b00b-4206-9420-deadd00d1337";
   ```
3. Verify that the workflow files (`workflow_1_cloth.json`, `workflow_2_clothes.json`, etc.) are in the `public/workflows/` folder.

## Usage

1. Start the development server:
   ```
   npm run dev
   ```
2. Open the browser and access `http://localhost:5173` (or the port indicated in the console).
3. In the interface:
   - Choose between generating a full-body piece or two separate pieces
   - Upload a reference image for the face
   - Upload reference images for the clothes
   - Select the type of clothing and desired size
   - Click "Generate" to create new clothing visualizations

## Application Workflow

1. The user selects options and uploads reference images.
2. When clicking "Generate", the images are sent to the ComfyUI server.
3. The appropriate workflow (full body or two pieces) is selected and executed in ComfyUI.
4. The application receives the generated images via WebSocket and displays them in the interface.
5. The user can view the generated images and select to see them in a larger size.

## Limitations and Considerations

As this is an experimental project:

- It may contain bugs or unexpected behaviors.
- It is not optimized for performance or scalability.
- Security was not a priority and should not be used in a production environment without proper review.
- Results may vary, and the quality of generated images depends greatly on the models and training data used in ComfyUI.
