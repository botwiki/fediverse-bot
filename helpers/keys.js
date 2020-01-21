var fs = require('fs'),
    util = require('util'),
    generate_rsa_keypair = require('generate-rsa-keypair'),
    pem = require('pem'),
    pubkey_path = '.data/rsa/pubKey',
    privkey_path = '.data/rsa/privKey';

module.exports = {
  generateKeys: function(cb) {
    console.log('generating keys...');
    
    try{
      fs.mkdirSync('.data/rsa');
    } catch(err){ /* noop */ }
    
    var pair = generate_rsa_keypair();    

    fs.writeFileSync(privkey_path, pair.private);
    fs.writeFileSync(pubkey_path, pair.public);
    
    if (cb){
      cb(null);
    }
  }
};
