import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar.component";
import Signup from "./components/signup.component";
import Logout from "./components/logout.component";
import Auctions from "./components/auctions.component";
import Categories from "./components/categories.component";
import MainPage from "./components/mainPage.component";
import Messages from "./components/messages.component";
import { Provider } from 'react-redux';
import store from "./store";
import {loadUser} from "./actions/authActions"
import { Redirect } from 'react-router-dom';
export default class MyApp extends Component {
    componentDidMount(){
        store.dispatch(loadUser());
        
    }
    render(){
        return (
            <Provider store={store}>
                <Router>
                    <div className="container">
                        <Navbar />
                        <br/>
                        <Switch>
                            <Route exact path="/" component={MainPage}/>
                            <Route exact path="/users/myAuctions"
                                component={() => 
                                <Auctions displayType="My Auctions" />}
                            />
                            <Route exact path="/users/signup" component={Signup}/>
                            <Route exact path="/users/logout" component={Logout}/>
                            <Route exact path="/users/myBids"
                                component={() => 
                                <Auctions displayType="My Bids" />}
                            />
                            <Route exact path="/users/downloads"
                                component={() => 
                                <Auctions displayType="downloads" />}
                            />
                            <Route exact path="/users/myRatings"
                                component={() => 
                                <Auctions displayType="My Ratings" />}
                            />
                            <Route exact path="/users/myMessages"
                                component={Messages}
                            />
                            <Route exact path="/users/categories"
                                component={() => 
                                <Categories />}
                            />
                            <Route path="/*" render={() => 
                                <Redirect to={{pathname: "/"}} />} />
                        </Switch>
                    </div>                  
                </Router>
            </Provider>
        );
    }
}