<template>
  <div class="container mt-4">
    <b-alert v-if="error" show variant="danger">{{error}}</b-alert>
    <b-alert v-if="message" show variant="success">{{message}}</b-alert>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show && !isProcessingTx">
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
          placeholder="Enter how many you have on stock"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-spinner v-else label="Spinning"></b-spinner>
    <br>
    <h5>Product preview</h5>
    <Product :product="productPreview">

    </Product>
  </div>
</template>

<script>
import Product from '../components/Product.vue'
  export default {
    components:{
        Product,
    },
    data() {
      return {
        error:null,
        message:null,
        isProcessingTx: false,
        form: {
          price: 0,
          name: '',
          img_link:"https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc=",
          stock: 1,
        },
        show: true,
      }
    },
    computed: {
        productPreview() {
            return {name:this.form.name, price:this.form.price, stock: this.form.stock, img_link: this.form.img_link};
        },
    
    },
    methods: {
      onSubmit(event) {
        this.isProcessingTx=true;
        event.preventDefault()
        window.contract.methods.storeProduct(this.form.name,this.form.price,this.form.img_link, this.form.stock).send(
          {
            from: window.DApp.account,
                value: 0
            }
        ).then(
          (tx)=>{
            console.log(tx)
              this.error = null;
              this.message = 'Product added on the contract!';
              this.isProcessingTx=false;
            }
        ).catch((err)=>{
          this.error = err.message;
          this.message = null;
          this.isProcessingTx=false;
        });
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        
        this.form.email = ''
        this.form.name = ''
        this.form.price = 0,
        this.form.img_link="https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc=",
        this.form.stock = 1,
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>