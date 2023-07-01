import Wrapper from "../assets/wrappers/SearchForm"
import { Form, useNavigation } from "react-router-dom"

const SearchForm = () => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  return (
    <Wrapper>
      <Form className='form'>
        <input 
          type="search" 
          name="search" 
          className='form-input' 
          placeholder='Search for a cocktail' 
          defaultValue='vodka'
        />
        <button type='submit' className='btn' disabled={isSubmitting}>
          {isSubmitting ? 'searching...' : 'search'}
        </button>
      </Form>
    </Wrapper>
   

  )
}
export default SearchForm