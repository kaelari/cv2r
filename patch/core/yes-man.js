module.exports = {
  patch: [
    // Sets the default merchant dialog answer to 'yes'
    { offset: 0x1ED1F, bytes: [ 0x01 ] }
  ]                                                                                                                                                                                                                 
};
