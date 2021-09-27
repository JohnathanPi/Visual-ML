import numpy as np
from numpy import random
import json
import sys
import ast

def dist(pt_1, pt_2):
    # calculate euclidean distance between two points
    return np.sqrt(((pt_1[0] - pt_2[0])**2 + (pt_1[1] - pt_2[1])**2))

def group_mean(points):
    # used to recalculate centroids
    x_val = (np.sum(points, axis = 0) / len(points)).tolist()
    return x_val

def assign_clusters(clusters, points, assignments, k):
    # Reassigns each point to its new cluster
    for i in range(1, k + 1):
        clusters[i] = []
    for i in range(len(points)):
        clusters[assignments[i]].append(points[i]) 
    return clusters       

def calc_centroids(clusters, k):
    centroids = {}
    for i in range(1, k + 1):
        centroids[i] = np.around(group_mean(clusters[i]), 2).tolist()
    return centroids

def assign_points(points, centroids, k):
    # Find the cluster to which each point belongs
    assignments = []
    for point in points:
        dists = []
        for i in range(1, k + 1):
            dists.append(np.around(dist(centroids[i], point), 2))
        assignments.append(np.argmin(dists) + 1)
    return assignments

def random_point(points):
    # Used to create better initial clusters to prevent empty sets
    return points[random.choice(len(points))]

data = sys.argv[1]

def k_means(data):
    try:
        data_objs = ast.literal_eval(data)
        k = int(data_objs['k'])
        points = []
        for pair in data_objs['data']:
            points.append([pair['x'], pair['y']])
        if (k > len(points)):
            raise ValueError('K bigger than num of points')
        starting_assignments = [] 
        # Assign initial clusters and prevent empty clusters
        while (len(set(starting_assignments)) != k):
            starting_assignments = np.floor(np.random.rand(len(points)) * k + 1).tolist()
        clusters = {}
        clusters = assign_clusters(clusters, points, starting_assignments, k)
        # Assign initial centroids to existing points to decrease chance of empty cluster
        centroids = {i: random_point(points) for i in range(1, k + 1)}  
        # Order of operations: Recieve indeces -> assign to clusters -> recalc centroids -> repeat
        i = 0
        while(i < 1000):
            prev_centroids = centroids
            assignments = assign_points(points, prev_centroids, k)
            clusters = assign_clusters(clusters, points, assignments, k)
            centroids = calc_centroids(clusters, k)
            i += 1
            if (prev_centroids == centroids):
                break
        return_data = {
            'centroids' : centroids,
            'clusters': clusters
        }
        print(json.dumps(return_data))
    except Exception as e:
        if (e == 'K bigger than num of points'):
            print('1')
            return
        print('0')

k_means(data)