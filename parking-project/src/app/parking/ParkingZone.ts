/// <reference types="@types/googlemaps" />

export class ParkingZone {
    private static LOW = "#22e839";
    private static MEDIUM = "#FFFF00";
    private static HIGH = "#FF0000";
    private static FULL = "#000000";

    private name: string;
    
    private mapShape: google.maps.Polygon;

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

        google.maps.event.addListener(this.mapShape, "click", (event) => {
            console.log(this.currentCapacity + " / " + this.maxCapacity);
        });

        this.currentCapacity = 0;
        this.maxCapacity = maxCapacity;
        this.percentFull = 0;
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

    public getCurrentCapacity() {
        return this.currentCapacity;
    }

    public getMaximumCapacity() {
        return this.maxCapacity;
    }
}