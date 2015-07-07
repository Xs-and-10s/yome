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

Yome.sidePoints = (st) =>
  st.sides.map((_,i) => Yome.radialPoint(180, i * Yome.sliceTheta(st)))
// l(Yome.sidePoints(Yome.initialState()))

Yome.pointsToPointsString = (points) =>
  points.map(p => p.x + "," + p.y).join(" ")
// l(Yome.pointsToPointsString(Yome.sidePoints(Yome.initialState())))

Yome.drawWalls = (state) =>
  <polygon points={Yome.pointsToPointsString(Yome.sidePoints(state))}>
  </polygon>

Yome.svgWorld = (children) =>
  <svg height="500" width="500" viewBox="-250 -250 500 500"
       preserveAscpectRatio="xMidYMid meet">
    {children}
  </svg>

Yome.playArea = (children) =>
  React.render(Yome.svgWorld(children), document.getElementById("playarea"))

Yome.clearPlayArea = () =>
  React.unmountComponentAtNode(document.getElementById("playarea"))

// Yome.playArea(Yome.drawWalls({sides: [1,2,3,4,5,6]}))
// Yome.playArea(Yome.drawWalls({sides: [1,2,3,4,5,6,7]}))
// Yome.playArea(Yome.drawWalls({sides: [1,2,3,4,5,6,7,8]}))

// Yome.clearPlayArea()
