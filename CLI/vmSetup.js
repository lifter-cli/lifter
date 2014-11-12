exports.vmSetup = {
    properties: {
      vm: {
        description: "Please select a name for the VM that will become the Docker container host computer in Azure".white,
        required: true
      },
      username: {
        description: "Please create a username for your Azure VM".white,
        required: true
      },
      password: {
        description: "Please create a password for your Azure VM.\nPassword must be at least 8 characters, contain one lower case and one upper case character, a number, and a special character: !@#$%^&+=".white,
        hidden: true,
        required: true
      }
    }
  };