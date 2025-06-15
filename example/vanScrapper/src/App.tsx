import { useState } from 'react';
import { getAllVanInfo } from './api';

function App() {
  const [data, setData] = useState<unknown>(null);

  const search = async () => {
    const res = await getAllVanInfo();
    setData(res.data);
  };

  return (
    <div>
      <button onClick={search}>Rechercher un van</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default App;
