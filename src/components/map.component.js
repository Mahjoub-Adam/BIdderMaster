import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import style from "./mapStyle/style.json";
const MapGl = ReactMapboxGl({
  accessToken: "token",
});            
export default class Map extends Component {
    constructor(props) {
      super(props);
      this.state={
        coords:this.props.coords
      };
    }
    componentWillReceiveProps(props){
      this.setState({
         coords:props.coords
      });
    }
    render(){
        if(String(this.state.coords.lon)==="undefined") return ((null));
        return(
            <MapGl containerStyle={{height: "30vh",width: "30vw"}}
                style={style} center={[this.state.coords.lon,
                this.state.coords.lat]}>
              <Layer
                id='trees-point'
                type='circle'
                source='trees'
                paint={{
                  'circle-radius': 8,
                  'circle-color': '#223b53',
                  'circle-stroke-color': 'white',
                  'circle-stroke-width': 4,
                  'circle-opacity': 1
                }}>
                <Feature
                  coordinates={[this.state.coords.lon,this.state.coords.lat]}/>
              </Layer>
            </MapGl>
        );
    } 
}  
            