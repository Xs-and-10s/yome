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

Yome.windowPoints = (st) => {
  const theta = Yome.sliceTheta(st),
        indent = theta / 6;
  return [Yome.radialPoint(160, indent),
          Yome.radialPoint(160, theta - indent),
          Yome.radialPoint(100, theta / 2)];
}
// l(Yome.windowPoints(Yome.initialState()))

Yome.drawWindow = (st) =>
  <polygon points={ Yome.pointsToPointsString(Yome.windowPoints(st)) }>
  </polygon>

// Yome.playArea(<g>{Yome.drawWindow(Yome.initialState())}
//                  {Yome.drawWalls(Yome.initialState())}</g>)

Yome.doorPoints = (st) => {
  const indent = Yome.sliceTheta(st) / 8;
  return [Yome.radialPoint(165,  indent),
          Yome.radialPoint(165, -indent),
          Yome.radialPoint(90,  -indent),
          Yome.radialPoint(90,   indent)];
}

Yome.drawDoor = (st) =>
  <polygon points={ Yome.pointsToPointsString(Yome.doorPoints(st)) }>
  </polygon>

// Yome.playArea(<g>{Yome.drawDoor(Yome.state) }
                 // {Yome.drawWindow(Yome.state) }
                 // {Yome.drawWalls(Yome.state) }</g>)

Yome.drawLine = (line) =>
  <line x1={line.start.x} y1={line.start.y}
        x2={line.end.x} y2={line.end.y}>
  </line>

Yome.drawZipDoor = (st) => {
  const theta   = Yome.sliceTheta(st),
        indent  = 0.15 * (theta / 6),
        lines   = [0,1,2,3,4,5,6,7,8].map( (x) => {
          const dist = 170 - (10 * x);
          return {start: Yome.radialPoint(dist, -indent),
                  end:   Yome.radialPoint(dist,  indent)}});
  lines.push({start: Yome.radialPoint(180, 0),
              end:   Yome.radialPoint(90, 0)});
  return <g>{lines.map(Yome.drawLine)}</g>;
}

// Yome.playArea(<g>{Yome.drawZipDoor(Yome.state)}
//                  {Yome.drawWalls(Yome.state)}</g>)
