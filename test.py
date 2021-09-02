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

# def lin_reg_test():
#     incoming_data = sys.argv[1]
#     data_objs = ast.literal_eval(incoming_data)
#     x1_vals = []
#     x2_vals = []
#     for point in data_objs:
#         x1_vals.append(point['x'])
#         x2_vals.append(point['y'])
#     x1_arr = np.array(x1_vals)
#     x2_arr = np.array(x2_vals)
#     print(np.dot(np.transpose(x1_arr), x2_arr))
#     print(x1_vals, x2_vals)
#     print(json.dumps(data_objs))


func()