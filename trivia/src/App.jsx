import React, { Component } from 'react';
import { HashRouter as Router, Switch, Redirect, Route, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import './App.css';
import SignUpView from './components/SignUp';
import SignInView from './components/SignIn';
import constants from './components/Constants';
import MainPageView from './components/MainPage';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenicated: false,
      firstName:"",
      lastName:""
    };
  }

  componentDidMount() {
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
      this.setState({authenicated: user != null});
    });
  }

  componentWillUnmount() {
    this.authUnsub();
  }
  
  handleSignUp() {
    this.setState({working: true, errorMessge: undefined});
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => user.updateProfile({
          displayName: this.state.displayName
        }))
      .catch(err => this.setState({errorMessage: err.message}))
      .then(() => this.setState({working: false}));
  }

  handleSignOut() {
    this.setState({working: true});
    firebase.auth().signOut()
     .catch(err => this.setState({errorMessage: err.message}))
      .then(() => this.setState({working: false, authenicated: false})); 
  }

  handleSignIn() {
    this.setState({working: true, errorMessage: undefined});
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(err => this.setState({errorMessage: err.message}))
      .then(() => this.setState({working: false}));
  }
  render() {

    if (!this.state.authenicated) {
      console.log("not authenicated");
    }

    let scoreRef = firebase.database().ref("totalscore");
    let displayNameRef = firebase.database().ref("displayname");
    let dateRef = firebase.database().ref("date");
    return (
      <div className="App">
        <header className="bg-dark text-white">
          <h1>Trivia</h1>
        </header>
        <div className="container">
          {
            this.state.errorMessage ? <div className="alert alert-danger">{this.state.errorMessage}</div> :
            undefined
          }
          {
            this.state.authenicated ? <div className="alert alert-success">Welcome Back{this.state.errorMessage}</div> :
            undefined
          }
          <p>user is <strong>{this.state.authenicated? "Authenticated!" : "Not Authenticated."}</strong></p>
          <span>{this.state.working? "working on it !" : undefined}</span>
          <p><button className="btn btn-primary" onClick={()=>this.handleSignOut()}> sign Out!</button></p>
          <Router>
          <Switch>
              <Route exact path={constants.routes.signin} component={SignInView} />
              <Route path={constants.routes.signup} component={SignUpView} />    
              <Route path={constants.routes.mainpage} component={MainPageView} />
              
          </Switch>
          </Router>
        </div>
        <div>
          <section>
            <footer className="bg-dark text-white">
              <p><i>&copy; 2017, Trivia, <a href="mailto:info@trivia.com"> info@trivia.com</a></i></p>
              <p><a href="#">Back to Top &uarr;</a></p> 
            </footer>
          </section>
        </div>
      </div>
    );
  }
}

export default App;