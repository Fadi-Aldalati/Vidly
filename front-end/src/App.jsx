import React, { Component } from 'react';
import Movies from './components/movies';
import {ToastContainer} from 'react-toastify';
import Customers from './components/customers';
import Rentals from './components/rentals';
import notFound from './components/notFound';
import MovieForm from './components/movieForm';
import LoginForm from './components/loginForm';
import Logout from './components/logout';
import RegisterForm from './components/registerForm';
import ProtectedRoute from './components/common/protectedRoute';
import auth from './services/authService';
import { Route , Redirect , Switch } from 'react-router-dom';
import "./App.css";
import NavBar from './components/navBar';
import 'react-toastify/dist/ReactToastify.css';


class App extends Component {
  state = {  } 

  componentDidMount(){
    const user = auth.getCurrentUser();
    this.setState({user});
  }

  render() { 
    return (
      <React.Fragment>
        <ToastContainer />
      <NavBar user={this.state.user}/>
      <main className="container">
        <Switch>
           <Route path="/register" component={RegisterForm} />
           <Route path="/login" component={LoginForm} />
           <Route path="/logout" component={Logout} />
           <ProtectedRoute path="/movies/:id" component={MovieForm} />
           <Route path="/movies" 
            render={props => <Movies {...props} user={this.state.user} />}
           />
           <Route path="/customers" component={Customers} />
           <Route path="/rentals" component={Rentals} />
           <Route path="/not-found" component={notFound} />
           <Redirect from='/' exact to='/movies' />
           <Redirect to='/not-found' />
        </Switch>
      </main>
      </React.Fragment>
    );
  }
}
 
export default App;