
import './App.css';
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator} from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports';
import Main from '../../my_yelp/src/components/form';
 


Amplify.configure(awsConfig);

function App({ signOut }) {

  const [user, setUser] = useState(null);


  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => setUser(user))
      .catch(() => setUser(null));
  }, []);

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    
      <div className="App">
        <Container>
            <h1>My Yelp</h1>
            <Main />
            <hr/>
            
            <hr/>
            {user && (
                <Button onClick={handleSignOut} className="float-right">
                  Sign Out
                </Button>
            )}  
        </Container>     

    </div>

  );
}

export default withAuthenticator(App);
