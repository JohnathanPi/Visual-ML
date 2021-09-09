import numpy as np
import json
import sys
import ast



# data =  "[{'x': 5, 'y':3}, {'x': 1, 'y': 4}, {'x': 2, 'y': 7}, {'x': 2, 'y':2},{'x': 3, 'y':4},{'x': 7, 'y':10},{'x': 6, 'y':5},{'x': 1, 'y':1},{'x': -2, 'y':3},{'x': 3, 'y':12},{'x': -5, 'y': -8},{'x': 0, 'y':0}, {'x': 11, 'y': 4},{'x': -1, 'y':12}]"

def dist(pt_1, pt_2):
    return np.sqrt(((pt_1[0] - pt_2[0])**2 + (pt_1[1] - pt_2[1])**2))

def group_mean(points):
    x_val = (np.sum(points, axis = 0) / len(points)).tolist()
    return x_val

def assign_clusters(clusters, points, assignments, k):
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
    assignments = []
    for point in points:
        dists = []
        for i in range(1, k + 1):
            dists.append(np.around(dist(centroids[i], point), 2))
        assignments.append(np.argmin(dists) + 1)
    return assignments

def WSS():
    pass

data = sys.argv[1]

def k_means(data):
    try:
        data_objs = ast.literal_eval(data)
        k = int(data_objs['k'])
        points = []
        for pair in data_objs['data']:
            points.append([pair['x'], pair['y']])
        starting_k_s = []
        # Assign initial clusters and prevent empty clusters
        while (len(set(starting_k_s)) != k):
            starting_k_s = np.floor(np.random.rand(len(points)) * k + 1).tolist()
        clusters = {}
        # Assign intial clusters 
        clusters = assign_clusters(clusters, points, starting_k_s, k)
        centroids = {}
        # Calculate intial centroids
        centroids = calc_centroids(clusters, k)
        # Assign points to new clusters
        
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
        # print("the final clusters are", json.dumps(clusters))
        return_data = {
            'centroids' : centroids,
            'clusters': clusters
        }
        print(json.dumps(return_data))
    except Exception as e:
        sys.stderr.write(str(e))
        print('0')

k_means(data)