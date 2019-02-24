/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild } from '@angular/core';
import { ParkingZone } from "./parking/ParkingZone";
declare let $: any;

declare var io: any;
import "../../socketio.min.js";
import { tick } from '@angular/core/testing';

import { Chart } from 'chart.js';
import * as moment from 'moment';


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
  private isShowingMoreInfo = false;

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

    this.createUI();
    this.populateList();

    // TODO: Change to your computer IP
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

    this.parkingZones.forEach((parkingZone, key, map) => {
      this.updateListUI(parkingZone);
    });
  } 

  selectLot(parkingZone) {
    this.selectedLot = parkingZone;
    this.displayLotInfo(this.selectedLot);

    this.map.panTo(this.selectedLot.getCenter());
    this.map.setZoom(16);

    $('#info-panel').animate({
      bottom: "-340px"
    }, 300, () => {
      $('#info-panel').removeClass('slideDown');
    });

    this.createChart("chart");
  }

  displayLotInfo(parkingZone) {
    $("#lotName").html(parkingZone.getName());
    $("#spotsRemaining").html(parkingZone.getSpotsLeft() + " Parking Spots Remaining");
    $("#percentFull").html(parkingZone.getPercentFull().toFixed() + "% Full");
  }

  updateListUI(parkingZone) {
    var listElement = $("li[lotName='" + parkingZone.getName() + "']");
    listElement.find(".listSpotsOpen").html(parkingZone.getSpotsLeft() + " Spots Open");
    listElement.find(".listStatus").attr('src', parkingZone.getIconSrc());
  }

  createParkingZones() {
    this.parkingZones = new Map<string, ParkingZone>();

    this.parkingZones.set("D Lot", new ParkingZone(this.map, "D Lot", 40, [
      {lat: 39.74862680238093, lng: -105.22318225421515},
      {lat: 39.74827209694497, lng: -105.22394668378439},
      {lat: 39.748775283184, lng: -105.22432219304648},
      {lat: 39.74898356821566, lng: -105.22391986169424}
    ]));
    this.parkingZones.get("D Lot").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("D Lot"));
    });
    
    this.parkingZones.set("Q Lot",  new ParkingZone(this.map, "Q Lot", 60, [
      {lat: 39.75027459728276, lng: -105.22575904541935},
      {lat: 39.750014761322326, lng: -105.22640814000096}, 
      {lat: 39.75059217323679, lng: -105.22707332783665}, 
      {lat: 39.75048906432132, lng: -105.22737373524632}, 
      {lat: 39.75079839060481, lng: -105.22789944821324}, 
      {lat: 39.751190201903334, lng: -105.22742201500859},
      {lat: 39.75106647226035, lng: -105.2267943780991}
    ]));
    this.parkingZones.get("Q Lot").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("Q Lot"));
    });

    this.parkingZones.set("CTLM", new ParkingZone(this.map, "CTLM", 55, [
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

    this.parkingZones.set("A Lot", new ParkingZone(this.map, "A Lot", 33, [
      {lat: 39.74626372114325, lng: -105.22201382936964},
      {lat: 39.74544291833426, lng: -105.22200041832457},
      {lat: 39.74513975502509, lng: -105.22250467361937},
      {lat: 39.745789389054266, lng: -105.22288554729948}
    ]));
    this.parkingZones.get("A Lot").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("A Lot"));
    });

    this.parkingZones.set("F Lot", new ParkingZone(this.map, "F Lot", 47, [
      {lat: 39.74627645485167, lng: -105.22190208925389}, 
      {lat: 39.74535904102645, lng: -105.22188038239051}, 
      {lat: 39.74566839034351, lng: -105.22125810989905},
      {lat: 39.74627645485167, lng: -105.22190208925389} 
    ]));
    this.parkingZones.get("F Lot").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("F Lot"));
    });

    this.parkingZones.set("AA Lot", new ParkingZone(this.map, "AA Lot", 31, [
      {lat: 39.74533730704826, lng: -105.22187432665015}, 
      {lat: 39.74612305184506, lng: -105.2203883828559}, 
      {lat: 39.745580662037675, lng: -105.22040179390098},
      {lat: 39.74507757584759, lng: -105.22144315099797},
      {lat: 39.74517244350668, lng: -105.22181866026006}
    ]));
    this.parkingZones.get("AA Lot").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("AA Lot"));
    });  
    
    this.parkingZones.set("J Lot", new ParkingZone(this.map, "J Lot", 60, [
      {lat: 39.75094610313953, lng: -105.21805249832892},
      {lat: 39.75028208243195, lng: -105.21740876816534},
      {lat: 39.75052541995597, lng: -105.21695279263281},
      {lat: 39.75121005990381, lng: -105.21756970070624},
      {lat: 39.75094610313953, lng: -105.21805249832892}
    ]));
    this.parkingZones.get("J Lot").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("J Lot"));
    });  

    this.parkingZones.set("O and N Lots", new ParkingZone(this.map, "O and N Lots", 26, [
      {lat: 39.75235298915961, lng: -105.22008189241842},
      {lat: 39.751585874739405, lng: -105.21937915365652},
      {lat: 39.7518642640246, lng: -105.2188722161527}, 
      {lat: 39.75262725111311, lng: -105.2195910481687},
      {lat: 39.75235298915961, lng: -105.22008189241842}
    ]));
    this.parkingZones.get("O and N Lots").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("O and N Lots"));
    });  

    this.parkingZones.set("FF Lot", new ParkingZone(this.map, "FF Lot", 56, [
      {lat: 39.74658311541243, lng: -105.22121118967823},
      {lat: 39.74603454228738, lng: -105.22066401903919},
      {lat: 39.74616653020521, lng: -105.22036897604755},
      {lat: 39.74666148264515, lng: -105.22013294165424},
      {lat: 39.74707806485977, lng: -105.22050845091633},
      {lat: 39.74688833465853, lng: -105.2209000534325}, 
      {lat: 39.74657486622484, lng: -105.22116290991596}
    ]));
    this.parkingZones.get("FF Lot").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("FF Lot"));
    });  

    this.parkingZones.set("E Lot", new ParkingZone(this.map, "E Lot", 40, [
      {lat: 39.74777789350077, lng: -105.2198107406677}, 
      {lat: 39.74759641429301, lng: -105.22014333458554},
      {lat: 39.74785213485707, lng: -105.22039009781491}, 
      {lat: 39.74791400259291, lng: -105.22090508194577}, 
      {lat: 39.748010928600635, lng: -105.2209989592613},
      {lat: 39.748200655710455, lng: -105.22093726845395},
      {lat: 39.74842750265594, lng: -105.22049202175748}, 
      {lat: 39.74777789350077, lng: -105.2198107406677}
    ]));
    this.parkingZones.get("E Lot").addClickListener((event) => {
      this.selectLot(this.parkingZones.get("E Lot"));
    });  
  }

  createUI() {
    $("#closeIconDiv").click(() => {
      this.isShowingMoreInfo = false;

      $('#info-panel').animate({
        bottom: "-500px"
      }, 300, () => {
        $('#info-panel').removeClass('slideUp');
        $('#info-panel').removeClass('fullShow');
      });

      this.selectedLot = null;
      $("#moreInfoButtonText").html("More Information");
    });

    $("#parkingIcon").click(() => {
      if(this.selectedLot != null) {
        this.selectedLot = null;

        $('#info-panel').animate({
          bottom: "-500px"
        }, 300, () => {
          $('#info-panel').removeClass('slideUp');
          $('#info-panel').removeClass('fullUp');
        });

        this.isShowingMoreInfo = false;
        $("#moreInfoButtonText").html("More Information");
      }

      if(this.isShowingParkingList) {
        this.isShowingParkingList = false;
        $('#parkingLotsListDiv').animate({
          bottom: "-480px"
        }, 300, () => {
          $('#parkingLotsListDiv').removeClass('showList');
        });

      } else {
        this.isShowingParkingList = true;
        $('#parkingLotsListDiv').animate({
          bottom: "-0px"
        }, 300, () => {
          $('#parkingLotsListDiv').removeClass('hideList');
        });
      }
    });

    $("#moreInfoButton").click(() => {
      if(this.isShowingMoreInfo) {
        this.isShowingMoreInfo = false;
        $('#info-panel').animate({
          bottom: "-340px"
        }, 300, () => {
          // $('#info-panel').removeClass('fullShow');
        });

        $("#moreInfoButtonText").html("More Information");
      } else {
        this.isShowingMoreInfo = true;
        $('#info-panel').animate({
          bottom: "0px"
        }, 300, () => {
        
        });

        $("#moreInfoButtonText").html("Hide Information");
      }
    
    });
  }

  registerLotListEvents() {
    $(".parkingLotListElement").click((e) => {
      var lotName = $(e.currentTarget).attr('lotName');
      
      this.isShowingParkingList = false;

      $('#parkingLotsListDiv').animate({
        bottom: "-480px"
      }, 300, () => {
        $('#parkingLotsListDiv').removeClass('showList');
      });

      this.selectLot(this.parkingZones.get(lotName));
    });
  }

  populateList() {
    this.parkingZones.forEach((parkingZone, key, map) => {
      $("#parkingLotsList").append(
        "<li class='parkingLotListElement' lotName='" + parkingZone.getName() +"'>"+
            "<span>" +
              "<h1 class='listName'>" + parkingZone.getName() + "</h1>" +
              "<p class='listSpotsOpen'>" + parkingZone.getCurrentCapacity() + " Spots Open</p>" +
            "</span>" +
          "<img class='listStatus' src='" + parkingZone.getIconSrc() + "'>" +
        "</li>"
      );
    });
    this.registerLotListEvents();
  }

  createChart(id) {
    var myChart = new Chart(document.getElementById("myChart"), {
      type: 'bar',
      data: {
          datasets: [{
            label: "% Parking Lot Utilization",
              data: [{
                          x: moment().hours(7),
                          y: 0.1 * 100
              }, {
                          x: moment().hours(8),
                          y: 0.8 * 100
              }, {
                          x: moment().hours(9),
                          y: 0.98 * 100
              }, {
                          x: moment().hours(10),
                          y: 1 * 100
              }, {
                          x: moment().hours(11),
                          y: 0.95 * 100
              }, {
                          x: moment().hours(12),
                          y: 0.98 * 100
              }, {
                          x: moment().hours(13),
                          y: 0.7 * 100
              }, {
                          x: moment().hours(14),
                          y: 0.8 * 100
              }, {
                          x: moment().hours(15),
                          y: 0.8 * 100
              }, {
                          x: moment().hours(16),
                          y: 0.6 * 100
              }, {
                          x: moment().hours(17),
                          y: 0.5 * 100
              }, {
                          x: moment().hours(18),
                          y: 0.23 * 100
              }, {
                          x: moment().hours(19),
                          y: 0.1 * 100
              }, {
                          x: moment().hours(20),
                          y: 0.05 * 100
              }],
              backgroundColor: 
                  '#2c6ac850', 
              borderColor: 
                  '#2c6ac8',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }],
              xAxes: [{
                  type: 'time',
                  time: {
                      min: moment().hours(6),
                      max: moment().hours(21),
                      unit: 'hour',
                      displayFormats: {
                          hour: 'hA'    
                      },
                      stepSize: 3
                  }
              }]
          }
      }
  });
  }
}
