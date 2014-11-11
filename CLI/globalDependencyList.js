exports.files = ['bower.json','karma.conf','README.md'];
exports.installCommands = {
'bower.json': ['RUN','yum install bower -g'],
'README.md': ['RUN','yum install -y yml'],
'karma.conf': ['RUN','yum install karma -g']
};