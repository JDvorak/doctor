/* bar */
function a() {

}

var thing = {
  a: {
    /* baz */
    f: function () {}
  }
};

var b = a;

var c = thing.a.f;

exports.bar = b;
exports.baz = c;