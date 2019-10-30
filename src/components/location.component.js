
import React, { Component } from 'react';
import {FormControl,InputGroup} from 'react-bootstrap'
import axios from 'axios';
import { Tooltip,Button } from 'reactstrap';
import Map from './map.component';
class Location extends Component {
  constructor(props) {
    super(props);
    this.onQuery = this.onQuery.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
        addr:this.props.location?this.props.location.address:"",
          address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country:String(this.props.country)==="undefined"?"":this.props.country
        },
        query: '',
        locationId: '',
        isChecked: false,
        coords: this.props.location && String(this.props.location.lon)!=="undefined"?
        {lon:this.props.location.lon,
        lat:this.props.location.lat}:null,
        tooltipOpen: false,
        first :true
    };
  }
  componentDidMount(){
    const e={target:{value:this.state.addr}};
    this.onQuery(e);
  }
  componentWillReceiveProps(props){
    if(props.refresh===true){
        this.setState({
          addr:props.location?props.location.address:"",
            address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          },
          query: '',
          locationId: '',
          isChecked: false,
          coords: props.location && String(props.location.lon)!=="undefined"?
          {lon:props.location.lon,
          lat:props.location.lat}:null,
          tooltipOpen: false
        });
        this.props.changeRefresh();
    }
  }
  onQuery(e) {
    const query = e.target.value;
    this.setState({
      addr:e.target.value,
      coords:this.state.first?this.state.coords:null
    });
    const loc=null;
    if(this.state.first)
      this.setState({
        first:false
      });
    else {
      this.props.change(false);
      this.props.onChangeLocation(loc,"",query);
    }
    if (!query.length > 0) {
      return;
    }
    const self=this;
    axios.get('https://autocomplete.geocoder.api.here.com/6.2/suggest.json',
      {params: {
        app_id: "id",
        app_code: "code",
        query: query,
        maxresults: 1,
      }}).then(function (response) {
          if (response.data.suggestions.length > 0) {
            const id = response.data.suggestions[0].locationId;
            const address = response.data.suggestions[0].address;    
            self.setState({
              address : address,
              query : query,
              locationId: id,
            })
          }
      });
  }



  onCheck() {
    let params = {
        app_id: "nwpG8EhSTJo3clEae8Yn",
        app_code: "yYAzy9c9jNAKv4GU8Uz14Q",
    }
    
    if (this.state.locationId.length > 0) {
      params['locationId'] = this.state.locationId;
    } else {
      params['searchtext'] = this.state.address.street
        + this.state.address.city
        + this.state.address.state
        + this.state.address.postalCode
        + this.state.address.country;
    }
    const self=this;
    axios.get('https://geocoder.api.here.com/6.2/geocode.json',
      {params: params }
      ).then(function (response) {
        const view = response.data.Response.View;
        if (view.length > 0 && view[0].Result.length > 0) {
          const location = view[0].Result[0].Location;
          self.setState({
            isChecked: true,
            query: location.Address.Label,
            addr: location.Address.Label,
            address: {
              street: location.Address.HouseNumber + ' ' + location.Address.Street,
              city: location.Address.City,
              state: location.Address.State,
              postalCode: location.Address.PostalCode,
              country: location.Address.Country
            },
            coords: {
              lat: location.DisplayPosition.Latitude,
              lon: location.DisplayPosition.Longitude
            }
          });
          const loc={
            address: location.Address.Label,
            lat: location.DisplayPosition.Latitude,
            lon: location.DisplayPosition.Longitude,       
          };
          const country= location.Address.Country
          self.props.onChangeLocation(loc,country);
          self.props.change(true);
        } else {
          self.setState({
            isChecked: true,
            coords: null,
          });
        }

      })
      .catch(function (error) {
        self.setState({
          isChecked: true,
          coords: null,
        });
      });
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  render() {
    var suggestion=`Adress:${this.state.address.street}
            City : ${this.state.address.city}
            State : ${this.state.address.state}
            Postal Code : ${this.state.address.postalCode}
            Country : ${this.state.address.country}`;
    return (
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="adressLabel">Address</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              required={this.props.required}
              value={this.state.addr}
              onChange={this.onQuery}
              placeholder="Address Search..."
              aria-label="address"
              aria-describedby="adressLabel"
            />
            <InputGroup.Append>
                <Button id="tooltip"color='dark' 
                  style={{backgroundColor:"green",borderColor:"green"}} 
                  onClick={this.onCheck}>
                  Check
                </Button>
                <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="tooltip" toggle={this.toggle}>
                  {suggestion}
                </Tooltip>
            </InputGroup.Append>
            {this.state.coords?
              <Map coords={this.state.coords}/>
              :
              (null)
            }
        </InputGroup>
  
         
          
      );
  }
}

export default Location;