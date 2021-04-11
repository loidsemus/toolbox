require("yargs")
    .scriptName("toolbox")
    .usage("$0 <cmd> [args]")
    .commandDir("./commands")
    .help()
    .argv