import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert'
export default class MyAlert extends Component {
    render() {
        if(String(this.props.myKey)==="undefined") return((null));
        return (
            <Alert key={this.props.myKey} show={true} variant={this.props.variant}>
                <p style={{textAlign:"center"}}>
                  {this.props.msg}
                </p>
                <hr />
            </Alert>
        );
    }
}