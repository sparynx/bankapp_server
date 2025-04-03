import React from 'react'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import { MantineProvider } from '@mantine/core';

import router from './router/router.jsx'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme="dark">
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </MantineProvider>
)
