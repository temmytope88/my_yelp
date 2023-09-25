import { createRestaurant } from '../graphql/mutations';
import { listRestaurants } from '../graphql/queries';
import { onCreateRestaurant } from '../graphql/subscriptions';
import { useEffect, useReducer, useState } from 'react';
//import { Button } from '@aws-amplify/ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button, Form, Row, Table } from 'react-bootstrap';


const initialState = {
  restaurants: [],
    formData: {
      name: '',
      city: '',
      description: '',
    },
  };
  
const reducer = (state, action) => {
  switch (action.type) {
    case 'QUERY':
      return { ...state, restaurants: action.payload };
    case 'SUBSCRIPTION':
      return { ...state, restaurants: [...state.restaurants, action.payload] };
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    
    default:
      return state;
  }
};

const Main = () =>{

    const [state, dispatch] = useReducer(reducer, initialState);
    const [err, setInputError] = useState("")  
    
  
    useEffect(() => {
      getRestaurantList(); 
      const subscription = API.graphql(graphqlOperation(onCreateRestaurant)).subscribe({
        next: eventData => {
          const payload = eventData.value.data.onCreateRestaurant;
          dispatch({ type: 'SUBSCRIPTION', payload });
        },
      });

  
      return () => subscription.unsubscribe();
    }, []);
  
    const getRestaurantList = async () => {
      const restaurants = await API.graphql(graphqlOperation(listRestaurants));
      dispatch({
        type: 'QUERY',
        payload: restaurants.data.listRestaurants.items,
      });
    };
  
    const createNewRestaurant = async e => {
      e.stopPropagation();
      // fire only if fields not empty
      const { name, description, city } = state.formData
      if (name && description && city){
        console.log("better")
        const restaurant = {
          name,
          description,
          city,
        };
        await API.graphql(graphqlOperation(createRestaurant, { input: restaurant }));
                
      }else{
         setInputError("Form need to be completed")
         console.log("error")
          dispatch({
            type: ""
          })
  
      }
            
    };
  
    const handleChange = e =>
      dispatch({
        type: 'SET_FORM_DATA',
        payload: { [e.target.name]: e.target.value },
      });   





    return(
      <div>      
          <Row className="mt-3">
          <Col md={4}>
              {
                err && (
                  <p>{err}</p>
                )
              }
              <Form>
                <Form.Group controlId="formDataName" className='mtop'>
                  <Form.Control onChange={handleChange} type="text" name="name" placeholder="Name" />
                </Form.Group><br/>
                <Form.Group controlId="formDataDescription" className='mtop'>
                  <Form.Control onChange={handleChange} type="text" name="description" placeholder="Description" />
                </Form.Group><br/>
                <Form.Group controlId="formDataCity" className='mtop'>
                  <Form.Control onChange={handleChange} type="text" name="city" placeholder="City" />
                </Form.Group><br/>
                <Button onClick={createNewRestaurant} className="float-left">
                  Add New Restaurant
                </Button>
            </Form>
          </Col>
          </Row>
          <hr/><hr/>
          { state.restaurants && state.restaurants.length ? (
            <Row className="my-3">
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.restaurants.map((restaurant, index) => (
                      <tr key={`restaurant-${index}`}>
                        <td>{index + 1}</td>
                        <td>{restaurant.name}</td>
                        <td>{restaurant.description}</td>
                        <td>{restaurant.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
        ) : null}
      </div>       
        
    )
}

export default Main