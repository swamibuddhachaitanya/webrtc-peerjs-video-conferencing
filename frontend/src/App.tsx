import { useState } from 'react';
import Login from './components/Login';
import VideoConference from './components/VideoConference';


function App() {
    const [token, setToken] = useState<string | null>(null);

    if (!token) {
        return <Login setToken={setToken} />;
    }

    return <VideoConference token={token} />;
}

export default App;
