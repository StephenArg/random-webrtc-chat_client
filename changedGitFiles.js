var cgf = require("changed-git-files");
var fs = require('fs')

// var data = require('./src/mockDB/what.json')

cgf(function(err, results){
    console.log("err", err)
    console.log("results", results)

    var imports = {}

    results.forEach(obj => {
        if (obj.filename.includes("mockDB")){
            const routeSplit = obj.filename.split('/')
            const varName = routeSplit[routeSplit.length - 1].split('.')[0]
            imports[varName] = {}
            imports[varName][varName + "MockDB"] = `./${obj.filename}`
            imports[varName][varName + "MetaData"] = `./src/metaData/${routeSplit[routeSplit.length - 1]}`
        }
    });

    Object.entries(imports).forEach((arr) => {
        const mockDBFilename = arr[1][eval("'" + arr[0] + "MockDB" + "'")]
        const metaDataFilename = arr[1][eval("'" + arr[0] + "MetaData" + "'")]

        const importedMockDB = eval("require(\"" + mockDBFilename + "\")")
        const importedMetaData = eval("require(\"" + metaDataFilename + "\")")

        console.log(importedMockDB)
        console.log("originalMetaData", importedMetaData)
        importedMetaData.thing.payload = importedMockDB

        console.log("updatedMetaData", importedMetaData)

        fs.writeFileSync(metaDataFilename, JSON.stringify(importedMetaData))
        console.log("Completed")
    })
    
});