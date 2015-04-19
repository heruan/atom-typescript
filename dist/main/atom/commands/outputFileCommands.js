var atomUtils = require("../atomUtils");
var parent = require("../../../worker/parent");
var child_process_1 = require("child_process");
var path = require("path");
function register() {
    atom.commands.add('atom-workspace', 'typescript:output-toggle', function (e) {
        if (!atomUtils.commandForTypeScript(e))
            return;
        var query = atomUtils.getFilePath();
        var previousActivePane = atom.workspace.getActivePane();
        parent.getOutput(query).then(function (res) {
            if (res.output.emitSkipped) {
                atom.notifications.addInfo('AtomTS: No emit for this file');
                return;
            }
            else {
                var uri = res.output.outputFiles[0].name.split("/").join(path.sep);
                var previewPane = atom.workspace.paneForURI(uri);
                if (previewPane) {
                    previewPane.destroyItem(previewPane.itemForURI(uri));
                }
                else {
                    atom.workspace.open(res.output.outputFiles[0].name, { split: "right" }).then(function () {
                        previousActivePane.activate();
                    });
                }
            }
        });
    });
    atom.commands.add('atom-workspace', 'typescript:output-file-execute-in-node', function (e) {
        if (!atomUtils.commandForTypeScript(e))
            return;
        var query = atomUtils.getFilePath();
        parent.getOutput(query).then(function (res) {
            if (res.output.emitSkipped) {
                atom.notifications.addInfo('AtomTS: No emit for this file');
                return;
            }
            else {
                child_process_1.exec("node " + res.output.outputFiles[0].name, function (err, stdout, stderr) {
                    console.log(stdout);
                    if (stderr.toString().trim().length) {
                        console.error(stderr);
                    }
                });
            }
        });
    });
}
exports.register = register;