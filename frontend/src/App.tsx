import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import HomePage from "@/pages/HomePage";
import ChurchesPage from "@/pages/church/ChurchesPage";
import ChurchDetailPage from "@/pages/church/ChurchDetailPage";
import MinistersPage from "@/pages/ministers/MinistersPage"
import MinisterProfilePage from "@/pages/ministers/MinisterProfilePage"


const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomePage />} />
      <Route path="/churches" element={<ChurchesPage />} />
      <Route path="/churches/:id" element={<ChurchDetailPage />} />
      <Route path="/ministers" element={<MinistersPage />} />
      <Route path="/ministers/:id" element={<MinisterProfilePage />} />

    </Route>
  )
)

function App() {

  return (
    <RouterProvider router={routes} />
  );
}



export default App
