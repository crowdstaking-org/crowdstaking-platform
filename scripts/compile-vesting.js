const solc = require('solc');
const fs = require('fs');
const path = require('path');

// Read the Solidity source code
const contractPath = path.resolve(__dirname, '../contracts/VestingContract.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// Solidity compiler input
const input = {
  language: 'Solidity',
  sources: {
    'VestingContract.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    },
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

// Compile the contract
console.log('Compiling VestingContract.sol...');

function findImports(importPath) {
  // Handle OpenZeppelin imports
  if (importPath.startsWith('@openzeppelin/')) {
    try {
      const openzeppelinPath = path.resolve(__dirname, '../node_modules', importPath);
      const content = fs.readFileSync(openzeppelinPath, 'utf8');
      return { contents: content };
    } catch (error) {
      return { error: 'File not found: ' + importPath };
    }
  }
  return { error: 'File not found: ' + importPath };
}

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

// Check for errors
if (output.errors) {
  const hasErrors = output.errors.some(error => error.severity === 'error');
  
  if (hasErrors) {
    console.error('Compilation errors:');
    output.errors.forEach(error => {
      console.error(error.formattedMessage);
    });
    process.exit(1);
  } else {
    // Just warnings
    console.log('Compilation warnings:');
    output.errors.forEach(error => {
      console.warn(error.formattedMessage);
    });
  }
}

// Extract compiled contract
const contract = output.contracts['VestingContract.sol']['VestingContract'];

if (!contract) {
  console.error('Contract not found in compilation output');
  process.exit(1);
}

// Save ABI and Bytecode
const compiledPath = path.resolve(__dirname, '../contracts/compiled');
if (!fs.existsSync(compiledPath)) {
  fs.mkdirSync(compiledPath, { recursive: true });
}

const result = {
  contractName: 'VestingContract',
  abi: contract.abi,
  bytecode: '0x' + contract.evm.bytecode.object,
  deployedBytecode: '0x' + (contract.evm.deployedBytecode?.object || ''),
  compiler: {
    version: solc.version(),
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.resolve(compiledPath, 'VestingContract.json'),
  JSON.stringify(result, null, 2)
);

console.log('\n✅ Compilation successful!');
console.log('📁 Output saved to: contracts/compiled/VestingContract.json');
console.log('\nContract Details:');
console.log('- ABI functions:', contract.abi.filter(item => item.type === 'function').length);
console.log('- Events:', contract.abi.filter(item => item.type === 'event').length);
console.log('- Bytecode size:', contract.evm.bytecode.object.length / 2, 'bytes');

