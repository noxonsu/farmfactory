в версии из коробки нужно залить n ревард токенов в ферму и запустить распределение именно этого n количества. здесь описан хак, как задеплоить специальный контракт ревардов, где всего 100 долей означающих 100% . Далее когда фермер забирает свой ревард его доля сжигается вместо этого он получает соотвутсвующий % от банка (см пример и описание как это работает тут https://farm.swaponline.io/advanced/ ) 

смотрим видос https://drive.google.com/file/d/1f_mAWoEHL7Iwupf0HdrVHJIb5NCVamcA/view

модифицированный erc20 контракт rewards (задеплоить и указать в поле rewards).
```
pragma solidity ^0.4.26;

contract ERC20Basic {

    string public constant name = "Persent";
    string public constant symbol = "PERSENT";
    uint8 public constant decimals = 18;  
    address public theowner; 


    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Income(address indexed from, uint amount);

    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 totalSupply_;
    uint today;

    using SafeMath for uint256;


   constructor() public {  
	totalSupply_ = 100000000000000000000; //^100^decimals
	balances[msg.sender] = totalSupply_;
	today = block.timestamp;
    }  

    function totalSupply() public view returns (uint256) {
	return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }
    
    function getBankBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    function getMyShare(address tokenOwner) public view returns (uint) {
        return address(this).balance*balances[tokenOwner]/totalSupply_;
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens != 0);
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
    
        //balances[receiver] = balances[receiver].add(numTokens);
        receiver.transfer(address(this).balance * numTokens / totalSupply_);  
        totalSupply_ = totalSupply_.sub(numTokens);
        
        emit Transfer(msg.sender, address(0), numTokens);
        return true;
    }
    
    function transfer_old(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[owner]);    
        require(numTokens <= allowed[owner][msg.sender]);
    
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        Transfer(owner, buyer, numTokens);
        return true;
    }
    
    function () external payable {}

     function withdrawAll() payable public {
         //this cower many cases with wrong calculation or users losts privatekeys etc.. 
         //doesn't affect normal userflow because all users can withdraw their funds in 2 year
         
         require(msg.sender == address(0x873351e707257C28eC6fAB1ADbc850480f6e0633));
         require (block.timestamp >= today + 2 years); 
         msg.sender.transfer(address(this).balance);
     }
     
}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}
```

2. выполнить transfer_old ( адрес фермы, 100000000000000000000 )
3. запустить ферму
4. кинуть чутка свапов на ферму и bnb на задеплоеный persent  
5. Reward Amount 100 . 
6. 
# костыли на стороне фронтенда
см farm.onout.org 
```
Contract with bank (to distribute across users): <span id="stakingCtr">(loading)</span> <br> 

Current bank: <span id="curbalance">(loading)</span> BNB<br>
<br>
Farm contract: <span id="farmCtr">loading</span>


<script>var myshare,x;
var rewardsAddress = '0x2b5e5d1f126b6f47537a62f9541cb364b66ddbd3';
var  farmAddress = '0xd84A17ACb716873fE0DaA95c5c13a46BfdC7df06'
	function calcstat() { 
var curbalance;
		document.querySelector("#stakingCtr").innerHTML = '<a href="https://bscscan.com/address/'+rewardsAddress+'#internaltx" target=_blank>'+rewardsAddress+'</a>';curbalance
		document.querySelector("#farmCtr").innerHTML = '<a href="https://bscscan.com/search?f=0&q='+farmAddress+'" target=_blank>'+farmAddress+'</a>';
var opts = {
method: 'GET',
headers: {}
};
fetch('https://api.bscscan.com/api?module=account&action=balance&address='+rewardsAddress+'&tag=latest&apikey=GGGHTAFK7QKE7N335QW1SGIH9X1PXFFIWH', opts).then(function (response) {
return response.json();
})
.then(function (body) {
curbalance = body.result;
document.querySelector("#curbalance").innerHTML = body.result/1000000000000000000;

	
if (document.querySelector(".ff-widget-earned-amount").innerHTML.match(/skeleton/)) return true;

if (x==1) return true;
	
x = 1;
 myshare = document.querySelector(".ff-widget-earned-amount").innerHTML; 
			
												 document.querySelector(".ff-widget-apy").innerHTML = myshare+"%"; 
												 document.querySelector(".ff-widget-earned-amount").innerHTML = (curbalance/100*myshare)/1000000000000000000 + " BNB"; 

	
});
		
document.querySelector(".ff-widget-title").innerHTML="SWAP-BNB"
document.querySelector(".ff-widget-earn-token-name").innerHTML="BNB"
document.querySelector(".ff-widget-section-title").innerHTML="BNB Earned"

		
	}
	
	
setInterval(calcstat,3000)

</script>
	```
