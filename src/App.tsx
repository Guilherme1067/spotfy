import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Artists } from './components/artists';
import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { ArtistDetails } from './components/artistDetails';
import { queryClient } from './lib/react-query';
import { Suspense } from 'react';
import { Loading } from './components/loading';



function App() {
  return (

    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Artists />} />
            <Route path="/artist/:artistId" element={<ArtistDetails />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
