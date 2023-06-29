

#### Fetch

- useEffect approach

Landing.jsx

```js
const fetchSomething = async () => {
  try {
    const response = await axios.get('/someUrl');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchSomething();
}, []);
```

#### Loader

Each route can define a "loader" function to provide data to the route element before it renders.

- must return something even "null" otherwise error

Landing.jsx

```js
import { useLoaderData } from 'react-router-dom';

export const loader = async () => {
  return 'something';
};

const Landing = () => {
  const data = useLoaderData();
  console.log(data);
  return <h1>Landing</h1>;
};
export default Landing;
```

```js
import { loader as landingLoader } from './pages/Landing.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement:<Error/>
    children: [
      {
        index: true,
        loader: landingLoader,
        element: <Landing />,
      },
      // alternative approach
      {
        index: true,
        loader: () => {
          // do stuff here
        },
        element: <Landing />,

      },
      // rest of the routes
    ],
  },
]);
```

#### TheCocktailDB

[API](https://www.thecocktaildb.com/)

- Search cocktail by name
  www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita
- Lookup full cocktail details by id
  www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007

#### Landing - Fetch Drinks

Landing.jsx

```js
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';

const cocktailSearchUrl =
  'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

export const loader = async () => {
  const searchTerm = 'margarita';
  const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`);
  return { drinks: response.data.drinks, searchTerm };
};

const Landing = () => {
  const { searchTerm, drinks } = useLoaderData();
  console.log(drinks);
  return <h1>Landing page</h1>;
};

export default Landing;
```

- empty search term returns some default drinks
- if search term yields not drinks drinks:null

#### More Errors

- bubbles up
- no return from loader
- wrong url

App.jsx

```js
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        loader: landingLoader,
        errorElement: <h2>There was an error...</h2>,
        element: <Landing />,
      },
    ],
  },
]);
```

#### SinglePageError Component

- create pages/SinglePageError.jsx
- export import (index.js)
- use it in App.jsx

```js
import { useRouteError } from 'react-router-dom';
const SinglePageError = () => {
  const error = useRouteError();
  console.log(error);
  return <h2>{error.message}</h2>;
};
export default SinglePageError;
```

#### More Components

- in src/components create SearchForm, CocktailList, CocktailCard
- render SearchForm and CocktailList in Landing
- pass drinks, iterate over and render in CocktailCard

Landing.jsx

```js
const Landing = () => {
  const { searchTerm, drinks } = useLoaderData();

  return (
    <>
      <SearchForm />
      <CocktailList drinks={drinks} />
    </>
  );
};
```

CocktailList.jsx

```jsx
import CocktailCard from './CocktailCard';
import Wrapper from '../assets/wrappers/CocktailList';
const CocktailList = ({ drinks }) => {
  if (!drinks) {
    return (
      <h4 style={{ textAlign: 'center' }}>No matching cocktails found...</h4>
    );
  }

  const formattedDrinks = drinks.map((item) => {
    const { idDrink, strDrink, strDrinkThumb, strAlcoholic, strGlass } = item;
    return {
      id: idDrink,
      name: strDrink,
      image: strDrinkThumb,
      info: strAlcoholic,
      glass: strGlass,
    };
  });
  return (
    <Wrapper>
      {formattedDrinks.map((item) => {
        return <CocktailCard key={item.id} {...item} />;
      })}
    </Wrapper>
  );
};

export default CocktailList;
```

```jsx
import { Link, useOutletContext } from 'react-router-dom';
import Wrapper from '../assets/wrappers/CocktailCard';
const CocktailCard = ({ image, name, id, info, glass }) => {
  // const data = useOutletContext();
  // console.log(data);
  return (
    <Wrapper>
      <div className='img-container'>
        <img src={image} alt={name} className='img' />
      </div>
      <div className='footer'>
        <h4>{name}</h4>
        <h5>{glass}</h5>
        <p>{info}</p>

        <Link to={`/cocktail/${id}`} className='btn'>
          details
        </Link>
      </div>
    </Wrapper>
  );
};

