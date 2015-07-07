var Reloader = Reloader || {};

Reloader.reloadFile = (path) => {
  var x = document.createElement("script");
  x.setAttribute("src",path + "?rel=" + (new Date().getTime()));
  document.body.appendChild(x);
  setTimeout(function(){ document.body.removeChild(x);}, 1000);
}

Reloader.startReloading = (files) => {
  setTimeout(function() {
    console.log("--- reloading ---");
    files.map(Reloader.reloadFile);
  }, 500);
}

Reloader.startReloading(["build/yome.js"])

// -----------------------------------------------------------------------------

function l (x) { console.log(x); return x; }

var Yome = Yome || {};

Yome.initialState = () => {
  return { sides: [1,2,3,4,5,6,7,8].map( () => new Object() )}
}

Yome.state = Yome.state || Yome.initialState();
// l(Yome.state)

Yome.sideCount = (st) => st.sides.length
// l(Yome.sideCount(Yome.state))

Yome.sliceTheta = (st) => 2 * Math.PI / Yome.sideCount(st)
// l(Yome.sliceTheta(Yome.state))

Yome.rotate = (theta, point) => {
  const sint = Math.sin(theta), cost = Math.cos(theta);
  return { x: (point.x * cost) - (point.y * sint),
           y: (point.x * sint) + (point.y * cost) };
}
// l(Yome.rotate(Math.PI, {x: 0, y: 1}));

Yome.radialPoint = (radius, theta) =>
  Yome.rotate(theta, {x: 0, y: radius})
// l(Yome.radialPoint(100, Math.PI));
