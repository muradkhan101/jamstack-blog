const React=require('react');const SingleCategoryContainer=require('./SingleCategoryContainer');const actions=require('../redux/reducers/actions');const CategoryToggle=require('./CategoryToggle');const Post=require('./Post');class CategoriesContainer extends React.Component{constructor(props){super(props);this.toggleCategory=this.toggleCategory.bind(this);this.checkVisibility=this.checkVisibility.bind(this);this.getVisibility=this.getVisibility.bind(this)}toggleCategory(toggle){this.props.dispatch(actions.toggleVisibility(toggle))}checkVisibility(category){for(var i=0;i<this.props.categories.length;i++){if(this.props.categories[i].category===category)return this.props.categories[i].visible}}getVisibility(post,category){return this.checkVisibility(category)?{display:'block'}:{display:'none'}}componentDidUpdate(){if(masonry)masonry.layout()}render(){return React.createElement('div',null,React.createElement('div',{className:'card-title'},React.createElement('h1',null,'Posts by Category')),React.createElement('div',{className:'category-toggles flex-row'},this.props.categories.map((e,i)=>{return React.createElement(CategoryToggle,{key:e.category,category:e.category,checked:e.visible,click:this.toggleCategory})})),React.createElement('div',{className:'home-masonry-grid'},React.createElement('div',{className:'grid-sizer'}),this.props.posts.map((e,i)=>{return React.createElement(Post,{data:e,key:e.slug,visible:this.getVisibility(e,e.categories[0])})})))}}module.exports=CategoriesContainer;