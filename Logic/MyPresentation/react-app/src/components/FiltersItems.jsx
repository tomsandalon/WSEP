import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StarRatings from 'react-star-ratings';
class FiltersItems extends Component {
    state = {
        categories:[]
    }
    handlePriceFilter = () =>{

    }
    setMinPrice = (event) =>{
        this.setState({minPrice:event.target.value})
    }
    setMaxPrice = (event) =>{
        this.setState({maxPrice:event.target.value})
    }
    handleSearch = (event) => {
        this.setState({search: event.target.value})
    }
    handleSearchClick = () => {
        if(this.state.search !== ''){
            console.log("searching",this.state.search);
        }
    }
    // handleCategory = (category) => {
    //     this.props.handleCategory();
    // }
    changeRating(newRating, name){
        console.log(newRating,name);
    }
    componentDidUpdate(prevProps) {
        if ((prevProps.shopsInfo !== this.props.shopsInfo) && this.props.shopsInfo.length > 0) {
           // console.log(this.props.shopsInfo);
            const cats = this.props.shopsInfo.map(shop => shop.products.map(item => item._category))
            const flatCats = cats.map(cat => cat.flat());
            const arr = flatCats.flat();
            const arrStrings = arr.map(name => name._name);
            const unique = arrStrings.filter((elem, index, self) =>
             index === self.indexOf(elem))
            this.setState({categories:unique})
    }
}
    render() {
        return(        
<output>
<div className="card">
	<article className="filter-group">
		<div className="filter-content collapse show" id="collapse_aside1">
			<div className="card-body">
				<form className="mb-3">
				<div className="input-group">
				  <input type="text" className="form-control" placeholder="Search by product name" onChange={this.handleSearch}/>
				  <div className="input-group-append">
				    <button className="btn btn-primary" type="button"><i className="fa fa-search" onClick={this.handleSearchClick}></i></button>
				  </div>
				</div>
				</form>
                <ul>
                    <h6 className="title">Filter Categories</h6>
                    {((this.props !== null) && (this.props.shopsInfo.length !== 0)) &&
                        this.state.categories.map((category,index) =>(
                        <li key={index}><button onClick={() => this.props.handleCategory(category)} className="btn btn-outline-primary btn-sm" type="button" padding="105">{category}</button></li>
                    ))
                    }
                </ul>
			</div> 
		</div>
	</article> 
	<article className="filter-group">
		<header className="card-header">
            <h6 className="title">Price</h6>
		</header>
		<div className="filter-content collapse show" id="collapse_aside2">
			<div className="card-body">
				<div className="form-row">
				<div className="form-group col-md-6">
				  <label>Min</label>
				  <input className="form-control" placeholder={this.state.minPrice} type="number" onChange={this.setMinPrice}/>
				</div>
				<div className="form-group text-left col-md-6">
				  <label>Max</label>
				  <input className="form-control" type="number" onChange={this.setMaxPrice}/>
				</div>
				</div> 
				<button className="btn btn-block btn-primary" onClick={this.handlePriceFilter}>Apply</button>
			</div>
		</div>
	</article>
    <article className="filter-group">
		<header className="card-header">
            <h6 className="title">Filter by rating</h6>
		</header>
    <StarRatings
          rating={this.state.rating}
          starRatedColor="blue"
          starDimension="40px"
          starSpacing="18px"
          changeRating={this.changeRating}
          numberOfStars={5}
          name='rating'
    /></article>
</div> 
</output>

        );
    }
}

export default FiltersItems;