import { BrowserRouter , Route , Routes } from "react-router-dom"
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/signin" element={<SignIn/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/dashboard" element={<DashBoard/>} />
      <Route path="/send" element={<Send/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
