#!/usr/bin/python3
import cv2
import numpy as np
from threading import Thread
import logging
import time
import requests
import plate_reader

class detector:
    def __init__(self, lot="Not Assigned!"): 
        self.lot = lot
        self.cap = cv2.VideoCapture(0)
        self.min_movement_area = 200
        _, self.last_frame = self.cap.read()
        self.current_frame = self.last_frame
        self.current_car = False
        self.movement_thresh = 5 
        self.frames_since_movement = self.movement_thresh
        self.detector_active = True
        self.car_x = []
        self.car_frames = []
        self.req_entered = "http://localhost:5000/carEntered?lot=" + self.lot
        self.req_exited = "http://localhost:5000/carExited?lot=" + self.lot

    def get_frame_movement(self):
        _, self.current_frame = self.cap.read()

        current_frame_gray = cv2.cvtColor(self.current_frame, cv2.COLOR_BGR2GRAY)
        last_frame_gray = cv2.cvtColor(self.last_frame, cv2.COLOR_BGR2GRAY)

        self.last_frame = self.current_frame

        frame_diff = cv2.absdiff(last_frame_gray, current_frame_gray)
        _, frame_diff = cv2.threshold(frame_diff, 25, 255, cv2.THRESH_BINARY)
        frame_diff = cv2.morphologyEx(frame_diff, cv2.MORPH_OPEN, None, iterations=3)

        return frame_diff
    
    def update_car_status(self):
        diff = self.get_frame_movement()
        _, cnts, _ = cv2.findContours(diff, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        moved = False
        cx = 0
        for c in cnts:
            if cv2.contourArea(c) > self.min_movement_area:
                moved = True
                m = cv2.moments(c)
                cx = m['m10'] / m['m00']
                break
        self.frames_since_movement += -1 if moved else 1
        if self.frames_since_movement < 0:
            self.frames_since_movement = 0
            self.current_car = True
            self.car_x.append(cx)
            self.car_frames.append(self.current_frame)
        elif self.frames_since_movement > self.movement_thresh:
            self.frames_since_movement = self.movement_thresh
            self.current_car = False

    def listen_for_cars(self):
        print("TEST")
        while self.detector_active:
            last_state = self.current_car
            self.update_car_status()
            current_state = self.current_car
            avg_movement = 0
            if len(self.car_x) > 1:
                avg_movement = sum(\
                                    [self.car_x[i+1] - self.car_x[i]\
                                    for i in range(len(self.car_x)-1)]) / (len(self.car_x)-1)

            if last_state != current_state:
                if current_state:
                    self.car_x = []
                    self.car_frames = []
                else:
                    if avg_movement > 0:
                        #r = requests.get(self.req_entered)
                        plate_reader.read_plate(self.car_frames)     
                        print("Car entered!")
                    else:
                        #r = requests.get(self.req_exited)
                        print("Car exited")

                    #print(r.status_code)


if __name__ == '__main__':
    d = detector()
    d.listen_for_cars()


