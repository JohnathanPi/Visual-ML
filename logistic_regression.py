from typing import final
import numpy as np
import json
import ast
import sys

from numpy.lib.stride_tricks import broadcast_shapes


# data = "{'''1''': [{'x': 2, 'y':2}, {'x': 1, 'y': 1}], '''0''': [{'x': -2, 'y':2}, {'x': -1, 'y': 1}]}"
# data = "{'''1''': [{'x': 1, 'y':1}], '''0''': [{'x': -1, 'y':-1}]}"
# data = "{'''1''': [{'x': 5, 'y':10}, {'x': 5, 'y':5}], '''0''': [{'x': 10, 'y':10}, {'x': 10, 'y':5}]}"
# data = "{'''1''': [{'x': 0, 'y':0}], '''0''': [{'x': -5, 'y':-5}]}"

data = sys.argv[1]

def sigmoid(x):
    return (1 / (1 + np.exp(-x)))

def linear_func(X, w, b):
    return np.dot(X, w) + b

def accuracy(y_true, y_preds):
    final_preds = np.array([np.around(y_preds[i]) for i in range(len(y_preds))])
    y_arr = np.array(y_true)
    return (final_preds == y_arr).sum() / y_arr.shape[0]

def logistic_regression(data):
    try:
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
        learning_rates = [0.0001, 0.001, 0.01, 0.1] 
        weights = [0, 0]
        bias = 0
        accuracy_dict = {}
        param_dict = {}
        for learning_rate in learning_rates:
            for _ in range(n_iters):
                y_preds = (sigmoid(linear_func(X, weights, bias)))
                # Cost function gradients
                dw = (1 / X.shape[0]) * np.dot(X.T, (y_preds - y))
                db = (1 / X.shape[0]) * np.sum(y_preds - y)
                weights -= learning_rate * dw
                bias -= learning_rate * db
            param_dict[learning_rate] = [weights, bias]
            accuracy_dict[learning_rate] = accuracy(y, y_preds)
        best_learning_rate = max(accuracy_dict, key = accuracy_dict.get)
        weights, bias = param_dict[best_learning_rate]
        # print(y_preds, y)
        # print(weights)
        # print(bias)
        return_dict = {'slope' : np.around(-(weights[0] / weights[1]), 2), 'bias': np.around(-(bias / weights[1]), 2), 'accuracy' : accuracy_dict[best_learning_rate]}
        if(return_dict['slope'] == -np.inf or return_dict['slope'] == np.inf):
            raise ValueError('Infinite slope') 
        print(json.dumps(return_dict)) 
    except Exception as e:
        if (str(e) == 'Infinite slope'):
            print('0')
        else:
            print('1')


logistic_regression(data)
