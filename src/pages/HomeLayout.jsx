import { Outlet } from 'react-router-dom'

const HomeLayout = () => {
  return (
    <div>
      <h1>Navbar</h1>
      <Outlet/>
      <footer>Footer</footer>
    </div>
  )
}
export default HomeLayout