import React, {Component} from 'react';

class BasketItem extends Component {
	// <BasketItem img={Image} basket_id={basket.basket_id} shop_id={basket.shop_id} product_id={_product_id} item_name={product._name} price={product._base_price}/>)
    //         ))}
    render() {
        return(
            <React.Fragment>
                <article className="card card-body mb-3">
				<div className="row align-items-center">
					<div className="col-md-5">
						<figure className="itemside">
							<div className="aside"><img src={this.props.img} className="photoCart border img-sm" alt=""/></div>
							<figcaption className="info">
								<span className="text-muted">{this.props.shop_name} {this.props.item_name}
								(ID:{this.props.product_id})
								</span>
							</figcaption>
						</figure> 
					</div> 
					<div className="col"> 
						<div className="input-group input-spinner">
							<div className="input-group-prepend">
							<button className="btn btn-light" type="button" id="button-plus"> <i className="fa fa-minus"></i> </button>
							</div>
							<input type="text" className="form-control"  value={this.props.amount}/>
							<div className="input-group-append">
							<button className="btn btn-light" type="button" id="button-minus"> <i className="fa fa-plus"></i> </button>
							</div>
						</div> 
					</div> 
					<div className="col">
						<div className="price h5">{this.props.price} </div>
					</div>
					{/*<div className="col flex-grow-0 text-right">*/}
					{/*	<a href="#" className="btn btn-light"> <i className="fa fa-times"></i> </a>*/}
					{/*</div>*/}
				</div>
			</article>
            </React.Fragment>
        );
    }
}

export default BasketItem;