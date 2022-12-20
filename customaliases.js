/*---------------------------------------------------------------------------------------------------------
  Spatial Entity Constructor
---------------------------------------------------------------------------------------------------------*/
class Vector2D {
  constructor(x = 0,y = 0) {
    this.x = x;
    this.y = y;
  }
  _toRadians(angle) { return angle * (Math.PI / 180); }
  _toDegrees(angle) { return angle * (180 / Math.PI); }

  Add(Vec) { this.x += Vec.x; this.y += Vec.y; }
  Sub(Vec) { this.x -= Vec.x; this.y -= Vec.y; }
  Mult(Vec) { this.x *= Vec.x; this.y *= Vec.y; }
  Div(Vec) { this.x /= Vec.x; this.y /= Vec.y; }
  AddScalar(Scalar) { this.x += Scalar; this.y += Scalar; }
  SubScalar(Scalar) { this.x -= Scalar; this.y -= Scalar; }
  MultScalar(Scalar) { this.x *= Scalar; this.y *= Scalar; }
  DivScalar(Scalar) { this.x /= Scalar; this.y /= Scalar; }
  Rotate(Deg) { 
    var Cos = Math.cos(this._toRadians(Deg)) , Sin = Math.sin(this._toRadians(Deg));
    var nx = this.x * Cos - this.y * Sin, ny = this.y * Cos + this.x * Sin;
    this.x = nx;
    this.y = ny;
  }
  Cross(Vec) { 
    if (arguments.length > 0) { return new Vector2D(Vec.y - this.y,this.x - Vec.x); }
    else { return new Vector2D(-this.y,this.x); }
  }
  InvDot(Vec) { return this.x * Vec.x - this.y * Vec.y; }
  Dot(Vec) { return this.x * Vec.x + this.y * Vec.y; }
  Wedge(Vec) { return this.x * Vec.y - this.y * Vec.x; }
  MagSq() { return Math.pow(this.x,2) + Math.pow(this.y,2); }
  Mag() { return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2)); }
  Normalize() { this.DivScalar(this.Mag()); }
  Normalized() { var mag = this.Mag(); return new Vector2D(this.x / mag,this.y / mag); }
  Angle() { return this._toDegrees(Math.atan2(this.y,this.x)); }
  Clone() { return new Vector2D(this.x,this.y); }
}
class SpatialEntity {
  constructor(name,polygon,radius = 1,X = 0,Y = 0,Dx = 1,Dy = 0,Vx = 0,Vy = 0,AngVel = 0,friction = 0) {
    this.name = name;
    if (polygon.length == 2) { this.type = "point"; }
    else if (polygon.length == 4) { this.type = "lineseg"; }
    else { this.type = "polygon"; }
    this.polygon = polygon;
    this.radius = radius;
    this.position = new Vector2D(X,Y);
    this.direction = new Vector2D(Dx,Dy);
    this.velocity = new Vector2D(Vx,Vy);
    this.angularvelocity = AngVel;
    this.friction = friction;
    this.TranslatePolygon();
  }
  setPosition(x,y) { this.position.x = x; this.position.y = y; this.TranslatePolygon(); }
  setDirection(x,y) { this.direction.x = x; this.direction.y = y; this.TranslatePolygon(); }
  setVelocity(x,y) { this.velocity.x = x; this.velocity.y = y; }
  applyForce(x,y) { this.velocity.x += x; this.velocity.y += y; }
  setAngularVelocity(a) { this.angularvelocity = a; }
  Update(DeltaTime) {
    this.oldposition = this.position.Clone();
    this.position.x += this.velocity.x * DeltaTime;
    this.position.y += this.velocity.y * DeltaTime;
    if (this.friction != 0) {
      var fx = this.velocity.x * this.friction , fy = this.velocity.y * this.friction;
      this.velocity.x -= fx * DeltaTime;
      this.velocity.y -= fy * DeltaTime;
      if ((Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2)) <= 0.0000007) { this.setVelocity(0,0); }
    }
    if (this.angularvelocity != 0) {
      //Rotate our directional vector
      var Cosine = Math.cos(this.angularvelocity * DeltaTime) , Sine = Math.sin(this.angularvelocity * DeltaTime);
      var NewDx = this.direction.x * Cosine - this.direction.y * Sine , NewDy = this.direction.x * Sine + this.direction.y * Cosine;
      this.direction.x = NewDx;
      this.direction.y = NewDy;
    }
    this.TranslatePolygon();
  }
  TranslatePolygon() {
    //Shove each Point through a rotational matrix and add our offset (rotate and move)
    this.translated = this.polygon.slice(0);
    var minx, miny, maxx, maxy;
    for (var i = 0; i < this.translated.length; i += 2) {
      var A = this.translated[i] , B = this.translated[i + 1];
      this.translated[i] = A * this.direction.x - B * this.direction.y + this.position.x; 
      this.translated[i + 1] = A * this.direction.y + B * this.direction.x + this.position.y;
      if (i == 0) { minx = maxx = this.translated[i]; miny = maxy = this.translated[i+1]; }
      minx = Math.min(minx,this.translated[i]);
      maxx = Math.max(maxx,this.translated[i]);
      miny = Math.min(miny,this.translated[i+1]);
      maxy = Math.max(maxy,this.translated[i+1]);
    }
    if (this.translated.length == 2) { this.bounds = [parseInt(this.position.x - this.radius / 2),parseInt(this.position.y - this.radius / 2),parseInt(this.position.x + this.radius / 2),parseInt(this.position.y + this.radius / 2)]; }
    else { this.bounds = [parseInt(minx),parseInt(miny),parseInt(maxx),parseInt(maxy)]; }
    this.Width = this.bounds[2] - this.bounds[0];
    this.Height = this.bounds[3] - this.bounds[1];
    this.Mag = Math.sqrt(this.Width*this.Width+this.Height*this.Height);
    if (this.translated.length == 4) {
      this.Width = this.translated[2] - this.translated[0];
      this.Height = this.translated[3] - this.translated[1];
      this.Mag = Math.sqrt(this.Width*this.Width+this.Height*this.Height);
      this.NormalX = this.Height / this.Mag * -1;
      this.NormalY = this.Width / this.Mag;
      this.Dist = (0 - (this.translated[0] * this.NormalX + this.translated[1] * this.NormalY));
      //this.position.x = this.Width / 2 + this.bounds[0];
      //this.position.y = this.Height / 2 + this.bounds[1];
    }
    if (this.translated.length > 4) { this.radius = (Math.max(this.Width,this.Height) / 2) * 1.5; }
  }
  OffsetPolygon(x,y,scale = 1) { 
    var poly = this.translated.slice(0);
    for (var i = 0; i < poly.length; i += 2) { poly[i] *= scale; poly[i] += x; poly[i+1] *= scale; poly[i+1] += y; }
    return poly;
  }
}
  
  /*---------------------------------------------------------------------------------------------------------
    Asteroids Game Constructor
  ---------------------------------------------------------------------------------------------------------*/
  
  function Asteroids(Window) {
    //Where The Magic Gets Drawn!
    this._Canvas = Window.Picture;
    this._Window = Window;
    this._Invul = true;
    this._Debug = false;
  }
  Asteroids.prototype = {
    KeyDown: function(e) { this._Keys[e.keyCode] = 1; },
    KeyUp: function(e) { this._Keys[e.keyCode] = 0; },
    NewGame: function() {
      //Offset values to convert our cartesian grid coordinates to canvas coordinates
      this._ox = this._Canvas.width / 2;
      this._oy = this._Canvas.height / 2;
  
      //Spatial partitioning stuff, the bounds of our world, and the number of cells in the X and Y axis.
      this._Bounds = [-this._ox,-this._oy,this._ox,this._oy];
      this._Dimensions = [parseInt(this._Canvas.width / 40) - 1,parseInt(this._Canvas.height / 40) - 1];
  
      //The keystrokes currently active...
      this._Keys = [];
  
      this._Map = []; //1D Collection of Entities per spatial partitioning grid cell (an array of arrays)
      this._Entities = []; //Collection of Polygon Entities
      this._Bullets = []; //Collection of your shot bullets
      this._Missiles = []; //Collection of Ufo shot bullets
      this._Explosions = []; //Collection of Explosion-Bits
      this._Player = new SpatialEntity("ship",this.Polygons("ship"),11,0,0,0,-1,0,0,0);
  
      this.Level = 0;
      this.Lives = 3;
      this.Score = 0;
      this.LastScore = 0;
      this.Dead = 1;
      this.FirstLaunch = 1;
      this.SpawnUfo = 20000;  
      this.GenerateRocks();
      if (!this.Animation) { this.Animation = requestAnimationFrame(this.Update.bind(this)); }
    },
    GenerateRocks: function() {
      this.Level++;
      for (var i = 0; i < (this.Level + 3); i++) {
        //TODO: Avoid spawning rocks onto our player ship...
        var DirX = Math.random() / (RandInt(0,1) ? -1 : 1) * 320;
        var DirY = Math.random() / (RandInt(0,1) ? -1 : 1) * 240;
        this._Entities.push(new SpatialEntity("largeRock",this.Polygons("largeRock" + RandInt(1,3)),48,this._Player.position.x + DirX,this._Player.position.y + DirY,1,0,Math.random() / (RandInt(0,1) ? -10 : 10),Math.random() / (RandInt(0,1) ? -10 : 10),(RandInt(0,1) ? -1 : 1) * 0.00015));
        //this._Entities.push(new AsteroidsEntity("largeRock" + RandInt(1,3),this._Player.x + DirX,this._Player.y + DirY,1,0,Math.random() / (RandInt(0,1) ? -10 : 10),Math.random() / (RandInt(0,1) ? -10 : 10),48,(RandInt(0,1) ? -1 : 1),0.015,0,0,0)); 
      }
    },
    CheckKeys: function(DeltaTime,Time) {
      this._Debug = (this._Keys[16] ? true : false);
      //Key values for left/right arrow
      if (this._Keys[37] || this._Keys[39]) { 
        //Rotate our directional vector
        var Cosine = Math.cos(0.003 * DeltaTime) , Sine = Math.sin(0.003 * DeltaTime) * ((this._Keys[39] == 1 ? 1:0) - (this._Keys[37] == 1 ? 1:0));
        var NewDx = this._Player.direction.x * Cosine - this._Player.direction.y * Sine , NewDy = this._Player.direction.x * Sine + this._Player.direction.y * Cosine;
        this._Player.direction.x = NewDx / Math.sqrt(NewDx * NewDx + NewDy * NewDy);
        this._Player.direction.y = NewDy / Math.sqrt(NewDx * NewDx + NewDy * NewDy);
      }
      //key value of up arrow
      if (this._Keys[38]) {
        //Increment our speed in our direction by 0.15 pixels per second
        var NewVX = this._Player.velocity.x + this._Player.direction.x * 0.00015 * DeltaTime , NewVY = this._Player.velocity.y + this._Player.direction.y * 0.00015 * DeltaTime;
  
        //Test that our new velocity vector isn't beyond a certain magnitude (compare squared values, instead of wasting time with sqare root)
        if ((NewVX*NewVX+NewVY*NewVY) <= 0.0184) {
          this._Player.velocity.x = NewVX;
          this._Player.velocity.y = NewVY;
        }
        if (this._Invul == true) { this._Invul = false; }
        //TODO: I believe the original game had a very small velocity decay...
      }
      //Spacebar
      if (this._Keys[32]) {
        //Limit the rate of fire, can only shoot every 250ms.
        if (this._Fired == undefined || (Time - this._Fired) >= 250) {
          //True physics, our bullet speed should add the velocity of our ship... but firing backwards could result in a bullet sitting stationary... which looks dumb.. should we do it tho?
          var Bullet = new SpatialEntity("Bullet",[0,0],5,this._Player.position.x,this._Player.position.y,this._Player.direction.x,this._Player.direction.y,this._Player.direction.x * 0.2,this._Player.direction.y * 0.2,0);
          Bullet.lifespan = 2500;
          this._Bullets.push(Bullet);
          //this._Bullets.push(new AsteroidsEntity("Bullet",this._Player.x,this._Player.y,this._Player.dx,this._Player.dy,this._Player.dx * 0.2,this._Player.dy * 0.2,5,0,0,0,0,2500)); 
          this._Fired = Time;
          if (this._Invul == true) { this._Invul = false; }
        }
      }
    },
    SpatialInsert: function(Entity) {
      var GMin = this.SpatialIndex(Entity.bounds[0],Entity.bounds[1]);
      var GMax = this.SpatialIndex(Entity.bounds[2],Entity.bounds[3]);
      for (var x = GMin[0]; x <= GMax[0]; x++) {
         for (var y = GMin[1]; y <= GMax[1]; y++) {
          var OneD = y * this._Dimensions[0] + x;
            //Initialize an empty cell if it doesn't exist already and shove in our entity...
            if (!Array.isArray(this._Map[OneD])) { this._Map[OneD] = []; }
            this._Map[OneD].push(Entity);
         }
      }
    },
    SpatialDelete: function(Entity) {
      var GMin = this.SpatialIndex(Entity.bounds[0],Entity.bounds[1]);
      var GMax = this.SpatialIndex(Entity.bounds[2],Entity.bounds[3]);
      for (var x = GMin[0]; x <= GMax[0]; x++) {
        for (var y = GMin[1]; y <= GMax[1]; y++) {
          var OneD = y * this._Dimensions[0] + x;
            //Remove items from cell if the cell exists...
            if (Array.isArray(this._Map[OneD])) { this._Map[OneD].splice(this._Map[OneD].indexOf(Entity),1); }
        }
      }
    },
    SpatialIndex: function(x,y) { return [ Math.min(Math.floor(Math.min(Math.max((x - this._Bounds[0]) / (this._Bounds[2] - this._Bounds[0]),0),1) * this._Dimensions[0]),this._Dimensions[0] -1) , Math.min(Math.floor(Math.min(Math.max((y - this._Bounds[1]) / (this._Bounds[3] - this._Bounds[1]),0),1) * this._Dimensions[1]),this._Dimensions[1] -1) ]; },
    SpatialNearBy: function(Entity) {
      var GMin = this.SpatialIndex(Entity.bounds[0],Entity.bounds[1]);
      var GMax = this.SpatialIndex(Entity.bounds[2],Entity.bounds[3]);
      var Ret = new Set();
      for (var x = GMin[0]; x <= GMax[0]; x++) {
        for (var y = GMin[1]; y <= GMax[1]; y++) {
          var OneD = y * this._Dimensions[0] + x;
            //Shove entity into our set if it's not the entity itself we're lookin at!
            if (Array.isArray(this._Map[OneD])) { this._Map[OneD].forEach((Object) => { if (Object != Entity) { Ret.add(Object); } }); }
        }
      }
      return Ret;
    },
    Update: function(Time) {
      if (this._LastUpdate == undefined) { var DeltaTime = 0; }
      else { var DeltaTime = Time - this._LastUpdate; }
      
      //Window prolly lost focus, avoid EXTREMELY LARGE timesteps updating stuff way outta bounds... (60ms is ~= 16 fps, we should always run well above this...)
      if (DeltaTime > 60) { DeltaTime = 60; }
  
      //Check keypresses and apply forces to our player first
      this.CheckKeys(DeltaTime,Time);
      
      //Score counter, give extra life every 10,000 points
      if ((this.Score - this.LastScore) >= 10000) {
        this.Lives++;
        this.LastScore = this.Score;
      }
  
      //Ufo Countdown! Spawn ufo's based on time & level
      if (this.SpawnUfo > 0 && !this._Invul) { this.SpawnUfo -= DeltaTime; }
      else if (!this._Invul) {
        this.SpawnUfo = 5000 + (30000/(1+this.Level));
        //TODO: Avoid spawning ufo's onto player ship...
        var Ufo = (RandInt(1,30) <= this.Level ? "smallufo" : "ufo");
        var DirX = Math.random() / (RandInt(0,1) ? -1 : 1) * 320;
        var DirY = Math.random() / (RandInt(0,1) ? -1 : 1) * 240;
        this._Entities.push(new SpatialEntity(Ufo,this.Polygons(Ufo + "Outline"),12,this._Player.position.x + DirX,this._Player.position.y + DirY,1,0,Math.random() / (RandInt(0,1) ? -10 : 10),Math.random() / (RandInt(0,1) ? -10 : 10),0));
        //this._Entities.push(new AsteroidsEntity((RandInt(1,30) <= this.Level ? "smallufo" : "ufo"),RandInt(this._Bounds[0],this._Bounds[2]),RandInt(this._Bounds[1],this._Bounds[3]),1,0,Math.random() / 10,Math.random() / 10,12,0,0,0,0)); 
      }
      
      //If we destroyed every entity, initialize a new level! (Should remove UFO's from this list, I think the original game did new level on all rocks destroyed...
      var RocksLeft = 0;
      this._Entities.forEach((entity) => { if (/Rock/i.test(entity.name)) { RocksLeft++; } });
      if (RocksLeft == 0) { this.GenerateRocks(); }
      
      //Combine all entity lists into one array
      var UpdList = this._Entities.slice(0).concat(this._Bullets,this._Missiles,this._Explosions);
      UpdList.push(this._Player);
  
      //Don't waste time cleaning up items from our map, just start new every time... Collisions found after an update anyways...
      this._Map = [];
  
      //Update every entity
      UpdList.forEach(function(Entity) {
        Entity.Update(DeltaTime);
        //Dirty wrap-around hack... Take integer value because Max.01 can get stuck in an infinite loop bouncing between +/-
        // Also allow our object to get beyond the bounds by it's radius (to get off-screen before wraping, to avoid the snap-effect)	  
        //TODO: Fix the problem with a rock remaining off-screen indefinately by traveling in a grid-aligned motion (1,0 or 0,1 and it's negative inverses)
        // this problem is rare, and usually a result of a larger rock being shot off screen and the two smaller ones just luckily land on this velocity vector.
        if (Entity.position.x < (this._Bounds[0] - Entity.radius) || Entity.position.x > (this._Bounds[2] + Entity.radius)) { Entity.position.x = parseInt(Entity.position.x * -1); Entity.TranslatePolygon(); }
        if (Entity.position.y < (this._Bounds[1] - Entity.radius) || Entity.position.y > (this._Bounds[3] + Entity.radius)) { Entity.position.y = parseInt(Entity.position.y * -1); Entity.TranslatePolygon(); }
        
        if (Entity.change > 0) { Entity.change -= DeltaTime; }
        else {
          if (Entity.name == "ufo" || Entity.name == "smallufo") { 
            //Randomly change direction of travel
            Entity.velocity.x = Math.random() / (RandInt(0,1) ? -10 : 10);
            Entity.velocity.y = Math.random() / (RandInt(0,1) ? -10 : 10);		  
            Entity.change = 1800 + RandInt(100,1000) / (1 + this.Level);
          }
        }
        if (Entity.shoot > 0) { Entity.shoot -= DeltaTime; }
        else {
          //Randomly shoot (small ufo's shoot at player)
          if (Entity.name == "ufo" || Entity.name == "smallufo") { 
            if (Entity.name == "ufo") {
              //Since we want a fixed bullet speed we can't cheat with math.random here... instead pick a random degree, and convert it to a directional vector, and apply a magnitude to it.
              var Angle = RandInt(0,359) * (Math.PI/180);
              var Missile = new SpatialEntity("Missile",[0,0],5,Entity.position.x,Entity.position.y,1,0,Math.cos(Angle) * 0.2,Math.sin(Angle) * 0.2,0);
              Missile.lifespan = 1250;
              this._Missiles.push(Missile);
              Entity.shoot = RandInt(500,1000); 
            }
            if (Entity.name == "smallufo") {
              //Subtract the positions of player vs ufo, and normalize to be left with a directional vector pointing in the direction of the player.
              var DiffX = this._Player.position.x - Entity.position.x , DiffY = this._Player.position.y - Entity.position.y , Mag = Math.sqrt(DiffX*DiffX+DiffY*DiffY);
              DiffX /= Mag;
              DiffY /= Mag;
              var Missile = new SpatialEntity("Missile",[0,0],5,Entity.position.x,Entity.position.y,1,0,DiffX * 0.2,DiffY * 0.2,0);
              Missile.lifespan = 1250;
              this._Missiles.push(Missile);
              Entity.shoot = 2000 + RandInt(500,22000); 
            }
          }
        }
        var spliced = 0;
        if (Entity.lifespan > 0) { Entity.lifespan -= DeltaTime; }
        else {
          //Destroy aged entities!
          if (Entity.name == "Bullet") { spliced = 1; this._Bullets.splice(this._Bullets.indexOf(Entity),1); }
          else if (Entity.name == "Missile") { spliced = 1; this._Missiles.splice(this._Missiles.indexOf(Entity),1); }
          else if (Entity.name == "Explosion") { spliced = 1; this._Explosions.splice(this._Explosions.indexOf(Entity),1); }
        }
        if (!spliced && Entity.name != "Explosion") { this.SpatialInsert(Entity); }
      },this);
      
      //Lazy Compare Entities for collisions!;
      UpdList.reduceRight((_,SortA) => {
        var near = this.SpatialNearBy(SortA);
        for (var SortB of near) {
          if (SortA.name == "Explosion" || SortB.name == "Explosion") { break; }
          if (SortA.name == "Bullet" && SortB.name == "Bullet") { break; }
          else if (SortA.name == "Missile" && SortB.name == "Missile") { break; }
          else if (/Rock/.test(SortA.name) && /Rock/.test(SortB.name)) { break; }
          else if (/ship$/.test(SortA.name) && /ship$/.test(SortB.name)) { break; }
          else if (/ship$/.test(SortA.name) && /Bullet$/.test(SortB.name)) { break; }
          else if (/ship$/.test(SortB.name) && /Bullet$/.test(SortA.name)) { break; }
          else if (/ufo$/.test(SortA.name) && /ufo$/.test(SortB.name)) { break; }
          else if (/ufo$/.test(SortA.name) && /Missile$/.test(SortB.name)) { break; }
          else if (/ufo$/.test(SortB.name) && /Missile$/.test(SortA.name)) { break; }
          var ObjectA, ObjectB;
          if (SortA.name == "Bullet" || SortA.name == "Missile") { ObjectA = SortB; ObjectB = SortA; }
          else { ObjectA = SortA; ObjectB = SortB; }
          var dmag = Math.pow(ObjectA.position.x - ObjectB.position.x,2) + Math.pow(ObjectA.position.y - ObjectB.position.y,2) , rmag = Math.pow(ObjectA.radius + ObjectB.radius,2);
          //Dirty test... If their distance apart is less than the sum of their radii, it's a collision
          if (dmag <= rmag) {
            if (ObjectB.type == "point") {
              if (InPoly(ObjectB.position.x,ObjectB.position.y,ObjectA.translated)) { 
                var i = this._Entities.indexOf(ObjectA);
                if (i > -1) { 
                  this.SpatialDelete(ObjectA); this._Entities.splice(i,1);
                  if (ObjectA.name == "largeRock") { 
                    this._Entities.push(new SpatialEntity("medRock",this.Polygons("medRock" + RandInt(1,3)),48,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -10 : 10),Math.random() / (RandInt(0,1) ? -10 : 10),(RandInt(0,1) ? -1 : 1) * 0.0015));
                    this._Entities.push(new SpatialEntity("medRock",this.Polygons("medRock" + RandInt(1,3)),48,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -10 : 10),Math.random() / (RandInt(0,1) ? -10 : 10),(RandInt(0,1) ? -1 : 1) * 0.0015));
                    if (ObjectB.name == "Bullet") { this.Score += 20; }
                    for (var i = 0; i < RandInt(5,32); i++) {                      
                      var exp = new SpatialEntity("Explosion",[0,0],1,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -5 : 5),Math.random() / (RandInt(0,1) ? -5 : 5),0)
                      exp.lifespan = RandInt(500,1000);
                      this._Explosions.push(exp);
                    }
                  }
                  else if (ObjectA.name == "medRock") { 
                    this._Entities.push(new SpatialEntity("smallRock",this.Polygons("smallRock" + RandInt(1,3)),48,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -10 : 10),Math.random() / (RandInt(0,1) ? -10 : 10),(RandInt(0,1) ? -1 : 1) * 0.0025));
                    this._Entities.push(new SpatialEntity("smallRock",this.Polygons("smallRock" + RandInt(1,3)),48,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -10 : 10),Math.random() / (RandInt(0,1) ? -10 : 10),(RandInt(0,1) ? -1 : 1) * 0.0025));
                    if (ObjectB.name == "Bullet") { this.Score += 50; }
                    for (var i = 0; i < RandInt(5,32); i++) {                      
                      var exp = new SpatialEntity("Explosion",[0,0],1,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -5 : 5),Math.random() / (RandInt(0,1) ? -5 : 5),0)
                      exp.lifespan = RandInt(500,1000);
                      this._Explosions.push(exp);
                    }
                  }
                  else if (ObjectA.name == "smallRock") { 
                    if (ObjectB.name == "Bullet") { this.Score += 100; }
                    for (var i = 0; i < RandInt(5,32); i++) {                      
                      var exp = new SpatialEntity("Explosion",[0,0],1,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -5 : 5),Math.random() / (RandInt(0,1) ? -5 : 5),0)
                      exp.lifespan = RandInt(500,1000);
                      this._Explosions.push(exp);
                    }
                  }
                  else if (ObjectA.name == "ufo" || ObjectA.name == "smallufo") { 
                    if (ObjectB.name == "Bullet") { this.Score += 200; }
                    for (var i = 0; i < RandInt(5,32); i++) {                      
                      var exp = new SpatialEntity("Explosion",[0,0],1,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -5 : 5),Math.random() / (RandInt(0,1) ? -5 : 5),0)
                      exp.lifespan = RandInt(500,1000);
                      this._Explosions.push(exp);
                    }
                  }
                }

                var i = (ObjectB.name == "Bullet" ? this._Bullets : this._Missiles).indexOf(ObjectB);
                if (i > -1) { this.SpatialDelete(ObjectB); (ObjectB.name == "Bullet" ? this._Bullets : this._Missiles).splice(i,1); }
              }
            }
            else if (ObjectB.type == "polygon") {
              if (OnPoly(ObjectA.translated,ObjectB.translated)) {
                if (/ufo/.test(ObjectA.name)) { 
                  var i = this._Entities.indexOf(ObjectA);
                  if (i > -1) { 
                    this.SpatialDelete(ObjectA); this._Entities.splice(i,1); 
                    for (var i = 0; i < RandInt(5,32); i++) {                      
                      var exp = new SpatialEntity("Explosion",[0,0],1,ObjectA.position.x,ObjectA.position.y,1,0,Math.random() / (RandInt(0,1) ? -5 : 5),Math.random() / (RandInt(0,1) ? -5 : 5),0)
                      exp.lifespan = RandInt(500,1000);
                      this._Explosions.push(exp);
                    }
                  }
                }
                else if (/ufo/.test(ObjectB.name)) {
                  var i = this._Entities.indexOf(ObjectB);
                  if (i > -1) { 
                    this.SpatialDelete(ObjectB); this._Entities.splice(i,1); 
                    for (var i = 0; i < RandInt(5,32); i++) {                      
                      var exp = new SpatialEntity("Explosion",[0,0],1,ObjectB.position.x,ObjectB.position.y,1,0,Math.random() / (RandInt(0,1) ? -5 : 5),Math.random() / (RandInt(0,1) ? -5 : 5),0)
                      exp.lifespan = RandInt(500,1000);
                      this._Explosions.push(exp);
                    }
                  }
                }
                else if ((ObjectA.name == "ship" || ObjectB.name == "ship") && !this._Invul) {
                  //Death
                  this.Lives--;
                  this._Player.setPosition(0,0);
                  this._Player.setDirection(0,-1);
                  this._Player.setVelocity(0,0);
                  //this._Player = new AsteroidsEntity("ship",0,0,0,-1,0,0,12,0,0.2,0,0,0); //You!
                  this._Invul = true;
                }  
              }
            }
          }
        }
      },null);

      if (this.Lives <= 0) { this.NewGame(); }
      //Render the game scene.
      this.Render(DeltaTime);	
  
      //Log the time given from requestAnimationFrame so we can calculate the time passed from last frame
      this._LastUpdate = Time;
      this._Animation = requestAnimationFrame(this.Update.bind(this));
    },
    Render: function(DeltaTime) {
      //Clear the screen
      this._Window.DrawRect("f","#000000",1,0,0,this._Canvas.width,this._Canvas.height);
  
      //draw Every Entity
      this._Entities.forEach(function(Entity) {
        this._Window.DrawPolygon("f","rgba(155,155,155,0.5)",1,Entity.OffsetPolygon(this._ox,this._oy));
        this._Window.DrawPolygon("","rgb(155,155,155)",1,Entity.OffsetPolygon(this._ox,this._oy));
        if (this._Debug) { this._Window.DrawDot("","#40a0c0",Entity.radius,Entity.position.x + this._ox,Entity.position.y + this._oy); }
      },this);

      this._Bullets.forEach(function(Entity) { 
        this._Window.DrawDot("f","#00fc00",2,Entity.position.x + this._ox,Entity.position.y + this._oy); 
        if (this._Debug) { this._Window.DrawDot("","#40a0c0",Entity.radius,Entity.position.x + this._ox,Entity.position.y + this._oy); }
      },this);
      this._Missiles.forEach(function(Entity) { 
        this._Window.DrawDot("f","#ff0000",2,Entity.position.x + this._ox,Entity.position.y + this._oy); 
        if (this._Debug) { this._Window.DrawDot("","#40a0c0",Entity.radius,Entity.position.x + this._ox,Entity.position.y + this._oy); }
      },this);
      this._Explosions.forEach(function(Entity) {
        var colors = ["#740000","#743A00","#747400","#B50000","#B56300","#B5B500","#FF0000","#FF8C00","#FFFF00","#FF5959","#FFB459","#FFFF71"];
        this._Window.DrawDot("f",colors[RandInt(0,colors.length)],RandInt(1,3),Entity.position.x + this._ox,Entity.position.y + this._oy); 
      },this);
  
      //Draw Your Ship
      this._Window.DrawPolygon((this._Invul != false ? "" : "f"),"rgba(64,160,192,0.5)",1,this._Player.OffsetPolygon(this._ox,this._oy));
      this._Window.DrawPolygon("","rgb(64,160,192)",1,this._Player.OffsetPolygon(this._ox,this._oy));
      if (this._Debug) { this._Window.DrawDot("","#40a0c0",this._Player.radius,this._Player.position.x + this._ox,this._Player.position.y + this._oy); }
      if (this._Keys[38]) { this._Window.DrawPolygon("f","#ffff00",1,this.TranslatePolygon(this.Polygons("flame"),this._Player.direction.x,this._Player.direction.y,this._Player.position.x + this._ox,this._Player.position.y + this._oy)); }
  
      //draw some stats in the upper left corner   
      this._Window.DrawText("","#ffffff","12px Arial",0,12,"Score: " + this.Score);
      this._Window.DrawText("","#ffffff","12px Arial",0,24,"Level: " + this.Level);
      this._Window.DrawText("","#ffffff","12px Arial",0,36,"Lives: " + this.Lives);
      this._Window.DrawText("","#ffffff","12px Arial",0,48,"Entities: " + (this._Entities.length + this._Bullets.length + this._Missiles.length + this._Explosions.length));
      this._Window.DrawText("","#ffffff","12px Arial",0,60,"FPS: " + (1000 / DeltaTime).toFixed(2));
  
      if (this.Score == 0 && this._Invul) {
        this._Window.DrawText("","#ffffff","12px Arial",this._Player.x + this._ox - 125,this._Player.y + this._oy + 20,"Up Arrow: thrust, L/R Arrow: rotate, space: shoot");
      }
    },
    Polygons: function(Type) {
      //Polygons are an array of Points (X,Y,X,Y,etc..), which are a distance away from the origin: 0,0
      if (Type == "ufo") { return [-5,-5,-3,-9,3,-9,5,-5,-5,-5,-12,0,12,0,5,-5,12,0,7,4,-7,4,-12,0]; }
      if (Type == "ufoOutline") { return [-5,-5,-3,-9,3,-9,5,-5,12,0,5,5,-5,5,-12,0]; }
      if (Type == "smallufo") { return [-3,-3,-1.8,-5.4,1.8,-5.4,3,-3,-3,-3,-7.2,0,7.2,0,3,-3,7.2,0,4.2,2.4,-4.2,2.4,-7.2,0]; }
      if (Type == "smallufoOutline") { return [-3,-3,-1.8,-5.4,1.8,-5.4,3,-3,7.2,0,3,3,-3,3,-7.2,0]; }
      if (Type == "ship") { return [11,0,-11,-7,-7,-3,-7,3,-11,7]; }
      if (Type == "flame") { return [-7,-2,-12,0,-7,2]; }
      if (Type == "largeRock1") { return [-39,-25,-33,-8,-38,21,-23,25,-13,39,24,34,38,7,33,-15,38,-31,16,-39,-4,-34,-16,-39]; }
      if (Type == "largeRock2") { return [-32,35,-4,32,24,38,38,23,31,-4,38,-25,14,-39,-28,-31,-39,-16,-31,4,-38,22]; }
      if (Type == "largeRock3") { return [12,-39,-2,-26,-28,-37,-38,-14,-21,9,-34,34,-6,38,35,23,21,-14,36,-25]; }
      if (Type == "medRock1") { return [-7,-19,-19,-15,-12,-5,-19,0,-19,13,-9,19,12,16,18,11,13,6,19,-1,16,-17]; }
      if (Type == "medRock2") { return [9,-19,18,-8,7,0,15,15,-7,13,-16,17,-18,3,-13,-6,-16,-17]; }
      if (Type == "medRock3") { return [2,18,18,10,8,0,18,-13,6,-18,-17,-14,-10,-3,-13,15]; }
      if (Type == "smallRock1") { return [-8,-8,-5,-1,-8,3,0,9,8,4,8,-5,1,-9]; }     
      if (Type == "smallRock2") { return [-6,8,1,4,8,7,10,-1,4,-10,-8,-6,-4,0]; }
      if (Type == "smallRock3") { return [-8,-9,-5,-2,-8,5,6,8,9,6,7,-3,9,-9,0,-7]; }
    },
    TranslatePolygon: function(Points,Dx,Dy,X,Y) {
      //Shove each Point through a rotational matrix and add our offset (rotate and move)
      for (var i = 0; i < Points.length; i += 2) {
        var A = Points[i] , B = Points[i + 1];
        Points[i] = A * Dx - B * Dy + X; 
        Points[i + 1] = A * Dy + B * Dx + Y;
      }
      return Points;
    }
  }
  
  /*---------------------------------------------------------------------------------------------------------
    Helper Functions
  ---------------------------------------------------------------------------------------------------------*/
  function InCircle(x1,y1,x2,y2,Radii) { if ((Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2)) <= Math.pow(Radii,2)) { return 1; } }
  function InRect(x,y,rx,ry,rw,rh) { return ((x >= rx && x <= rx + rw) && (y >= ry && y <= ry + rh)); }
  
  function InPoly(x,y,Poly) {
    Poly.push(Poly[0]);
    Poly.push(Poly[1]);
    var Point = {'x':x,'y':y};
    var cn = 0;
    for (var i = 0; i < Poly.length - 2; i += 2) {
      if ((Poly[i+1] <= Point.y) && (Poly[i+3] > Point.y) || (Poly[i+1] > Point.y) && (Poly[i+3] <= Point.y)) { //Condition1 = Upward Crossing, Condition2 = downward crossing
        //compute the actual edge-ray intersect x-coordinate
        var vt = (Point.y - Poly[i+1]) / (Poly[i+3] - Poly[i+1]);
        if (Point.x < Poly[i] + vt * (Poly[i+2] - Poly[i])) { ++cn; } //Valid Crossing
      }
    }
    cn &= 1;
    if (cn > 0) { return true; }
  }
  function Intersect(ax1,ay1,ax2,ay2,bx1,by1,bx2,by2,method) {
    var dy = ay2 - ay1;
    var dx = ax2 - ax1;
    var db = by2 - by1;
    var da = bx2 - bx1;
    var c1 = (da * dy) - (db * dx);
    var c2 = (db * dx) - (da * dy);
    if (c1 == 0 || c2 == 0) { return; }
    var t = ((da * (ay1 - by1)) + (db * (bx1 - ax1))) / c2;
    var u = ((dx * (by1 - ay1)) + (dy * (ax1 - bx1))) / c1;

    //lineseg to lineseg (ll)
    if (method == "ll" && t >= 0 && t <= 1 && u >= 0 && u <= 1) { return {'x':ax1 + t * dx,'y':ay1 + t * dy}; }
    //ray to lineseg (rl)
    else if (method == "rl" && t >= 0 && u >= 0 && u <= 1) { return {'x':ax1 + t * dx,'y':ay1 + t * dy}; }
    //lineseg to ray (lr)
    else if (method == "lr" && t >= 0 && t <= 1 && u >= 0) { return {'x':ax1 + t * dx,'y':ay1 + t * dy}; }
    //ray to ray (rr)
    else if (method == "rr" && t >= 0 && u >= 0) { return {'x':ax1 + t * dx,'y':ay1 + t * dy}; }
  }
  function OnPoly(PolyA,PolyB) { 
    //Early escape test, if either polygon is fully contained in the other, any and every point will be inside the other
    if (this.InPoly(PolyA[0],PolyA[1],PolyB) || this.InPoly(PolyB[0],PolyB[1],PolyA)) { return true; }
    //Else: Iterate line segments and check for intersection
    PolyA.push(PolyA[0]);
    PolyA.push(PolyA[1]);
    PolyB.push(PolyB[0]);
    PolyB.push(PolyB[1]);
    for (var i = 0; i < PolyA.length - 2; i += 2) {
      for (var j = 0; j < PolyB.length - 2; j += 2) {
        if (Intersect(PolyA[i],PolyA[i+1],PolyA[i+2],PolyA[i+3],PolyB[j],PolyB[j+1],PolyB[j+2],PolyB[j+3],"ll")) { return true; }
      }
    }
    return false;
  }
  function RandInt(min,max) { return Math.floor(Math.random() * (max - min + 1) + min); }

  function Billiards(Window,cmd) {
    var Cmd = cmd.split(" "), Game = Cmd[1] || '9' , Table = Cmd[2] || '5.5';
    this._Canvas = Window.Picture;
    this._Window = Window;
    this._FPSLimit = 60;
    this._TimeDelta = Math.floor((1000 / this._FPSLimit) / 16) * 16;
    this.GenerateTable(Table,Game);
  }
  Billiards.prototype = {
    CosDeg(deg) { return Math.cos(deg * (Math.PI/180)); },
    SinDeg(deg) { return Math.sin(deg * (Math.PI/180)); },
    GenerateTable(size,Game = 9) {
      if (Game != 9) { Game = 8; }
      this._ox = this._Canvas.width / 2;
      this._oy = this._Canvas.height / 2;
      this._Motion = false;
      this.Table = {
        'Game':Game,
        Size: size,
        Rail: 2,
        CornerAngle: 54,
        SideAngle: 14,
        CornerThroat: 4.5,
        SideThroat: 5,
        LineSegments: [],
        Pockets: [],
        firstBreak: true,
      }

      if (size == '5.5') { this.Table.Width = 68; this.Table.Height = 34; }
      else if (size == '6') { this.Table.Width = 72; this.Table.Height = 36; }
      else if (size == '7') { this.Table.Width = 78; this.Table.Height = 39; }
      else if (size == '8') { this.Table.Width = 88; this.Table.Height = 44; }
      else if (size == '8.5') { this.Table.Width = 92; this.Table.Height = 46; }
      else if (size == '9') { this.Table.Width = 100; this.Table.Height = 50; }
      else { this.Table.Width = 112; this.Table.Height = 56; this.Table.Size = 10; }
      this.Table.Surface = { w: this.Table.Width + this.Table.Rail * 2, h: this.Table.Height + this.Table.Rail * 2 };
      this.Table.Half = {w: this.Table.Width / 2 , h: this.Table.Height / 2 , sw: this.Table.Surface.w / 2 , sh: this.Table.Surface.h / 2};

      //Spatial partitioning stuff, the bounds of our world, and the number of cells in the X and Y axis.
      this._Bounds = [-this.Table.Half.sw,-this.Table.Half.sh,this.Table.Half.sw,this.Table.Half.sh];
      this._Dimensions = [parseInt(this.Table.Surface.w / 2) - 1,parseInt(this.Table.Surface.h / 2) - 1];  
      this._Map = []; //1D Collection of Entities per spatial partitioning grid cell (an array of arrays)
      this._Entities = []; //Collection of Polygon Entities

      var a = Math.sqrt(Math.pow(this.Table.CornerThroat,2) / 2);
      var x = this.Table.Half.w * -1 + a, y = this.Table.Half.h * -1;
      var I = Intersect(x,y,x + this.CosDeg((90 + this.Table.CornerAngle) * -1),y + this.SinDeg((90 + this.Table.CornerAngle) * -1),this.Table.Half.sw * -1,this.Table.Half.sh * -1,this.Table.Half.sw,this.Table.Half.sh * -1,"rl");
      var reta = [I.x,I.y,x,y];
      var retb = [x,y * -1,I.x,I.y * -1];
      var retc = [I.x,I.y];
      var x = 0 - this.Table.SideThroat / 2, y = this.Table.Half.h * -1;
      var I = Intersect(x,y,x + this.CosDeg((90 - this.Table.SideAngle) * -1),y + this.SinDeg((90 - this.Table.SideAngle) * -1),this.Table.Half.sw * -1,this.Table.Half.sh * -1,this.Table.Half.sw,this.Table.Half.sh * -1,"rl");
      reta = reta.concat([x,y,I.x,I.y]);
      retb = [I.x,I.y * -1,x,y * -1].concat(retb);
      var x = this.Table.SideThroat / 2, y = this.Table.Half.h * -1;
      var I = Intersect(x,y,x + this.CosDeg((90 + this.Table.SideAngle) * -1),y + this.SinDeg((90 + this.Table.SideAngle) * -1),this.Table.Half.sw * -1,this.Table.Half.sh * -1,this.Table.Half.sw,this.Table.Half.sh * -1,"rl");
      reta = reta.concat([I.x,I.y,x,y]);
      retb = [x,y * -1,I.x,I.y * -1].concat(retb);
      var x = this.Table.Half.w - a, y = this.Table.Half.h * -1;
      var I = Intersect(x,y,x + this.CosDeg((90 - this.Table.CornerAngle) * -1),y + this.SinDeg((90 - this.Table.CornerAngle) * -1),this.Table.Half.sw * -1,this.Table.Half.sh * -1,this.Table.Half.sw,this.Table.Half.sh * -1,"rl");
      reta = reta.concat([x,y,I.x,I.y]);
      retb = [I.x,I.y * -1,x,y * -1].concat(retb);
      var x = this.Table.Half.w , y = (this.Table.Half.h - a) * -1;
      var I = Intersect(x,y,x + this.CosDeg(0 - this.Table.CornerAngle),y + this.SinDeg(0 - this.Table.CornerAngle),this.Table.Half.sw,this.Table.Half.sh * -1,this.Table.Half.sw,this.Table.Half.sh,"rl");
      reta = reta.concat([I.x,I.y,x,y,x,y * -1,I.x,I.y * -1]);
      retc = [I.x * -1,I.y * -1,x * -1,y * -1,x * -1,y,I.x * -1,I.y].concat(retc);
      this.Table.Polygon = reta.concat(retb,retc);

      this.Table.Pockets.push(new SpatialEntity("pocket",[0,0],4,-this.Table.Half.sw,-this.Table.Half.sh));
      this.Table.Pockets.push(new SpatialEntity("pocket",[0,0],4,0,-this.Table.Half.sh - 2.25));
      this.Table.Pockets.push(new SpatialEntity("pocket",[0,0],4,this.Table.Half.sw,-this.Table.Half.sh));
      this.Table.Pockets.push(new SpatialEntity("pocket",[0,0],4,this.Table.Half.sw,this.Table.Half.sh));
      this.Table.Pockets.push(new SpatialEntity("pocket",[0,0],4,0,this.Table.Half.sh + 2.25));
      this.Table.Pockets.push(new SpatialEntity("pocket",[0,0],4,-this.Table.Half.sw,this.Table.Half.sh));
      this.Table.Pockets.forEach((Pocket) => { this.SpatialInsert(Pocket); });

      for (var i = 0; i < this.Table.Polygon.length - 2; i += 2) { 
        var ent = new SpatialEntity("border",[this.Table.Polygon[i],this.Table.Polygon[i+1],this.Table.Polygon[i+2],this.Table.Polygon[i+3]],1);
        this.SpatialInsert(ent);
        this.Table.LineSegments.push(ent);
      }
      var centerx = this.Table.Width / 4 * -1
      var RS = 1.129 , rs = 1.139 , ds = rs * 2 , fric = 0.00039 , xdec = Math.sqrt(Math.pow(ds,2) - Math.pow(rs,2));
      if (Game == 9) {
        this._Entities.push(new SpatialEntity("ball1",[0,0],RS,centerx,0,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball2",[0,0],RS,centerx - xdec,0 - rs,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball3",[0,0],RS,centerx - xdec,0 + rs,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball4",[0,0],RS,centerx - xdec * 2,0 - rs * 2,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball9",[0,0],RS,centerx - xdec * 2,0,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball5",[0,0],RS,centerx - xdec * 2,rs * 2,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball6",[0,0],RS,centerx - xdec * 3,0 - rs,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball7",[0,0],RS,centerx - xdec * 3,rs,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball8",[0,0],RS,centerx - xdec * 4,0,1,0,0,0,0,fric));
        this.Cue = new SpatialEntity("ball0",[0,0],RS,centerx * -1 + 1.125,0,1,0,0,0,0,fric);
        this._Entities.push(this.Cue);
        this._Entities.forEach((Entity) => { this.SpatialInsert(Entity); });
        this._Ghost = new SpatialEntity("ball0",[0,0],RS,centerx * -1 + 1.125,0,1,0,0,0,0,fric);
      }
      else {
        this._Entities.push(new SpatialEntity("ball1",[0,0],RS,centerx,0,1,0,0,0,0,fric));
        
        this._Entities.push(new SpatialEntity("ball9",[0,0],RS,centerx - xdec,0 - rs,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball14",[0,0],RS,centerx - xdec,0 + rs,1,0,0,0,0,fric));

        this._Entities.push(new SpatialEntity("ball2",[0,0],RS,centerx - xdec * 2,0 - rs * 2,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball8",[0,0],RS,centerx - xdec * 2,0,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball6",[0,0],RS,centerx - xdec * 2,rs * 2,1,0,0,0,0,fric));

        this._Entities.push(new SpatialEntity("ball10",[0,0],RS,centerx - xdec * 3,0 - rs * 3,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball7",[0,0],RS,centerx - xdec * 3,0 - rs,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball15",[0,0],RS,centerx - xdec * 3,rs,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball13",[0,0],RS,centerx - xdec * 3,rs * 3,1,0,0,0,0,fric));

        this._Entities.push(new SpatialEntity("ball3",[0,0],RS,centerx - xdec * 4,0 - rs * 4,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball11",[0,0],RS,centerx - xdec * 4,0 - rs * 2,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball4",[0,0],RS,centerx - xdec * 4,0,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball12",[0,0],RS,centerx - xdec * 4,rs * 2,1,0,0,0,0,fric));
        this._Entities.push(new SpatialEntity("ball5",[0,0],RS,centerx - xdec * 4,rs * 4,1,0,0,0,0,fric));
        this.Cue = new SpatialEntity("ball0",[0,0],RS,centerx * -1 + 1.125,0,1,0,0,0,0,fric);
        this._Entities.push(this.Cue);
        this._Entities.forEach((Entity) => { this.SpatialInsert(Entity); });
        this._Ghost = new SpatialEntity("ball0",[0,0],RS,centerx * -1 + 1.125,0,1,0,0,0,0,fric);
      } 
    },
    SpatialInsert: function(Entity) {
      var GMin = this.SpatialIndex(Entity.bounds[0],Entity.bounds[1]);
      var GMax = this.SpatialIndex(Entity.bounds[2],Entity.bounds[3]);
      for (var x = GMin[0]; x <= GMax[0]; x++) {
         for (var y = GMin[1]; y <= GMax[1]; y++) {
          var OneD = y * this._Dimensions[0] + x;
            //Initialize an empty cell if it doesn't exist already and shove in our entity...
            if (!Array.isArray(this._Map[OneD])) { this._Map[OneD] = []; }
            if (this._Map[OneD].indexOf(Entity) == -1) { this._Map[OneD].push(Entity); } 
         }
      }
    },
    SpatialDelete: function(Entity) {
      var GMin = this.SpatialIndex(Entity.bounds[0],Entity.bounds[1]);
      var GMax = this.SpatialIndex(Entity.bounds[2],Entity.bounds[3]);
      for (var x = GMin[0]; x <= GMax[0]; x++) {
        for (var y = GMin[1]; y <= GMax[1]; y++) {
          var OneD = y * this._Dimensions[0] + x;
            //Remove items from cell if the cell exists...
            if (Array.isArray(this._Map[OneD]) && this._Map[OneD].indexOf(Entity) > -1) { this._Map[OneD].splice(this._Map[OneD].indexOf(Entity),1); }
        }
      }
    },
    //SpatialIndex: function(x,y) { return [ Math.floor(Math.min(Math.max((x - this._Bounds[0]) / (this._Bounds[2] - this._Bounds[0]),0),1) * (this._Dimensions[0] -1)) , Math.floor(Math.min(Math.max((y - this._Bounds[1]) / (this._Bounds[3] - this._Bounds[1]),0),1) * (this._Dimensions[1] - 1)) ]; },    
    SpatialIndex: function(x,y) { return [ Math.min(Math.floor(Math.min(Math.max((x - this._Bounds[0]) / (this._Bounds[2] - this._Bounds[0]),0),1) * this._Dimensions[0]),this._Dimensions[0] -1) , Math.min(Math.floor(Math.min(Math.max((y - this._Bounds[1]) / (this._Bounds[3] - this._Bounds[1]),0),1) * this._Dimensions[1]),this._Dimensions[1] -1) ]; },    
    SpatialNearBy: function(Entity,Bounds) {
      var GMin = this.SpatialIndex(Bounds[0],Bounds[1]);
      var GMax = this.SpatialIndex(Bounds[2],Bounds[3]);
      var Ret = new Set();
      for (var x = GMin[0]; x <= GMax[0]; x++) {
        for (var y = GMin[1]; y <= GMax[1]; y++) {
          var OneD = y * this._Dimensions[0] + x;
            //Shove entity into our set if it's not the entity itself we're lookin at!
            if (Array.isArray(this._Map[OneD])) { this._Map[OneD].forEach((Object) => { if (Object != Entity) { Ret.add(Object); } }); }
        }
      }
      return Ret;
    },
    SpatialNearRay: function(Entity,ray) {
      //ray [x,y,x+dir,y+dir]
      var rayDirX = ray[2]-ray[0], rayDirY = ray[3]-ray[1], mapX = ray[0], mapY = ray[1] , stepX = 0, stepY = 0, sideDistX = 0, sideDistY = 0;
      var deltaDistX = Math.sqrt(1 + Math.pow(rayDirY,2) / Math.pow(rayDirX,2)) , deltaDistY = Math.sqrt(1 + Math.pow(rayDirX,2) / Math.pow(rayDirY,2));
      if (rayDirX < 0) { stepX = -1; sideDistX = (ray[0] - mapX) * deltaDistX; } 
      else { stepX = 1; sideDistX = (mapX + 1 - ray[0]) * deltaDistX; } 
      if (rayDirY < 0) { stepY = -1; sideDistY = (ray[1] - mapY) * deltaDistY; } 
      else { stepY = 1; sideDistY = (mapY + 1 - ray[1]) * deltaDistY; } 
      var hit = 0, side = 0, Ret = new Set();
      while (!hit) {
        if (mapX > this._Bounds[2] || mapY > this._Bounds[3]) { hit = 1; break; }
        if (mapX < this._Bounds[0] || mapY < this._Bounds[1]) { hit = 1; break; }
        if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
        else { sideDistY += deltaDistY; mapY += stepY; side = 1; }

        var GMin = this.SpatialIndex(Math.floor(mapX),Math.floor(mapY));
        var GMax = this.SpatialIndex(Math.ceil(mapX),Math.ceil(mapY));
        for (var x = GMin[0]; x <= GMax[0]; x++) {
          for (var y = GMin[1]; y <= GMax[1]; y++) {
            var OneD = y * this._Dimensions[0] + x;
            //Shove entity into our set if it's not the entity itself we're lookin at!
            if (Array.isArray(this._Map[OneD])) { this._Map[OneD].forEach((Object) => { if (Object != Entity) { Ret.add(Object); } }); }
          }
        }
  
      }
      return Ret;
    },
    Quadratic: function(a,b,c) { if (a != 0 && b != 0) { var det = Math.pow(b,2) - 4 * a * c; return ((0 - b - Math.sqrt(det)) / (2 * a)); } },
    BorderCollisionTime: function(ObjectA,ObjectB) {
      var PlaneDist = ObjectA.position.x * ObjectB.NormalX + ObjectA.position.y * ObjectB.NormalY + ObjectB.Dist;
      if (PlaneDist < ObjectA.radius) {
        var inStart = InCircle(ObjectA.position.x,ObjectA.position.y,ObjectB.translated[0],ObjectB.translated[1],ObjectA.radius) , inEnd = InCircle(ObjectA.position.x,ObjectA.position.y,ObjectB.translated[2],ObjectB.translated[3],ObjectA.radius);
        if (inStart) { var dx = ObjectA.position.x - ObjectB.translated[0], dy = ObjectA.position.y - ObjectB.translated[1]; }
        else if (inEnd) { var dx = ObjectA.position.x - ObjectB.translated[2], dy = ObjectA.position.y - ObjectB.translated[3]; }
        if (inStart || inEnd) {
          var mag = Math.sqrt(dx*dx+dy*dy) , NormX = dx / mag, NormY = dy / mag
          var vdx = ObjectA.velocity.x - ObjectB.velocity.x , vdy = ObjectA.velocity.y - ObjectB.velocity.y;
          var velAlongNormal = vdx * NormX + vdy * NormY
          var a = Math.pow(vdx,2) + Math.pow(vdy,2);
          var b = 2 * (dx * vdx + dy * vdy);
          var c = Math.pow(dx,2) + Math.pow(dy,2) - Math.pow(ObjectA.radius,2);
          if (velAlongNormal <= 0) { var point = {normal:{x:NormX,y:NormY}, quad: this.Quadratic(a,b,c)}; }
        }
        var t = ((ObjectA.position.x - ObjectB.translated[0]) * ObjectB.Width + (ObjectA.position.y - ObjectB.translated[1]) * ObjectB.Height) / (ObjectB.Mag * ObjectB.Mag);
        if (t >= 0 && t <= 1) {
          var d1 = (ObjectA.position.x - ObjectB.translated[0]) * ObjectB.NormalX + (ObjectA.position.y - ObjectB.translated[1]) * ObjectB.NormalY;
          var d2 = ObjectA.velocity.x * ObjectB.NormalX + ObjectA.velocity.y * ObjectB.NormalY;
          var a = Math.pow(d2,2);
          var b = 2 * d1 * d2;
          var c = Math.pow(d1,2) - Math.pow(ObjectA.radius,2);
          if (d2 <= 0) { var seg = this.Quadratic(a,b,c); }
        }
        return {point: point, segment: seg};
      }
    },
    BallCollisionTime: function(ObjectA,ObjectB) {
      if (ObjectA.name == ObjectB.name) { return; }
      if (ObjectA.velocity.MagSq() == 0 && ObjectB.velocity.MagSq() == 0) { return; }
      var dx = ObjectA.position.x - ObjectB.position.x, dy = ObjectA.position.y - ObjectB.position.y;
      var mag = Math.sqrt(dx*dx+dy*dy) , NormX = dx / mag, NormY = dy / mag
      var vdx = ObjectA.velocity.x - ObjectB.velocity.x , vdy = ObjectA.velocity.y - ObjectB.velocity.y;
      var velAlongNormal = vdx * NormX + vdy * NormY;
      var a = Math.pow(vdx,2) + Math.pow(vdy,2);
      var b = 2 * (dx * vdx + dy * vdy);
      var c = Math.pow(dx,2) + Math.pow(dy,2) - Math.pow((ObjectB.name != "pocket" ? ObjectA.radius+ObjectB.radius : ObjectB.radius),2);
      if (velAlongNormal <= 0) { return this.Quadratic(a,b,c); }
    },
    CollisionCheck: function(ObjectA,FrameTime) {
      var CollisionPairs = []
      var SearchRad = ObjectA.radius * 2;
      var SearchBounds = [ObjectA.position.x - SearchRad,ObjectA.position.y - SearchRad,ObjectA.position.x + SearchRad,ObjectA.position.y + SearchRad];
      var near = this.SpatialNearBy(ObjectA,SearchBounds);
      for (var ObjectB of near) {
        if (ObjectA.name == ObjectB.name) { return; }
        if (ObjectA.velocity.MagSq() == 0 && ObjectB.velocity.MagSq() == 0) { return; }
        if (ObjectB.name == "border") {
          var Seg = this.BorderCollisionTime(ObjectA,ObjectB);
          if (Seg) {
            if (Seg.point && Seg.point.quad <= 0) { CollisionPairs.push({'nt':Seg.point.quad,'a':ObjectA,'b':ObjectB,'normal':{x: Seg.point.normal.x, y: Seg.point.normal.y},'reflect': -2 * (Seg.point.normal.x * ObjectA.velocity.x + ObjectA.velocity.y * Seg.point.normal.y)}); }
            if (Seg.segment && Seg.segment <= 0) { CollisionPairs.push({'nt':Seg.segment,'a':ObjectA,'b':ObjectB,'normal':{x: ObjectB.NormalX, y: ObjectB.NormalY},'reflect': -2 * (ObjectB.NormalX * ObjectA.velocity.x + ObjectA.velocity.y * ObjectB.NormalY)}); }
          }
        }
        else if (/^(?:ball|pocket)/.test(ObjectB.name)) {
          var nt = this.BallCollisionTime(ObjectA,ObjectB);
          if (nt && nt <= 0 && Math.abs(nt) <= FrameTime) { 
            var dx = ObjectA.position.x - ObjectB.position.x , dy = ObjectA.position.y - ObjectB.position.y;
            var mag = Math.sqrt(dx*dx+dy*dy), NormalX = dx / mag, NormalY = dy / mag;
            CollisionPairs.push({'nt':nt,'a':ObjectA,'b':ObjectB,'normal':{x: NormalX , y: NormalY},'reflect': (ObjectB.velocity.x * NormalX + ObjectB.velocity.y * NormalY) - (ObjectA.velocity.x * NormalX + ObjectA.velocity.y * NormalY)}); 
          }
        }
      }
      return CollisionPairs.sort((a,b) => { return a.nt > b.nt; });
    },
    Update: function(Time) {
      if (this._LastUpdate == undefined) { var DeltaTime = 0; this._LastUpdate = Time; }
      else { var DeltaTime = Time - this._LastUpdate; }

      //Window prolly lost focus, avoid EXTREMELY LARGE timesteps updating stuff way outta bounds... (60ms is ~= 16 fps, we should always run well above this...)
      if (DeltaTime > 60) { DeltaTime = 60; }
        
      //Offset values to convert our cartesian grid coordinates to canvas coordinates
      this._ox = this._Canvas.width / 2;
      this._oy = this._Canvas.height / 2;
      this._Motion = false;

      this._Entities.reduceRight((_,Entity) => { 
        this.SpatialDelete(Entity);
        Entity.Update(DeltaTime); 
        this.SpatialInsert(Entity);
        var Pairs = this.CollisionCheck(Entity,DeltaTime);
        while (Pairs && Pairs.length) {
          var Collision = Pairs[0] , key = Collision.nt , b = false;
          if (/^ball/.test(Collision.a.name)) {
            if (this._Entities.indexOf(Collision.a) > -1) {
              this.SpatialDelete(Collision.a);
              Collision.a.setPosition(Collision.a.position.x + Collision.a.velocity.x * key , Collision.a.position.y + Collision.a.velocity.y * key);
              Collision.a.velocity.x += Collision.normal.x * Collision.reflect;
              Collision.a.velocity.y += Collision.normal.y * Collision.reflect;
              Collision.a.setPosition(Collision.a.position.x + Collision.a.velocity.x * (key * -1) , Collision.a.position.y + Collision.a.velocity.y * (key * -1));
              this.SpatialInsert(Collision.a);
            
              if (/^pocket/.test(Collision.b.name)) {
                if (Collision.a.name == "ball0") { 
                  this.SpatialDelete(Collision.a);
                  this.Cue.setPosition(0,0);
                  this.Cue.setDirection(1,0);
                  this.Cue.setVelocity(0,0);
                  this.SpatialInsert(Collision.a);
                }
                else {
                  this.SpatialDelete(Collision.a);
                  this._Entities.splice(this._Entities.indexOf(Collision.a),1);
                }
                break;
              }
              else if (/^ball/.test(Collision.b.name)) {
                if (this._Entities.indexOf(Collision.b) > -1) {
                  this.SpatialDelete(Collision.b);
                  Collision.b.setPosition(Collision.b.position.x - Collision.b.velocity.x * key , Collision.b.position.y - Collision.b.velocity.y * key);
                  Collision.b.velocity.x -= Collision.normal.x * Collision.reflect;
                  Collision.b.velocity.y -= Collision.normal.y * Collision.reflect;
                  Collision.b.setPosition(Collision.b.position.x - Collision.b.velocity.x * (key * -1) , Collision.b.position.y - Collision.b.velocity.y * (key * -1));
                  this.SpatialInsert(Collision.b);
                }
              }
              else if (Collision.b.name == "border") {
                
              }
            }
          }
          Pairs = this.CollisionCheck(Entity,DeltaTime);
        }
        if (Entity.velocity.MagSq() > 0) { this._Motion = true; }
      },null);

      if (this._Entities.length == 1 && this._Entities[0].name == "ball0") { this.GenerateTable(this.Table.Size,this.Table.Game); }

      //Don't redraw until we meet or exceed our FPS limit
      if (DeltaTime >= this._TimeDelta) {
        //Render the scene.
        this.Render(DeltaTime);	
  
        //Log the time given from requestAnimationFrame so we can calculate the time passed from last frame
        this._LastUpdate = Time;
      }  
      this._Animation = requestAnimationFrame(this.Update.bind(this));
    },
    Mouse: function(e,x,y) {
      var scalew = Math.max(1,parseInt(this._Canvas.width / this.Table.Surface.w));
      var scaleh = Math.max(1,parseInt(this._Canvas.height / this.Table.Surface.h));
      var scale = Math.min(scaleh,scalew);
      var gx = (x - this._Canvas.width / 2) / scale;
      var gy = (y - this._Canvas.height / 2) / scale;
      if (e.type == 'pointermove' || e.type == 'pointerdown') {
        if (this.hasOwnProperty('_Ghost')) {
          var dx = gx - this.Cue.position.x , dy = gy - this.Cue.position.y;
          var mag = Math.sqrt(dx*dx+dy*dy), NormalX = dx / mag, NormalY = dy / mag;
          this._Ghost.setPosition(gx,gy);
          this._Ghost.setVelocity(dx,dy);
          this._Ghost.direction.isInverseVelocity = false;
          this.Cue.setDirection(-NormalX,-NormalY);
        }
      }
      if (!this._Motion && e.type == 'pointerup') {
        var dx = this.Cue.position.x - this._Ghost.position.x , dy = this.Cue.position.y - this._Ghost.position.y;
        var mag = Math.sqrt(dx*dx+dy*dy), NormalX = dx / mag, NormalY = dy / mag, fdiv = 100;
        if (!this.Table.hasOwnProperty('firstBreak') || this.Table.firstBreak) { fdiv = 60; this.Table.firstBreak = false; }
        var pfactor = parseInt(this.Table.Size) / fdiv;
        this._Ghost.setPosition(gx,gy);
        this._Ghost.setVelocity(dx,dy);
        this._Ghost.direction.isInverseVelocity = false;
        this.Cue.setDirection(-NormalX,-NormalY);
        this.Cue.applyForce(this.Cue.direction.x * pfactor,this.Cue.direction.y * pfactor);
        console.log(this._Window.GetDot(x,y));
      }
    },
    Render: function(DeltaTime) { 
      //Clear the screen
      this._Window.DrawRect("f","#004074",1,0,0,this._Canvas.width,this._Canvas.height);
      var scalew = Math.max(1,parseInt(this._Canvas.width / this.Table.Surface.w));
      var scaleh = Math.max(1,parseInt(this._Canvas.height / this.Table.Surface.h));
      var scale = Math.min(scaleh,scalew);
      this.Table.Pockets.forEach((Pocket) => {
        this._Window.DrawDot("f","#1F1F1F",Pocket.radius * scale,Pocket.position.x * scale + this._ox,Pocket.position.y * scale + this._oy);
      }); 
      this.Table.LineSegments.forEach((LineSeg) => { this._Window.DrawPolygon("","rgba(0,0,0,1)",1,LineSeg.OffsetPolygon(this._ox,this._oy,scale)); });
      //this._Window.DrawFill("f","0063b5ff","000000ff",1,1);

      this._Entities.forEach((Entity) => { 
        if (this.Table.Game == 9) { var clr = ['white','yellow','blue','red','purple','orange','green','maroon','black','pink']; }
        else { var clr = ['white','red','yellow','yellow','red','black','red','yellow','red','yellow','yellow','red','yellow','red','yellow','red']; }
        if (/^ball(\d+)$/.test(Entity.name)) {
          if (RegExp.$1 == "0") { }
          this._Window.DrawDot("f",clr[RegExp.$1],Entity.radius * scale,Entity.position.x * scale + this._ox,Entity.position.y * scale + this._oy);
          this._Window.DrawDot("","#c0c0c0",Entity.radius * scale,Entity.position.x * scale + this._ox,Entity.position.y * scale + this._oy);
        }
      });
      if (!this._Motion) {
        var Pairs = this.CollisionCheck(this._Ghost,DeltaTime);
        if (Pairs && Pairs.length) { 
          var Collision = Pairs[0] , key = Collision.nt , b = false;
          if (key && key < 0) { 
            Collision.a.setPosition(Collision.a.position.x + Collision.a.velocity.x * key , Collision.a.position.y + Collision.a.velocity.y * key);
            Collision.a.setVelocity(Collision.a.velocity.x + Collision.normal.x * Collision.reflect,Collision.a.velocity.y + Collision.normal.y * Collision.reflect);
            Collision.a.setDirection(Collision.b.velocity.x - Collision.normal.x * Collision.reflect,Collision.b.velocity.y - Collision.normal.y * Collision.reflect);
            Collision.a.velocity.Normalize();
            Collision.a.direction.Normalize();
            Collision.a.direction.isInverseVelocity = true;
          }
        }
        this._Window.DrawDot("f","rgba(255,255,255,0.5)",this._Ghost.radius * scale,this._Ghost.position.x * scale + this._ox,this._Ghost.position.y * scale + this._oy);
        this._Window.DrawArrow("f","rgba(255,255,255,0.5)",2,4,this._Ghost.position.x * scale + this._ox,this._Ghost.position.y * scale + this._oy,(this._Ghost.position.x + this._Ghost.velocity.x * 2) * scale + this._ox,(this._Ghost.position.y + this._Ghost.velocity.y * 2) * scale + this._oy);
        if (this._Ghost.direction.hasOwnProperty('isInverseVelocity') && this._Ghost.direction.isInverseVelocity == true) { this._Window.DrawArrow("f","rgba(0,255,0,0.5)",2,4,this._Ghost.position.x * scale + this._ox,this._Ghost.position.y * scale + this._oy,(this._Ghost.position.x + this._Ghost.direction.x * 18) * scale + this._ox,(this._Ghost.position.y + this._Ghost.direction.y * 18) * scale + this._oy); }        
        this._Window.DrawLine("f","rgba(255,255,255,0.5)",1,this.Cue.position.x * scale + this._ox,this.Cue.position.y * scale + this._oy,this._Ghost.position.x * scale + this._ox,this._Ghost.position.y * scale + this._oy);
        /*var InPath = Array.from(this.SpatialNearRay(this.Cue,[this.Cue.position.x,this.Cue.position.y,this.Cue.position.x - this.Cue.direction.x,this.Cue.position.y - this.Cue.direction.y]))
        InPath = InPath.sort((a,b) => { 
          var amsq = Math.pow(this.Cue.position.x - a.position.x,2) * Math.pow(this.Cue.position.y - a.position.y,2);
          var bmsq = Math.pow(this.Cue.position.x - b.position.x,2) * Math.pow(this.Cue.position.y - b.position.y,2);
          return amsq > bmsq;
        });
        if (InPath.length) {
          //console.log(InPath)
          var Collision = InPath[0];
          this._Window.DrawLine("f","pink",1,this.Cue.position.x * scale + this._ox,this.Cue.position.y * scale + this._oy,(this.Cue.position.x + this.Cue.direction.x) * scale + this._ox,(this.Cue.position.y + this.Cue.direction.y) * scale + this._oy)
          this._Window.DrawLine("f","orange",1,this.Cue.position.x * scale + this._ox,this.Cue.position.y * scale + this._oy,Collision.position.x * scale + this._ox,Collision.position.y * scale + this._oy);
        }*/
      }

      var vbars = (this._Canvas.height - this.Table.Surface.h * scale) / 2;
      this._Window.DrawRect("f","#000000",1,0,0,this._Canvas.width,vbars);
      this._Window.DrawRect("f","#000000",1,0,this._Canvas.height - vbars,this._Canvas.width,this._Canvas.height);

      var hbars = (this._Canvas.width - this.Table.Surface.w * scale) / 2;
      this._Window.DrawRect("f","#000000",1,0,0,hbars,this._Canvas.height);
      this._Window.DrawRect("f","#000000",1,this._Canvas.width-hbars,0,this._Canvas.width,this._Canvas.height);

      this._Window.DrawText("","#ffffff","10px Calibri",0,20,"FPS: " + (1000 / DeltaTime).toFixed(2));
    },
  }

  function JSClock(Window) {
    //Where The Magic Gets Drawn!
    this._Canvas = Window.Picture;
    this._Window = Window;
    this._FPSLimit = 60;
    this._TimeDelta = Math.floor((1000 / this._FPSLimit) / 16) * 16;
  }
  JSClock.prototype = {
    Update: function(Time) {
      if (this._LastUpdate == undefined) { var DeltaTime = 0; this._LastUpdate = Time; }
      else { var DeltaTime = Time - this._LastUpdate; }
  
      //Offset values to convert our cartesian grid coordinates to canvas coordinates
      this._ox = this._Canvas.width / 2;
      this._oy = this._Canvas.height / 2;
      this.Radius = Math.min(this._ox,this._oy) - 10;
  
      //Don't redraw until we meet or exceed our FPS limit
      if (DeltaTime >= this._TimeDelta) {
        //Render the scene.
        this.Render(DeltaTime);	
  
        //Log the time given from requestAnimationFrame so we can calculate the time passed from last frame
        this._LastUpdate = Time;
      }  
      this._Animation = requestAnimationFrame(this.Update.bind(this));
    },
    Render: function(DeltaTime) {
      //Clear the screen
      this._Window.DrawRect("f","#000000",1,0,0,this._Canvas.width,this._Canvas.height);
      for (var x = 0; x <= 15; x++) {
        var Angle = x * Math.PI * 2 / 60 , Dx = this.Radius * Math.cos(Angle) , Dy = this.Radius * Math.sin(Angle);
        var ColSize = (x % 5 != 0 ? ["#ffffff",2] : ["#ff0000",4]);
        this._Window.DrawDot("f",ColSize[0],ColSize[1],Dx + this._ox,Dy * -1 + this._oy);
        this._Window.DrawDot("f",ColSize[0],ColSize[1],Dx * -1 + this._ox,Dy * -1 + this._oy);
        this._Window.DrawDot("f",ColSize[0],ColSize[1],Dx + this._ox,Dy + this._oy);
        this._Window.DrawDot("f",ColSize[0],ColSize[1],Dx * -1 + this._ox,Dy + this._oy);
  
        this._Window.DrawDot("f",ColSize[0],ColSize[1],Dx * 0.8 + this._ox,Dy * 0.8 * -1 + this._oy);
        this._Window.DrawDot("f",ColSize[0],ColSize[1],Dx * 0.8 * -1 + this._ox,Dy * 0.8 * -1 + this._oy);
        this._Window.DrawDot("f",ColSize[0],ColSize[1],Dx * 0.8 + this._ox,Dy * 0.8 + this._oy);
        this._Window.DrawDot("f",ColSize[0],ColSize[1],Dx * 0.8 * -1 + this._ox,Dy * 0.8 + this._oy);
        if (ColSize[1] == 4) { 
          this._Window.DrawText("c","#ffffff",this.Radius / 10 + "px Calibri",Dx * 0.92 + this._ox,Dy * -0.92 + this._oy,((15 - x) / 5 == 0 ? 12 : (15 - x) / 5));
          this._Window.DrawText("c","#ffffff",this.Radius / 10 + "px Calibri",Dx * 0.92 + this._ox,Dy * 0.92 + this._oy,x / 5 + 3);
          this._Window.DrawText("c","#ffffff",this.Radius / 10 + "px Calibri",Dx * -0.92 + this._ox,Dy * 0.92 + this._oy,(15 - x) / 5 + 6);
          this._Window.DrawText("c","#ffffff",this.Radius / 10 + "px Calibri",Dx * -0.92 + this._ox,Dy * -0.92 + this._oy,x / 5 + 9);
  
          this._Window.DrawText("c","#ffffff",this.Radius / 20 + "px Calibri",Dx * 0.72 + this._ox,Dy * -0.72 + this._oy,15 - x);
          this._Window.DrawText("c","#ffffff",this.Radius / 20 + "px Calibri",Dx * 0.72 + this._ox,Dy * 0.72 + this._oy,x + 15);
          this._Window.DrawText("c","#ffffff",this.Radius / 20 + "px Calibri",Dx * -0.72 + this._ox,Dy * 0.72 + this._oy,15 - x + 30);
          this._Window.DrawText("c","#ffffff",this.Radius / 20 + "px Calibri",Dx * -0.72 + this._ox,Dy * -0.72 + this._oy,(x + 45) % 60);
        }
      }
      var D = new Date(), H = D.getHours() + D.getMinutes() / 60, M = D.getMinutes() + D.getSeconds() / 60, S = D.getSeconds() + D.getMilliseconds() / 1000;
      var HrAngle = (H - 3) * Math.PI * 2 / 12;
      var MnAngle = (M - 15) * Math.PI * 2 / 60;
      var ScAngle = (S - 15) * Math.PI * 2 / 60;
  
      this._Window.DrawArrow("","#3f3f3f",8,this.Radius * 0.05,this._ox,this._oy,Math.cos(HrAngle) * this.Radius * 0.85 + this._ox,Math.sin(HrAngle) * this.Radius * 0.85 + this._oy);
      this._Window.DrawArrow("","#3f3f3f",8,this.Radius * 0.05,this._ox,this._oy,Math.cos(MnAngle) * this.Radius * 0.95 + this._ox,Math.sin(MnAngle) * this.Radius * 0.95 + this._oy);
      this._Window.DrawArrow("","#ff0000",4,this.Radius * 0.05,this._ox,this._oy,Math.cos(ScAngle) * this.Radius + this._ox,Math.sin(ScAngle) * this.Radius + this._oy);
      this._Window.DrawText("c","#ffffff",this.Radius / 10 + "px Calibri",this._ox,this._oy + this.Radius / 5,(D.getMonth() + 1).toString().padStart(2,"0") + "/" + D.getDate().toString().padStart(2,"0") + "/" + (1900 + D.getYear()));
      this._Window.DrawText("c","#ffffff",this.Radius / 10 + "px Calibri",this._ox,this._oy + this.Radius / 3,(D.getHours() > 12 ? D.getHours() - 12 : D.getHours()).toString().padStart(2,"0") + ":" + D.getMinutes().toString().padStart(2,"0") + ":" + D.getSeconds().toString().padStart(2,"0") + "." + D.getMilliseconds().toString().padStart(3,"0") + (D.getHours() > 12 ? " PM" : " AM"));
      this._Window.DrawText("","#ffffff",this.Radius / 10 + "px Calibri",0,20,"FPS: " + (1000 / DeltaTime).toFixed(2));
    }
  }
  