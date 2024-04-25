import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';

import Spots from './components/Spots';
import OneSpot from './components/OneSpot';
import CreateSpotForm from './components/CreateSpotForm';
import ManageSpots from './components/ManageSpots';
import UpdateSpotForm from './components/UpdateSpotForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots/>
      },
      {
        path: '/:spotId',
        element: <OneSpot/>
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm/>
      },
      {
        path: '/manage-spots',
        element: <ManageSpots/>
      },
      {
        path: '/:spotId/update',
        element: <UpdateSpotForm/>
      }
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
