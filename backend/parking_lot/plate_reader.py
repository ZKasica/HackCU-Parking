import cv2


def read_plate(frames):
    numFrames = len(frames)
    cv2.imshow("plate?????", frames[numFrames//3])
    key = cv2.waitKey(1000)


