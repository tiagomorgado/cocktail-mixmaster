import { Form } from "react-router-dom"

export const action = async ({request}) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  return null
}

const Newsletter = () => {
  return (
    <Form action="" method='POST' className='form'>
      <h4 style={{textAlign: 'center', marginBottom:'2rem'}}>
        Our Newsletter
      </h4>
      <div className="form-row">
        <label htmlFor="name" className='form-label'>
          name
        </label>
        <input type="text" className='form-input' name='name' id='name' defaultValue='john'/>
      </div>

      <div className="form-row">
        <label htmlFor="lastName" className='form-label'>
          last Name
        </label>
        <input type="text" className='form-input' name='lastName' id='lastName' defaultValue='smith'/>
      </div>

      <div className="form-row">
        <label htmlFor="email" className='form-label'>
          email
        </label>
        <input type="text" className='form-input' name='email' id='email' defaultValue='test@test.com'/>
      </div>

      <button type='submit' className='btn btn-block' style={{marginTop:'0.5rem'}}>
        submit
      </button>
    </Form>
  )
}
export default Newsletter