export default CocktailCard;
```

#### CocktailList and CocktailCard CSS (optional)

#### Global Loading and Context

HomeLayout.jsx

```js
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useNavigation } from 'react-router-dom';
const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  const value = 'some value';
  return (
    <>
      <Navbar />
      <section className='page'>
        {isPageLoading ? (
          <div className='loading' />
        ) : (
          <Outlet context={{ value }} />
        )}
      </section>
    </>
  );
};
export default HomeLayout;
```

#### Single Cocktail

App.jsx

```js
import { loader as singleCocktailLoader } from './pages/Cocktail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        path: 'cocktail/:id',
        loader: singleCocktailLoader,
        element: <Cocktail />,
        errorElement: <SinglePageError />,
      },
      // rest of the routes
    ],
  },
]);
```

Cocktail.jsx

```js
const singleCocktailUrl =
  'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
import { useLoaderData, Link } from 'react-router-dom';
import axios from 'axios';

import Wrapper from '../assets/wrappers/CocktailPage';

export const loader = async ({ params }) => {
  const { id } = params;
  const { data } = await axios.get(`${singleCocktailUrl}${id}`);
  return { id, data };
};

const Cocktail = () => {
  const { id, data } = useLoaderData();

  const singleDrink = data.drinks[0];
  const {
    strDrink: name,
    strDrinkThumb: image,
    strAlcoholic: info,
    strCategory: category,
    strGlass: glass,
    strInstructions: instructions,
  } = singleDrink;
  const validIngredients = Object.keys(singleDrink)
    .filter(
      (key) => key.startsWith('strIngredient') && singleDrink[key] !== null
    )
    .map((key) => singleDrink[key]);

  return (
    <Wrapper>
      <header>
        <Link to='/' className='btn'>
          back home
        </Link>
        <h3>{name}</h3>
      </header>
      <div className='drink'>
        <img src={image} alt={name} className='img'></img>
        <div className='drink-info'>
          <p>
            <span className='drink-data'>name :</span> {name}
          </p>
          <p>
            <span className='drink-data'>category :</span> {category}
          </p>
          <p>
            <span className='drink-data'>info :</span> {info}
          </p>
          <p>
            <span className='drink-data'>glass :</span> {glass}
          </p>
          <p>
            <span className='drink-data'>ingredients :</span>
            {validIngredients.map((item, index) => {
              return (
                <span className='ing' key={item}>
                  {item} {index < validIngredients.length - 1 ? ',' : ''}
                </span>
              );
            })}
          </p>
          <p>
            <span className='drink-data'>instructons :</span> {instructions}
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default Cocktail;
```

#### Additional Check

```js
const Cocktail = () => {
  import { Navigate } from 'react-router-dom';
  const { id, data } = useLoaderData();
  // if (!data) return <h2>something went wrong...</h2>;
  if (!data) return <Navigate to='/' />;
  return <Wrapper>....</Wrapper>;
};
```

#### Single Cocktail CSS (optional)

assets/wrappers/CocktailPage.js

```js
import styled from 'styled-components';

const Wrapper = styled.div`
  header {
    text-align: center;
    margin-bottom: 3rem;
    .btn {
      margin-bottom: 1rem;
    }
  }

  .img {
    border-radius: var(--borderRadius);
  }
  .drink-info {
    padding-top: 2rem;
  }

  .drink p {
    font-weight: 700;
    text-transform: capitalize;
    line-height: 2;
    margin-bottom: 1rem;
  }
  .drink-data {
    margin-right: 0.5rem;
    background: var(--primary-300);
    padding: 0.25rem 0.5rem;
    border-radius: var(--borderRadius);
    color: var(--primary-700);
    letter-spacing: var(--letterSpacing);
  }

  .ing {
    display: inline-block;
    margin-right: 0.5rem;
  }
  @media screen and (min-width: 992px) {
    .drink {
      display: grid;
      grid-template-columns: 2fr 3fr;
      gap: 3rem;
      align-items: center;
    }
    .drink-info {
      padding-top: 0;
    }
  }
`;

export default Wrapper;
```

#### Setup React Toastify

main.jsx

```js
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer position='top-center' autoClose={2000} />
    <App />
  </React.StrictMode>
);
```

#### Newsletter

Newsletter.jsx

```js
const Newsletter = () => {
  return (
    <form className='form'>
      <h4 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        our newsletter
      </h4>
      {/* name */}
      <div className='form-row'>
        <label htmlFor='name' className='form-label'>
          name
        </label>
        <input
          type='text'
          className='form-input'
          name='name'
          id='name'
          defaultValue='john'
        />
      </div>
      {/* last name */}
      <div className='form-row'>
        <label htmlFor='lastName' className='form-label'>
          last name
        </label>
        <input
          type='text'
          className='form-input'
          name='lastName'
          id='lastName'
          defaultValue='smith'
        />
      </div>
      {/* name */}
      <div className='form-row'>
        <label htmlFor='email' className='form-label'>
          email
        </label>
        <input
          type='email'
          className='form-input'
          name='email'
          id='email'
          defaultValue='test@test.com'
        />
      </div>
      <button
        type='submit'
        className='btn btn-block'
        style={{ marginTop: '0.5rem' }}
      >
        submit
      </button>
    </form>
  );
};

export default Newsletter;
```

#### Default Behavior

The "method" attribute in an HTML form specifies the HTTP method to be used when submitting the form data to the server. The two commonly used values for the "method" attribute are:

GET: This is the default method if the "method" attribute is not specified. When the form is submitted with the GET method, the form data is appended to the URL as a query string. The data becomes visible in the URL, which can be bookmarked and shared. GET requests are generally used for retrieving data from the server and should not have any side effects on the server.

POST: When the form is submitted with the POST method, the form data is included in the request payload rather than being appended to the URL. POST requests are typically used when submitting sensitive or large amounts of data to the server, as the data is not directly visible in the URL. POST requests can have side effects on the server, such as updating or inserting data.

- action attribute

  The "action" attribute in an HTML form specifies the URL or destination where the form data should be sent when the form is submitted. It defines the server-side script or endpoint that will receive and process the form data.

If the action attribute is not provided in the HTML form, the browser will send the form data to the current URL, which means it will submit the form to the same page that the form is on. This behavior is referred to as a "self-submitting" form.

#### FormData API

- covered in React fundamentals
  [JS Nuggets - FormData API](https://youtu.be/5-x4OUM-SP8)

- a great solution when you have bunch of inputs
- inputs must have name attribute

The FormData interface provides a way to construct a set of key/value pairs representing form fields and their values, which can be sent using the fetch() or XMLHttpRequest.send() method. It uses the same format a form would use if the encoding type were set to "multipart/form-data".

#### React Router - Action

Route actions are the "writes" to route loader "reads". They provide a way for apps to perform data mutations with simple HTML and HTTP semantics while React Router abstracts away the complexity of asynchronous UI and revalidation. This gives you the simple mental model of HTML + HTTP (where the browser handles the asynchrony and revalidation) with the behavior and UX capabilities of modern SPAs.

Newsletter.jsx

```js
import { Form } from 'react-router-dom';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  return 'something';
};

