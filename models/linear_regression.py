import json
import sys
import ast
import numpy as np


incoming_data = sys.argv[1]
data = ast.literal_eval(incoming_data)
x_vals = []
y_vals = []
count = 0
for point in data:
    count += 1
    x_vals.append(point['x'])
    y_vals.append(point['y'])
X = np.array([[1 for i in range(count)], x_vals])
y = np.array(y_vals)

def linear_regression(X, y):
    try:
        if len(x_vals) == len(y_vals) == 1:
            raise ValueError('Not enough data')
        # (X^TX)^-1
        inv_xt_x = np.linalg.inv(np.matmul(X, X.T)) 
        x_ty = np.matmul(inv_xt_x, X)
        w = np.matmul(x_ty, np.transpose(y))
        final_weights = (np.around(w, 2)).ravel()
        slope, bias = final_weights[1], final_weights[0]
        weight_dict = {"slope" : slope, 'bias' : bias}
        # Calcualte R^2
        def f_i(a, b, x):
            return a*x + b
        y_mean = np.mean(y_vals)
        ssr = sst = 0
        for i in range(count):
            ssr += (y_vals[i] - f_i(slope, bias, x_vals[i]))**2
            sst += (y_vals[i] - y_mean)**2
        if (sst == 0):
            r_squared = 1
        else:
            r_squared = np.around(1 - (ssr/ sst), 2)
        weight_dict['R^2'] = r_squared
        print(json.dumps(weight_dict))
    except Exception as e:
        if (str(e) == 'Not enough data'):
            print("0")
        else:
            print("1")

linear_regression(X, y)
