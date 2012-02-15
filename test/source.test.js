var test = require("tap").test;
var Path = require('path');
var fs = require('fs');
var doctor = require('../lib/doctor');
var nast = require('../lib/nice-ast');

function removeEmptyStatements(ast) {
  if (!ast.nodes) {
    return;
  }
  for (var i = 0; i < ast.nodes.length; i++) {
    if (ast.nodes[i].type === 'empty') {
      ast.nodes.splice(i, 1);
      i--;
    } else {
      removeEmptyStatements(ast.nodes[i]);
    }
  }
}

function testSource(sourceFile) {
  var sourceName = sourceFile;
  test('check against source: ' + sourceFile, function (t) {
    sourceFile = Path.join(__dirname, 'fixture', 'source', sourceFile + '.js');
    // get a ast from the file
    nast.astFromFile({}, sourceFile, function (err, ast) {
      t.equal(err, null);
      // now let doctor turn the file into an ast and then into source code
      doctor.examine({
        files: [sourceFile],
        transform: false,
        report: 'ast',
        render: 'source',
        followRequired: false
      }, function (err, report) {
        t.equal(err, null);
        //console.log(err);
        var keys = Object.keys(report);
        t.equal(keys.length, 1);
        if (keys.length !== 1) {
          t.end();
        } else {
          // finally convert that source code to an ast
          nast.astFromSource({}, report[keys[0]], function (err, sourcedAst) {
            //console.log(sourceFile);
            //console.log(report[keys[0]]);
            // console.log(JSON.stringify(ast, null, 2));
            // console.log(">>>" + nast.extendAst(ast).lispify());
            // console.log(">>>" + nast.extendAst(sourcedAst).lispify());

            removeEmptyStatements(ast);
            removeEmptyStatements(sourcedAst);

            // and compare it to the first ast
            var diff = {};
            var equal = nast.equal(ast, sourcedAst, diff);
            if (!equal) {
              console.log(sourceName + " failed: ast line: " + diff.a.line +
                ", source line: " + diff.b.line);
              console.log(report[keys[0]]);
            }
            t.equal(equal, true);
            t.end();
          });
        }
      });
    });
  });
}

function testSources(sources) {
  sources.forEach(function (source) {
    testSource(source);
  });
}

testSources([
  'define-function',
  'name',
  'parameters',
  'nodes',
  'return',
  'vars',
  'call',
  'dot',
  'subscript',
  'arguments',
  'assign',
  'operator',
  'new',
  'postfix',
  'unary',
  'switch',
  'block',
  'regex',
  'string',
  'number',
  'object',
  'array',
  'undefined',
  'null',
  'boolean',
  'this',
  'get',
  'set',
  'conditional',
  'empty',
  'if',
  'while',
  'label',
  'throw',
  'try',
  'debug',
  'function',
  'for',
  'for-in',

  'express/express',
  'express/http',
  'express/https',
  'express/request',
  'express/response',
  'express/utils',
  'express/view',

  'yamlish/yamlish',
  
  'tap/tap-consumer',
  'tap/runner',
  'tap/tap-runner',

  'mkdirp/index',

  'jade/jade',
  'jade/parser',

  'react/vcon'
]);