import json
import sys
import ast
import numpy as np
# import warnings

# warnings.filterwarnings('ignore')
def func():
    incoming_data = sys.argv[1]
    test_data = ast.literal_eval(incoming_data)
    print(json.dumps(test_data))

def linear_regression():
    # incoming_data = '[{"x":1, "y":4},{"x":2, "y":5},{"x":3, "y":6},{"x":-9, "y":1}]'
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
    weight_dict = {"slope" : final_weights[1], 'bias' : final_weights[0]}
    print(json.dumps(weight_dict))


linear_regression();