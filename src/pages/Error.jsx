import Wrapper from '../assets/wrappers/ErrorPage'
import { Link, useRouteError } from 'react-router-dom'
import img from '../assets/not-found.svg'

const Error = () => {
  const error = useRouteError()

  if(error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={img} alt='Not Found'></img>
          <h3>Ohh!</h3>
          <p>We can't seem to find the page you are looking for</p>
          <Link to='/'>Back Home</Link>
        </div>
      </Wrapper>
    )
  }
  return (
    <div>Error</div>
  )
}
export default Error