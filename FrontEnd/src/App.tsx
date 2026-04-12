import { Navigate, Route, Routes } from 'react-router-dom';
import { Main } from './components/main/Main';
import Login from './app/auth/login/Login';
import HomeExamples from './components/examples/Home';
import IssueList from './components/issue-list/IssueList';
import { APP_ROUTING_PATHS } from './app/constants';
import './App.scss';
import { Auth } from './app/auth/Auth';
import { ProtectedLoginRoute } from './app/guards/ProtectedLoginRoute';
import { ProtectedInnerAppRoute } from './app/guards/ProtectedInnerAppRoute';

function App() {
  return (
    <div className="App">
      <Auth>
        <Routes>
          <Route path={APP_ROUTING_PATHS.AUTH} >
            <Route path={APP_ROUTING_PATHS.LOGIN} element={
              <ProtectedLoginRoute>
                <Login />
              </ProtectedLoginRoute>
            } />
            <Route
              path={APP_ROUTING_PATHS.AUTH}
              element={<Navigate to={`${APP_ROUTING_PATHS.LOGIN}`} replace />}
            />
          </Route>
          <Route
            path={APP_ROUTING_PATHS.HOME}
            element={
              <ProtectedInnerAppRoute>
                <Main />
              </ProtectedInnerAppRoute>
            }
          >
            <Route path={APP_ROUTING_PATHS.HOME} element={<HomeExamples />} />
            <Route path={APP_ROUTING_PATHS.ISSUES} element={<IssueList />} />
          </Route>
          <Route
            path="/"
            element={
              <Navigate to={`${APP_ROUTING_PATHS.HOME}/${APP_ROUTING_PATHS.ISSUES}`} replace />
            }
          />
        </Routes>
      </Auth>
    </div>
  );
}

export default App;
