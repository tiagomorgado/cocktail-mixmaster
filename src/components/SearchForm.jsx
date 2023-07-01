import Wrapper from "../assets/wrappers/SearchForm"
import { Form, useNavigation } from "react-router-dom"

const SearchForm = () => {
  return (
    <Wrapper>
      <Form className='form'>
        <input type="search" name="" id="" placeholder='look for a cocktail'/>
      </Form>
    </Wrapper>
   

  )
}
export default SearchForm