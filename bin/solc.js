var fs = require('fs');
var path = require('path');
var solc = require('solc');


var contract = fs.readFileSync(path.resolve('contracts/Farm.sol'))

var input = {
  language: 'Solidity',
  sources: {
    'Farm.sol': {
      content: contract.toString()
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for compilation errors
if (output.errors) {
  var hasErrors = output.errors.some(function(error) {
    return error.severity === 'error';
  });

  if (hasErrors) {
    console.error('Solidity compilation errors:');
    output.errors.forEach(function(error) {
      console.error(error.formattedMessage);
    });
    process.exit(1);
  }
}

// Check if contracts exist
if (!output.contracts || !output.contracts['Farm.sol'] || !output.contracts['Farm.sol']['Farm']) {
  console.error('Error: Contract compilation failed - Farm contract not found in output');
  console.error('Creating stub Farm.json for development...');

  // Create stub file to allow build to continue
  var stub = {
    abi: [],
    bytecode: '0x'
  };
  fs.writeFileSync(path.resolve('contracts/Farm.json'), JSON.stringify(stub));
  process.exit(1);
}

var result = {
  abi: output.contracts['Farm.sol']['Farm'].abi,
  bytecode: output.contracts['Farm.sol']['Farm'].evm.bytecode.object,
}

fs.writeFileSync(path.resolve('contracts/Farm.json'), JSON.stringify(result))

// `output` here contains the JSON output as specified in the documentation
// for (var contractName in output.contracts['Farm.sol']) {
//   console.log(
//     contractName +
//     ': ' +
//     output.contracts['Farm.sol'][contractName].evm.bytecode.object
//   );
// }
