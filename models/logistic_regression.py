import numpy as np
import json
import ast
import sys


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
        n_iters = 30000
        learning_rates = [0.001] # currently uses single learning rate but left for flexibillity 
        weights = [0, 0]
        bias = 0
        accuracy_dict = {}
        param_dict = {}
        for learning_rate in learning_rates:
            for _ in range(n_iters):
                y_preds = (sigmoid(linear_func(X, weights, bias))) # predicting y's
                # Cost function gradients
                dw = (1 / X.shape[0]) * np.dot(X.T, (y_preds - y))
                db = (1 / X.shape[0]) * np.sum(y_preds - y)
                # readjusting weights
                weights -= learning_rate * dw 
                bias -= learning_rate * db
            param_dict[learning_rate] = [weights, bias]
            accuracy_dict[learning_rate] = accuracy(y, y_preds)
        best_learning_rate = max(accuracy_dict, key = accuracy_dict.get)
        weights, bias = param_dict[best_learning_rate]
        return_dict = {'slope' : np.around(-(weights[0] / weights[1]), 2), 'bias': np.around(-(bias / weights[1]), 2), 'accuracy' : np.around(accuracy_dict[best_learning_rate], 2), 'flag' : 0}
        if(return_dict['slope'] == -np.inf or return_dict['slope'] == np.inf):
            # if decision boundary has infinite slope
            x_intercept = np.mean(X[:, 0]) 
            return_dict = {'slope' : x_intercept, 'bias': 0, 'accuracy' : np.around(accuracy_dict[best_learning_rate], 2), 'flag' : 1}
            print(json.dumps(return_dict))
            return
        print(json.dumps(return_dict)) 
    except Exception as e:
        if (str(e) == 'Infinite slope'):
            print('0')
        else:
            print('1')


logistic_regression(data)
