import { NavLink } from "react-router-dom"
import styled from 'styled-components'

const Navbar = () => {
  return (
    <Wrapper>
        <div className="nav-center">
            <span className="logo">MixMaster</span>
            <div className="nav-links">
                <NavLink to='/' className='nav-link'>
                    Home
                </NavLink>
                <NavLink to='/about' className='nav-link'>
                    About
                </NavLink>
                <NavLink to='/newsletter' className='nav-link'>
                    Newsletter
                </NavLink>
            </div>
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
background:red;
`

export default Navbar
