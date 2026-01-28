import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Home from './pages/Home'; // adjust 
// path as needed
import Signup from "./components/Signup";
import MyContributor from "./pages/MyContributor";
import Myresultpage from "./pages/Myresultpage";
import ProfilePage from "./pages/ProfilePage";

// protected route
function RequiredAuth({children}){
  const isLogin = Boolean(localStorage.getItem('authToken'));
  const location = useLocation();

  if(!isLogin){
  return <Navigate to="/login" state={{from:location}} replace></Navigate>
}
return children;
}



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/contributor" element={<MyContributor/>} />
      <Route path="/result" element={
        <RequiredAuth>
        <Myresultpage></Myresultpage>
        </RequiredAuth>
      } />
      <Route
  path="/profile"
  element={
    <RequiredAuth>
      <ProfilePage />
    </RequiredAuth>
  }
/>
    </Routes>
  );
};

export default App;
