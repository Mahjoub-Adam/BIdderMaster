import React, { Component } from 'react';
import { Button,Table,Form } from 'reactstrap';
import { connect } from 'react-redux';
import { getCategories, deleteCategory, addCategory } from '../actions/categoriesActions';
import PropTypes from 'prop-types';
import {FormControl,InputGroup} from 'react-bootstrap'
import Select from 'react-select';
import {GoPlus} from "react-icons/go";
import { clearErrors} from '../actions/errorActions';
import Alert from './alert.component'
class Categories extends Component{
    static propTypes = {
        categories: PropTypes.object.isRequired,
        isAdmin : PropTypes.string.isRequired,
        error : PropTypes.object.isRequired
    };
    constructor(props){
      super(props);
      this.renderTableRows=this.renderTableRows.bind(this);
      this.renderSelectOptions=this.renderSelectOptions.bind(this);
      this.add=this.add.bind(this);
      this.delete=this.delete.bind(this);
      this.onChangeName=this.onChangeName.bind(this);
      this.select=this.select.bind(this);
      this.state={
        name:"",
        parents:[],
        option:null,
        change : false
      };
    }
    componentDidMount() {
      this.props.getCategories();
    }
    componentDidUpdate() {
      if(this.state.change){
        this.props.getCategories();
        this.props.clearErrors();
        this.setState({
          change: false
        });
      }
    }
    componentWillUnmount(){
      this.props.clearErrors();
    }
    onChangeName(e){
      this.setState({
        name:e.target.value
      });
    }
    add(e){
      e.preventDefault();
      const category={
      name:this.state.name,
      parents:this.state.parents
      }
      this.props.addCategory(category);
      this.setState({
        name:"",
        parents:[],
        option:null,
        change: true
      });
    }

    delete(id,name){
      this.props.deleteCategory(id,name);
      this.setState({
        name:"",
        parents:[],
        option:null,
        change: true
      });
    }
    renderSelectOptions(){
        var { categories } = this.props.categories;
        categories=categories.sort((a,b)=>{return a.parents.length-b.parents.length});
        const cat=categories.filter(({parents})=>
        ((parents===[] && this.state.parents===[]) || 
        (this.state.parents!==[] && this.state.parents.includes(name))  ||
        (this.state.parents!==[] && parents!==[] &&
        parents[parents.length-1]===
        this.state.parents[this.state.parents.length-1]))
        );
        return cat.map((category)=>{return({label:category.name,value:category.name})});
    }
    renderTableRows(){
      const { categories } = this.props.categories;
      return categories.map((category)=>{
        const {_id,name,parents}=category;
        var parentsCat="";
        parents.map((parent)=>
          parentsCat+=","+parent
        );
        if(parentsCat==="") parentsCat="NONE"
        else parentsCat=parentsCat.substr(1);
        return(
          <tr  key={name} style={{width:"20%",overflow: "visible"}}>
            <td style={{width:"20%"}} key="name">{name}</td>
            <td style={{width:"20%"}} key="parents">{parentsCat}</td>
            <td style={{width:"20%"}}>
              <Button color='dark' 
                style={{backgroundColor:"red",borderColor:"red",
                width:"100%",float:"right"}}
                onClick={()=>this.delete(_id,name)}>Delete Category
              </Button>
            </td>
          </tr>
        );   
      });
    }
    select=option=>{
      var name =this.state.option===null?null: 
      option===null?this.state.option:this.state.option.filter(x => !option.includes(x)); 
      name= name===null|| name.length===0?null:name.map(x=>{return x.value});
      const {categories}=this.props.categories;
      if(name)name=name[0];
      if(name!==null && option!==null)option=option.filter(x=>categories.filter( c=>!c.parents.includes(name)&& x.value===c.name).length!==0)
      const values=option===null ?[]:option.map(opt=>opt.value)
      this.setState({
        option : option,
        parents: values
      });
    }
    render(){
        const options=this.renderSelectOptions();
        if(this.props.isAdmin==="undefined") return ((null)); 
        return(
          this.props.isAdmin==="false" ?
              <Alert variant="danger" 
                msg={"Only admin has the right to this page !"} myKey="" />
            :
            <div>
              {this.props.error.msg!==false ?
                <Alert variant="danger" msg={this.props.error.msg} myKey="" />
                :
                (null)
              }
              <Form onSubmit={this.add}>
                  <Select options={ options } value={this.state.option} 
                  placeholder="Select Parent Categories" style={{borderColor:"#00a2ed",
                  }} isMulti onChange={this.select}/>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="nameLabel">Category Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      required
                      placeholder="Category Name"
                      value={this.state.name}
                      onChange={this.onChangeName}
                      aria-label="name"
                      aria-describedby="nameLabel"
                    />
                    <InputGroup.Append>
                      <Button color='dark' 
                        style={{backgroundColor:"green",borderColor:"green"}}
                        type="submit"><GoPlus/> 
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>     
              </Form> 
              <Table striped bordered hover variant="dark" key="categories" size="sm">
                <thead>
                  <tr style={{overflow: "visible"}}>
                    <th>Name</th>
                    <th>Parents</th>
                    <th>Delete</th>              
                  </tr>           
                </thead>
                <tbody>
                  {this.renderTableRows()}
                </tbody>   
              </Table>
            </div>   
        )  
    }
}
const mapStateToProps = state => ({
  isAdmin: state.auth.isAdmin,
  categories : state.categories,
  error: state.error
});

export default connect(
  mapStateToProps,
  { getCategories,deleteCategory,addCategory,clearErrors }
)(Categories);