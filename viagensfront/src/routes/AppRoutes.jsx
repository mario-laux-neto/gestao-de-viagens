import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { Home } from '../features/roteiros/Home';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* O AppLayout envolve as rotas que precisam do menu superior */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
