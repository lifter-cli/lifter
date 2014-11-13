exports.vmSetup = {
    properties: {
      vm: {
        description: "Please select a name for your azure vm".white,
        required: true
      },
      username: {
        description: "Please create a username for your Azure VM".white,
        required: true
      },
      password: {
        description: "Please create a password for your Azure VM. Password should contain 8 characters, one lower case, one upper case character, a number, and a special character: !@#$%^&+=".white,
        hidden: true,
        required: true,
        pattern: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,20})/,
        message: "Please make sure your password meets all requirements"
      }
    }
  };
