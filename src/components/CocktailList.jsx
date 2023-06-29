import CocktailCard from "./CocktailCard"
import Wrapper from '../assets/wrappers/CocktailList'

const CocktailList = ({drinks}) => {
    if(!drinks) {
        return (
            <h4 style={{textAlign: 'center'}}>
                No matching cocktails found...
            </h4>
        )
    }

    const formattedDrinks = drinks.map((item) => {
        const {idDrink, strDrink, strDrinkThumb, strAlcoholic, strGlass} = item
        return {id:idDrink, name:strDrink, image:strDrinkThumb, info:strAlcoholic, glass:strGlass}
    })
    console.log('formatted', formattedDrinks);
  return (
    <Wrapper>
        {formattedDrinks.map((drink) => {
            return <CocktailCard key={drink.id} {...drink}/>
        })}
    </Wrapper>
    
  )
}
export default CocktailList