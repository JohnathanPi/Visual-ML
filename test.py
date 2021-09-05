import json
import sys
import ast
import numpy as np

def linear_regression():
    try:
        # "[{'x': 5, 'y':3}, {'x': 1, 'y': 4}, {'x': 2, 'y': 7}]"
        incoming_data = sys.argv[1]
        data_objs = ast.literal_eval(incoming_data)
        x_vals = []
        y_vals = []
        count = 0
        for point in data_objs:
            count += 1
            x_vals.append(point['x'])
            y_vals.append(point['y'])
        x_arr = np.array([[1 for i in range(count)], x_vals])
        x_arr_t = np.transpose(x_arr)
        y_arr = np.array([y_vals])
        inv_xt_x = np.linalg.inv(np.matmul(x_arr, x_arr_t))
        x_ty = np.matmul(inv_xt_x, x_arr)
        w = np.matmul(x_ty, np.transpose(y_arr))
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
        r_squared = np.around(1 - (ssr/ sst), 2)
        weight_dict['R^2'] = r_squared
        print(json.dumps(weight_dict))
    except Exception as e:
        print("0")


linear_regression();