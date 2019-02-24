/// <reference types="@types/googlemaps" />

export class ParkingZone {
    private static LOW = "#22e839";
    private static MEDIUM = "#FFFF00";
    private static HIGH = "#FF0000";
    private static FULL = "#000000";

    private name: string;
    
    private mapShape: google.maps.Polygon;
    private center: google.maps.LatLng;

    private currentCapacity: number;
    private maxCapacity: number;
    private percentFull: number;
    private status: string;

    constructor(map: google.maps.Map, name: string, maxCapacity: number, coords) {
        this.name = name;

        this.status = ParkingZone.LOW;

        this.mapShape = new google.maps.Polygon({
            paths: coords,
            strokeColor: this.status,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: this.status,
            fillOpacity: 0.35
        });
        this.mapShape.setMap(map);

        this.currentCapacity = 0;
        this.maxCapacity = maxCapacity;
        this.percentFull = 0;


        var lat = 0;
        var lng = 0;

        for(let pos of coords) {
            lat += pos.lat;
            lng += pos.lng;
        }
        this.center = new google.maps.LatLng(lat / coords.length, lng / coords.length);
    }

    public onCarCountChanged(newCarCount) {
        this.currentCapacity = newCarCount;
        this.updateStatus();
    }

    public onCarEntered() {
        this.currentCapacity++;
        this.updateStatus();
    }

    public onCarExited() {
        this.maxCapacity--;
        this.updateStatus();
    }

    private updateStatus() {
        var ratio = this.currentCapacity / this.maxCapacity;
        this.percentFull = ratio * 100;


        // TODO: Unhardcode
        // Add another status: Full? that should be red or black?
        if(ratio < .6) {
            this.status = ParkingZone.LOW;
        } else if(ratio < 0.8) {
            this.status = ParkingZone.MEDIUM;
        } else if(ratio < 1) {
            this.status = ParkingZone.HIGH;
        } else {
            this.status = ParkingZone.FULL;
        }

        this.mapShape.setOptions({
            strokeColor: this.status,
            fillColor: this.status
        });
    }

    public getName() {
        return this.name;
    }

    public getCurrentCapacity() {
        return this.currentCapacity;
    }

    public getMaximumCapacity() {
        return this.maxCapacity;
    }

    public getPercentFull() {
        return this.percentFull <= 100 ? this.percentFull : 100;
    }

    public addClickListener(eventCallback) {
        google.maps.event.addListener(this.mapShape, "click", eventCallback);
    }

    public getSpotsLeft() {
        var left = this.maxCapacity - this.currentCapacity;

        return left >= 0 ? left : 0;
    }

    public getCenter() {
        return this.center;
    }

    public getStatus() {
        return this.status;
    }
}