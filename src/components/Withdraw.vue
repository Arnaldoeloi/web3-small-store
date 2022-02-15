<template>
<div class="card text-center">
    <b-alert v-if="error" show variant="danger">{{error}}</b-alert>
    <b-alert v-if="message" show variant="success">{{message}}</b-alert>
    <div class="card-header">
        Available to Withdraw
    </div>
    <div class="card-body">
        <h5 class="card-title"><img src="../assets/ethereum.png" alt="EthIcon">{{balanceInEthers}} ETH</h5>
        <p class="card-text">Only the owner (<span class="text-success"><b-link target="_blank" :href="`https://ropsten.etherscan.io/address/${ownerAddress}`">{{ownerAddress}}</b-link></span>) can withdraw the balance.</p>
        <b-button v-if="!fetching" @click="withdraw" variant="info"><b-icon icon="box-arrow-in-up"/> Withdraw</b-button>
        <b-spinner v-else label="Spinning"></b-spinner>
    </div>
    <div class="card-footer text-muted">
        <b-link target="_blank" :href="`https://ropsten.etherscan.io/address/${contractAddress}`">See on Etherscan</b-link>
    </div>
    
</div>
</template>

<script>
import web3 from 'web3';
export default {
    name: 'Withdraw',

    data() {
        return {
            error:null,
            message:null,
            fetching: true,
            balance:100000000000000000,
            ownerAddress:'0x00000...0000000',
        };
    },

    created() {
        this.fetchOwner();
        this.fetchContractBalance();
    },
    methods: {
        fetchOwner: function(){
            window.contract.methods.owner().call().then(
                (ownerAddress)=>{
                    this.ownerAddress = ownerAddress.toLowerCase();  
                }
            )
        },
        fetchContractBalance: function(){
            // web3.eth.getBalance(window.contract.options.address);
            this.fetching = true;
            window.DApp.web3.eth.getBalance(this.contractAddress).then((balance)=>{
                console.log(balance)
                this.balance = balance;
                this.fetching = false;
            }).catch(err=>{
                this.fetching = false;
                this.error = err.message;
            });
        },
        withdraw: function(){
            this.fetching = true;
            window.contract.methods.withdraw().send(
                {
                    from: window.DApp.account,
                }
            ).then(
                (tx)=>{
                    console.log(tx)
                    this.balance=0;
                    this.message = 'Balance withdrawn to contract owner!';
                    this.error = null;
                    this.fetching = false;
                }
            ).catch(err=>{
                console.log(err)
                this.message = null;
                this.error = err.message;
                this.fetching = false;
            });
        }
    },
    computed: {
        balanceInEthers(){
            return web3.utils.fromWei(String(this.balance), 'ether');
        },
        contractAddress(){
            return String(window.DApp.contract._address);
        }
    }
};
</script>

<style lang="scss" scoped>

</style>