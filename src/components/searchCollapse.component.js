import React, { Component } from 'react';
import Select from 'react-select';
import {
  Collapse,
  Button,
  Card,
  CardBody,
  Form
} from 'reactstrap';
import { getCategories } from '../actions/categoriesActions';
import {FormControl,InputGroup,FormGroup} from 'react-bootstrap'
import { searchAllAuctions,searchMyAuctions,searchMyBids,searchMyRatings,searchDownloads} 
from '../actions/auctionsActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Location from './location.component';
import Alert from './alert.component';
class SearchCollapse extends Component {
  static propTypes = {
    categories: PropTypes.object.isRequired
  };
  constructor(props){
      super(props);
      this.toggle = this.toggle.bind(this);
      this.renderSelectOptions=this.renderSelectOptions.bind(this);
      this.onChangeMax=this.onChangeMax.bind(this);
      this.onChangeMin=this.onChangeMin.bind(this);
      this.onSubmit=this.onSubmit.bind(this);
      this.onChangeName=this.onChangeName.bind(this);
      this.onChangeDescription=this.onChangeDescription.bind(this);
      this.onChangeLocation=this.onChangeLocation.bind(this);
      this.reset=this.reset.bind(this);
      this.categorySelect=this.categorySelect.bind(this);
      this.onChangeKm=this.onChangeKm.bind(this);
      this.changeCheck=this.changeCheck.bind(this);
      this.changeRefresh=this.changeRefresh.bind(this);
      this.state={
        isOpen: false,
        min:"",
        max:"",
        parents:[],
        location:null,
        categoryOption:null,
        name:"",
        description:"",
        Km:"",
        check:true,
        refresh:false,
        msg: "Any empty field will not be taken in consideration on the search results ! Address must be checked before submitted ! ",
        error:false,
        query:""
      }   
  }
  componentDidMount() {
    this.props.getCategories();
  }
  onChangeKm(e){
    this.setState({
      Km:e.target.value
    });
  }
  changeRefresh(){
    this.setState({
      refresh:false
    });
  }
  onChangeLocation(location,country,query){
    this.setState({
      location :location,
      query :query
    });
  }
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
    this.reset();
  }
  changeCheck(val){
    this.setState({
      check:val
    });
  }
  onSubmit(e){
    e.preventDefault();
    var error="";
    if(!this.state.check && this.state.query!=="")
      error+="Address was not checked before submitted ! ";
    else if((!this.state.location && this.state.Km!=="") || 
      (this.state.location && this.state.Km===""))
       error +="If one of Km radius and address field is submitted,then the other must too !";
    if(error!==""){
      this.setState({
        error: error
      })
      return;
    }
    const {categories}=this.props.categories;
    const search={
      name:this.state.name,
      categories:this.state.categoryOption===null?
        categories.map((x)=>{return x.name}):
        this.state.categoryOption.map((x)=>{return x.value}),
      min:this.state.min===""?0:this.state.min,
      max:this.state.max===""?Number.MAX_VALUE:this.state.max,
      description:this.state.description,
      location:this.state.location?this.state.location:{
        lon:-0.481747846041145, 
        lat:51.3233379650232
      },
      Km:this.state.Km?this.state.Km:Number.MAX_VALUE
    };
    if(this.props.displayType==="All Auctions")
      this.props.searchAllAuctions(search);
    else if(this.props.displayType==="My Auctions")
      this.props.searchMyAuctions({...search,...{cur_old:this.props.value}});
    else if(this.props.displayType==="My Bids")
      this.props.searchMyBids({...search,...{cur_old:this.props.value}});
    else if(this.props.displayType==="My Ratings")
      this.props.searchMyRatings(search)
    else if(this.state.displayType==="downloads")
          this.props.searchDownloads(search);
    this.reset();
    this.props.change(true,false,this.props.value);
    this.toggle();
  }
  onChangeMax(e){
    this.setState({
      max:e.target.value
    });
  }
  onChangeMin(e){
    this.setState({
      min:e.target.value
    });
  }
  onChangeName(e){
    this.setState({
      name:e.target.value
    });
  }
  onChangeDescription(e){
    this.setState({
      description:e.target.value
    });
  }
  categorySelect=categoryOption=>{
   this.setState({
      categoryOption : categoryOption,
    });
  }
  reset(){
    this.setState({
      name: "",
      description: "",
      min: "",
      max:"",
      categoryOption : null,
      location :null,
      error:false,
      refresh: true,
      query:"",
      Km:"",
    });
  }
  renderSelectOptions(){
      const {categories}=this.props.categories;
      return categories.map((category)=>{return({label:category.name,value:category.name})});
  }
  render() {
    const options=this.renderSelectOptions();
    const search=(
      <Form onSubmit={this.onSubmit}>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="nameLabel">Name</InputGroup.Text>
          </InputGroup.Prepend>
         <FormControl            
            placeholder="Name Search..."
            value={this.state.name}
            onChange={this.onChangeName}
            aria-label="name"
            aria-describedby="nameLabel"
          />
        </InputGroup>
        <FormGroup>
          <Select options={ options } placeholder="Select Categories" 
            style={{borderColor:"#00a2ed",float:"left"}}
            value={this.state.categoryOption}
            isMulti onChange={this.categorySelect}/>
        </FormGroup> 
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="minLabel">Min</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl      
            type="number"
            placeholder={this.state.min}
            value={this.state.min}
            min="1"
            max={this.state.max}
            onChange={this.onChangeMin}
            aria-label="min"
            aria-describedby="minLabel"
           />
          <InputGroup.Append>
            <InputGroup.Text>€</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup className="mb-3">
         <InputGroup.Prepend>
          <InputGroup.Text id="maxLabel">Max</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl 
          type="number"
          placeholder={this.state.max}
          min={this.state.min}
          value={this.state.max}
          onChange={this.onChangeMax}
          aria-label="max"
          aria-describedby="maxLabel"
        />
        <InputGroup.Append>
            <InputGroup.Text>€</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>     
        <Location location={this.state.location} change={this.changeCheck}
          onChangeLocation={this.onChangeLocation}  required={false}
          refresh={this.state.refresh}  changeRefresh={this.changeRefresh} />
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="KmLabel">Km Radius</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl            
            type="number"
            placeholder={this.state.Km}
            value={this.state.Km}
            onChange={this.onChangeKm}
            aria-label="Km"
            min="1"
            aria-describedby="KmLabel"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="descriptionLabel">Description</InputGroup.Text>
          </InputGroup.Prepend>
         <FormControl            
            placeholder="Description Search..."
            value={this.state.description}
            onChange={this.onChangeDescription}
            aria-label="description"
            aria-describedby="descriptionLabel"
          />
        </InputGroup>
        <Button style={{backgroundColor:"red",width:"50%",
           borderColor:"red"}} onClick={this.reset}> Reset
        </Button>
        <Button color="outline-primary" style={{width:"50%"}} 
          type="submit"> Search 🔍
        </Button>
      </Form>
    );
    return (  
      <div >
        <Button style={{width:this.props.width,borderColor:"#00a2ed"}} 
          color="outline-primary" onClick={this.toggle}>Search
        </Button>
        <Collapse isOpen={this.state.isOpen}>
          <Card>
            <CardBody>
              <Alert myKey="alert" msg={this.state.msg} variant="warning"/>
              {this.state.error!==false?
                  <Alert myKey="alert" variant="danger" 
                    msg={this.state.error} />
                :
                (null)
              }
              {search}
            </CardBody>
          </Card>
        </Collapse>      
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories : state.categories
});

export default connect(
  mapStateToProps,
  {getCategories,searchAllAuctions,searchMyAuctions,searchMyBids,searchMyRatings,searchDownloads}
)(SearchCollapse);