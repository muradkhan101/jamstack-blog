const React=require('react');const contentful=require('../contentful/contentfulAPI');const Post=require('./Post');class SingleCategoryContainer extends React.Component{constructor(props){super(props)}getVisibility(){return this.props.visible?{display:'inline-block'}:{display:'none'}}render(){return React.createElement('div',{className:`${this.props.category}-post-container`,style:this.getVisibility()},this.props.posts.map((e,i)=>{return React.createElement(Post,{key:i,data:e})}))}}module.exports=SingleCategoryContainer;