/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild } from '@angular/core';
import { ParkingZone } from "./parking/ParkingZone"

declare var io: any;
import "../../socketio.min.js"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('gmap') gmapElement: any;
  public map: google.maps.Map;

  private parkingZones: Map<string, ParkingZone>
  private carSocket;

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(39.7510, -105.2226),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    google.maps.event.addListener(this.map, 'click', function(event) {
      console.log('{lat: ' + event.latLng.lat() + ', lng: ' + event.latLng.lng() + "},");
    });

    this.createParkingZones();

    this.carSocket = io.connect('http://localhost:5000/cars');
    this.carSocket.on('connect', () => {
      console.log("Connected to cars socket");
    });

    this.carSocket.on('carEntered', (event) => {
      this.parkingZones[event.data.lot].onCarEntered();
      console.log("Car entered " + event.data + " "
                 + this.parkingZones[event.data.lot].getCurrentCapacity() 
                 + " / " 
                 + this.parkingZones[event.data.lot].getMaximumCapacity());
    });

    this.carSocket.on('carExited', (event) => {
      this.parkingZones[event.data.lot].onCarEntered();
      console.log("Car exited " + event.data + " "
                 + this.parkingZones[event.data.lot].getCurrentCapacity() 
                 + " / " 
                 + this.parkingZones[event.data.lot].getMaximumCapacity());
    });
  } 

  createParkingZones() {
    this.parkingZones = new Map<string, ParkingZone>();

    this.parkingZones["Lot D"] = new ParkingZone(this.map, "Lot D", 10, [
      {lat: 39.74862680238093, lng: -105.22318225421515},
      {lat: 39.74827209694497, lng: -105.22394668378439},
      {lat: 39.748775283184, lng: -105.22432219304648},
      {lat: 39.74898356821566, lng: -105.22391986169424}
    ]);
    
    this.parkingZones["Lot Q"] = new ParkingZone(this.map, "Lot Q", 120, [
      {lat: 39.75027459728276, lng: -105.22575904541935},
      {lat: 39.750014761322326, lng: -105.22640814000096}, 
      {lat: 39.75059217323679, lng: -105.22707332783665}, 
      {lat: 39.75048906432132, lng: -105.22737373524632}, 
      {lat: 39.75079839060481, lng: -105.22789944821324}, 
      {lat: 39.751190201903334, lng: -105.22742201500859},
      {lat: 39.75106647226035, lng: -105.2267943780991}
    ]);

    this.parkingZones["CTLM"] = new ParkingZone(this.map, "CTLM", 160, [
      {lat: 39.7501214009411, lng: -105.21948697794733},
      {lat: 39.75074417976547, lng: -105.21824779738245}, 
      {lat: 39.750331744087596, lng: -105.21784546603021}, 
      {lat: 39.750405982691824, lng: -105.21768453348932}, 
      {lat: 39.7502410079071, lng: -105.2175021432763}, 
      {lat: 39.74950686532418, lng: -105.21893980730829}
    ]);
  }
}
