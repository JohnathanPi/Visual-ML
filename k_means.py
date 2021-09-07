import numpy as np
import json
import sys
import ast


def dist(pt_1, pt_2):
    return np.sqrt(((pt_1[0] - pt_2[0])**2 + (pt_1[1] - pt_2[1])**2))

data = sys.argv[1]


def k_means(data, k = 3):
    data_objs = ast.literal_eval(data)
    print(type(data_objs))
    points = []
    for pair in data_objs:
        points.append([pair['x'], pair['y']])
    starting_k_s = np.floor(np.random.rand(len(points)) * 3 + 1)

k_means(data)