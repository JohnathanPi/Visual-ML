import numpy as np
import json
import sys
import ast

data = sys.argv[1]
data_obj = ast.literal_eval(data)
X = []
y = []
for label in data_obj:
    for i in range(len(data_obj[label])):
        curr = data_obj[label][i]
        X.append([curr['x'], curr['y']])
        y.append(int(label))
X = np.array(X)
y = np.array(y)
def sgd_svm(X, y, learning_rate = 0.001, reg_param = 0, n_iters = 20000):
    sv_s = []
    weights = np.zeros(2)
    bias = 0
    labels = np.where(y <= 0, -1, 1)
    for _ in range(n_iters):
        for idx, point in enumerate(X):
            function_val = labels[idx] * (np.dot(point, weights) - bias)
            if (function_val >= 1):
                weights -= learning_rate * (2 * reg_param * weights)
            else:
                weights -= learning_rate * (2 * reg_param * weights - np.dot(point, labels[idx]))
                bias -= learning_rate * labels[idx]
    for idx, point in enumerate(X):
        final_funcion_val = labels[idx] * (np.dot(point, weights) - bias)
        if np.abs(final_funcion_val) <= (1.05):
            sv_s.append(point)
    support_vectors = {}
    for i, sv in enumerate(sv_s):
        sv = sv.tolist()
        support_vectors[i] = sv
    coeffs = np.array(weights)
    intercept = np.array(bias)
    # print(coeffs, intercept)
    # intercept = clf.intercept_.tolist()
    support_vectors['slope'] = np.around(-(coeffs[0] / coeffs[1]), 2)
    support_vectors['bias'] = np.around(-(intercept / coeffs[1]), 2)
    support_vectors['bias-1'] = np.around(-((intercept + 1) / coeffs[1]), 2)
    support_vectors['bias-2'] = np.around(-((intercept - 1) / coeffs[1]), 2)
    # res_dict = {'slope' : np.around(weights[0]), 'bias' : np.around(weights[1]), 'offset' : bias}
    # print(weights)
    print(json.dumps(support_vectors))
    # print(sv_s)
                
            
                
# X = np.array([[5, 3], [1,4], [2,7], [-5, -3], [-1, -4], [-2, -7]])
# # {'''1''': [{'x': 5, 'y':3}, {'x': 1, 'y': 4}, {'x': 2, 'y': 7}], '''-1''': [{'x': -5, 'y':-3}, {'x': -1, 'y': -4}, {'x': -2, 'y': -7}]}
# y = np.array([1,1,1,-1,-1,-1])
# X = np.array([[3,1], [3, -1], [6,1], [6, -1], [1, 0], [0,1], [0,-1], [-1,0]])
# y = np.array([0, 0, 0, 0, 1, 1, 1, 1])    
# X = np.array([[1,1], [1, -1], [-1,1], [-1, -1]])
# y = np.array([1,1,0,0]) 
sgd_svm(X, y)