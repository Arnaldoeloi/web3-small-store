<template>
<div>
    <b-card 
        :title="`${product.canBeBought?'':'[DELETED]'}${product.name}`"
        tag="div"
        style="width: 100%;"
        class="mb-2 product-listing"
        :class="product.canBeBought?'bg-light':'alert-warning'"
        img-left
        :img-src="product.img_link"
        img-height="150px"
    >
        <b-card-text>
            <span><img src="../assets/ethereum.png" alt="EthIcon">{{ priceInEther }} ETH</span> |   
            <strong :class="{'text-danger':product.stock<=0}">{{ product.stock }} in stock</strong> 
        </b-card-text>
        <b-alert v-if="error" show variant="danger">{{error}}</b-alert>
        <b-alert v-if="message" show variant="success">{{message}}</b-alert>
        <b-spinner v-if="isProcessingEdition" label="Spinning"></b-spinner>
        <div v-else class="block">
            <b-button-group>
                <b-button class="inline-block text-white" @click="handleProductEdit(product)" href="#" variant="warning" v-b-modal="`edit-modal-${product.id}`" inline ><b-icon icon="pencil-square"/> Edit item</b-button>
                <b-button @click="removeProduct(product)" href="#" variant="danger" inline :disabled="!product.canBeBought"><b-icon icon="trash-fill" /> Remove item from the store</b-button>
            </b-button-group>
        </div>
    </b-card>
    <b-modal :ref="`edit-modal-${product.id}`" :id="`edit-modal-${product.id}`" hide-footer :title="`Editing product (${product.name})`">
        <b-alert v-if="error" show variant="danger">{{error}}</b-alert>
        <b-alert v-if="message" show variant="success">{{message}}</b-alert>
        <div v-if="isProcessingEdition">
            <span>Loading changes </span>
            <b-spinner label="Spinning"></b-spinner>
        </div>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show && !isProcessingEdition || !isProcessingRemoval">
            <b-form-group
                id="input-group-1"
                label="Product name"
                label-for="input-1"
            >
                <b-form-input
                id="input-1"
                v-model="form.name"
                type="text"
                placeholder="Enter product name"
                required
                ></b-form-input>
            </b-form-group>

            <b-form-group 
                id="input-group-2" 
                label="Image link" 
                label-for="input-2"
                description="You can use imgur to upload your image."
            >
                <b-form-input
                id="input-2"
                type="text"
                v-model="form.img_link"
                placeholder="Enter image link"
                required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Price in WEIs" label-for="input-2">
                <b-form-input
                id="input-2"
                type="number"
                v-model="form.price"
                placeholder="Enter price"
                required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Stock (max:255)" label-for="input-2">
                <b-form-input
                id="input-2"
                type="number"
                v-model="form.stock"
                max="255"
                min="0"
                placeholder="Enter how many you have on stock"
                required
                ></b-form-input>
            </b-form-group>

            <b-form-checkbox v-model="form.canBeBought" class="mb-5 mr-sm-2 mb-sm-0">Can be bought?</b-form-checkbox>

            <b-button-group class="mt-3 width-100">
                <b-button type="submit" variant="primary">Submit</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
            </b-button-group>
        </b-form>
        <br>
        <h5>Product preview</h5>
        <Product :product="productPreview">
        </Product>
    </b-modal>
</div>
</template>
<script>
import web3 from 'web3';
import Product from './Product'
export default {
    name: 'CartProduct',
    components: {
        Product,
    },
    props: ['product','amount'],
    data() {
        return {
            error:null,
            message:null,
            isProcessingEdition: false,
            isProcessingRemoval: false,
            form: {
                price: 0,
                name: '',
                img_link:"https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc=",
                stock: 1,
                canBeBought:true,
            },
            show: true,
        };
    },
    methods: {
        removeProduct: function(){
            this.isProcessingRemoval=true;
            this.isProcessingEdition=true;
            this.show = false;
            window.contract.methods.removeProduct(this.product.id).send(
                {
                    from: window.DApp.account,
                }
            ).then(
                (tx)=>{
                    console.log(tx)
                    this.error=null;
                    this.isProcessingRemoval=false;
                    this.message = 'Product removed from the store!';
                    this.product.canBeBought = false;
                }
            ).catch(err=>{
                console.log(err)
                this.message = null;
                this.error = err.message;
                this.isProcessingEdition=false;
                this.isProcessingRemoval=false;
            });
            this.show = true;
        },
        onSubmit(event) {
            this.isProcessingEdition=true;
            this.show = false;
            event.preventDefault()
            window.contract.methods.editProduct(this.product.id,this.form.name,this.form.price,this.form.img_link, this.form.stock, this.form.canBeBought).send(
                {
                    from: window.DApp.account,
                }
            ).then(
                (tx)=>{
                    console.log(tx)
                    this.error = null;
                    this.message = "Product edition was successful."
                    this.isProcessingEdition=false;
                }
            ).catch(err=>{
                console.log(err)
                this.error = err.message;
                this.message = null;
                this.isProcessingEdition=false;
            });
            this.show = true;
        },
        onReset(event) {
            event.preventDefault()
                // Reset our form values
            this.form=this.product
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
            this.show = true
            })
        },
        handleProductEdit(){
            this.form = this.product;
        }
    },
    computed: {
        priceInEther() {
            return web3.utils.fromWei(String(this.product.price), 'ether');
        },
        productPreview() {
            return {name:this.form.name, price:this.form.price, stock: this.form.stock, img_link: this.form.img_link, canBeBought:this.form.canBeBought};
        },
    },

}
</script>
<style>
.block{
    display: block;
}    
.inline-block{
    display: inline-block;
}    
.height-100{
    height: 100%;
}
.flex-stretch{
    align-items: stretch;
}
.product-listing{
    width: 100%;
}
</style>