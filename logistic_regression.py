import numpy as np
import json
import ast
import sys

from numpy.lib.stride_tricks import broadcast_shapes


# data = "{'''1''': [{'x': 2, 'y':2}, {'x': 1, 'y': 1}], '''-1''': [{'x': -2, 'y':2}, {'x': -1, 'y': 1}]}"
# data = "{'''1''': [{'x': 1, 'y':1}], '''0''': [{'x': -1, 'y':-1}]}"

data = sys.argv[1]

def sigmoid(x):
    return (1 / (1 + np.exp(-x)))

def linear_func(X, w, b):
    return np.dot(X, w) + b

# def return_x1(x0, w0, w1, b):
#     return (-b-w0*x0) / w1

def logistic_regression(data):
    data_obj = ast.literal_eval(data)
    X = []
    y = []
    for label in data_obj:
        for i in range(len(data_obj[label])):
            curr = data_obj[label][i]
            X.append([curr['x'], curr['y']])
            y.append(int(label))
    X = np.array(X)
    n_iters = 10000
    learning_rate = 0.001
    weights = [0, 0]
    bias = 0
    for _ in range(n_iters):
        y_preds = (sigmoid(linear_func(X, weights, bias)))
        # Cost function gradients
        dw = (1 / X.shape[0]) * np.dot(X.T, (y_preds - y))
        db = (1 / X.shape[0]) * np.sum(y_preds - y)
        weights -= learning_rate * dw
        bias -= learning_rate * db
    # x1_1 = return_x1(20, weights[0], weights[1], bias)
    # x1_2 = return_x1(-20, weights[0], weights[1], bias)
    # slope = -40 / (x1_2 - x1_1)
    # decision_boundary = {'slope' : np.around(slope, 2), 'bias': np.around(-bias, 2) / weights[1]}
    decision_boundary = {'slope' : np.around(-(weights[0] / weights[1]), 2), 'bias': np.around(-(bias / weights[1]), 2)}
    print(json.dumps(decision_boundary))   

logistic_regression(data)