const Newsletter = () => {
  return (
    <Form className='form' method='POST'>
    .....)
}
```

App.jsx

```js
import { action as newsletterAction } from './pages/Newsletter';
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        path: 'newsletter',
        action: newsletterAction,
        element: <Newsletter />,
      },
    ],
  },
]);
```

#### Newsletter Request

const newsletterUrl = 'https://www.course-api.com/cocktails-newsletter';

Newsletter.jsx

```js
import { Form, redirect } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const newsletterUrl = 'https://www.course-api.com/cocktails-newsletter';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const response = await axios.post(newsletterUrl, data);
  console.log(response);
  return response;
};
```

#### Try/Catch

Newsletter.jsx

```js
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await axios.post(newsletterUrl, data);
    console.log(response);
    toast.success(response.data.msg);
    return redirect('/');
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
```

#### Submit State

Newsletter.jsx

```js
import { Form, useNavigation } from 'react-router-dom';

const Newsletter = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Form className='form' method='POST'>
      ....
      <button
        type='submit'
        className='btn btn-block'
        style={{ marginTop: '0.5rem' }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'submitting...' : 'submit'}
      </button>
    </Form>
  );
};
```

#### Attributes

- remove defaultValue and add required
- cover required and defaultValue

#### Search Form - Setup

components/SearchForm.jsx

```js
import { Form, useNavigation } from 'react-router-dom';
import Wrapper from '../assets/wrappers/SearchForm';
const SearchForm = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Wrapper>
      <Form className='form'>
        <input
          type='search'
          name='search'
          className='form-input'
          defaultValue='vodka'
        />
        <button type='submit' className='btn' disabled={isSubmitting}>
          {isSubmitting ? 'searching...' : 'search'}
        </button>
      </Form>
    </Wrapper>
  );
};

