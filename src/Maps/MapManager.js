var ReactNative = require('react-native');
var {Dimensions} = ReactNative;

class Tile
{
    constructor(x, y, path, zoomLevel)
    {
        this.x = x;
        this.y = y;
        this.path = path;
        this.zoomLevel = zoomLevel;
        this.shouldDraw = false;
    }

    draw(d, zoom, tileSize, screenWidth, screenHeight)
    {
        var xDraw = d.x;
        var yDraw = d.y;

        if ((xDraw + tileSize * zoom * Math.pow(3, this.zoomlevel - 1) > 0) && (xDraw - tileSize * zoom * Math.pow(3, this.zoomlevel - 1) < screenWidth) && (yDraw + tileSize * zoom * Math.pow(3, this.zoomlevel - 1) > 0) && (yDraw - tileSize * zoom * Math.pow(3, this.zoomlevel - 1) < screenHeight)) {
            if (currentZoomLevel == this.zoomlevel) {
                // If we haven't loaded this image yet, load it
                console.warn(this.path);
                this.shouldDraw = true;
            }
            try {
                // If the image is loaded, draw it
                var d = coordToScreen(this.x, this.y + 13, tileSize * Math.pow(3, this.zoomlevel - 1), tileSize * Math.pow(3, zoomlevel - 1), false);
                // ctx.drawImage(this.imagedata, d.x, d.y, this.tileSize * zoom * Math.pow(3,
                // this.zoomlevel - 1), tileSize * zoom * Math.pow(3, this.zoomlevel - 1))
                // //this.imagedata.width, this.imagedata.height);
            } catch (e) {}
        } else {
            // If we're off-screen, unload the image so we aren't so fat
            this.shouldDraw = false;
        }
    }
}

class Poi
{
    constructor(x, y, name, type, index)
    {
        this.x = x;
        this.y = y;
        this.name = name;
        this.type = type;        
        this.index = index;
    }
}

class MapManager
{
    constructor()
    {
        this.cameraX = -29500;
        this.cameraY = 7000;
        this.tiles = [];
        this.tileSize = 250;
        this.currentZoomLevel = 1;
        this.serverID = 2;
        this.imageCoords = 1000;
        this.zoom = 1;
        this.pois = [];

        /*this.initDimensions();

        this.createTiles();

        this
            .getTruckData()
            .done();

        this.drawMap();*/
    }

    initDimensions()
    {
        this.dimensions = Dimensions.get('window');
        this.screenWidth = this.dimensions.height;
        this.screenHeight = this.dimensions.width;
        console.warn(this.screenHeight);
        console.warn(this.screenWidth);
    }

    createTiles()
    {
        for (var i = -60; i <= 45; i += 27) {
            for (var j = -58; j <= 45; j += 27) {
                this
                    .tiles
                    .push(new Tile(i * 1000, j * 1000, "https://tiles.ets2map.com/tiles/" + i + "_" + j + "_4.png", 4));
            }
        }

        for (var i = -60; i <= 60; i += 9) {
            for (var j = -58; j <= 45; j += 9) {
                this
                    .tiles
                    .push(new Tile(i * 1000, j * 1000, "https://tiles.ets2map.com/tiles/" + i + "_" + j + "_3.png", 3));
            }
        }

        for (var i = -60; i <= 45; i += 3) {
            for (var j = -58; j <= 45; j += 3) {
                this
                    .tiles
                    .push(new Tile(i * 1000, j * 1000, "https://tiles.ets2map.com/tiles/" + i + "_" + j + "_2.png", 2));
            }
        }

        for (var i = -60; i <= 45; i++) {
            for (var j = -58; j <= 45; j++) {
                var x = i * 1000;
                var y = j * 1000;
                this
                    .tiles
                    .push(new Tile(x, y, "https://tiles.ets2map.com/tiles/" + i + "_" + j + ".png", 1));
            }
        }

        console.warn(this.tiles.length);
    }

    drawMap()
    {
        for (var i = 0; i < this.tiles.length; i++) {
            this
                .tiles[i]
                .draw(this.coordToScreen(this.tiles[i].x, this.tiles[i].y, 0, 0, false), this.zoom, this.tileSize, this.screenHeight, this.screenHeight);
        }
    }

