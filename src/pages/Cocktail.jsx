import axios from "axios"
import { useLoaderData, Link } from "react-router-dom"
import Wrapper from '../assets/wrappers/CocktailPage'

const singleCocktailUrl =
  'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

  export const loader = async ({
    
  })

const Cocktail = () => {
  const response = axios.get()
  return (
    <div>Cocktail</div>
  )
}
export default Cocktail