import { Layout } from './components/Layout/Layout';
import { About } from './components/About/About';
import { Map } from './components/Map/Map';

function App() {
  return (
    <Layout>
      <div className="h-[calc(100vh-10rem)]">
        <Map />
      </div>
      <About />
    </Layout>
  );
}

export default App;