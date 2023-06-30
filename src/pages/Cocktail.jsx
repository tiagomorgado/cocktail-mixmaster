import axios from "axios"
import { useLoaderData, Link } from "react-router-dom"
import Wrapper from '../assets/wrappers/CocktailPage'

const singleCocktailUrl =
  'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

  export const loader = async ({params}) => {
    const {id} = params
    const {data} = await axios.get(`${singleCocktailUrl}${id}`)
    return {id, data}
  }

const Cocktail = () => {
  const {id, data} = useLoaderData()
  const response = axios.get()
  return (
    <div>Cocktail</div>
  )
}
export default Cocktail