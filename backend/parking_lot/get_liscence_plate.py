
import cv2
import numpy as np

target_plate_aspect = 2.0 

def find_plate(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN,\
                                   cv2.THRESH_BINARY, 11, 2)
    _, cnts, _ = cv2.findContours(gray, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        aspect_ratio = w / float(h)
        if aspect_ratio


