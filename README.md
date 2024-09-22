
# WebRTC PeerJS Video Conferencing

![Status](https://img.shields.io/badge/status-active-brightgreen)
![WebRTC](https://img.shields.io/badge/WebRTC-enabled-blue)

A real-time video conferencing app built using **WebRTC** and **PeerJS**. This application allows a single producer to stream video/audio to multiple participants using peer-to-peer (P2P) connections with simple UI controls. The project is part of Week 23 of the **100xDevs Cohort 2.0**, led by **Harkirat Singh**.

## Features
- **Real-Time Communication**: Supports seamless two-way video and audio communication.
- **Multiple Participants**: The producer can stream media to multiple peers.
- **Peer-to-Peer (P2P) Architecture**: Uses PeerJS for establishing WebRTC connections between participants.
- **Responsive UI**: Simple and minimal user interface, with controls to mute/unmute audio and start/stop video.
- **Error Handling**: Handles connection and media device errors gracefully.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/swamibuddhachaitanya/webrtc-peerjs-video-conferencing.git
   cd webrtc-peerjs-video-conferencing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The application will run on `http://localhost:5173`.

4. **Run the backend server:**
   The PeerJS signaling server is part of the backend, which is crucial for connecting participants. Use the following commands:

   ```bash
   cd backend
   npm install
   npm run start
   ```

   The backend will be hosted at `http://localhost:9000`.

## Usage

1. **Start the server:**
   Ensure that both the frontend and backend servers are running locally on your machine.

2. **Join the Conference:**
   Open the application in a browser, log in, and start the video conference. A producer can stream to multiple participants. The participants can join by connecting to the room.

3. **Control the Stream:**
   - Use the **Mute Audio** / **Unmute Audio** buttons to toggle your microphone.
   - Use the **Start Video** / **Stop Video** buttons to control your camera.

## Technologies Used

- **Frontend**: React (with TypeScript)
- **Backend**: Node.js, Express, PeerJS
- **Real-Time Communication**: WebRTC
- **UI Design**: Custom CSS for minimal, clean design

## Learning Outcomes

Through this project, I gained experience with:
- **WebRTC**: Understanding how real-time video and audio communication works in the browser.
- **PeerJS**: Using PeerJS to manage P2P connections between multiple participants.
- **Media Handling**: Working with media devices (camera/microphone), stream controls, and error handling.
- **Building Minimal UI**: Crafting a responsive UI that balances usability and simplicity.

## Contributing

Feel free to fork this repository, create a branch, and submit a pull request. We welcome contributions that enhance the functionality, performance, or design of the app.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push the branch (`git push origin feature-branch`)
5. Open a pull request

## Acknowledgments

Special thanks to **Harkirat Singh** and the **100xDevs Cohort 2.0** community for their support and guidance throughout this project.
