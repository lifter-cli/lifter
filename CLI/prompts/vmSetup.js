var vmSetup = {
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

var existingOrNew = {
  properties: {
    select: {
      description: "Are you deploying to an existing azure vm or creating a new one? (existing/new)".white,
      pattern: /existing|new/,
      message: "Please type in existing or new".red,
      required: true
    }
  }
}

var vmInfo = {
  properties: {
    vmName: {
      description: "What is your vm name?".white,
      required: true
    },
    vmUsername: {
      description: "What is your vm username?".white,
      required: true
    }
  }
}

module.exports = {
  vmSetup : vmSetup,
  existingOrNew : existingOrNew,
  vmInfo : vmInfo

}