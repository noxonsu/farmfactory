var farmFactory=function(){"use strict";n=t={exports:{}},n.exports=e;function e(t){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?n.exports=e=function(t){return typeof t}:n.exports=e=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}var n;var t,a=function(){return(a=Object.assign||function(t){for(var e,n=1,a=arguments.length;n<a;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function d(i,r,s,u){return new(s=s||Promise)(function(t,e){function n(t){try{o(u.next(t))}catch(t){e(t)}}function a(t){try{o(u.throw(t))}catch(t){e(t)}}function o(e){e.done?t(e.value):new s(function(t){t(e.value)}).then(n,a)}o((u=u.apply(i,r||[])).next())})}function c(n,a){var o,i,r,s={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]},t={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(t[Symbol.iterator]=function(){return this}),t;function e(e){return function(t){return function(e){if(o)throw new TypeError("Generator is already executing.");for(;s;)try{if(o=1,i&&(r=2&e[0]?i.return:e[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,e[1])).done)return r;switch(i=0,r&&(e=[2&e[0],r.value]),e[0]){case 0:case 1:r=e;break;case 4:return s.label++,{value:e[1],done:!1};case 5:s.label++,i=e[1],e=[0];continue;case 7:e=s.ops.pop(),s.trys.pop();continue;default:if(!(r=0<(r=s.trys).length&&r[r.length-1])&&(6===e[0]||2===e[0])){s=0;continue}if(3===e[0]&&(!r||e[1]>r[0]&&e[1]<r[3])){s.label=e[1];break}if(6===e[0]&&s.label<r[1]){s.label=r[1],r=e;break}if(r&&s.label<r[2]){s.label=r[2],s.ops.push(e);break}r[2]&&s.ops.pop(),s.trys.pop();continue}e=a.call(n,s)}catch(t){e=[6,t],i=0}finally{o=r=0}if(5&e[0])throw e[1];return{value:e[0]?e[1]:void 0,done:!0}}([e,t])}}}var o=(i.prototype.addHandler=function(t){var e=this;this.handlers.push(t.bind({unsubscribe:function(){e.removeHandler(t)}}))},i.prototype.removeHandler=function(t){t=this.handlers.indexOf(t);this.handlers.splice(t,1)},i.prototype.call=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.handlers.forEach(function(t){try{t.apply(void 0,e)}catch(t){console.error(t)}})},i);function i(t){this.name=t,this.handlers=[]}function r(){this.events={}}function l(t){w=a(a({},w),t),v.dispatch("state change",w)}function s(t){return'<div class="farmfactory-loader'+(t?" black":"")+'"><div></div><div></div><div></div></div>'}function p(t){if(!t)return t;var e=Number(t).toFixed(5);return"0.00000"===e&&(e=Number(t).toFixed(8)),"0.00000000"===e?t:e}function m(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return console.log.apply(console,function(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;for(var a=Array(t),o=0,e=0;e<n;e++)for(var i=arguments[e],r=0,s=i.length;r<s;r++,o++)a[o]=i[r];return a}(["widget: "+t],e))}function u(){return d(void 0,void 0,void 0,function(){var e,n,a,o,i,r,s,u;return c(this,function(t){switch(t.label){case 0:if(m("getData"),r=w.opts,o=w.contracts,i=w.account,e=w.stakingTokenName,n=w.rewardsTokenName,!o)return[2];t.label=1;case 1:return t.trys.push([1,3,,4]),[4,Promise.all([o.farm.methods.balanceOf(i).call(),o.farm.methods.earned(i).call(),o.staking.methods.allowance(i,r.farmAddress).call()])];case 2:return s=t.sent(),a=s[0],o=s[1],u=s[2],console.log("allowance:",u),S(0<Number(u)),i=document.getElementById(b.ids.widget.staked),r=document.getElementById(b.ids.widget.earned),s=document.getElementById(b.ids.widget.harvestButton),u=document.getElementById(b.ids.widget.withdrawButton),i.innerText=p(a/1e18)+" "+e,r.innerText=p(o/1e18)+" "+n,s&&(0<o?s.classList.remove("disabled"):s.classList.add("disabled")),u&&(0<a?u.classList.remove("disabled"):u.classList.add("disabled")),[3,4];case 3:return u=t.sent(),console.error(u),g(u.message),[3,4];case 4:return[2]}})})}function f(){document.getElementById(b.ids.widget.approveButton).addEventListener("click",function(){d(void 0,void 0,void 0,function(){var e,n,a,o;return c(this,function(t){switch(t.label){case 0:if(m("init approve"),n=w.opts,a=w.web3,e=w.contracts,o=w.account,H)return[2];if(!o)return[2];if(!e.staking)return g("Staking contract is not connected"),[2];t.label=1;case 1:return t.trys.push([1,3,4,5]),H=!0,document.getElementById(b.ids.widget.approveButton).innerHTML="Approve "+s(),n=n.farmAddress,a=a.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),[4,e.staking.methods.approve(n,a).send({from:o})];case 2:return t.sent().status&&g("Transaction confirmed!"),u(),[3,5];case 3:return o=t.sent(),console.error(o),g(o.message),[3,5];case 4:return H=!1,document.getElementById(b.ids.widget.approveButton).innerHTML="Approve",[7];case 5:return[2]}})})})}function y(){var t=w.opts,e=document.getElementById(b.ids.widget.harvestButton);t.harvestButtonTitle&&(e.innerText=t.harvestButtonTitle),e.addEventListener("click",function(){e.classList.contains("disabled")||d(void 0,void 0,void 0,function(){var e,n,a;return c(this,function(t){switch(t.label){case 0:if(m("init harvest"),e=w.contracts,a=w.account,H)return[2];if(!a)return[2];if(!e.farm)return g("Farm contract is not connected"),[2];n=document.getElementById(b.ids.widget.harvestButton),t.label=1;case 1:return t.trys.push([1,3,4,5]),H=!0,n.innerHTML="Harvest "+s(),[4,e.farm.methods.getReward().send({from:a})];case 2:return t.sent().status&&g("Transaction confirmed!"),u(),[3,5];case 3:return a=t.sent(),console.error(a),g(a.message),[3,5];case 4:return H=!1,n.innerHTML="Harvest",[7];case 5:return[2]}})})})}var v=new(r.prototype.getEvent=function(t){var e=this.events[t];return e||(e=new o(t),this.events[t]=e),e},r.prototype.subscribe=function(t,e){t=this.getEvent(t);return t.addHandler(e),{event:t,handler:e}},r.prototype.unsubscribe=function(t,e){this.getEvent(t).removeHandler(e)},r.prototype.dispatch=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];t=this.getEvent(t);t&&t.call.apply(t,e)},r.prototype.once=function(t,n){var a=this.getEvent(t),o=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];n.apply(void 0,t)&&a.removeHandler(o)};return a.addHandler(o),{event:a,handlerWrapper:o}},r),w={opts:null,web3:null,account:null,contracts:null,stakingTokenName:"",rewardsTokenName:""},b={networks:{mainnet:"https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c",ropsten:"https://ropsten.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c",kovan:"https://kovan.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c"},ids:{timerRoot:"farmfactory-timer-root",widgetRoot:"farmfactory-widget-root",modalsRoot:"farmfactory-modals-root",infoModalRoot:"farmfactory-info-modal-root",widget:{root:"farmfactory-widget-root",earned:"farmfactory-widget-earned",staked:"farmfactory-widget-staked",lpsButtons:"farmfactory-widget-lps-buttons",harvestButton:"farmfactory-widget-harvest-button",approveButton:"farmfactory-widget-approve-button",depositButton:"farmfactory-widget-deposit-button",withdrawButton:"farmfactory-widget-withdraw-button"},depositForm:{title:"farmfactory-deposit-title",input:"farmfactory-deposit-input",cancelButton:"farmfactory-deposit-cancel-button",depositButton:"farmfactory-deposit-deposit-button"},withdrawForm:{title:"farmfactory-withdraw-title",input:"farmfactory-withdraw-input",cancelButton:"farmfactory-withdraw-cancel-button",withdrawButton:"farmfactory-withdraw-deposit-button"},infoModal:{closeButton:"farmfactory-info-modal-close-button",cancelButton:"farmfactory-info-modal-cancel-button"},wrongNetworkModal:{closeButton:"farmfactory-wrong-network-modal-close-button"},connectModal:{closeButton:"farmfactory-connect-modal-close-button",connectButton:"farmfactory-connect-modal-connect-button",cancelButton:"farmfactory-connect-modal-cancel-button"},depositModal:{closeButton:"farmfactory-deposit-modal-close-button",title:"farmfactory-deposit-modal-title",depositButton:"farmfactory-deposit-modal-deposit-button",cancelButton:"farmfactory-deposit-modal-cancel-button",availableToDeposit:"farmfactory-deposit-modal-available-to-deposit",depositAmount:"farmfactory-deposit-modal-deposit-amount"},withdrawModal:{closeButton:"farmfactory-withdraw-modal-close-button",title:"farmfactory-withdraw-modal-title",withdrawButton:"farmfactory-withdraw-modal-withdraw-button",cancelButton:"farmfactory-withdraw-modal-cancel-button",availableToWithdraw:"farmfactory-withdraw-modal-available-to-withdraw",withdrawAmount:"farmfactory-deposit-modal-withdraw-amount"},harvestModal:{closeButton:"farmfactory-harvest-modal-close-button",connectButton:"farmfactory-harvest-modal-connect-button",cancelButton:"farmfactory-harvest-modal-cancel-button"}}},h=function(){document.getElementById(b.ids.infoModalRoot).innerHTML=""},g=function(t){document.getElementById(b.ids.infoModalRoot).innerHTML=(e=t,'\n  <div class="farmfactory-overlay">\n    <div class="farmfactory-modal">\n      <button class="farmfactory-closeButton" id="'+b.ids.infoModal.closeButton+'">\n        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">\n          <path stroke="currentColor" stroke-width="2" d="M9 9l7 6.99L23 9l-6.99 7L23 23l-7-6.99L9 23l6.99-7L9 9z" opacity=".9"/>\n        </svg>\n      </button>\n      <div class="farmfactory-inner">\n        <div>'+e+'</div>\n      </div>\n      <div class="farmfactory-footer">\n        <button class="farmfactory-button gray" id="'+b.ids.infoModal.cancelButton+'">Close</button>\n      </div>\n    </div>\n  </div>\n');var t=document.getElementById(b.ids.infoModal.closeButton),e=document.getElementById(b.ids.infoModal.cancelButton);t.addEventListener("click",h),e.addEventListener("click",h)},B='\n  <div class="farmfactory-form farmfactory-deposit">\n    <div class="farmfactory-title" id="'+b.ids.depositForm.title+'"></div>\n    <input class="farmfactory-input" id="'+b.ids.depositForm.input+'" type="number" value="" />\n    <div class="farmfactory-row">\n      <button class="farmfactory-button" id="'+b.ids.depositForm.cancelButton+'">Cancel</button>\n      <button class="farmfactory-button" id="'+b.ids.depositForm.depositButton+'">Deposit</button>\n    </div>\n  </div>\n',M=!1,T=function(){document.getElementById(b.ids.widget.root).classList.remove("farmfactory-deposit-visible")},k=function(){var t=document.getElementById(b.ids.depositForm.cancelButton),e=document.getElementById(b.ids.depositForm.depositButton);t.addEventListener("click",function(){t.classList.contains("disabled")||T()}),e.addEventListener("click",function(){d(void 0,void 0,void 0,function(){var e,n,a,o,i,r;return c(this,function(t){switch(t.label){case 0:if(e=w.web3,n=w.contracts,r=w.account,M)return[2];if(!n.farm)return g("Farm contract is not connected"),[2];if(i=document.getElementById(b.ids.depositForm.input),a=document.getElementById(b.ids.depositForm.cancelButton),o=document.getElementById(b.ids.depositForm.depositButton),!(0<(i=Number(i.value))))return[3,5];t.label=1;case 1:return t.trys.push([1,3,4,5]),M=!0,a.classList.add("disabled"),o.innerHTML="Deposit "+s(),i=e.utils.toWei(String(i)),[4,n.farm.methods.stake(i).send({from:r})];case 2:return t.sent().status&&g("Transaction confirmed!"),T(),v.dispatch("deposit success"),[3,5];case 3:return r=t.sent(),console.error(r),"INVALID_ARGUMENT"==r.code?g("Placeholder cannot be empty"):g(r.message),[3,5];case 4:return M=!1,a.classList.remove("disabled"),o.innerHTML="Deposit",[7];case 5:return[2]}})})})},E=function(){return d(void 0,void 0,void 0,function(){var e,n,a,o,i;return c(this,function(t){switch(t.label){case 0:return e=w.contracts,i=w.account,n=w.stakingTokenName,a=document.getElementById(b.ids.widget.root),o=document.getElementById(b.ids.depositForm.title),a.classList.add("farmfactory-deposit-visible"),o.innerHTML="Balance: "+s(!0),[4,e.staking.methods.balanceOf(i).call()];case 1:return i=t.sent(),o.innerHTML="Balance: <b>"+p(Number(i)/1e18)+" "+n+"</b>",[2]}})})},L='\n  <div class="farmfactory-form farmfactory-withdraw">\n    <div class="farmfactory-title" id="'+b.ids.withdrawForm.title+'"></div>\n    <input class="farmfactory-input" id="'+b.ids.withdrawForm.input+'" type="number" value="" />\n    <div class="farmfactory-row">\n      <button class="farmfactory-button" id="'+b.ids.withdrawForm.cancelButton+'">Cancel</button>\n      <button class="farmfactory-button" id="'+b.ids.withdrawForm.withdrawButton+'">Deposit</button>\n    </div>\n  </div>\n',I=!1,x=function(){document.getElementById(b.ids.widget.root).classList.remove("farmfactory-withdraw-visible")},F=function(){var t=document.getElementById(b.ids.withdrawForm.cancelButton),e=document.getElementById(b.ids.withdrawForm.withdrawButton);t.addEventListener("click",function(){t.classList.contains("disabled")||x()}),e.addEventListener("click",function(){d(void 0,void 0,void 0,function(){var e,n,a,o,i,r;return c(this,function(t){switch(t.label){case 0:if(e=w.web3,n=w.contracts,r=w.account,I)return[2];if(!n.farm)return g("Farm contract is not connected"),[2];if(i=document.getElementById(b.ids.withdrawForm.input),a=document.getElementById(b.ids.withdrawForm.cancelButton),o=document.getElementById(b.ids.withdrawForm.withdrawButton),!(0<(i=Number(i.value))))return[3,5];t.label=1;case 1:return t.trys.push([1,3,4,5]),I=!0,a.classList.add("disabled"),o.innerHTML="Withdraw "+s(),i=e.utils.toWei(String(i)),[4,n.farm.methods.withdraw(i).send({from:r})];case 2:return t.sent().status&&g("Transaction confirmed!"),x(),v.dispatch("withdraw success"),[3,5];case 3:return r=t.sent(),console.error(r),"INVALID_ARGUMENT"==r.code?g("Placeholder cannot be empty"):g(r.message),[3,5];case 4:return I=!1,a.classList.remove("disabled"),o.innerHTML="Withdraw",[7];case 5:return[2]}})})})},R=function(){return d(void 0,void 0,void 0,function(){var e,n,a,o,i;return c(this,function(t){switch(t.label){case 0:return e=w.contracts,i=w.account,n=w.stakingTokenName,a=document.getElementById(b.ids.widget.root),o=document.getElementById(b.ids.withdrawForm.title),a.classList.add("farmfactory-withdraw-visible"),o.innerHTML="Balance: "+s(!0),[4,e.farm.methods.balanceOf(i).call()];case 1:return i=t.sent(),o.innerHTML="Balance: <b>"+p(Number(i)/1e18)+" "+n+"</b>",[2]}})})},H=!1,A='\n  <div class="farmfactory-root" id="'+b.ids.widget.root+'">\n    '+B+"\n    "+L+'\n    <div class="farmfactory-widget">\n      <div class="farmfactory-line">\n        <div class="farmfactory-row">\n          <div class="farmfactory-title">Earned</div>\n          <div class="farmfactory-buttons">\n            <button class="farmfactory-button disabled" id="'+b.ids.widget.harvestButton+'">Harvest</button>\n          </div>\n        </div>\n        <div class="farmfactory-value" id="'+b.ids.widget.earned+'">&mdash;</div>\n      </div>\n      <div class="farmfactory-line">\n        <div class="farmfactory-row">\n          <div class="farmfactory-title">Staked</div>\n          <div class="farmfactory-buttons" id="'+b.ids.widget.lpsButtons+'"></div>\n        </div>\n        <div class="farmfactory-value" id="'+b.ids.widget.staked+'">&mdash;</div>\n      </div>\n    </div>\n  </div>\n',N='\n  <button class="farmfactory-button" id="'+b.ids.widget.approveButton+'">Approve</button>\n',C='\n  <button class="farmfactory-button" id="'+b.ids.widget.depositButton+'">Deposit</button>\n  <button class="farmfactory-button" id="'+b.ids.widget.withdrawButton+'">Withdraw</button>\n',S=function(t){var e,n,a=document.getElementById(b.ids.widget.lpsButtons);t?(a.innerHTML=C,n=w.opts,t=document.getElementById(b.ids.widget.depositButton),n.depositButtonTitle&&(t.innerText=n.depositButtonTitle),t.addEventListener("click",function(){E()}),t=w.opts,e=document.getElementById(b.ids.widget.withdrawButton),t.withdrawButtonTitle&&(e.innerText=t.withdrawButtonTitle),e.addEventListener("click",function(){e.classList.contains("disabled")||R()})):(a.innerHTML=N,f())},D=function(){document.getElementById(b.ids.widgetRoot).innerHTML=A,k(),F(),y(),v.subscribe("setup web3",u),v.subscribe("deposit success",u),v.subscribe("withdraw success",u)},P=function(t){document.getElementById(b.ids.widgetRoot).innerHTML=(t=t,'\n  <div class="farmfactory-root" id="'+b.ids.widget.root+'">\n    <div class="farmfactory-widget-error">\n      <span>'+t+"</span>\n    </div>\n  </div>\n")},O=function(){document.getElementById(b.ids.modalsRoot).innerHTML=""},_=function(){var t=w.opts;document.getElementById(b.ids.modalsRoot).innerHTML=(t=t.networkName.toUpperCase(),'\n  <div class="farmfactory-overlay">\n    <div class="farmfactory-modal">\n      <button class="farmfactory-closeButton" id="'+b.ids.wrongNetworkModal.closeButton+'">\n        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">\n          <path stroke="currentColor" stroke-width="2" d="M9 9l7 6.99L23 9l-6.99 7L23 23l-7-6.99L9 23l6.99-7L9 9z" opacity=".9"/>\n        </svg>\n      </button>\n      <div class="farmfactory-inner">\n        Please open your metamask and change network to <b>'+t+"</b>.\n      </div>\n    </div>\n  </div>\n"),document.getElementById(b.ids.wrongNetworkModal.closeButton).addEventListener("click",function(){O()})},W={farm:[{inputs:[{internalType:"address",name:"_rewardsToken",type:"address"},{internalType:"address",name:"_stakingToken",type:"address"},{internalType:"uint256",name:"_rewardsDuration",type:"uint256"}],stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"token",type:"address"},{indexed:!1,internalType:"uint256",name:"amount",type:"uint256"}],name:"Recovered",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"reward",type:"uint256"}],name:"RewardAdded",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"user",type:"address"},{indexed:!1,internalType:"uint256",name:"reward",type:"uint256"}],name:"RewardPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"newDuration",type:"uint256"}],name:"RewardsDurationUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"user",type:"address"},{indexed:!1,internalType:"uint256",name:"amount",type:"uint256"}],name:"Staked",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"user",type:"address"},{indexed:!1,internalType:"uint256",name:"amount",type:"uint256"}],name:"Withdrawn",type:"event"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"earned",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"exit",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"getReward",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"getRewardForDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"lastTimeRewardApplicable",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"lastUpdateTime",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"a",type:"uint256"},{internalType:"uint256",name:"b",type:"uint256"}],name:"min",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"pure",type:"function"},{inputs:[{internalType:"uint256",name:"reward",type:"uint256"}],name:"notifyRewardAmount",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"periodFinish",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"tokenAddress",type:"address"},{internalType:"uint256",name:"tokenAmount",type:"uint256"}],name:"recoverERC20",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"rewardPerToken",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"rewardPerTokenStored",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"rewardRate",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"rewards",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"rewardsDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"rewardsToken",outputs:[{internalType:"contract IERC20",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_rewardsDuration",type:"uint256"}],name:"setRewardsDuration",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"amount",type:"uint256"}],name:"stake",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"stakingToken",outputs:[{internalType:"contract IERC20",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"userRewardPerTokenPaid",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"amount",type:"uint256"}],name:"withdraw",outputs:[],stateMutability:"nonpayable",type:"function"}],rewards:[{constant:!0,inputs:[],name:"name",outputs:[{name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"spender",type:"address"},{name:"value",type:"uint256"}],name:"approve",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"totalSupply",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"from",type:"address"},{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"transferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{name:"_spender",type:"address"},{name:"_value",type:"uint256"},{name:"_extraData",type:"string"}],name:"approveAndCall",outputs:[{name:"success",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"spender",type:"address"},{name:"addedValue",type:"uint256"}],name:"increaseAllowance",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"mint",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{name:"value",type:"uint256"}],name:"burn",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{name:"from",type:"address"}],name:"getAvailableBalance",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"tokensMinted",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"owner",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"from",type:"address"},{name:"value",type:"uint256"}],name:"burnFrom",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"symbol",outputs:[{name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"account",type:"address"}],name:"addMinter",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[],name:"renounceMinter",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{name:"spender",type:"address"},{name:"subtractedValue",type:"uint256"}],name:"decreaseAllowance",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{name:"account",type:"address"}],name:"isMinter",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"owner",type:"address"}],name:"freezeFor",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"owner",type:"address"}],name:"freezeOf",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"},{name:"_unfreezeTimestamp",type:"uint256"},{name:"_subsequentUnlock",type:"bool"}],name:"mintWithFreeze",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"maxSupply",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"owner",type:"address"},{name:"spender",type:"address"}],name:"allowance",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{inputs:[],payable:!1,stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,name:"account",type:"address"}],name:"MinterAdded",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"account",type:"address"}],name:"MinterRemoved",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"owner",type:"address"},{indexed:!0,name:"spender",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Approval",type:"event"}]};W.staking=W.rewards;function U(t,e){var n=w.opts[t+"Address"],t=W[t];return new e.eth.Contract(t,n)}function z(){return d(void 0,void 0,void 0,function(){var n,a,o,i;return c(this,function(t){switch(t.label){case 0:return w.account?(n=new window.Web3(window.Web3.givenProvider||window.ethereum),[4,(e=n,d(void 0,void 0,void 0,function(){return c(this,function(t){return[2,Promise.all([U("farm",e),U("rewards",e),U("staking",e)]).then(function(t){return{farm:t[0],rewards:t[1],staking:t[2]}})]})}))]):[2];case 1:return[4,(a=t.sent()).staking.methods.symbol().call()];case 2:return o=t.sent(),[4,a.rewards.methods.symbol().call()];case 3:return i=t.sent(),l({web3:n,contracts:a,stakingTokenName:o,rewardsTokenName:i}),v.dispatch("setup web3"),[2]}var e})})}function V(){return d(void 0,void 0,void 0,function(){var e,n,a;return c(this,function(t){switch(t.label){case 0:if(G)return[2];e=document.getElementById(b.ids.connectModal.cancelButton),n=document.getElementById(b.ids.connectModal.connectButton),t.label=1;case 1:return t.trys.push([1,5,6,7]),G=!0,e.classList.add("disabled"),n.innerHTML="Connect "+s(),[4,window.ethereum.request({method:"eth_requestAccounts"})];case 2:return a=t.sent(),l({account:a[0]}),localStorage.setItem("ff-account-unlocked","true"),[4,window.ethereum.enable()];case 3:return t.sent(),[4,z()];case 4:return t.sent(),K(),[3,7];case 5:return a=t.sent(),console.error(a),g(a.message),[3,7];case 6:return G=!1,e.classList.remove("disabled"),n.innerHTML="Connect",[7];case 7:return[2]}})})}function j(){return d(void 0,void 0,void 0,function(){var e,n,a;return c(this,function(t){switch(t.label){case 0:if(e=w.opts,!(n={1:"mainnet",3:"ropsten",42:"kovan"}[window.ethereum.networkVersion])||e.networkName.toLowerCase()!==n.toLowerCase())return _(),[2];if(!("true"===localStorage.getItem(Z)))return[3,5];t.label=1;case 1:return t.trys.push([1,3,,4]),[4,window.ethereum.request({method:"eth_accounts"})];case 2:return(a=t.sent())[0]?l({account:a[0]}):(localStorage.removeItem(Z),Q()),[3,4];case 3:return a=t.sent(),console.error(a),localStorage.removeItem(Z),Q(),[3,4];case 4:return[3,6];case 5:Q(),t.label=6;case 6:return[2]}})})}var q,G=!1,J='\n  <div class="farmfactory-overlay">\n    <div class="farmfactory-modal">\n      <button class="farmfactory-closeButton" id="'+b.ids.connectModal.closeButton+'">\n        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">\n          <path stroke="currentColor" stroke-width="2" d="M9 9l7 6.99L23 9l-6.99 7L23 23l-7-6.99L9 23l6.99-7L9 9z" opacity=".9"/>\n        </svg>\n      </button>\n      <div class="farmfactory-inner">\n        <img class="farmfactory-svgLogo" src="https://metamask.io/images/mm-logo.svg" alt="Metamask" />\n      </div>\n      <div class="farmfactory-footer">\n        <button class="farmfactory-button yellow" id="'+b.ids.connectModal.connectButton+'">Connect</button>\n        <button class="farmfactory-button gray" id="'+b.ids.connectModal.cancelButton+'">Cancel</button>\n      </div>\n    </div>\n  </div>\n',K=function(){document.getElementById(b.ids.modalsRoot).innerHTML=""},Q=function(){document.getElementById(b.ids.modalsRoot).innerHTML=J;var t=document.getElementById(b.ids.connectModal.connectButton),e=document.getElementById(b.ids.connectModal.cancelButton),n=document.getElementById(b.ids.connectModal.closeButton);t.addEventListener("click",V),e.addEventListener("click",K),n.addEventListener("click",K)},X=function(){var t=document.getElementById(b.ids.timerRoot);t&&(t.innerText="--:--:--:--")},Y=function(){return d(void 0,void 0,void 0,function(){var e,o,n,a,i,r;return c(this,function(t){switch(t.label){case 0:return(e=w.opts,i=w.contracts,o=document.getElementById(b.ids.timerRoot))?i?[3,2]:(n=new Web3(b.networks[e.networkName]),[4,U("farm",n)]):[2];case 1:n=t.sent(),i={farm:n},t.label=2;case 2:return t.trys.push([2,4,,5]),[4,i.farm.methods.periodFinish().call()];case 3:return a=t.sent(),[3,5];case 4:return i=t.sent(),console.error(i),[2];case 5:return 0<(r=Number(a.toString()))-Date.now()/1e3?(q&&clearInterval(q),q=setInterval(function(){var t=Math.floor((1e3*r-Date.now())/1e3),e=Math.floor(t/86400);t-=86400*e;var n=Math.floor(t/3600)%24;t-=3600*n;var a=Math.floor(t/60)%60,t=(t-=60*a)%60,t=(e<10?"0"+e:e)+":"+(n<10?"0"+n:n)+":"+(a<10?"0"+a:a)+":"+(t<10?"0"+t:t);o.innerText=t},1e3)):o.innerText=e.timesUpMessage||"Farming not started yet",[2]}})})},Z="ff-account-unlocked";return{init:function(u){return d(void 0,void 0,void 0,function(){var o,i,r,s;return c(this,function(t){switch(t.label){case 0:return(o=u.networkName,i=u.farmAddress,r=u.rewardsAddress,s=u.stakingAddress,l({opts:u}),e=document.createElement("div"),n=document.createElement("div"),e.setAttribute("id",b.ids.modalsRoot),n.setAttribute("id",b.ids.infoModalRoot),document.body.appendChild(e),document.body.appendChild(n),o&&i&&r&&s)?document.getElementById(b.ids.widgetRoot)?(D(),X(),[4,d(void 0,void 0,void 0,function(){return c(this,function(t){return window.ethereum?[2,new Promise(function(t){var e=setInterval(function(){window.ethereum.networkVersion&&(clearInterval(e),j(),window.ethereum.on("networkChanged",j),t())},500)})]:(P('\n      <div class="install-metamask">\n        <img src="https://swaponline.github.io/images/metamask_45038d.svg" /><br />\n        Please install MetaMask\n      </div>\n    '),[2])})})]):(g("Template variable not found! Please use {farmfactory-widget-root}."),[2]):(g("Check farmFactory.init(options). Required options: networkName, farmAddress, rewardsAddress, stakingAddress."),[2]);case 1:return t.sent(),[4,(a="https://cdnjs.cloudflare.com/ajax/libs/web3/1.3.1/web3.min.js",new Promise(function(t,e){var n=document.createElement("script");n.onload=t,n.onerror=e,n.src=a,document.head.appendChild(n)}))];case 2:return t.sent(),[4,d(void 0,void 0,void 0,function(){return c(this,function(t){switch(t.label){case 0:return[4,z()];case 1:return t.sent(),Y(),[2]}})})];case 3:return t.sent(),[2]}var a,e,n})})}}}();