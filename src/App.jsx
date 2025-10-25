import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
//test

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;