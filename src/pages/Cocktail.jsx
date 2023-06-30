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
  const singleDrink = data.drinks[0]

  const {
    strDrink:name, 
    strDrinkThumb:image,
    strAlcoholic:info,
    strCategory:category,
    strGlass:glass,
    strINstructions:instructions
  } = singleDrink
  return (
    <Wrapper>
      <header>
        <Link to='/' className='btn'>
          Back Home
        </Link>
        <h3>{name}</h3>
      </header>
      <div className='drink'>
        <img src={image} alt={name} />
      </div>
    </Wrapper>
  )
}
export default Cocktail