/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild } from '@angular/core';
import { ParkingZone } from "./parking/ParkingZone";
declare let $: any;

declare var io: any;
import "../../socketio.min.js";
import { tick } from '@angular/core/testing';

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
  private selectedLot: ParkingZone;

  private isShowingParkingList = false;

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(39.7510, -105.2226),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    google.maps.event.addListener(this.map, 'click', function(event) {
      console.log('{lat: ' + event.latLng.lat() + ', lng: ' + event.latLng.lng() + "},");
    });

    this.createParkingZones();

    this.createGeolocation();
    this.createUI();
    this.populateList();
    this.parkingZones.forEach((parkingZone, key, map) => {
      this.updateListUI(parkingZone);
    });

    // Doesn't work on android because localhost...
    // TODO: Change to your computer IP...
    this.carSocket = io.connect('http://10.203.155.149:5000/cars');
    this.carSocket.on('connect', () => {
      console.log("Connected to cars socket");
    });

    this.carSocket.on('carCountChanged', (event) => {
      this.parkingZones.get(event.data.lot).onCarCountChanged(event.data.count);

      if(this.selectedLot != null) {
        this.displayLotInfo(this.selectedLot);
      }

      this.updateListUI(this.parkingZones.get(event.data.lot));
    });

    $(window).on('beforeunload', () => {
      this.carSocket.close();
    });
  } 

  selectLot(parkingZone) {
    this.selectedLot = parkingZone;
    this.displayLotInfo(this.selectedLot);

    this.map.panTo(this.selectedLot.getCenter());
    this.map.setZoom(16);

    $('#info-panel').removeClass('slideDown');
    $('#info-panel').addClass('slideUp', 500, 'easeOutCirc');
  }

  displayLotInfo(parkingZone) {
    $("#lotName").html(parkingZone.getName());
    $("#spotsRemaining").html(parkingZone.getSpotsLeft() + " Parking Spots Remaining");
    $("#percentFull").html(parkingZone.getPercentFull().toFixed() + "% Full");
  }

  updateListUI(parkingZone) {
    var listElement = $("li[lotName='" + parkingZone.getName() + "']");
    listElement.find(".listSpotsOpen").html(parkingZone.getSpotsLeft() + " Spots Open");
  }

  createParkingZones() {
    this.parkingZones = new Map<string, ParkingZone>();

    this.parkingZones.set("Lot D", new ParkingZone(this.map, "Lot D", 10, [
      {lat: 39.74862680238093, lng: -105.22318225421515},
      {lat: 39.74827209694497, lng: -105.22394668378439},
      {lat: 39.748775283184, lng: -105.22432219304648},
      {lat: 39.74898356821566, lng: -105.22391986169424}
    ]));
    this.parkingZones.get("Lot D").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("Lot D"));
    });
    
    this.parkingZones.set("Lot Q",  new ParkingZone(this.map, "Lot Q", 120, [
      {lat: 39.75027459728276, lng: -105.22575904541935},
      {lat: 39.750014761322326, lng: -105.22640814000096}, 
      {lat: 39.75059217323679, lng: -105.22707332783665}, 
      {lat: 39.75048906432132, lng: -105.22737373524632}, 
      {lat: 39.75079839060481, lng: -105.22789944821324}, 
      {lat: 39.751190201903334, lng: -105.22742201500859},
      {lat: 39.75106647226035, lng: -105.2267943780991}
    ]));
    this.parkingZones.get("Lot Q").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("Lot Q"));
    });

    this.parkingZones.set("CTLM", new ParkingZone(this.map, "CTLM", 160, [
      {lat: 39.7501214009411, lng: -105.21948697794733},
      {lat: 39.75074417976547, lng: -105.21824779738245}, 
      {lat: 39.750331744087596, lng: -105.21784546603021}, 
      {lat: 39.750405982691824, lng: -105.21768453348932}, 
      {lat: 39.7502410079071, lng: -105.2175021432763}, 
      {lat: 39.74950686532418, lng: -105.21893980730829}
    ]));
    this.parkingZones.get("CTLM").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("CTLM"));
    });
  }

  createUI() {
    $("#closeIconDiv").click(() => {
      $('#info-panel').removeClass('slideUp');
      $('#info-panel').addClass('slideDown', 500, 'easeOutCirc');
      this.selectedLot = null;
    });

    $("#parkingIcon").click(() => {
      if(this.selectedLot != null) {
        this.selectedLot = null;
        $('#info-panel').removeClass('slideUp');
        $('#info-panel').addClass('slideDown', 500, 'easeOutCirc');
      }

      if(this.isShowingParkingList) {
        this.isShowingParkingList = false;
        $('#parkingLotsListDiv').removeClass('showList');
        $('#parkingLotsListDiv').addClass('hideList', 500, 'easeOutCirc');
      } else {
        this.isShowingParkingList = true;
        $('#parkingLotsListDiv').removeClass('hideList');
        $('#parkingLotsListDiv').addClass('showList', 500, 'easeOutCirc');
      }
    });
  }

  registerLotListEvents() {
    $(".parkingLotListElement").click((e) => {
      var lotName = $(e.currentTarget).attr('lotName');
      
      this.isShowingParkingList = false;
      $('#parkingLotsListDiv').removeClass('showList');
      $('#parkingLotsListDiv').addClass('hideList', 500, 'easeOutCirc');

      this.selectLot(this.parkingZones.get(lotName));
    });
  }

  populateList() {
    // $("#parkingLotsList").empty();
    this.parkingZones.forEach((parkingZone, key, map) => {
      $("#parkingLotsList").append(
        "<li class='parkingLotListElement' lotName='" + parkingZone.getName() +"'>"+
            "<span>" +
              "<h1 class='listName'>" + parkingZone.getName() + "</h1>" +
              "<p class='listSpotsOpen'>" + parkingZone.getCurrentCapacity() + " Spots Open</p>" +
            "</span>" +
          "<img class='listStatus' src='assets/img/checked.png'>" +
        "</li>"
      );
    });
    this.registerLotListEvents();
  }

  createGeolocation() {
    // if(navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     var pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };

    //     var infoWindow = new google.maps.InfoWindow();
    //     infoWindow.setPosition(pos);
    //     infoWindow.setContent('Location found.');
    //     infoWindow.open(this.map);

    //     alert(pos);
    //   });
    // } 
  }
}