    coordToScreen(x, y, width, height, ukscale)
    {
        if (ukscale == null) {
            ukscale = true;
        }

        var cx = this.cameraX;
        var cy = this.cameraY;

        if (cy < (-.76 * cx - 30140) && (cx < -22145)) {
            cx = cx * .75 - 8337;
            cy = cy * .75 - 1000;
        }

        if ((y < (-.76 * x - 30140)) && (ukscale) && (x < -22145)) {
            x = x * .75 - 8337;
            y = y * .75 - 1000;
        }

        ret = [];
        ret.x = x * this.tileSize / this.imageCoords * this.zoom + this.screenWidth / 2 - cx / (this.imageCoords / this.tileSize) * this.zoom - width / 2 * this.zoom;
        ret.y = y * this.tileSize / this.imageCoords * this.zoom + this.screenHeight / 2 - cy / (this.imageCoords / this.tileSize) * this.zoom - height / 2 * this.zoom;

        return ret;
    }

    screenToCoord(x, y, ukscale) {
        if (ukscale == null) {
            ukscale = true;
        }

        var cx = this.cameraX;
        var cy = this.cameraY;

        if (cy < (-.76 * cx - 30140) && (cx < -22145)) {
            cx = cx * .75 - 8337;
            cy = cy * .75 - 1000;
        }

        ret = [];
        ret.x = (x + cx / (this.imageCoords / this.tileSize) * this.zoom - this.screenWidth / 2) / (this.tileSize / this.imageCoords * this.zoom);
        ret.y = (y + cy / (this.imageCoords / this.tileSize) * this.zoom - this.screenHeight / 2) / (this.tileSize / this.imageCoords * this.zoom);

        if ((ret.y < (-.76 * ret.x - 30140)) && (ukscale) && (ret.x < -22145)) {
            ret.x = (ret.x + 8337) / .75;
            ret.y = (ret.y + 1000) / .75;
        }

        return ret;
    }

    async getTruckData()
    {
        var screen = this.screenToCoord(this.screenWidth / 2, this.screenHeight / 2, 0);
        var outer = this.screenToCoord(-20, -20, 0);

        var boundX = screen.x - outer.x;
        var boundY = screen.y - outer.y;
        var zoomLevel;

        if (boundX > boundY) {
            zoomLevel = boundX;
        } else {
            zoomLevel = boundY;
        }

        zoomLevel = Math.round(zoomLevel * 1.25);

        var url = "https://tracker.ets2map.com/v2/" + this.serverID + "/" + Math.round(this.cameraX) + "/" + Math.round(this.cameraY) + "/" + zoomLevel;

        console.warn(url);

        var response = await fetch(url);
        var trucks = await response.json();

        console.warn(JSON.stringify(trucks));

        return trucks;

    }

    async getPois()
    {
        var response = await fetch('https://ets2map.com/automated_v16.json');
        var json = await response.json();

        this.processPois(json);

        return this.pois;
    }

    myforeach(array, funct) {
        for (var key in array) {
            if (array.hasOwnProperty(key) && /^0$|^[1-9]\d*$/.test(key) && key <= 4294967294) {
                funct(key);
            }
        }
    }

    processPois(ps, searchstring, depth) {
        if (searchstring == null) 
            searchstring = "";
        if (depth == null) 
            depth = 0;
        
        var instance = this;

        this
            .myforeach(ps, function (key) { // Loop de loop
                //console.log(ps);
                instance.pois[instance.pois.length] = new Poi(ps[key].x, ps[key].y, ps[key].name, ps[key].type, instance.pois.length);
                instance.pois[instance.pois.length - 1].search = searchstring + " " + instance.pois[instance.pois.length - 1].name;
                instance.pois[instance.pois.length - 1].depth = depth;
                if (ps[key].pois != null) {
                    var parentIndex = instance.pois.length - 1;
                    instance.processPois(ps[key].pois, instance.pois[instance.pois.length - 1].search, depth + 1);
                    if (instance.pois.length > (parentIndex + 1)) {
                        for (var j = parentIndex + 1; j < instance.pois.length; j++) {
                            instance.pois[parentIndex].search += instance.pois[j].search;
                        }
                    }
                }
            });
    }

    getServerID(apiServerID)
    {
        switch(apiServerID)
        {
            case 1:
                return 0;
            case 3:
                return 1;
            case 4:
                return 2;
            case 5:
                return 3;
            case 7:
                return 6;
            case 10:
                return 9;
            case 11:
                return 10;
        }
    }

    reserveServerID(mapServerID)
    {
        switch(mapServerID)
        {
            case 0:
                return 1;
            case 1:
                return 3;
            case 2:
                return 4;
            case 3:
                return 5;
            case 6:
                return 7;
            case 9:
                return 10;
            case 10:
                return 11;
        }
    }
}

module.exports = MapManager;