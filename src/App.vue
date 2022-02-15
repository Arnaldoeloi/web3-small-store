<template>
  <div id="app">
    <b-navbar id="main-navbar" type="dark" variant="dark">
      <b-navbar-brand to="/"><img src="./assets/ethereum.png" alt="EthIcon">SmallStore</b-navbar-brand>


      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-if="isOwner" to="/store/management"><span class="text-warning">Manage Store</span></b-nav-item>
          <b-nav-item v-if="isOwner" to="/products/add"><span class="text-warning">Add Product</span></b-nav-item>
          <b-nav-item to="/purchases">My Purchases</b-nav-item>
        </b-navbar-nav>

        <!--  aligned nav items -->
        <div class="align-self-end">
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="https://arnaldosouza.com">by Arnaldo Souza</b-nav-item>
          </b-navbar-nav>
        </div>
      </b-collapse>
    </b-navbar>
    <b-container class="width-100 mt-3 align-center">
      <router-view v-if="isConnectedToMetamaskAndContract" ></router-view>
      <b-alert v-else show variant="warning">You need to login into your <strong>metamask wallet</strong> to interact with this page. If you did it already, don't worry: you'll soon be redirected to the store.</b-alert>
      <b-alert v-if="needsMetamask" show variant="danger">You need a browser with web3 support. <b-link href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">Try to install MetaMask extension</b-link> and reload the page.</b-alert>
    </b-container>

  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      isOwner: false,
      contractSet: false,
      DappAccountSet: false,
    };
  },
  methods: {
    handleAccountChange: function(){
      this.fetchIsOwner();
    },
    fetchIsOwner: function(){
      if(!this.isConnectedToMetamaskAndContract)return false;
      window.contract.methods.owner().call().then(
        (ownerAddress)=>{
          this.isOwner = ownerAddress.toLowerCase()==window.DApp.account.toLowerCase()  
        }
      )
    },
    checkIfContractAndDAppAccountIsSet: function(){
       console.log('checked');
       return (window.contract)?(window.DApp.account?true:false):false; 
    }
  },
  mounted() {
    if(this.needsMetamask)return;
    
    //try to connect every second
    var timer=setInterval(() => {
      console.log('Checking if metamask is connected again.')
      if(this.checkIfContractAndDAppAccountIsSet()){
        this.contractSet = true;
        this.DappAccountSet = true;
        this.handleAccountChange();
        console.log('Contract and DApp Account are set.')
        clearInterval(timer)
      }
    }, 1000);

    window.ethereum.on('accountsChanged', this.handleAccountChange);
    this.fetchIsOwner();
  },
  computed: {
    needsMetamask(){
      return window.ethereum == undefined;
    },
    isConnectedToMetamaskAndContract() {
      return (this.contractSet && this.DappAccountSet);
    },
  },
}
</script>
<style>
.width-100{
  width: 100%;
}
#main-navbar{
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 1em;
}
.align-self-end{
  align-self: flex-end;
}
.inline-block{
  display: inline-block;
}
.flex-between{
  align-content: space-between;
}
.flex-nowrap{
  flex-wrap: nowrap;
}
.flex-wrap{
  flex-wrap: wrap;
}
.flex-column{
  flex-direction: column;
}
.flex{
  display: flex;
}
.flex-end{
  align-content: flex-end;
}
.flex-stretch{
  align-content: stretch;
}
.justify-between{
  justify-content: space-between;
}
.align-center{
  align-items: center;
}
#nav-collapse{
  display: flex;
  justify-content: space-between;
}
</style>