export default SearchForm;
```

#### Query Params

Landing.jsx

```js
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('search') || '';
  const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`);
  return { drinks: response.data.drinks, searchTerm };
};
```

const url = new URL(request.url);
This line of code creates a new URL object using the URL constructor. The URL object represents a URL and provides methods and properties for working with URLs. In this case, the request.url is passed as an argument to the URL constructor to create a new URL object called url.

The request.url is an input parameter representing the URL of an incoming HTTP request. By creating a URL object from the provided URL, you can easily extract specific components and perform operations on it.

const searchTerm = url.searchParams.get('search') || '';
This line of code retrieves the value of the search parameter from the query string of the URL. The searchParams property of the URL object provides a URLSearchParams object, which allows you to access and manipulate the query parameters of the URL.

The get() method of the URLSearchParams object retrieves the value of a specific parameter by passing its name as an argument. In this case, 'search' is passed as the parameter name. If the search parameter exists in the URL's query string, its value will be assigned to the searchTerm variable. If the search parameter is not present or its value is empty, the expression '' (an empty string) is assigned to searchTerm using the logical OR operator (||).

#### Controlled Input (kinda/sorta)

Landing.js

```js
const Landing = () => {
  const { searchTerm, drinks } = useLoaderData();

  return (
    <>
      <SearchForm searchTerm={searchTerm} />
      <CocktailList drinks={drinks} />
    </>
  );
};
```

SearchForm.jsx

```js
const SearchForm = ({ searchTerm }) => {
  return (
    <Wrapper>
      <Form className='form'>
        <input
          type='search'
          name='search'
          className='form-input'
          defaultValue={searchTerm}
        />
        .....
      </Form>
    </Wrapper>
  );
};

export default SearchForm;
```

#### React Query - Setup

App.jsx

```js
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});
...
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
export default App;

```

#### React Query - Landing Page

Landing.jsx

```js
import { useQuery } from '@tanstack/react-query';

const searchCocktailsQuery = (searchTerm) => {
  return {
    queryKey: ['search', searchTerm || 'all'],
    queryFn: async () => {
      const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`);
      return response.data.drinks;
    },
  };
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('search') || '';
  // const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`);
  return { searchTerm };
};

const Landing = () => {
  const { searchTerm } = useLoaderData();
  const { data: drinks } = useQuery(searchCocktailsQuery(searchTerm));
  return (
    <>
      <SearchForm searchTerm={searchTerm} />
      <CocktailList drinks={drinks} />
    </>
  );
};

export default Landing;
```

#### React Query - Landing Page Loader

App.jsx

```js
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        loader: landingLoader(queryClient),
        element: <Landing />,
      },
    ],
  },
]);
```

Landing.jsx

```js
export const loader =
  (queryClient) =>
  async ({ request }) => {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('search') || '';
    await queryClient.ensureQueryData(searchCocktailsQuery(searchTerm));
    // const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`);
    return { searchTerm };
  };
```

#### React Query - Cocktail

App.jsx

```js
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
    ....
      {
        path: 'cocktail/:id',
        loader: singleCocktailLoader(queryClient),
        errorElement: <h2>There was an error...</h2>,
        element: <Cocktail />,
      },
      ....
    ],
  },
]);
```

Cocktail.jsx

```js
import { useQuery } from '@tanstack/react-query';
import Wrapper from '../assets/wrappers/CocktailPage';
import { useLoaderData, Link } from 'react-router-dom';
import axios from 'axios';

const singleCocktailUrl =
  'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

const singleCocktailQuery = (id) => {
  return {
    queryKey: ['cocktail', id],
    queryFn: async () => {
      const { data } = await axios.get(`${singleCocktailUrl}${id}`);
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params;
    await queryClient.ensureQueryData(singleCocktailQuery(id));
    return { id };
  };

const Cocktail = () => {
  const { id } = useLoaderData();
  const { data } = useQuery(singleCocktailQuery(id));
  // rest of the code
};
```

#### Redirects

- in public folder create "\_redirects"

```
/* /index.html 200
```
