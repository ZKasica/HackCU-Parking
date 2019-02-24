from threading import Thread
import logging
import time
from car_detector import detector

class parking_lot:
    def __init__(self, capacity, num_detectors=1):
        self.num_cars = 0
        self.lot_capacity = 10 

        self.detectors = []
        for _ in range(num_detectors):
            d = detector(self)
            self.detectors.append(d)

    def add_car_to_lot(self):
        
